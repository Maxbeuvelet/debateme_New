import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User } from "@/entities/User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Flame, Clock, Zap, Star, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function Achievements() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const achievements = [
    {
      id: "first_debate",
      name: "Newcomer",
      description: "Join your first debate",
      icon: Trophy,
      color: "bg-blue-600",
      requirement: { type: "debates_joined", count: 1 },
      rarity: "common"
    },
    {
      id: "five_debates",
      name: "Debater",
      description: "Join 5 debates",
      icon: Zap,
      color: "bg-purple-600",
      requirement: { type: "debates_joined", count: 5 },
      rarity: "uncommon"
    },
    {
      id: "ten_debates",
      name: "Experienced Debater",
      description: "Join 10 debates",
      icon: Flame,
      color: "bg-orange-600",
      requirement: { type: "debates_joined", count: 10 },
      rarity: "uncommon"
    },
    {
      id: "twenty_debates",
      name: "Rhetorical Warrior",
      description: "Join 20 debates",
      icon: Crown,
      color: "bg-red-600",
      requirement: { type: "debates_joined", count: 20 },
      rarity: "rare"
    },
    {
      id: "fifty_debates",
      name: "Master Orator",
      description: "Join 50 debates",
      icon: Star,
      color: "bg-yellow-600",
      requirement: { type: "debates_joined", count: 50 },
      rarity: "epic"
    },
    {
      id: "hundred_debates",
      name: "Legend of Discourse",
      description: "Join 100 debates",
      icon: Crown,
      color: "bg-indigo-600",
      requirement: { type: "debates_joined", count: 100 },
      rarity: "legendary"
    },
    {
      id: "ten_min_debate",
      name: "Determined",
      description: "Stay in a debate for 10 minutes",
      icon: Clock,
      color: "bg-green-600",
      requirement: { type: "debate_duration", minutes: 10 },
      rarity: "common"
    },
    {
      id: "twenty_min_debate",
      name: "Tenacious Debater",
      description: "Stay in a debate for 20 minutes",
      icon: Clock,
      color: "bg-cyan-600",
      requirement: { type: "debate_duration", minutes: 20 },
      rarity: "uncommon"
    },
    {
      id: "thirty_min_debate",
      name: "Unstoppable Conversationalist",
      description: "Stay in a debate for 30 minutes",
      icon: Clock,
      color: "bg-pink-600",
      requirement: { type: "debate_duration", minutes: 30 },
      rarity: "epic"
    }
  ];

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const isAchievementUnlocked = (achievement) => {
    if (!user) return false;
    return user.achievements && user.achievements.includes(achievement.id);
  };

  const getProgress = (achievement) => {
    if (!user) return 0;
    
    if (achievement.requirement.type === "debates_joined") {
      const debatesJoined = user.debates_joined || user.debates_completed || 0;
      const progress = (debatesJoined / achievement.requirement.count) * 100;
      return Math.min(100, isNaN(progress) ? 0 : progress);
    }
    
    if (achievement.requirement.type === "debate_duration") {
      const maxDebateTime = user.max_debate_duration || user.total_debate_time_minutes || 0;
      const progress = (maxDebateTime / achievement.requirement.minutes) * 100;
      return Math.min(100, isNaN(progress) ? 0 : progress);
    }
    
    return 0;
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: "border-slate-500",
      uncommon: "border-green-500",
      rare: "border-blue-500",
      epic: "border-purple-500",
      legendary: "border-yellow-500"
    };
    return colors[rarity] || "border-slate-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const unlockedCount = achievements.filter(a => isAchievementUnlocked(a)).length;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-white">Achievements</h1>
          </div>
          <p className="text-slate-300">
            <span className="font-bold text-yellow-400">{unlockedCount}</span> of <span className="font-bold text-slate-400">{achievements.length}</span> unlocked
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Debate Milestones */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Debate Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.filter(a => a.requirement.type === "debates_joined").map((achievement) => {
              const Icon = achievement.icon;
              const unlocked = isAchievementUnlocked(achievement);
              const progress = getProgress(achievement);
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`relative overflow-hidden transition-all ${
                    unlocked 
                      ? `bg-gradient-to-br from-slate-800 to-slate-900 border-2 ${getRarityColor(achievement.rarity)} shadow-lg shadow-slate-700` 
                      : "bg-slate-800/50 border border-slate-700"
                  }`}>
                    {unlocked && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute top-2 right-2"
                      >
                        <Flame className="w-5 h-5 text-yellow-400" />
                      </motion.div>
                    )}
                    
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${achievement.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className={unlocked ? "text-white" : "text-slate-400"}>
                            {achievement.name}
                          </CardTitle>
                          <CardDescription className={unlocked ? "text-slate-300" : "text-slate-500"}>
                            {achievement.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {!unlocked && (
                        <>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-400">Progress</span>
                            <span className="text-xs font-bold text-slate-300">{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${achievement.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </>
                      )}
                      {unlocked && (
                        <div className="text-center">
                          <Badge className={`${achievement.color} text-white capitalize`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Duration Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Endurance Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.filter(a => a.requirement.type === "debate_duration").map((achievement) => {
              const Icon = achievement.icon;
              const unlocked = isAchievementUnlocked(achievement);
              const progress = getProgress(achievement);
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`relative overflow-hidden transition-all ${
                    unlocked 
                      ? `bg-gradient-to-br from-slate-800 to-slate-900 border-2 ${getRarityColor(achievement.rarity)} shadow-lg shadow-slate-700` 
                      : "bg-slate-800/50 border border-slate-700"
                  }`}>
                    {unlocked && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute top-2 right-2"
                      >
                        <Flame className="w-5 h-5 text-yellow-400" />
                      </motion.div>
                    )}
                    
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${achievement.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className={unlocked ? "text-white" : "text-slate-400"}>
                            {achievement.name}
                          </CardTitle>
                          <CardDescription className={unlocked ? "text-slate-300" : "text-slate-500"}>
                            {achievement.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {!unlocked && (
                        <>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-400">Progress</span>
                            <span className="text-xs font-bold text-slate-300">{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${achievement.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </>
                      )}
                      {unlocked && (
                        <div className="text-center">
                          <Badge className={`${achievement.color} text-white capitalize`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}