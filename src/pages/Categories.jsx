import React, { useState, useEffect } from "react";
import { Debate, User } from "@/entities/all";
import { motion } from "framer-motion";
import { LayoutGrid, Landmark, Cpu, Leaf, DollarSign, Sparkles, Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categoryConfig = {
  politics: {
    name: "Politics",
    icon: Landmark,
    gradient: "from-gray-400 via-gray-500 to-gray-600",
    outlineGradient: "from-gray-400 to-gray-600",
    hoverGlow: "group-hover:shadow-[0_0_30px_rgba(148,163,184,0.3)]",
    iconBg: "bg-slate-700",
    iconType: "image",
    iconUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/c3e619f09_government.png",
    description: "Government policy, elections, and power dynamics",
    iconAnimation: {
      rotate: [0, -3, 3, -2, 2, 0],
      y: [0, -2, 0, -1, 0]
    }
  },
  technology: {
    name: "Technology",
    icon: Cpu,
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    outlineGradient: "from-blue-400 to-blue-600",
    hoverGlow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    iconBg: "bg-slate-700",
    emoji: "💻",
    description: "AI, innovation, and the digital future",
    iconAnimation: {
      scale: [1, 1.2, 0.9, 1.1, 1],
      rotate: [0, 180, 360]
    }
  },
  environment: {
    name: "Environment",
    icon: Leaf,
    gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
    outlineGradient: "from-emerald-400 to-emerald-600",
    hoverGlow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
    iconBg: "bg-slate-700",
    emoji: "🌍",
    description: "Climate action, sustainability, and conservation",
    iconAnimation: {
      rotate: [0, 360]
    }
  },
  economics: {
    name: "Economics",
    icon: DollarSign,
    gradient: "from-amber-400 via-amber-500 to-amber-600",
    outlineGradient: "from-amber-400 to-amber-600",
    hoverGlow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]",
    iconBg: "bg-slate-700",
    emoji: "💰",
    description: "Markets, wealth distribution, and trade policy",
    iconAnimation: {
      y: [0, -10, 0, -5, 0],
      rotate: [0, 5, -5, 3, -3, 0]
    }
  }
};

export default function Categories() {
  const [debates, setDebates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Launch date: Saturday, October 25th, 2025 at 7:00 PM
  const LAUNCH_DATE = new Date('2025-10-25T19:00:00');
  const isLaunched = new Date() >= LAUNCH_DATE;

  useEffect(() => {
    if (isLaunched) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [isLaunched]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const debatesData = await Debate.filter({ status: "active" });
      setDebates(debatesData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load categories. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If not launched yet, show the coming soon page
  if (!isLaunched) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Animated background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl"
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

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                DebateMe
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
                Debates Launch This Saturday!
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 mb-6 leading-relaxed">
                Get ready to challenge perspectives and build understanding through<br className="hidden sm:block" />
                <span className="text-purple-400 font-semibold"> live video debates</span> that matter.
              </p>
            </motion.div>

            {/* Launch Date Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="inline-block bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8 shadow-[0_0_50px_rgba(168,85,247,0.3)]"
            >
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-slate-400">Launch Date</div>
                    <div className="text-xl font-bold text-white">Saturday, Oct 25th</div>
                  </div>
                </div>
                
                <div className="h-12 w-px bg-slate-700 hidden sm:block" />
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-slate-400">Launch Time</div>
                    <div className="text-xl font-bold text-white">7:00 PM</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Footer text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-slate-500 text-sm"
            >
              <p>
                Check back Saturday evening to start your first debate!
              </p>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"
            />
          </motion.div>
        </div>
      </div>
    );
  }

  const categoryCounts = debates.reduce((acc, debate) => {
    acc[debate.category] = (acc[debate.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(categoryConfig);

  return (
    <div className="min-h-screen bg-slate-800 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent pb-2 leading-tight">
                Debate Categories
              </h1>
            </div>
            <p className="text-xl text-slate-300 ml-15">
              Choose your favorite categories and match with someone with similar interests
            </p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 text-center mb-8">
              <p className="text-red-200 mb-4">{error}</p>
              <Button
                onClick={loadData}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((categoryKey, index) => {
              const category = categoryConfig[categoryKey];
              const count = categoryCounts[categoryKey] || 0;

              return (
                <motion.div
                  key={categoryKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Link to={createPageUrl(`CategoryTopics?category=${categoryKey}`)} className="block h-full">
                    <div className={`group relative bg-gradient-to-r ${category.outlineGradient} p-[2px] rounded-xl sm:rounded-2xl ${category.hoverGlow} transition-all duration-300 h-full min-h-[280px]`}>
                      <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 h-full overflow-hidden flex flex-col">
                        {/* Animated icon/emoji */}
                        <motion.div
                          whileHover={category.iconAnimation}
                          transition={{
                            duration: 1,
                            ease: "easeInOut"
                          }}
                          className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-lg sm:rounded-xl lg:rounded-2xl ${category.iconBg} backdrop-blur-sm flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 cursor-pointer flex-shrink-0`}
                        >
                          {category.iconType === "image" ? (
                            <img src={category.iconUrl} alt={category.name} className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain" />
                          ) : (
                            <span className="text-xl sm:text-2xl lg:text-3xl">{category.emoji}</span>
                          )}
                        </motion.div>

                        <h3 className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:from-cyan-400 group-hover:to-white transition-all duration-300 flex-shrink-0">
                          {category.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 mb-3 sm:mb-4 leading-relaxed flex-grow">
                          {category.description}
                        </p>

                        <div className="flex items-center justify-between flex-shrink-0">
                          <Badge className={`bg-gradient-to-r ${category.gradient} text-white border-0 font-bold text-xs sm:text-sm`}>
                            {count} topics
                          </Badge>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </div>

                        {/* Glassmorphism overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl" />
                        
                        {/* Glow effect */}
                        <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${category.outlineGradient} opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-300`} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}