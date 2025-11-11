import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { motion } from "framer-motion";
import { Trophy, Hexagon, Shield, Zap, Star, Gem, Eye, Flame, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const rankTiers = [
  {
    level: 1,
    name: "Rookie",
    material: "Stone",
    icon: Hexagon,
    gradient: "",
    textColor: "text-amber-700",
    borderColor: "border-amber-300",
    glowColor: "shadow-[0_0_20px_rgba(217,119,6,0.2)]",
    description: "Raw, unrefined, just entered the arena.",
    xpRequired: 0,
    xpToNext: 1000,
    customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/8d99511b8_standartrankbronze.png"
  },
  {
    level: 10,
    name: "Apprentice",
    material: "Bronze",
    icon: Shield,
    gradient: "",
    textColor: "text-slate-500",
    borderColor: "border-slate-300",
    glowColor: "shadow-[0_0_25px_rgba(148,163,184,0.3)]",
    description: "Foundational skill, early respect.",
    xpRequired: 1000,
    xpToNext: 2000,
    customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/ed5a4b8bc_standartranksilver1.png"
  },
  {
    level: 20,
    name: "Tactician",
    material: "Silver",
    icon: Zap,
    gradient: "",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-200",
    glowColor: "shadow-[0_0_25px_rgba(234,179,8,0.3)]",
    description: "Sharp logic forming, sleek aesthetic.",
    xpRequired: 3000,
    xpToNext: 3000,
    customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/21cc5a6d2_standartrankgold1.png"
  },
  {
    level: 30,
    name: "Orator",
    material: "Gold",
    icon: Star,
    gradient: "",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    glowColor: "shadow-[0_0_30px_rgba(249,115,22,0.4)]",
    description: "Confident, loud, eloquent.",
    xpRequired: 6000,
    xpToNext: 4000,
    customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/eb077c24e_rankbronze1.png"
  },
  {
    level: 40,
    name: "Philosopher",
    material: "Emerald",
    icon: Gem,
    gradient: "",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    glowColor: "shadow-[0_0_30px_rgba(16,185,129,0.4)]",
    description: "Precision and calm control.",
    xpRequired: 10000,
    xpToNext: 5000,
    customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/cdc86a441_ranksilverblue.png"
  },
  {
    level: 50,
    name: "Visionary",
    material: "Diamond",
    icon: Eye,
    gradient: "",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    glowColor: "shadow-[0_0_35px_rgba(168,85,247,0.4)]",
    description: "Insightful, transcendent thinker.",
    xpRequired: 15000,
    xpToNext: 6000,
    customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/a139614f3_ranksilverpurple.png"
  },
  {
    level: 60,
    name: "Luminary",
    material: "Mythic",
    icon: Flame,
    gradient: "",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    glowColor: "shadow-[0_0_40px_rgba(251,191,36,0.4)]",
    description: "You don't argue—you inspire.",
    xpRequired: 21000,
    xpToNext: 7000,
    customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/83e5f6f36_rankgold.png"
  },
  {
    level: 70,
    name: "Paragon",
    material: "Obsidian",
    icon: Crown,
    gradient: "",
    textColor: "text-cyan-600",
    borderColor: "border-cyan-200",
    glowColor: "shadow-[0_0_50px_rgba(34,211,238,0.4)]",
    description: "Legendary rank. Debating deity.",
    xpRequired: 28000,
    xpToNext: null,
    customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/e707f104e_ranksilver.png"
  }
];

export default function Ranked() {
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

  const userLevel = currentUser?.level || 1;

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
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent pb-2 leading-tight">
                Rank System
              </h1>
            </div>
            <p className="text-xl text-slate-300 ml-15">
              Progress through the ranks as you debate and earn XP
            </p>
          </div>

          {/* Ranks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rankTiers.map((rank, index) => {
              const RankIcon = rank.icon;
              const isUnlocked = userLevel >= rank.level;
              const isCurrent = userLevel >= rank.level && (index === rankTiers.length - 1 || userLevel < rankTiers[index + 1].level);

              return (
                <motion.div
                  key={rank.level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className={`backdrop-blur-md border-2 ${rank.borderColor} ${rank.glowColor} overflow-hidden relative bg-slate-800/60`}
                  >
                    {isCurrent && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xs font-bold rounded-full">
                          Current
                        </span>
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Rank Icon */}
                        <div
                          className={`w-16 h-16 rounded-2xl bg-transparent flex items-center justify-center shadow-lg relative overflow-hidden`}
                        >
                          {rank.customImage ? (
                            <img 
                              src={rank.customImage} 
                              alt={rank.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <RankIcon className="w-8 h-8 text-white" />
                          )}
                          
                          {/* Special effects */}
                          {rank.level === 1 && (
                            <div className="absolute inset-0 rounded-2xl opacity-30 bg-[radial-gradient(circle_at_40%_60%,transparent_0%,transparent_45%,rgba(255,255,255,0.1)_45%,rgba(255,255,255,0.1)_47%,transparent_47%)]" />
                          )}
                          {/* Ember animation for Paragon Obsidian */}
                          {rank.level >= 70 && (
                            <motion.div
                              className="absolute inset-0 rounded-2xl"
                              style={{
                                background: 'radial-gradient(circle at 30% 40%, rgba(220,38,38,0.3) 0%, transparent 70%)',
                              }}
                              animate={{
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className={`text-xs font-bold ${rank.textColor} uppercase tracking-wider mb-1`}>
                            {rank.name}
                          </div>
                          <h3 className="text-2xl font-black mb-1 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                            Level {rank.level}+
                          </h3>
                        </div>
                      </div>

                      {/* XP Requirements */}
                      <div className="p-3 rounded-lg border bg-slate-900/40 border-slate-600">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">
                            XP Required:
                          </span>
                          <span className="font-bold text-white">
                            {rank.xpRequired.toLocaleString()} XP
                          </span>
                        </div>
                        {!rank.xpToNext && (
                          <div className="text-center text-sm mt-2 pt-2 border-t border-slate-600">
                            <span className="font-bold text-cyan-300">
                              ✨ Maximum Rank ✨
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <Card className="bg-slate-800/60 backdrop-blur-md border-slate-600 inline-block">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2">How to Earn XP</h3>
                <div className="text-slate-300 space-y-1">
                  <p>🎯 Join a debate: <span className="font-bold text-white">+50 XP</span></p>
                  <p className="text-sm text-slate-400">More ways to earn XP coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}