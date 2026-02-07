import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const MAX_PARTICIPANTS = 50;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const raw = await req.json().catch(() => ({}));
    const body = raw.body || raw;

    // Accept invite from any of these keys
    const inviteCode =
      body.inviteCode ||
      body.invite_code ||
      body.invite ||
      null;

    if (!inviteCode) {
      return Response.json({ error: "Invite code required" }, { status: 400 });
    }
    
    // Normalize invite code: trim and uppercase
    const normalizedInviteCode = inviteCode.trim().toUpperCase();
    
    // Get current user (required)
    let user;
    try {
      user = await base44.auth.me();
    } catch (error) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Find the debate by invite code
    const debates = await base44.entities.Debate.filter({ 
      invite_code: normalizedInviteCode,
      is_private: true
    });
    
    if (debates.length === 0) {
      return Response.json(
        { error: 'Invalid invite code or debate not found' },
        { status: 404 }
      );
    }
    
    const debate = debates[0];
    
    // Find or create active session for this debate
    let sessions = await base44.asServiceRole.entities.DebateSession.filter({ 
      debate_id: debate.id,
      status: 'active'
    });
    
    let session;
    if (sessions.length === 0) {
      // Create new session (use placeholders for participant fields)
      session = await base44.asServiceRole.entities.DebateSession.create({
        debate_id: debate.id,
        participant_a_id: 'private_room',
        participant_b_id: 'private_room',
        status: 'active',
        duration_minutes: 30
      });
    } else {
      session = sessions[0];
    }
    
    // Check if participant already exists (idempotent)
    const existingParticipants = await base44.asServiceRole.entities.SessionParticipant.filter({
      session_id: session.id,
      user_id: user.id
    });
    
    if (existingParticipants.length > 0) {
      // User already joined
      return Response.json({
        debateId: debate.id,
        sessionId: session.id,
        participantId: existingParticipants[0].id,
        alreadyJoined: true
      });
    }
    
    // Check participant limit
    const allParticipants = await base44.asServiceRole.entities.SessionParticipant.filter({
      session_id: session.id,
      status: 'active'
    });
    
    if (allParticipants.length >= MAX_PARTICIPANTS) {
      return Response.json(
        { error: `Session is full (max ${MAX_PARTICIPANTS} participants)` },
        { status: 400 }
      );
    }
    
    // Create new participant (no side)
    const participant = await base44.asServiceRole.entities.SessionParticipant.create({
      session_id: session.id,
      debate_id: debate.id,
      user_id: user.id,
      user_name: user.username,
      status: 'active',
      is_guest: !user.email
    });
    
    return Response.json({
      debateId: debate.id,
      sessionId: session.id,
      participantId: participant.id,
      alreadyJoined: false
    });
    
  } catch (error) {
    console.error('Error in joinPrivateDebate:', error);
    return Response.json(
      { error: error.message || 'Failed to join private debate' },
      { status: 500 }
    );
  }
});