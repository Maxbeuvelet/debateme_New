import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";

const achievements = [
  { id: "first_debate", criteria_type: "debates_joined", criteria_value: 1 },
  { id: "five_debates", criteria_type: "debates_joined", criteria_value: 5 },
  { id: "ten_debates", criteria_type: "debates_joined", criteria_value: 10 },
  { id: "twenty_debates", criteria_type: "debates_joined", criteria_value: 20 },
  { id: "fifty_debates", criteria_type: "debates_joined", criteria_value: 50 },
  { id: "hundred_debates", criteria_type: "debates_joined", criteria_value: 100 },
  { id: "ten_min_debate", criteria_type: "debate_duration", criteria_value: 10 },
  { id: "twenty_min_debate", criteria_type: "debate_duration", criteria_value: 20 },
  { id: "thirty_min_debate", criteria_type: "debate_duration", criteria_value: 30 },
];

const calculateXpForNextLevel = (level) => level * 100;

function computeNewAchievements(user) {
  const earned = user.achievements || [];
  const newlyEarned = [];

  for (const a of achievements) {
    if (earned.includes(a.id)) continue;

    let shouldUnlock = false;
    if (a.criteria_type === "debates_joined") {
      shouldUnlock = (user.debates_joined || 0) >= a.criteria_value;
    } else if (a.criteria_type === "debate_duration") {
      shouldUnlock = (user.max_debate_duration || 0) >= a.criteria_value;
    }

    if (shouldUnlock) {
      newlyEarned.push(a.id);
    }
  }

  return newlyEarned;
}

function applyLevelUps(currentLevel, currentXp) {
  let level = currentLevel || 1;
  let xp = currentXp || 0;

  while (true) {
    const needed = calculateXpForNextLevel(level);
    if (xp >= needed) {
      xp -= needed;
      level += 1;
    } else break;
  }

  return { level, xp };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const authUser = await base44.auth.me();

    const { sessionId, userId } = await req.json();

    if (!sessionId || !userId) {
      return Response.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // prevent spoofing
    if (!authUser || authUser.id !== userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the session safely (no list+find)
    const sessions = await base44.asServiceRole.entities.DebateSession.filter({ id: sessionId });
    const session = sessions[0];
    if (!session) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    // Fetch participant stances by id
    const aStance = session.participant_a_id
      ? (await base44.asServiceRole.entities.UserStance.filter({ id: session.participant_a_id }))[0]
      : null;

    const bStance = session.participant_b_id
      ? (await base44.asServiceRole.entities.UserStance.filter({ id: session.participant_b_id }))[0]
      : null;

    const userStance = [aStance, bStance].find((s) => s && s.user_id === userId) || null;

    if (!userStance || !userStance.session_start_time) {
      return Response.json({ error: "User stance or start time not found" }, { status: 404 });
    }

    // Idempotency guard: don't double-count
    if (userStance.status === "completed") {
      return Response.json({
        success: true,
        alreadyCounted: true,
        minutesSpent: 0,
        newAchievements: [],
        totalXpAwarded: 0,
      });
    }

    const startTime = new Date(userStance.session_start_time);
    const endTime = new Date();
    const minutesSpent = Math.max(0, Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)));

    const users = await base44.asServiceRole.entities.User.filter({ id: userId });
    const user = users[0];
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    // Compute updated stats locally (avoids read-after-write issues)
    const updatedDebatesJoined = (user.debates_joined || 0) + 1;
    const updatedMaxDuration = Math.max(user.max_debate_duration || 0, minutesSpent);
    const updatedUser = {
      ...user,
      debates_joined: updatedDebatesJoined,
      total_debate_time: (user.total_debate_time || 0) + minutesSpent,
      max_debate_duration: updatedMaxDuration,
    };

    // Compute achievements from updated stats
    const newlyEarned = computeNewAchievements(updatedUser);

    // Apply XP + levels
    const baseXp = 50;
    const combinedXp = (user.xp || 0) + baseXp;
    const { level, xp } = applyLevelUps(user.level || 1, combinedXp);

    // Update user once
    await base44.asServiceRole.entities.User.update(userId, {
      debates_joined: updatedDebatesJoined,
      total_debate_time: updatedUser.total_debate_time,
      max_debate_duration: updatedMaxDuration,
      achievements: [...(user.achievements || []), ...newlyEarned],
      new_achievements: newlyEarned,
      xp,
      level,
    });

    // Mark stance completed (and store end time)
    await base44.asServiceRole.entities.UserStance.update(userStance.id, {
      status: "completed",
      session_end_time: endTime.toISOString(),
      minutes_spent: minutesSpent,
    });

    return Response.json({
      success: true,
      minutesSpent,
      newAchievements: newlyEarned,
    });
  } catch (error) {
    console.error("Error in trackDebateTime:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});