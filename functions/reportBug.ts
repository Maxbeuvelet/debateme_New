import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const body = await req.json();
        
        const { bugDescription, currentPage, userAgent } = body;
        
        if (!bugDescription || !bugDescription.trim()) {
            return Response.json({ 
                error: 'Bug description is required' 
            }, { status: 400 });
        }

        // Get current user info (if logged in)
        let userName = "Anonymous";
        let userEmail = "Not logged in";
        
        try {
            const user = await base44.auth.me();
            if (user) {
                userName = user.username || user.full_name || 'Unknown';
                userEmail = user.email;
            }
        } catch (authError) {
            console.log("User not authenticated:", authError.message);
        }

        // Create bug report record
        await base44.asServiceRole.entities.BugReport.create({
            description: bugDescription,
            current_page: currentPage || 'Unknown',
            user_agent: userAgent || 'Unknown',
            user_name: userName,
            user_email: userEmail,
            status: 'new'
        });

        return Response.json({
            success: true,
            message: 'Bug report submitted successfully'
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error in reportBug function:", error);
        return Response.json({ 
            error: `Failed to send bug report: ${error.message}`,
            details: error.stack
        }, { status: 500 });
    }
});