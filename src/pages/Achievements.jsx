import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { motion } from "framer-motion";
import { Star, Trophy, Lock, CheckCircle2, Award, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const achievements = [
  {
    id: "first_exchange",
    name: "First Exchange",
    description: "Completed your first debate session",
    xp_reward: 25,
    icon: "🎯",
    criteria_type: "debates_completed",
    criteria_value: 1
  },
  {
    id: "debate_creator",
    name: "Debate Creator",
    description: "Created your own debate topic",
    xp_reward: 50,
    icon: "✨",
    criteria_type: "debates_created",
    criteria_value: 1
  },
  {
    id: "locked_in",
    name: "Locked In",
    description: "Spent 30 minutes in a debate",
    xp_reward: 150,
    icon: "🔒",
    criteria_type: "total_debate_time",
    criteria_value: 30
  },
  {
    id: "active_participant",
    name: "Active Participant",
    description: "Took part in 5 debates",
    xp_reward: 100,
    icon: "💬",
    criteria_type: "debates_completed",
    criteria_value: 5
  },
  {
    id: "committed_contributor",
    name: "Committed Contributor",
    description: "Engaged in 20 debates",
    xp_reward: 300,
    icon: "🔥",
    criteria_type: "debates_completed",
    criteria_value: 20
  },
  {
    id: "seasoned_debater",
    name: "Seasoned Debater",
    description: "Reached 100 completed debates",
    xp_reward: 1000,
    icon: "👑",
    criteria_type: "debates_completed",
    criteria_value: 100
  },
  {
    id: "consistent_voice",
    name: "Consistent Voice",
    description: "Participated 5 days in a row",
    xp_reward: 200,
    icon: "📅",
    criteria_type: "consecutive_days",
    criteria_value: 5
  },
  {
    id: "relentless_mind",
    name: "Relentless Mind",
    description: "Participated every day for 30 consecutive days",
    xp_reward: 1500,
    icon: "⚡",
    criteria_type: "consecutive_days",
    criteria_value: 30
  }
];

export default function Achievements() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
    }
    setIsLoading(false);
  };

  const calculateProgress = (achievement) => {
    if (!currentUser) return 0;
    
    let currentValue = 0;
    if (achievement.criteria_type === "debates_completed") {
      currentValue = currentUser.debates_completed || 0;
    } else if (achievement.criteria_type === "consecutive_days") {
      currentValue = currentUser.consecutive_days || 0;
    } else if (achievement.criteria_type === "total_debate_time") {
      currentValue = currentUser.total_debate_time || 0;
    } else if (achievement.criteria_type === "debates_created") {
      currentValue = currentUser.debates_created || 0;
    }
    
    return Math.min(100, (currentValue / achievement.criteria_value) * 100);
  };

  const isAchievementEarned = (achievement) => {
    if (!currentUser || !currentUser.achievements_earned) return false;
    return currentUser.achievements_earned.includes(achievement.id);
  };

  const totalXpEarned = achievements
    .filter(isAchievementEarned)
    .reduce((sum, achievement) => sum + achievement.xp_reward, 0);

  const earnedCount = achievements.filter(isAchievementEarned).length;

  return (
    <div className="min-h-screen bg-slate-800 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent pb-2 leading-tight">
                Achievements
              </h1>
            </div>
            <p className="text-xl text-slate-300 ml-15">
              Earn XP by completing challenges and milestones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-slate-800/60 backdrop-blur-md border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-5 h-5 text-slate-300" />
                  <span className="text-sm text-slate-300">Achievements Earned</span>
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                  {earnedCount} / {achievements.length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 backdrop-blur-md border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-slate-300">Total XP from Achievements</span>
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                  {totalXpEarned} XP
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 backdrop-blur-md border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-slate-300" />
                  <span className="text-sm text-slate-300">Completion Rate</span>
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                  {Math.round((earnedCount / achievements.length) * 100)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => {
              const progress = calculateProgress(achievement);
              const isEarned = isAchievementEarned(achievement);

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className={`backdrop-blur-md border-2 ${isEarned ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20 bg-slate-800/80' : 'border-slate-600 bg-slate-800/60'} overflow-hidden relative`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-lg relative"
                          >
                            <span className="text-3xl">{achievement.icon}</span>
                            {isEarned && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>

                          <div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-1">
                              {achievement.name}
                            </h3>
                            <p className="text-sm text-slate-300">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {!isEarned && (
                        <div className="mb-4" dir="ltr">
                          <div className="flex justify-between text-xs text-slate-400 mb-2">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-end pt-4 border-t border-slate-600">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-cyan-400" />
                          <span className="font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                            +{achievement.xp_reward} XP
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <Card className="bg-slate-800/60 backdrop-blur-md border-slate-600 inline-block">
              <CardContent className="p-6">
                <p className="text-slate-300">
                  <span className="text-white font-semibold">Note:</span> Achievement tracking is coming soon! 
                  Keep debating to unlock these rewards.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}