import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        const { debateId, stanceId } = await req.json();
        
        if (!debateId || !stanceId) {
            return Response.json({ 
                error: 'Missing required parameters: debateId and stanceId' 
            }, { status: 400 });
        }

        // Get the current stance - use filter for more reliable results
        const myStances = await base44.asServiceRole.entities.UserStance.filter({ 
            id: stanceId 
        });
        const myStance = myStances[0];
        
        if (!myStance) {
            // Stance not found - it may have been deleted
            // Return not matched instead of error to allow graceful handling
            return Response.json({
                matched: false,
                message: 'Your stance was not found. Please try taking your stance again.',
                stanceDeleted: true
            });
        }

        // Check if already matched - look for session by session_id field
        if (myStance.session_id) {
            try {
                const sessions = await base44.asServiceRole.entities.DebateSession.filter({ 
                    id: myStance.session_id 
                });
                const existingSession = sessions[0];
                
                if (existingSession && existingSession.status === "active") {
                    return Response.json({
                        matched: true,
                        sessionId: existingSession.id,
                        userName: myStance.user_name
                    });
                } else {
                    // Session ended or doesn't exist, reset stance to waiting
                    await base44.asServiceRole.entities.UserStance.update(stanceId, {
                        status: "waiting",
                        session_id: null
                    });
                }
            } catch (error) {
                // Session not found, reset stance
                await base44.asServiceRole.entities.UserStance.update(stanceId, {
                    status: "waiting",
                    session_id: null
                });
            }
        }

        // Get all stances for this debate
        const allStances = await base44.asServiceRole.entities.UserStance.filter({ 
            debate_id: debateId 
        });

        // Clean up old waiting stances (older than 10 minutes)
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const oldWaitingStances = allStances.filter(s => 
            s.status === "waiting" && 
            new Date(s.updated_date) < tenMinutesAgo
        );
        
        // Delete old waiting stances in the background
        if (oldWaitingStances.length > 0) {
            Promise.all(
                oldWaitingStances.map(s => 
                    base44.asServiceRole.entities.UserStance.delete(s.id).catch(() => {})
                )
            );
        }

        // Look for RECENT waiting opponents with opposite position (within last 10 minutes)
        const oppositePosition = myStance.position === "position_a" ? "position_b" : "position_a";
        const waitingStances = allStances.filter(s => s.status === "waiting");
        
        // Filter to only include recent stances (within last 10 minutes)
        const recentWaitingStances = waitingStances.filter(s => 
            new Date(s.updated_date) > tenMinutesAgo
        );
        
        const opponent = recentWaitingStances.find(s => 
            s.position === oppositePosition && 
            s.id !== stanceId &&
            s.created_date < myStance.created_date
        );
        
        if (!opponent) {
            // Make sure current user is marked as waiting with updated timestamp
            await base44.asServiceRole.entities.UserStance.update(stanceId, { 
                status: "waiting"
            });
            
            return Response.json({
                matched: false,
                message: 'No opponent available yet'
            });
        }

        // Double-check opponent hasn't been matched already
        const freshOpponentData = await base44.asServiceRole.entities.UserStance.filter({ 
            id: opponent.id 
        });
        const freshOpponent = freshOpponentData[0];
        
        if (!freshOpponent || freshOpponent.status === 'matched') {
            return Response.json({
                matched: false,
                message: 'Opponent just got matched with someone else, trying again'
            });
        }

        // Create debate session
        const session = await base44.asServiceRole.entities.DebateSession.create({
            debate_id: debateId,
            participant_a_id: myStance.position === "position_a" ? stanceId : opponent.id,
            participant_b_id: myStance.position === "position_b" ? stanceId : opponent.id,
            status: "active",
            duration_minutes: 30
        });
        
        // Update both stances to matched with session reference
        await Promise.all([
            base44.asServiceRole.entities.UserStance.update(stanceId, { 
                status: "matched",
                session_id: session.id 
            }),
            base44.asServiceRole.entities.UserStance.update(opponent.id, { 
                status: "matched",
                session_id: session.id 
            })
        ]);
        
        return Response.json({
            matched: true,
            sessionId: session.id,
            userName: myStance.user_name,
            opponentName: opponent.user_name
        });
        
    } catch (error) {
        console.error("Error in matchDebater:", error);
        return Response.json({ 
            error: error.message 
        }, { status: 500 });
    }
});