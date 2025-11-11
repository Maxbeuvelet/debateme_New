
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Users, MessageSquare, Trophy } from "lucide-react";

function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function LiveStats({ activeTopics, activeDebates, totalArguments, uniqueDebaters, isLoading }) {
  const stats = [
    {
      icon: Flame,
      label: "Active Topics",
      value: activeTopics,
      color: "from-gray-400 to-gray-600",
      glow: "shadow-[0_0_20px_rgba(0,0,0,0.1)]"
    },
    {
      icon: Users,
      label: "Debates Happening Now",
      value: activeDebates,
      color: "from-gray-500 to-gray-700",
      glow: "shadow-[0_0_20px_rgba(0,0,0,0.1)]"
    },
    {
      icon: MessageSquare,
      label: "Total Arguments",
      value: totalArguments,
      color: "from-blue-400 to-blue-600",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]"
    },
    {
      icon: Trophy,
      label: "Active Debaters",
      value: uniqueDebaters,
      color: "from-gray-600 to-gray-800",
      glow: "shadow-[0_0_20px_rgba(0,0,0,0.15)]"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((_, index) => (
          <div key={index} className="bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 animate-pulse">
            <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-gray-200 rounded-lg sm:rounded-xl mb-2 sm:mb-3 lg:mb-4" />
            <div className="h-6 sm:h-7 lg:h-8 bg-gray-200 rounded mb-1 sm:mb-2" />
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className={`group relative bg-white/80 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 ${stat.glow} cursor-pointer`}
        >
          <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 sm:mb-3 lg:mb-4`}>
            <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          
          <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black bg-gradient-to-r from-black to-blue-600 bg-clip-text text-transparent mb-0.5 sm:mb-1 font-mono">
            <AnimatedCounter value={stat.value} />
          </div>
          
          <div className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">
            {stat.label}
          </div>

          {/* Glow effect on hover */}
          <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />
        </motion.div>
      ))}
    </div>
  );
}
