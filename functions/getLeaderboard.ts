import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Use service role to bypass RLS and fetch all users
        const users = await base44.asServiceRole.entities.User.list();
        
        // Filter and sort users for leaderboard
        const leaderboard = users
            .filter(user => 
                user.username && 
                user.total_debate_time_minutes && 
                user.total_debate_time_minutes > 0
            )
            .sort((a, b) => {
                const timeA = a.total_debate_time_minutes || 0;
                const timeB = b.total_debate_time_minutes || 0;
                
                if (timeB === timeA) {
                    return (b.debates_completed || 0) - (a.debates_completed || 0);
                }
                
                return timeB - timeA;
            })
            .slice(0, 50); // Top 50
        
        return Response.json({
            success: true,
            leaderboard: leaderboard
        });
        
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return Response.json({ 
            error: error.message 
        }, { status: 500 });
    }
});