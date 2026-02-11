import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all user's stances that have a session
    const userStances = await base44.entities.UserStance.filter({ 
      user_id: user.id 
    });

    const sessionsParticipated = userStances.filter(s => s.session_id && s.status !== 'waiting');
    const uniqueSessionIds = [...new Set(sessionsParticipated.map(s => s.session_id))];

    let totalDebateTime = 0;

    // Calculate total time from completed sessions
    for (const sessionId of uniqueSessionIds) {
      try {
        const session = await base44.entities.DebateSession.get(sessionId);
        if (session && session.created_date) {
          const startTime = new Date(session.created_date);
          const endTime = new Date(session.updated_date);
          const durationMinutes = Math.floor((endTime - startTime) / 1000 / 60);
          
          // Only count sessions that lasted between 1-60 minutes (reasonable debate time)
          if (durationMinutes >= 1 && durationMinutes <= 60) {
            totalDebateTime += durationMinutes;
          }
        }
      } catch (err) {
        console.error(`Error processing session ${sessionId}:`, err);
      }
    }

    // Update user stats
    await base44.auth.updateMe({
      debates_joined: uniqueSessionIds.length,
      total_debate_time: totalDebateTime * 60 // Convert to seconds
    });

    return Response.json({
      success: true,
      debates_joined: uniqueSessionIds.length,
      total_debate_time_minutes: totalDebateTime
    });

  } catch (error) {
    console.error('Error backfilling user stats:', error);
    return Response.json({ 
      error: error.message || 'Failed to backfill stats' 
    }, { status: 500 });
  }
});