import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import sgMail from 'npm:@sendgrid/mail@8.1.0';

sgMail.setApiKey(Deno.env.get("SENDGRID_API_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify the caller is authenticated and is admin
    const currentUser = await base44.auth.me();
    if (!currentUser || currentUser.role !== 'admin') {
      return Response.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const emailSubject = "✨ DebateMe Has a New Look!";
    
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
    .preview-image { width: 100%; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
    .highlight-box { background: linear-gradient(135deg, #23153c 0%, #1e1b4b 100%); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center; }
    .highlight-box p { color: #a5b4fc; margin: 0; font-size: 14px; }
    .highlight-box .title { color: #ffffff; font-size: 18px; font-weight: bold; margin-bottom: 8px; }
    .features { margin: 30px 0; }
    .feature { display: flex; align-items: center; margin-bottom: 15px; }
    .feature-icon { font-size: 24px; margin-right: 15px; }
    .feature-text { color: #475569; }
    .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ DebateMe</h1>
      <p>Something exciting is here!</p>
    </div>
    
    <div class="content">
      <h2>We've Got a Brand New Look!</h2>
      
      <p>Hey there!</p>
      
      <p>We've been working hard to make DebateMe even better, and we're thrilled to show you our <strong>completely redesigned homepage!</strong></p>
      
      <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/111e1e339_image.png" alt="New DebateMe Design" class="preview-image" />
      
      <div class="highlight-box">
        <p class="title">🌐 Interactive 3D Globe</p>
        <p>Our new homepage features a stunning dynamic, interactive globe that responds to your mouse movements. It's not just a static image – come see it in action!</p>
      </div>
      
      <p>The new design brings:</p>
      
      <div class="features">
        <div class="feature">
          <span class="feature-icon">🎨</span>
          <span class="feature-text"><strong>Fresh Visual Design</strong> - A sleek, modern look that's easier on the eyes</span>
        </div>
        <div class="feature">
          <span class="feature-icon">🌐</span>
          <span class="feature-text"><strong>Dynamic 3D Globe</strong> - An interactive, animated globe you can play with</span>
        </div>
        <div class="feature">
          <span class="feature-icon">⚡</span>
          <span class="feature-text"><strong>Smoother Experience</strong> - Better performance and animations throughout</span>
        </div>
      </div>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="https://debateme.me" style="display: inline-block; padding: 18px 40px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 18px;">
          🎯 Check Out the New Look
        </a>
      </p>
      
      <p style="margin-top: 30px;">We'd love to hear what you think!</p>
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

    // TEST MODE: Only send to the admin user
    await sgMail.send({
      to: currentUser.email,
      from: {
        email: 'noreply@debateme.me',
        name: 'DebateMe'
      },
      subject: emailSubject,
      html: emailBody
    });

    return Response.json({
      success: true,
      message: 'Test email sent to admin only',
      sentTo: currentUser.email
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});