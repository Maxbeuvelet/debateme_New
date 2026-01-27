import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { motion } from "framer-motion";
import { Star, Trophy, Lock, CheckCircle2, Award, Zap, Sparkles, Calendar } from "lucide-react";

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

  // Launch date: Friday, January 2nd, 2026 at 6pm
  const LAUNCH_DATE = new Date(2026, 0, 2, 18, 0, 0); // year, month (0=Jan), day, hour, min, sec
  const isLaunched = new Date() >= LAUNCH_DATE;

  useEffect(() => {
    if (isLaunched) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, [isLaunched]);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const isAuth = await User.isAuthenticated();
      if (isAuth) {
        const user = await User.me();
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
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

  // If not launched yet, show coming soon page
  if (!isLaunched) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Animated background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">Coming Soon</span>
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Unlock Achievements
              </span>
            </motion.h1>

            {/* Launch Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Launch Day: Friday, January 2nd at 7pm EST
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 mb-6 leading-relaxed">
                Complete challenges, earn XP, and<br className="hidden sm:block" />
                <span className="text-purple-400 font-semibold"> track your debating journey</span>
              </p>
            </motion.div>



            {/* Preview of Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8 max-w-3xl mx-auto"
            >
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.2)] relative overflow-hidden">
                {/* Overlay to indicate disabled */}
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-xl font-bold text-white">Available Jan 2nd at 6pm</p>
                  </div>
                </div>

                {/* Preview Cards (disabled look) */}
                <div className="space-y-4 opacity-50">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Star className="w-8 h-8 text-yellow-400" />
                      Your Achievements
                    </h3>
                  </div>

                  {/* Mock achievement cards */}
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="bg-slate-800/80 border border-slate-600 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                          <span className="text-2xl">{achievement.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-1">{achievement.name}</h4>
                          <p className="text-sm text-slate-400">{achievement.description}</p>
                        </div>
                        <div className="flex items-center gap-1 text-cyan-400">
                          <Zap className="w-4 h-4" />
                          <span className="font-bold">+{achievement.xp_reward} XP</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Discord Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mb-6"
            >
              <a
                href="https://discord.gg/aXQevrYxBm"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-block"
              >
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                  </svg>
                  Join Our Discord Community
                </button>
              </a>
            </motion.div>

            {/* Footer text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-slate-500 text-sm"
            >
              <p>
                Join our community and start earning achievements on launch day!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

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