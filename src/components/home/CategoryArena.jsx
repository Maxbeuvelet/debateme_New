import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Landmark, Cpu, Leaf, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categoryConfig = {
  politics: {
    name: "Politics",
    icon: Landmark,
    gradient: "from-gray-400 via-gray-500 to-gray-600",
    outlineGradient: "from-gray-400 to-gray-600",
    hoverGlow: "group-hover:shadow-[0_0_30px_rgba(0,0,0,0.15)]",
    iconBg: "bg-gray-200",
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
    hoverGlow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
    iconBg: "bg-blue-100",
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
    gradient: "from-gray-500 via-gray-600 to-gray-700",
    outlineGradient: "from-green-400 to-green-600",
    hoverGlow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]",
    iconBg: "bg-gray-100",
    emoji: "🌍",
    description: "Climate action, sustainability, and conservation",
    iconAnimation: {
      rotate: [0, 360]
    }
  },
  economics: {
    name: "Economics",
    icon: DollarSign,
    gradient: "from-gray-600 via-gray-700 to-gray-800",
    outlineGradient: "from-yellow-400 to-yellow-600",
    hoverGlow: "group-hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]",
    iconBg: "bg-gray-200",
    emoji: "💰",
    description: "Markets, wealth distribution, and trade policy",
    iconAnimation: {
      y: [0, -10, 0, -5, 0],
      rotate: [0, 5, -5, 3, -3, 0]
    }
  }
};

export default function CategoryArena({ debates, categoryCounts, isLoading }) {
  const categories = Object.keys(categoryConfig);

  if (isLoading) {
    return (
      <div id="categories-arena">
        <div className="text-center mb-8 sm:mb-12">
          <div className="h-8 sm:h-10 w-48 sm:w-64 bg-gray-200 rounded mx-auto mb-3 sm:mb-4 animate-pulse" />
          <div className="h-4 sm:h-6 w-64 sm:w-96 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {categories.map((_, index) => (
            <div key={index} className="bg-white/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 h-[280px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="categories-arena" className="scroll-mt-4">
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black mb-2 sm:mb-3 lg:mb-4 px-3 sm:px-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
        >
          Pick a Category
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-300 px-3 sm:px-4"
        >
          Pick a category, take your stance
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {categories.map((categoryKey, index) => {
          const category = categoryConfig[categoryKey];
          const count = categoryCounts[categoryKey] || 0;

          return (
            <motion.div
              key={categoryKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Link to={createPageUrl(`CategoryTopics?category=${categoryKey}`)} className="block h-full">
                <div className={`group relative bg-gradient-to-r ${category.outlineGradient} p-[2px] rounded-xl sm:rounded-2xl ${category.hoverGlow} transition-all duration-300 h-full min-h-[280px]`}>
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 h-full overflow-hidden flex flex-col">
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
                        <img 
                          src={category.iconUrl} 
                          alt={category.name}
                          className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 object-contain"
                        />
                      ) : (
                        <span className="text-xl sm:text-2xl lg:text-3xl">{category.emoji}</span>
                      )}
                    </motion.div>

                    <h3 className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-black to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:from-blue-600 group-hover:to-black transition-all duration-300 flex-shrink-0">
                      {category.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed flex-grow">
                      {category.description}
                    </p>

                    <div className="flex items-center justify-between flex-shrink-0">
                      <Badge className={`bg-gradient-to-r ${category.gradient} text-white border-0 font-bold text-xs sm:text-sm`}>
                        {count} topics
                      </Badge>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
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
    </div>
  );
}