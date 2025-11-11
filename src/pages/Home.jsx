
import React, { useState, useEffect } from "react";
import { Debate, UserStance, User, DebateSession } from "@/entities/all";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Zap, Calendar, Clock, Sparkles, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import HeroArena from "../components/home/HeroArena";
import LiveStats from "../components/home/LiveStats";
import TrendingCarousel from "../components/home/TrendingCarousel";
import CategoryArena from "../components/home/CategoryArena";
import CommunitySpotlight from "../components/home/CommunitySpotlight";
import LaunchCountdown from "../components/home/LaunchCountdown";

export default function Home() {
  const [debates, setDebates] = useState([]);
  const [userStances, setUserStances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAchievementDialog, setShowAchievementDialog] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [debateOfTheWeek, setDebateOfTheWeek] = useState(null);

  // Launch date: Saturday, October 25th, 2025 at 7:00 PM
  const LAUNCH_DATE = new Date('2025-10-25T19:00:00'); // Updated launch date
  const isLaunched = new Date() >= LAUNCH_DATE;

  useEffect(() => {
    if (isLaunched) {
      loadData();
      checkForNewAchievements();
    } else {
      setIsLoading(false);
    }
  }, [isLaunched]);

  const checkForNewAchievements = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      if (user && user.new_achievements && user.new_achievements.length > 0) {
        const achievementsList = [
          { id: "first_exchange", name: "First Exchange", icon: "🎯", xp_reward: 25 },
          { id: "active_participant", name: "Active Participant", icon: "💬", xp_reward: 100 },
          { id: "committed_contributor", name: "Committed Contributor", icon: "🔥", xp_reward: 300 },
          { id: "seasoned_debater", name: "Seasoned Debater", icon: "👑", xp_reward: 1000 }
        ];
        
        const earnedAchievements = achievementsList.filter(a => 
          user.new_achievements.includes(a.id)
        );
        
        if (earnedAchievements.length > 0) {
          setNewAchievements(earnedAchievements);
          setShowAchievementDialog(true);
        }
      }
    } catch (error) {
      console.error("Error checking achievements:", error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [debatesData, allStances, allSessions] = await Promise.all([
        Debate.filter({ status: "active" }, "-created_date"),
        UserStance.list("-created_date"),
        DebateSession.list()
      ]);
      
      setDebates(debatesData);
      
      // Find debate of the week - looking for the Sliwa/Mamdani debate
      const dotw = debatesData.find(d => 
        d.title.toLowerCase().includes("sliwa") && d.title.toLowerCase().includes("mamdani")
      );
      setDebateOfTheWeek(dotw);
      
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const sessionsToEnd = [];
      
      for (const session of allSessions) {
        if (session.status === "active") {
          const sessionAge = Date.now() - new Date(session.created_date).getTime();
          const twoHoursInMs = 2 * 60 * 60 * 1000;
          
          if (sessionAge > twoHoursInMs) {
            sessionsToEnd.push(session.id);
          }
        }
      }
      
      if (sessionsToEnd.length > 0) {
        await Promise.all(
          sessionsToEnd.map(id => 
            DebateSession.update(id, { status: "ended" }).catch(() => {})
          )
        );
      }

      const freshSessionsForStances = await DebateSession.list();

      const stancesToDelete = [];
      for (const stance of allStances) {
        let shouldDelete = false;
        
        if (stance.status === "completed") {
          shouldDelete = true;
        }
        else if (stance.status === "waiting" && new Date(stance.updated_date) < oneHourAgo) {
          shouldDelete = true;
        }
        else if (stance.status === "matched" && stance.session_id) {
          const session = freshSessionsForStances.find(s => s.id === stance.session_id);
          if (!session || session.status === "ended" || sessionsToEnd.includes(stance.session_id)) {
            shouldDelete = true;
          }
        }
        
        if (shouldDelete) {
          stancesToDelete.push(stance.id);
        }
      }
      
      if (stancesToDelete.length > 0) {
        await Promise.all(
          stancesToDelete.map(id => 
            UserStance.delete(id).catch(() => {})
          )
        );
      }
      
      const [freshStances] = await Promise.all([
        UserStance.list("-created_date")
      ]);
      
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const recentStances = freshStances.filter(stance => 
        stance.status === "waiting" &&
        new Date(stance.created_date) > tenMinutesAgo
      );
      
      setUserStances(recentStances);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load debates. Please try again.");
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

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <LaunchCountdown launchDate={LAUNCH_DATE} />
            </motion.div>

            {/* Launch Date Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="inline-block bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8 shadow-[0_0_50px_rgba(168,85,247,0.3)]"
            >
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-slate-400">Launch Date</div>
                    <div className="text-xl font-bold text-white">Saturday, October 25th</div>
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
              transition={{ delay: 1.0 }}
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

  // After launch, show the regular home page
  const categoryCounts = debates.reduce((acc, debate) => {
    acc[debate.category] = (acc[debate.category] || 0) + 1;
    return acc;
  }, {});

  const activeSessions = userStances.filter(s => s.status === "matched").length / 2;
  const activeDebates = Math.floor(activeSessions);
  const totalArguments = userStances.length;
  const uniqueDebaters = new Set(userStances.map(s => s.user_name)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white overflow-x-hidden">
      <Dialog open={showAchievementDialog} onOpenChange={setShowAchievementDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-center text-2xl">
              🎉 Achievement{newAchievements.length > 1 ? 's' : ''} Unlocked!
            </DialogTitle>
            <DialogDescription className="text-center">
              You've earned {newAchievements.length > 1 ? 'new achievements' : 'a new achievement'}!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {newAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl border-2 border-yellow-500/50">
                <div className="text-4xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">{achievement.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">+{achievement.xp_reward} XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAchievementDialog(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowAchievementDialog(false);
                window.location.href = "/achievements";
              }}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white"
            >
              View All
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gray-300/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gray-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gray-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <HeroArena />
        
        {/* Debate of the Week Banner - Moved below HeroArena */}
        {debateOfTheWeek && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4 sm:pt-6"
          >
            <Link to={createPageUrl(`TakeStance?id=${debateOfTheWeek.id}`)}>
              <div className="group relative bg-gradient-to-r from-gray-300 via-gray-200 to-white p-[2px] rounded-xl sm:rounded-2xl hover:shadow-[0_0_50px_rgba(0,0,0,0.2)] transition-all duration-300 cursor-pointer">
                <div className="relative bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 overflow-hidden">
                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100/10 via-gray-200/10 to-gray-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {/* Trophy Icon */}
                    <motion.div
                      animate={{ 
                        rotate: [0, -5, 5, -5, 5, 0],
                        scale: [1, 1.1, 1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                      className="flex-shrink-0"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-lg">
                        <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-black to-blue-600 bg-clip-text text-transparent">
                          🏆 Debate of the Week
                        </span>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-200/50 rounded-full">
                          <Sparkles className="w-3 h-3 text-gray-600" />
                          <span className="text-xs text-gray-700 font-semibold">Featured</span>
                        </div>
                      </div>
                      
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-black to-blue-600 bg-clip-text text-transparent mb-1 group-hover:from-blue-600 group-hover:to-black transition-colors">
                        {debateOfTheWeek.title}
                      </h2>
                      
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-1 leading-relaxed">
                        {debateOfTheWeek.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          <span className="font-medium">Live Now</span>
                        </div>
                        <div className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600 font-medium">
                          Politics
                        </div>
                      </div>
                    </div>

                    {/* CTA Arrow */}
                    <div className="flex-shrink-0 self-center">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200/50 flex items-center justify-center group-hover:bg-gray-300/50 transition-colors">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gray-200/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-300/5 rounded-full blur-3xl" />
                </div>
              </div>
            </Link>
          </motion.div>
        )}
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-8 sm:space-y-12 lg:space-y-16">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center shadow-lg"
            >
              <p className="text-red-600 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 font-semibold">{error}</p>
              <Button 
                onClick={loadData}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm sm:text-base"
              >
                {isLoading ? "Loading..." : "Try Again"}
              </Button>
            </motion.div>
          )}

          <LiveStats 
            activeTopics={debates.length}
            activeDebates={Math.floor(activeSessions)}
            totalArguments={totalArguments}
            uniqueDebaters={uniqueDebaters}
            isLoading={isLoading}
          />

          <TrendingCarousel 
            debates={debates.slice(0, 8)}
            userStances={userStances}
            isLoading={isLoading}
          />

          <CategoryArena 
            debates={debates}
            categoryCounts={categoryCounts}
            isLoading={isLoading}
          />

          <CommunitySpotlight 
            userStances={userStances}
            isLoading={isLoading}
          />
        </div>

        <footer className="relative z-10 mt-12 sm:mt-16 lg:mt-20 border-t border-gray-200 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="text-center text-gray-500 text-xs sm:text-sm">
              <p>2025 DebateMe • Live Video 1 on 1 Debates</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
