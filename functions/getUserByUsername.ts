import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { username } = await req.json();
        
        if (!username) {
            return Response.json({ 
                success: false,
                error: "Username is required" 
            }, { status: 400 });
        }
        
        // Use service role to fetch user by username
        const users = await base44.asServiceRole.entities.User.list();
        const user = users.find(u => u.username === username);
        
        if (!user) {
            return Response.json({
                success: false,
                error: "User not found"
            }, { status: 404 });
        }
        
        return Response.json({
            success: true,
            user: user
        });
        
    } catch (error) {
        console.error("Error fetching user:", error);
        return Response.json({ 
            success: false,
            error: error.message 
        }, { status: 500 });
    }
});