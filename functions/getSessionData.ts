import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { sessionId } = await req.json();

    console.log("getSessionData called with:", sessionId);

    if (!sessionId) {
      return Response.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // 🔥 IMPORTANT: support guests AND logged in users
    let userId = null;
    try {
      const user = await base44.auth.me();
      userId = user?.id || null;
      console.log("Logged in user:", userId);
    } catch (err) {
      console.log("Guest user detected");
    }

    // Get session via service role
    const session = await base44.asServiceRole.entities.DebateSession.get(sessionId);
    if (!session) {
      console.log("Session not found");
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    const debate = await base44.asServiceRole.entities.Debate.get(session.debate_id);
    if (!debate) {
      console.log("Debate not found");
      return Response.json({ error: "Debate not found" }, { status: 404 });
    }

    // Get ALL participants
    let participants = await base44.asServiceRole.entities.SessionParticipant.filter({
      session_id: sessionId
    });

    // If logged in user exists, ensure they are a participant
    if (userId) {
      const alreadyParticipant = participants.find(p => p.user_id === userId);

      if (!alreadyParticipant && debate.is_private) {
        console.log("Auto-adding user to session");

        await base44.asServiceRole.entities.SessionParticipant.create({
          session_id: sessionId,
          user_id: userId,
          role: "debater"
        });

        participants = await base44.asServiceRole.entities.SessionParticipant.filter({
          session_id: sessionId
        });
      }
    }

    const messages = await base44.asServiceRole.entities.PublicMessage.filter({
      session_id: sessionId
    }, "created_date");

    console.log("Returning session data OK");

    return Response.json({
      session,
      debate,
      participants,
      messages
    });

  } catch (err) {
    console.error("getSessionData ERROR:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
});