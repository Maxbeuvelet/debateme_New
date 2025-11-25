import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import sgMail from 'npm:@sendgrid/mail@8.1.0';

sgMail.setApiKey(Deno.env.get("SENDGRID_API_KEY"));

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

    // Filter users with valid emails who haven't received the promo email yet
    const usersWithEmail = users.filter(user => user.email && !user.promo_email_sent);
    
    let sentCount = 0;
    let errorCount = 0;
    const errors = [];

    // Send emails using SendGrid (can handle bulk sending efficiently)
    for (const user of usersWithEmail) {
      try {
        await sgMail.send({
          to: user.email,
          from: {
            email: 'noreply@debateme.me',
            name: 'DebateMe'
          },
          subject: emailSubject,
          html: emailBody
        });
        
        // Mark user as having received the promo email
        await base44.asServiceRole.entities.User.update(user.id, {
          promo_email_sent: true
        });
        
        sentCount++;
      } catch (emailError) {
        errorCount++;
        errors.push({ email: user.email, error: emailError.message });
      }
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