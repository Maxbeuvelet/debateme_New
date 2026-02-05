import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";

const achievements = [
  { id: "first_exchange", xp_reward: 25, criteria_type: "debates_completed", criteria_value: 1 },
  { id: "active_participant", xp_reward: 100, criteria_type: "debates_completed", criteria_value: 5 },
  { id: "committed_contributor", xp_reward: 300, criteria_type: "debates_completed", criteria_value: 20 },
  { id: "seasoned_debater", xp_reward: 1000, criteria_type: "debates_completed", criteria_value: 100 },
  { id: "debate_creator", xp_reward: 50, criteria_type: "debates_created", criteria_value: 1 },
  { id: "locked_in", xp_reward: 150, criteria_type: "total_debate_time_minutes", criteria_value: 30 },
];

const calculateXpForNextLevel = (level) => level * 100;

function computeNewAchievements(user) {
  const earned = user.achievements_earned || [];
  const newlyEarned = [];
  let totalXpAwarded = 0;

  for (const a of achievements) {
    if (earned.includes(a.id)) continue;

    const currentValue =
      a.criteria_type === "debates_completed" ? (user.debates_completed || 0) :
      a.criteria_type === "debates_created" ? (user.debates_created || 0) :
      a.criteria_type === "total_debate_time_minutes" ? (user.total_debate_time_minutes || 0) :
      0;

    if (currentValue >= a.criteria_value) {
      newlyEarned.push(a.id);
      totalXpAwarded += a.xp_reward;
    }
  }

  return { newlyEarned, totalXpAwarded };
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
    const updatedUser = {
      ...user,
      total_debate_time_minutes: (user.total_debate_time_minutes || 0) + minutesSpent,
      debates_completed: (user.debates_completed || 0) + 1,
    };

    // Compute achievements from updated stats
    const { newlyEarned, totalXpAwarded } = computeNewAchievements(updatedUser);

    // Apply XP + levels
    const combinedXp = (user.xp || 0) + totalXpAwarded;
    const { level, xp } = applyLevelUps(user.level || 1, combinedXp);

    // Update user once
    await base44.asServiceRole.entities.User.update(userId, {
      total_debate_time_minutes: updatedUser.total_debate_time_minutes,
      debates_completed: updatedUser.debates_completed,
      achievements_earned: [...(user.achievements_earned || []), ...newlyEarned],
      new_achievements: [...(user.new_achievements || []), ...newlyEarned],
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
      totalXpAwarded,
    });
  } catch (error) {
    console.error("Error in trackDebateTime:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});