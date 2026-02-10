import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Reset user progress to defaults
    await base44.auth.updateMe({
      debates_joined: 0,
      max_debate_duration: 0,
      total_debate_time: 0,
      achievements: [],
      new_achievements: []
    });

    return Response.json({ success: true, message: 'Progress reset' });
  } catch (error) {
    console.error('Error resetting progress:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});