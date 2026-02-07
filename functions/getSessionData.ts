import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { sessionId } = await req.json();

    console.log("getSessionData called", sessionId);

    if (!sessionId) {
      return Response.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // 🔥 Correct way to get user in public Base44 functions
    const contextUser = base44.user;
    const userId = contextUser?.id || null;

    console.log("User from context:", userId ? userId : "GUEST");

    // Get session via service role
    const session = await base44.asServiceRole.entities.DebateSession.get(sessionId);
    if (!session) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    const debate = await base44.asServiceRole.entities.Debate.get(session.debate_id);
    if (!debate) {
      return Response.json({ error: "Debate not found" }, { status: 404 });
    }

    // Get participants
    let participants = await base44.asServiceRole.entities.SessionParticipant.filter({
      session_id: sessionId
    });

    // Auto-join logged in users to private debates
    if (userId && debate.is_private) {
      const alreadyParticipant = participants.find(p => p.user_id === userId);

      if (!alreadyParticipant) {
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
    return Response.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
});