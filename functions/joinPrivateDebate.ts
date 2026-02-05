import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const MAX_PARTICIPANTS = 50; // Optional limit per session

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Parse request body
    const { inviteCode, side } = await req.json();
    
    if (!inviteCode || !side) {
      return Response.json(
        { error: 'inviteCode and side are required' },
        { status: 400 }
      );
    }
    
    if (!['A', 'B'].includes(side)) {
      return Response.json(
        { error: 'side must be "A" or "B"' },
        { status: 400 }
      );
    }
    
    // Get current user (allow guests)
    let user;
    try {
      user = await base44.auth.me();
    } catch (error) {
      // Generate guest user if not authenticated
      const randomId = Math.random().toString(36).substring(2, 8);
      user = {
        id: `guest_${randomId}`,
        username: `Guest${randomId}`,
        email: null
      };
    }
    
    // Find the debate by invite code
    const debates = await base44.entities.Debate.filter({ 
      invite_code: inviteCode,
      is_private: true,
      status: 'active'
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
      // Create new session
      session = await base44.asServiceRole.entities.DebateSession.create({
        debate_id: debate.id,
        participant_a_id: 'multi', // placeholder for multi-participant
        participant_b_id: 'multi',
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
      // User already joined, return existing participation
      const participant = existingParticipants[0];
      return Response.json({
        debateId: debate.id,
        sessionId: session.id,
        participantId: participant.id,
        side: participant.side,
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
    
    // Create new participant
    const participant = await base44.asServiceRole.entities.SessionParticipant.create({
      session_id: session.id,
      debate_id: debate.id,
      user_id: user.id,
      user_name: user.username,
      side: side,
      status: 'active',
      is_guest: !user.email
    });
    
    // Create a stance record for tracking (optional, for backwards compatibility)
    await base44.asServiceRole.entities.UserStance.create({
      debate_id: debate.id,
      user_id: user.id,
      user_name: user.username,
      position: side === 'A' ? 'position_a' : 'position_b',
      status: 'matched',
      session_id: session.id,
      session_start_time: new Date().toISOString()
    });
    
    return Response.json({
      debateId: debate.id,
      sessionId: session.id,
      participantId: participant.id,
      side: participant.side,
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