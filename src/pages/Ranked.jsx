import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { motion } from "framer-motion";
import { Trophy, Hexagon, Shield, Zap, Star, Gem, Eye, Flame, Crown, Sparkles, Calendar } from "lucide-react";

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

  // Launch date: Saturday, January 4th, 2026 at 6pm
  const LAUNCH_DATE = new Date(2026, 0, 4, 18, 0, 0); // year, month (0=Jan), day, hour, min, sec
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
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
    }
    setIsLoading(false);
  };

  const userLevel = currentUser?.level || 1;

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
                Climb The Ranks
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
                Launch Day: November 28th
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 mb-6 leading-relaxed">
                Rise through the ranks and<br className="hidden sm:block" />
                <span className="text-purple-400 font-semibold"> become a legendary debater</span>
              </p>
            </motion.div>



            {/* Preview of Ranks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8 max-w-4xl mx-auto"
            >
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.2)] relative overflow-hidden">
                {/* Overlay to indicate disabled */}
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-xl font-bold text-white">Available November 28th</p>
                  </div>
                </div>

                {/* Preview Grid (disabled look) */}
                <div className="opacity-50">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Trophy className="w-8 h-8 text-yellow-400" />
                      Rank Progression
                    </h3>
                  </div>

                  {/* Mock rank cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {rankTiers.slice(0, 4).map((rank) => (
                      <div key={rank.level} className={`bg-slate-800/80 border-2 ${rank.borderColor} rounded-xl p-4`}>
                        <div className="w-12 h-12 rounded-xl bg-transparent flex items-center justify-center mb-3 mx-auto overflow-hidden">
                          {rank.customImage && (
                            <img 
                              src={rank.customImage} 
                              alt={rank.name}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                        <div className={`text-xs font-bold ${rank.textColor} uppercase text-center mb-1`}>
                          {rank.name}
                        </div>
                        <div className="text-sm font-bold text-white text-center">
                          Level {rank.level}+
                        </div>
                      </div>
                    ))}
                  </div>
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
                Join our community and start your journey to the top on launch day!
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