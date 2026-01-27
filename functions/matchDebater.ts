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
        
        // Filter to only include recent waiting stances (not older than 10 minutes)
        const recentWaitingStances = allStances.filter(s => 
            s.status === "waiting" &&
            s.position === oppositePosition && 
            s.id !== stanceId &&
            new Date(s.updated_date) > tenMinutesAgo
        );
        
        // Sort by created_date to match oldest waiting users first (fairness)
        recentWaitingStances.sort((a, b) => 
            new Date(a.created_date) - new Date(b.created_date)
        );
        
        // Try to match with each potential opponent until one succeeds
        for (const potentialOpponent of recentWaitingStances) {
            // Atomic check: try to update opponent to "matching" status
            // This prevents race conditions where multiple users try to match with the same opponent
            try {
                // First, verify opponent is still waiting (atomic read-check)
                const checkOpponent = await base44.asServiceRole.entities.UserStance.filter({ 
                    id: potentialOpponent.id 
                });
                
                if (!checkOpponent[0] || checkOpponent[0].status !== 'waiting') {
                    continue; // This opponent is no longer available
                }
                
                // Try to atomically claim this opponent by updating to "matching"
                await base44.asServiceRole.entities.UserStance.update(potentialOpponent.id, { 
                    status: "matching" 
                });
                
                // Successfully claimed the opponent, proceed with match
                const opponent = potentialOpponent;
                break;
            } catch (error) {
                // Failed to claim this opponent, try next one
                continue;
            }
        }
        
        // If we didn't find any opponent after trying all candidates
        const opponent = recentWaitingStances.find(async (potentialOpponent) => {
            const checkOpponent = await base44.asServiceRole.entities.UserStance.filter({ 
                id: potentialOpponent.id 
            });
            return checkOpponent[0]?.status === 'matching';
        });
        
        if (!opponent || recentWaitingStances.length === 0) {
            // Make sure current user is marked as waiting with updated timestamp
            await base44.asServiceRole.entities.UserStance.update(stanceId, { 
                status: "waiting"
            });
            
            return Response.json({
                matched: false,
                message: 'No opponent available yet'
            });
        }

        // Create debate session with both participants
        let session;
        try {
            session = await base44.asServiceRole.entities.DebateSession.create({
                debate_id: debateId,
                participant_a_id: myStance.position === "position_a" ? stanceId : opponent.id,
                participant_b_id: myStance.position === "position_b" ? stanceId : opponent.id,
                status: "active",
                duration_minutes: 30
            });
        } catch (error) {
            // Failed to create session, reset both stances
            await Promise.all([
                base44.asServiceRole.entities.UserStance.update(stanceId, { 
                    status: "waiting" 
                }).catch(() => {}),
                base44.asServiceRole.entities.UserStance.update(opponent.id, { 
                    status: "waiting" 
                }).catch(() => {})
            ]);
            
            return Response.json({
                matched: false,
                message: 'Failed to create session, please try again'
            });
        }
        
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