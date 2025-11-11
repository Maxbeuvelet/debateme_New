import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        const { sessionId, userId } = await req.json();
        
        if (!sessionId || !userId) {
            return Response.json({ 
                error: 'Missing required parameters' 
            }, { status: 400 });
        }

        // Get the session
        const sessions = await base44.asServiceRole.entities.DebateSession.list();
        const session = sessions.find(s => s.id === sessionId);
        
        if (!session) {
            return Response.json({ 
                error: 'Session not found' 
            }, { status: 404 });
        }

        // Get the user's stance
        const stances = await base44.asServiceRole.entities.UserStance.list();
        const userStance = stances.find(s => 
            (s.id === session.participant_a_id || s.id === session.participant_b_id) && 
            s.user_id === userId
        );
        
        if (!userStance || !userStance.session_start_time) {
            return Response.json({ 
                error: 'User stance or start time not found' 
            }, { status: 404 });
        }

        // Calculate time spent (in minutes)
        const startTime = new Date(userStance.session_start_time);
        const endTime = new Date();
        const minutesSpent = Math.round((endTime - startTime) / (1000 * 60));

        // Get user
        const users = await base44.asServiceRole.entities.User.list();
        const user = users.find(u => u.id === userId);
        
        if (!user) {
            return Response.json({ 
                error: 'User not found' 
            }, { status: 404 });
        }

        // Update user stats
        await base44.asServiceRole.entities.User.update(userId, {
            total_debate_time_minutes: (user.total_debate_time_minutes || 0) + minutesSpent,
            debates_completed: (user.debates_completed || 0) + 1
        });

        // Mark stance as completed
        await base44.asServiceRole.entities.UserStance.update(userStance.id, {
            status: "completed"
        });

        // Check for new achievements
        const achievementResponse = await base44.functions.invoke('checkAndAwardAchievements', {
            userId: userId
        });

        return Response.json({
            success: true,
            minutesSpent,
            newAchievements: achievementResponse.data.newAchievements || [],
            totalXpAwarded: achievementResponse.data.totalXpAwarded || 0
        });
        
    } catch (error) {
        console.error("Error in trackDebateTime:", error);
        return Response.json({ 
            error: error.message 
        }, { status: 500 });
    }
});