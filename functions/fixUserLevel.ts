import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Verify user is authenticated
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get current user data
        const users = await base44.asServiceRole.entities.User.list();
        const currentUserData = users.find(u => u.id === user.id);
        
        if (!currentUserData) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        let xp = currentUserData.xp || 0;
        let level = currentUserData.level || 1;

        // Keep leveling up until XP is below the requirement
        while (true) {
            const xpNeededForNextLevel = level * 100;
            
            if (xp >= xpNeededForNextLevel) {
                level = level + 1;
                xp = xp - xpNeededForNextLevel;
            } else {
                break;
            }
        }

        // Update user with corrected values
        await base44.asServiceRole.entities.User.update(user.id, {
            xp: xp,
            level: level
        });

        return Response.json({
            success: true,
            message: 'User level fixed',
            oldLevel: currentUserData.level,
            newLevel: level,
            oldXp: currentUserData.xp,
            newXp: xp
        });
        
    } catch (error) {
        console.error("Error in fixUserLevel:", error);
        return Response.json({ 
            error: error.message 
        }, { status: 500 });
    }
});