import React from "react";
import { useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, PlusCircle, TrendingUp, Trophy, User } from "lucide-react";
import { motion } from "framer-motion";
import { useTabNavigation } from "./TabNavigationProvider";

const tabs = [
  { name: "Home", path: createPageUrl("Home"), icon: Home },
  { name: "Create", path: createPageUrl("CreateDebate"), icon: PlusCircle },
  { name: "Trending", path: createPageUrl("Trending"), icon: TrendingUp },
  { name: "Ranked", path: createPageUrl("Ranked"), icon: Trophy },
  { name: "Profile", path: createPageUrl("UserStats"), icon: User },
];

export default function BottomTabs({ hasNewAchievements }) {
  const location = useLocation();
  const { navigateToTab } = useTabNavigation();

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-700"
      style={{ 
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.name}
              onClick={() => navigateToTab(tab.path)}
              className="relative flex flex-col items-center justify-center min-w-0 flex-1 py-2 bg-transparent border-0"
            >
              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`relative p-2 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-slate-700/50' 
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <Icon 
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  {tab.name === "Profile" && hasNewAchievements && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  )}
                </motion.div>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
              <span 
                className={`text-[10px] mt-1 font-medium truncate max-w-full ${
                  isActive ? 'text-cyan-400' : 'text-slate-400'
                }`}
              >
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}