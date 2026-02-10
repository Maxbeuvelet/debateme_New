import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const ACHIEVEMENTS = [
  { id: "first_debate", requirement: { type: "debates_joined", count: 1 } },
  { id: "five_debates", requirement: { type: "debates_joined", count: 5 } },
  { id: "ten_debates", requirement: { type: "debates_joined", count: 10 } },
  { id: "twenty_debates", requirement: { type: "debates_joined", count: 20 } },
  { id: "fifty_debates", requirement: { type: "debates_joined", count: 50 } },
  { id: "hundred_debates", requirement: { type: "debates_joined", count: 100 } },
  { id: "ten_min_debate", requirement: { type: "debate_duration", minutes: 10 } },
  { id: "twenty_min_debate", requirement: { type: "debate_duration", minutes: 20 } },
  { id: "thirty_min_debate", requirement: { type: "debate_duration", minutes: 30 } }
];

function checkAchievements(user) {
  const newAchievements = [];
  const currentAchievements = user.achievements || [];

  ACHIEVEMENTS.forEach(achievement => {
    if (currentAchievements.includes(achievement.id)) {
      return;
    }

    let unlocked = false;

    if (achievement.requirement.type === "debates_joined") {
      const debatesJoined = user.debates_joined || 0;
      unlocked = debatesJoined >= achievement.requirement.count;
    } else if (achievement.requirement.type === "debate_duration") {
      const maxDebateTime = user.max_debate_duration || 0;
      unlocked = maxDebateTime >= achievement.requirement.minutes;
    }

    if (unlocked) {
      newAchievements.push(achievement.id);
    }
  });

  return newAchievements;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newlyUnlocked = checkAchievements(user);

    if (newlyUnlocked.length > 0) {
      const currentAchievements = user.achievements || [];
      const updatedAchievements = [...currentAchievements, ...newlyUnlocked];
      const newAchievements = newlyUnlocked;

      await base44.auth.updateMe({
        achievements: updatedAchievements,
        new_achievements: newAchievements
      });

      return Response.json({
        success: true,
        newlyUnlocked: newlyUnlocked,
        totalAchievements: updatedAchievements.length
      });
    }

    return Response.json({
      success: true,
      newlyUnlocked: [],
      totalAchievements: (user.achievements || []).length
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});