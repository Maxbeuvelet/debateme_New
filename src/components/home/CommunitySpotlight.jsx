
import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Zap, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CommunitySpotlight({ userStances, isLoading }) {
  if (isLoading) {
    return (
      <div>
        <div className="h-8 sm:h-10 w-48 sm:w-64 bg-gray-200 rounded mx-auto mb-6 sm:mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 h-[160px] sm:h-[180px] lg:h-[200px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Get top debaters based on participation
  const userDebateCount = {};
  userStances.forEach(stance => {
    userDebateCount[stance.user_name] = (userDebateCount[stance.user_name] || 0) + 1;
  });

  const topDebaters = Object.entries(userDebateCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const highlights = [
    {
      title: "🏆 Debater of the Week",
      name: topDebaters[0]?.[0] || "Be the first!",
      stat: topDebaters[0]?.[1] || 0,
      statLabel: "debates joined",
      gradient: "from-gray-600 via-gray-700 to-gray-800",
      icon: Crown,
      glow: "shadow-[0_0_30px_rgba(0,0,0,0.15)]",
      iconBg: "bg-red-500/20",
      emoji: "🏛️",
      description: "Debate government policies, elections, and the balance of power in society",
      iconAnimation: {
        rotate: [0, -3, 3, -2, 2, 0],
        y: [0, -2, 0, -1, 0]
      }
    },
    {
      title: "⭐ Rising Star",
      name: topDebaters[1]?.[0] || "",
      stat: topDebaters[1]?.[1] || 0,
      statLabel: "debates joined",
      gradient: "from-gray-500 via-gray-600 to-gray-700",
      icon: Star,
      glow: "shadow-[0_0_30px_rgba(0,0,0,0.1)]",
      iconBg: "bg-cyan-500/20",
      emoji: "💻",
      description: "Explore AI ethics, innovation impact, and the digital transformation of society",
      iconAnimation: {
        rotate: [0, 360],
        scale: [1, 1.3, 1]
      }
    },
    {
      title: "⚡ Most Active",
      name: topDebaters[2]?.[0] || "Join a debate",
      stat: topDebaters[2]?.[1] || 0,
      statLabel: "debates joined",
      gradient: "from-blue-400 via-blue-500 to-blue-600",
      icon: Zap,
      glow: "shadow-[0_0_30px_rgba(59,130,246,0.2)]",
      iconBg: "bg-yellow-500/20",
      emoji: "💰",
      description: "Challenge views on markets, wealth distribution, and economic policies",
      iconAnimation: {
        y: [0, -15, 0],
        rotate: [0, -10, 10, 0],
        scale: [1, 1.2, 1]
      }
    }
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-6 sm:mb-8 lg:mb-12"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black mb-2 sm:mb-3 lg:mb-4 px-3 sm:px-4">
          🌟 Community <span className="bg-gradient-to-r from-black to-blue-600 bg-clip-text text-transparent">Spotlight</span>
        </h2>
        <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 px-3 sm:px-4">
          Celebrating our most active and passionate debaters
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {highlights.map((highlight, index) => (
          <motion.div
            key={highlight.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`group relative bg-gradient-to-br ${highlight.gradient} p-[2px] rounded-xl sm:rounded-2xl ${highlight.glow} transition-all duration-300 cursor-pointer`}
          >
            <div className="relative bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 h-full">
              {/* Animated Icon */}
              <motion.div 
                className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${highlight.gradient} flex items-center justify-center mb-2 sm:mb-3 lg:mb-4`}
                whileHover={highlight.iconAnimation}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <highlight.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </motion.div>

              {/* Title */}
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-700 mb-2 sm:mb-3">
                {highlight.title}
              </h3>

              {/* Debater name */}
              <div className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-black to-blue-600 bg-clip-text text-transparent mb-1 sm:mb-2 truncate">
                {highlight.name}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-2">
                <Badge className={`bg-gradient-to-r ${highlight.gradient} text-white border-0 font-bold text-xs sm:text-sm`}>
                  {highlight.stat} {highlight.statLabel}
                </Badge>
              </div>

              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${highlight.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-300`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
