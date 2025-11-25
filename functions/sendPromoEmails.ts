import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify the caller is authenticated
    const currentUser = await base44.auth.me();
    if (!currentUser || currentUser.role !== 'admin') {
      return Response.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    // Get all users
    const users = await base44.asServiceRole.entities.User.list();
    
    const emailSubject = "🎉 DebateMe Launches in 2 Days!";
    
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #475569 0%, #334155 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .header p { color: #94a3b8; margin-top: 10px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #0f172a; font-size: 24px; margin-bottom: 20px; }
    .content p { color: #475569; font-size: 16px; line-height: 1.6; }
    .countdown { background: linear-gradient(135deg, #06b6d4 0%, #1e40af 100%); color: white; text-align: center; padding: 30px; border-radius: 12px; margin: 30px 0; }
    .countdown .days { font-size: 48px; font-weight: bold; }
    .countdown .label { font-size: 18px; opacity: 0.9; }
    .features { margin: 30px 0; }
    .feature { display: flex; align-items: center; margin-bottom: 15px; }
    .feature-icon { font-size: 24px; margin-right: 15px; }
    .feature-text { color: #475569; }
    .cta-button { display: inline-block; background-color: #000000; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }

    .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 DebateMe</h1>
      <p>The Live Video Debate Platform</p>
    </div>
    
    <div class="content">
      <h2>Get Ready - We're Almost Live!</h2>
      
      <p>Hey there!</p>
      
      <p>We're thrilled to let you know that <strong>DebateMe is launching in just 2 days</strong> on November 28th!</p>
      
      <div class="countdown">
              <div class="days">2</div>
              <div class="label">Days Until Launch</div>
            </div>
      
      <p>As one of our early members, you'll be among the first to experience:</p>
      
      <div class="features">
        <div class="feature">
          <span class="feature-icon">🎥</span>
          <span class="feature-text"><strong>Live Video Debates</strong> - Face-to-face discussions in real-time</span>
        </div>
        <div class="feature">
          <span class="feature-icon">🏆</span>
          <span class="feature-text"><strong>Ranked System</strong> - Climb the leaderboard and earn achievements</span>
        </div>
        <div class="feature">
          <span class="feature-icon">💬</span>
          <span class="feature-text"><strong>Hot Topics</strong> - Politics, Technology, Environment & more</span>
        </div>
        <div class="feature">
          <span class="feature-icon">⚡</span>
          <span class="feature-text"><strong>Create Your Own Debate</strong> - Start discussions on topics you care about</span>
        </div>
      </div>
      
      <p>Mark your calendar for <strong>November 28th</strong> and be ready to join the debate!</p>
      

      
      <p style="text-align: center; margin-top: 20px;">
        <a href="https://discord.gg/aXQevrYxBm" style="display: inline-block; padding: 16px 32px; background: linear-gradient(to right, #6366f1, #8b5cf6); color: #ffffff; font-weight: 600; border-radius: 12px; text-decoration: none; font-size: 16px;">
          <svg style="width: 24px; height: 24px; vertical-align: middle; margin-right: 12px; display: inline-block;" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
          </svg>
          Join Our Discord Community
        </a>
      </p>
      
      <p style="margin-top: 30px;">See you there!</p>
      <p><strong>The DebateMe Team</strong></p>
    </div>
    
    <div class="footer">
      <p>© 2025 DebateMe • Live Video Debates</p>
    </div>
  </div>
</body>
</html>
    `;

    let sentCount = 0;
    let errorCount = 0;
    const errors = [];

    // TEST MODE: Send only to the current admin user
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: currentUser.email,
        subject: emailSubject,
        body: emailBody,
        from_name: "DebateMe"
      });
      sentCount++;
    } catch (emailError) {
      errorCount++;
      errors.push({ email: currentUser.email, error: emailError.message });
    }

    return Response.json({
      success: true,
      totalUsers: users.length,
      emailsSent: sentCount,
      errors: errorCount,
      errorDetails: errors
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});