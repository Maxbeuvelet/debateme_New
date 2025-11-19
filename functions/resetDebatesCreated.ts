import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Get current user
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Reset debates_created to 0
        await base44.asServiceRole.entities.User.update(user.id, {
            debates_created: 0
        });

        return Response.json({ 
            success: true, 
            message: 'Debates created count reset to 0' 
        });
    } catch (error) {
        console.error('Error resetting debates created:', error);
        return Response.json({ 
            error: error.message 
        }, { status: 500 });
    }
});