import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { sessionId } = await req.json();

    if (!sessionId) {
      return Response.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // Get logged in user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    // Get session via service role
    const session = await base44.asServiceRole.entities.DebateSession.get(sessionId);
    if (!session) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    // Get debate
    const debate = await base44.asServiceRole.entities.Debate.get(session.debate_id);
    if (!debate) {
      return Response.json({ error: "Debate not found" }, { status: 404 });
    }

    // Check if user is participant
    let participants = await base44.asServiceRole.entities.SessionParticipant.filter({
      session_id: sessionId,
      user_id: user.id
    });

    // Auto-join if private debate and user missing
    if (participants.length === 0 && debate.is_private) {
      await base44.asServiceRole.entities.SessionParticipant.create({
        session_id: sessionId,
        debate_id: debate.id,
        user_id: user.id,
        user_name: user.username,
        status: "active",
        is_guest: !user.email
      });
    }

    // Get all participants
    participants = await base44.asServiceRole.entities.SessionParticipant.filter({
      session_id: sessionId
    });

    // Get messages
    const messages = await base44.asServiceRole.entities.PublicMessage.filter({
      session_id: sessionId
    }, "created_date");

    return Response.json({
      session,
      debate,
      participants,
      messages
    });

  } catch (err) {
    console.error("Error in getSessionData:", err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
});