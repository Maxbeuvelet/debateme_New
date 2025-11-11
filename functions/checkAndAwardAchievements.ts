
import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

const achievements = [
  {
    id: "first_exchange",
    name: "First Exchange",
    xp_reward: 25,
    criteria_type: "debates_completed",
    criteria_value: 1
  },
  {
    id: "debate_creator",
    name: "Debate Creator",
    xp_reward: 50,
    criteria_type: "debates_created",
    criteria_value: 1
  },
  {
    id: "locked_in",
    name: "Locked In",
    xp_reward: 150,
    criteria_type: "total_debate_time",
    criteria_value: 30
  },
  {
    id: "active_participant",
    name: "Active Participant",
    xp_reward: 100,
    criteria_type: "debates_completed",
    criteria_value: 5
  },
  {
    id: "committed_contributor",
    name: "Committed Contributor",
    xp_reward: 300,
    criteria_type: "debates_completed",
    criteria_value: 20
  },
  {
    id: "seasoned_debater",
    name: "Seasoned Debater",
    xp_reward: 1000,
    criteria_type: "debates_completed",
    criteria_value: 100
  }
];

const calculateXpForNextLevel = (level) => {
  return level * 100;
};

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId } = await req.json();
        
        if (!userId || userId !== user.id) {
            return Response.json({ error: 'Invalid user ID' }, { status: 400 });
        }

        // Get current user data
        const users = await base44.asServiceRole.entities.User.list();
        const currentUser = users.find(u => u.id === userId);
        
        if (!currentUser) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        const earnedAchievements = currentUser.achievements_earned || [];
        const newAchievements = [];
        let totalXpAwarded = 0;

        // Check each achievement
        for (const achievement of achievements) {
            // Skip if already earned
            if (earnedAchievements.includes(achievement.id)) {
                continue;
            }

            let currentValue = 0;
            
            if (achievement.criteria_type === "debates_completed") {
                currentValue = currentUser.debates_completed || 0;
            } else if (achievement.criteria_type === "total_debate_time") {
                currentValue = currentUser.total_debate_time_minutes || 0;
            } else if (achievement.criteria_type === "debates_created") {
                currentValue = currentUser.debates_created || 0;
            }
            // Add more criteria types as needed
            
            // Check if achievement is earned
            if (currentValue >= achievement.criteria_value) {
                newAchievements.push(achievement.id);
                totalXpAwarded += achievement.xp_reward;
            }
        }

        // If no new achievements, return early
        if (newAchievements.length === 0) {
            return Response.json({
                success: true,
                newAchievements: [],
                totalXpAwarded: 0
            });
        }

        // Award XP and handle level ups
        let currentXp = (currentUser.xp || 0) + totalXpAwarded;
        let currentLevel = currentUser.level || 1;

        while (true) {
            const xpNeededForNextLevel = calculateXpForNextLevel(currentLevel);
            
            if (currentXp >= xpNeededForNextLevel) {
                currentLevel = currentLevel + 1;
                currentXp = currentXp - xpNeededForNextLevel;
            } else {
                break;
            }
        }

        // Update user with new achievements and XP
        await base44.asServiceRole.entities.User.update(userId, {
            achievements_earned: [...earnedAchievements, ...newAchievements],
            new_achievements: [...(currentUser.new_achievements || []), ...newAchievements],
            xp: currentXp,
            level: currentLevel
        });

        return Response.json({
            success: true,
            newAchievements: newAchievements,
            totalXpAwarded: totalXpAwarded,
            achievementDetails: achievements.filter(a => newAchievements.includes(a.id))
        });
        
    } catch (error) {
        console.error("Error in checkAndAwardAchievements:", error);
        return Response.json({ 
            error: error.message 
        }, { status: 500 });
    }
});
