import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Zap, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CommunitySpotlight({ userStances, isLoading }) {
  // Load Lottie script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.5/dist/dotlottie-wc.js';
    script.type = 'module';
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  if (isLoading) {
    return (
      <div id="community-spotlight">
        <div className="text-center mb-8 sm:mb-12">
          <div className="h-8 sm:h-10 w-48 sm:w-64 bg-slate-700 rounded mx-auto mb-3 sm:mb-4 animate-pulse" />
          <div className="h-4 sm:h-6 w-64 sm:w-96 bg-slate-700 rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-slate-700/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 h-[200px] animate-pulse" />
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
      title: "Most Active",
      name: topDebaters[0]?.[0] || "Be the first!",
      stat: topDebaters[0] ? `${topDebaters[0][1]} debates` : "0 debates",
      gradient: "from-purple-500 to-pink-500",
      icon: Flame,
      animation: {
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 1]
      }
    },
    {
      title: "Rising Star",
      name: topDebaters[1]?.[0] || "Start debating!",
      stat: topDebaters[1] ? `${topDebaters[1][1]} debates` : "0 debates",
      gradient: "from-cyan-500 to-blue-500",
      icon: Zap,
      animation: {
        y: [0, -5, 0],
        rotate: [0, 10, -10, 0]
      }
    },
    {
      title: "Champion",
      name: topDebaters[2]?.[0] || "Join debates!",
      stat: topDebaters[2] ? `${topDebaters[2][1]} debates` : "0 debates",
      gradient: "from-amber-500 to-orange-500",
      icon: Trophy,
      animation: {
        scale: [1, 1.05, 1],
        rotate: [0, -5, 5, 0]
      }
    }
  ];

  return (
    <div id="community-spotlight" className="scroll-mt-20">
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black mb-2 sm:mb-3 lg:mb-4 px-3 sm:px-4"
        >
          <span className="inline-block w-12 h-12 sm:w-14 sm:h-14 align-middle">
            <dotlottie-wc 
              src="https://lottie.host/97fe061f-9ad2-4f3a-bd76-a296c0f78ce0/owZOGY9iIX.lottie" 
              style={{ width: '100%', height: '100%' }} 
              autoplay 
              loop
            />
          </span>
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Community Spotlight</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-300 px-3 sm:px-4"
        >
          Celebrating our most engaged community members
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {highlights.map((highlight, index) => (
          <motion.div
            key={highlight.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`relative p-px rounded-xl sm:rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group hover:shadow-xl hover:scale-[1.01] bg-gradient-to-br ${highlight.gradient}`}
          >
            <div className="relative bg-slate-900/80 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 h-full flex flex-col justify-between">
              {/* Animated Icon */}
              <motion.div 
                className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br ${highlight.gradient} flex items-center justify-center mb-3 sm:mb-4 lg:mb-5`}
                whileHover={highlight.animation}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <highlight.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </motion.div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-200 mb-2 sm:mb-3">
                {highlight.title}
              </h3>

              {/* Debater name */}
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r ${highlight.gradient} bg-clip-text text-transparent mb-2 sm:mb-3 truncate">
                {highlight.name}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-2">
                <Badge className={`bg-slate-700 text-white border-0 font-semibold text-sm sm:text-base px-3 py-1 rounded-full`}>
                  {highlight.stat}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}