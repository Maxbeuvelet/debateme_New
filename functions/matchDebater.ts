import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { debateId, stanceId } = await req.json();

    if (!debateId || !stanceId) {
      return Response.json(
        { error: 'Missing required parameters: debateId and stanceId' },
        { status: 400 }
      );
    }

    // Load my stance
    const myStances = await base44.asServiceRole.entities.UserStance.filter({ id: stanceId });
    const myStance = myStances[0];

    if (!myStance) {
      return Response.json({
        matched: false,
        message: 'Your stance was not found. Please try taking your stance again.',
        stanceDeleted: true
      });
    }

    // If already has a session_id, validate it and return matched if active
    if (myStance.session_id) {
      try {
        const sessions = await base44.asServiceRole.entities.DebateSession.filter({
          id: myStance.session_id
        });
        const existingSession = sessions[0];

        if (existingSession && existingSession.status === 'active') {
          return Response.json({
            matched: true,
            sessionId: existingSession.id,
            userName: myStance.user_name
          });
        }

        // Session ended or doesn't exist, reset stance
        await base44.asServiceRole.entities.UserStance.update(stanceId, {
          status: 'waiting',
          session_id: null
        });
      } catch {
        await base44.asServiceRole.entities.UserStance.update(stanceId, {
          status: 'waiting',
          session_id: null
        });
      }
    }

    // === KEY FIX: lock MY stance first ===
    // If I'm still "waiting", immediately move me to "matching" so nobody else can match me concurrently.
    // (Even if I end up with no opponent, we'll revert to "waiting".)
    try {
      await base44.asServiceRole.entities.UserStance.update(stanceId, { status: 'matching' });
    } catch {
      // If we can't lock, just fail gracefully
      return Response.json({
        matched: false,
        message: 'Unable to enter queue right now. Please try again.'
      });
    }

    // Get all stances for this debate
    const allStances = await base44.asServiceRole.entities.UserStance.filter({ debate_id: debateId });

    // Clean up old waiting stances (older than 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const oldWaitingStances = allStances.filter(
      (s) => s.status === 'waiting' && new Date(s.updated_date) < tenMinutesAgo
    );

    if (oldWaitingStances.length > 0) {
      Promise.all(
        oldWaitingStances.map((s) =>
          base44.asServiceRole.entities.UserStance.delete(s.id).catch(() => {})
        )
      );
    }

    const oppositePosition = myStance.position === 'position_a' ? 'position_b' : 'position_a';

    // Candidate opponents: recent + waiting + opposite + not me
    const candidates = allStances
      .filter(
        (s) =>
          s.status === 'waiting' &&
          s.position === oppositePosition &&
          s.id !== stanceId &&
          new Date(s.updated_date) > tenMinutesAgo
      )
      .sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());

    let opponent = null;

    for (const candidate of candidates) {
      try {
        // Verify still waiting
        const check = await base44.asServiceRole.entities.UserStance.filter({ id: candidate.id });
        const fresh = check[0];
        if (!fresh || fresh.status !== 'waiting' || fresh.session_id) continue;

        // Claim opponent
        await base44.asServiceRole.entities.UserStance.update(candidate.id, { status: 'matching' });

        // Re-fetch to confirm claim stuck
        const verify = await base44.asServiceRole.entities.UserStance.filter({ id: candidate.id });
        const claimed = verify[0];
        if (!claimed || claimed.status !== 'matching' || claimed.session_id) {
          // Someone else likely grabbed/changed them; keep scanning
          // Best-effort revert
          if (claimed && claimed.status === 'waiting') {
            // already reverted by someone else
          } else {
            await base44.asServiceRole.entities.UserStance
              .update(candidate.id, { status: 'waiting' })
              .catch(() => {});
          }
          continue;
        }

        opponent = claimed;
        break;
      } catch {
        continue;
      }
    }

    if (!opponent) {
      // No opponent available; revert my lock back to waiting
      await base44.asServiceRole.entities.UserStance.update(stanceId, { status: 'waiting' }).catch(() => {});
      return Response.json({ matched: false, message: 'No opponent available yet' });
    }

    // Safety: re-check my stance is still "matching" and not already assigned a session
    const myCheck = await base44.asServiceRole.entities.UserStance.filter({ id: stanceId });
    const myFresh = myCheck[0];
    if (!myFresh || myFresh.status !== 'matching' || myFresh.session_id) {
      // Something changed about me; revert opponent and exit
      await base44.asServiceRole.entities.UserStance.update(opponent.id, { status: 'waiting' }).catch(() => {});
      return Response.json({ matched: false, message: 'Queue state changed, please try again' });
    }

    // Create the session
    let session;
    try {
      session = await base44.asServiceRole.entities.DebateSession.create({
        debate_id: debateId,
        participant_a_id: myStance.position === 'position_a' ? stanceId : opponent.id,
        participant_b_id: myStance.position === 'position_b' ? stanceId : opponent.id,
        status: 'active',
        duration_minutes: 30
      });
    } catch {
      // Session failed; revert both
      await Promise.all([
        base44.asServiceRole.entities.UserStance.update(stanceId, { status: 'waiting' }).catch(() => {}),
        base44.asServiceRole.entities.UserStance.update(opponent.id, { status: 'waiting' }).catch(() => {})
      ]);

      return Response.json({
        matched: false,
        message: 'Failed to create session, please try again'
      });
    }

    // Mark both matched
    await Promise.all([
      base44.asServiceRole.entities.UserStance.update(stanceId, {
        status: 'matched',
        session_id: session.id
      }),
      base44.asServiceRole.entities.UserStance.update(opponent.id, {
        status: 'matched',
        session_id: session.id
      })
    ]);

    return Response.json({
      matched: true,
      sessionId: session.id,
      userName: myStance.user_name,
      opponentName: opponent.user_name
    });
  } catch (error) {
    console.error('Error in matchDebater:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
});