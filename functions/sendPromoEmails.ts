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
    
    const emailSubject = "🚀 DebateMe is LIVE - Launch Day is Here!";
    
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
    .launch-banner { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-align: center; padding: 30px; border-radius: 12px; margin: 30px 0; }
    .launch-banner .title { font-size: 36px; font-weight: bold; margin-bottom: 10px; }
    .launch-banner .subtitle { font-size: 18px; opacity: 0.9; }
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
      <h2>🎉 The Wait is Over!</h2>
      
      <p>Hey there!</p>
      
      <p>The moment we've all been waiting for is finally here - <strong>DebateMe is NOW LIVE!</strong></p>
      
      <div class="launch-banner">
        <div class="title">🚀 WE'RE LIVE!</div>
        <div class="subtitle">Join the debate today at 7pm EST</div>
      </div>
      
      <p>As one of our early members, you're among the first to experience:</p>
      
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
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="https://debateme.me" style="display: inline-block; padding: 18px 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 18px;">
          🎯 Start Debating Now
        </a>
      </p>

      <p style="text-align: center; margin-top: 20px;">
        <a href="https://discord.gg/aXQevrYxBm" style="display: inline-block; padding: 14px 28px; background: linear-gradient(to right, #6366f1, #8b5cf6); color: #ffffff; font-weight: 600; border-radius: 12px; text-decoration: none; font-size: 14px;">
          Join Our Discord Community
        </a>
      </p>
      
      <p style="margin-top: 30px;">Let's debate!</p>
      <p><strong>The DebateMe Team</strong></p>
    </div>
    
    <div class="footer">
      <p>© 2025 DebateMe • Live Video Debates</p>
      <p><a href="https://debateme.me/PrivacyPolicy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a> • <a href="https://debateme.me/Unsubscribe" style="color: #64748b; text-decoration: underline;">Unsubscribe</a></p>
      
    </div>
  </div>
</body>
</html>
    `;

    // TEST MODE: Only send to the admin user for testing
    const usersWithEmail = [currentUser];
    
    let sentCount = 0;
    let errorCount = 0;
    const errors = [];

    // Send emails in smaller batches to avoid timeout
    const batchSize = 10;
    
    for (let i = 0; i < usersWithEmail.length; i += batchSize) {
      const batch = usersWithEmail.slice(i, i + batchSize);
      
      // Send batch in parallel
      const results = await Promise.allSettled(
        batch.map(async (user) => {
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
          
          return user.email;
        })
      );
      
      // Count successes and failures
      for (const result of results) {
        if (result.status === 'fulfilled') {
          sentCount++;
        } else {
          errorCount++;
          errors.push({ error: result.reason?.message });
        }
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