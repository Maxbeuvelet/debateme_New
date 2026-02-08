import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    console.log("---- getSessionData START ----");

    const base44 = createClientFromRequest(req);

    const raw = await req.json().catch(() => ({}));
    
    // Base44 wraps payload inside { body: {...} }
    const body = raw.body || raw;
    console.log("Request body:", body);

    let { sessionId } = body;

    if (!sessionId) {
      console.log("Missing sessionId");
      return new Response(JSON.stringify({ error: "Missing sessionId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 🔥 CRITICAL FIX: Base44 sometimes passes IDs as objects/numbers
    sessionId = String(sessionId);
    console.log("Normalized sessionId:", sessionId);

    const userId = base44.user?.id || null;
    console.log("User from context:", userId ?? "GUEST");

    const service = base44.asServiceRole.entities;

    // ---- LOAD SESSION ----
    let session;
    try {
      session = await service.DebateSession.get(sessionId);
      console.log("Session loaded:", session?.id);
    } catch (err) {
      console.error("FAILED loading session:", err);
      return new Response(JSON.stringify({ error: "Session fetch failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!session) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // ---- LOAD DEBATE ----
    let debate;
    try {
      debate = await service.Debate.get(String(session.debate_id));
      console.log("Debate loaded:", debate?.id);
    } catch (err) {
      console.error("FAILED loading debate:", err);
      return new Response(JSON.stringify({ error: "Debate fetch failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // ---- LOAD PARTICIPANTS ----
    let participants = [];
    try {
      participants = await service.SessionParticipant.filter({
        session_id: sessionId
      });
      console.log("Participants:", participants.length);
    } catch (err) {
      console.error("FAILED loading participants:", err);
    }

    // ---- AUTO JOIN LOGGED USER ----
    if (userId && debate?.is_private) {
      const already = participants.find(p => p.user_id === userId);

      if (!already) {
        console.log("Adding missing participant:", userId);

        try {
          await service.SessionParticipant.create({
            session_id: sessionId,
            user_id: userId,
            role: "debater"
          });

          participants = await service.SessionParticipant.filter({
            session_id: sessionId
          });
        } catch (err) {
          console.error("FAILED creating participant:", err);
        }
      }
    }

    // ---- LOAD MESSAGES ----
    let messages = [];
    try {
      messages = await service.PublicMessage.filter(
        { session_id: sessionId },
        "created_date"
      );
      console.log("Messages:", messages.length);
    } catch (err) {
      console.error("FAILED loading messages:", err);
    }

    console.log("---- getSessionData SUCCESS ----");

    return new Response(JSON.stringify({ session, debate, participants, messages }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("FATAL FUNCTION ERROR:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});