import React, { useState, useEffect } from "react";
import { Debate, UserStance } from "@/entities/all";
import { motion } from "framer-motion";
import { TrendingUp, Users, Clock, Sparkles, Flame } from "lucide-react";
import LaunchCountdown from "../components/home/LaunchCountdown";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Trending() {
  const [debates, setDebates] = useState([]);
  const [userStances, setUserStances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Launch date: Thursday, November 28th, 2025
  const LAUNCH_DATE = new Date('2025-11-28T00:00:00');
  const isLaunched = new Date() >= LAUNCH_DATE;

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
      const [debatesData, stancesData] = await Promise.all([
        Debate.filter({ status: "active" }, "-created_date"),
        UserStance.list("-created_date")
      ]);
      setDebates(debatesData);
      
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentStances = stancesData.filter(stance => 
        new Date(stance.created_date) > oneHourAgo
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
                Launch Day: November 28th
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 mb-6 leading-relaxed">
                Get ready to discover the hottest debates and<br className="hidden sm:block" />
                <span className="text-purple-400 font-semibold"> join the conversations that matter</span>
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

            {/* Preview of Trending Debates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8 max-w-3xl mx-auto"
            >
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.2)] relative overflow-hidden">
                {/* Overlay to indicate disabled */}
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Flame className="w-16 h-16 text-orange-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-xl font-bold text-white">Available November 28th</p>
                  </div>
                </div>

                {/* Preview Cards (disabled look) */}
                <div className="space-y-4 opacity-50">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <TrendingUp className="w-8 h-8 text-orange-400" />
                      Trending Debates
                    </h3>
                  </div>

                  {/* Mock debate cards */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-800/80 border border-slate-600 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center font-bold text-white">
                          #{i}
                        </div>
                        <div className="flex-1">
                          <div className="h-5 bg-slate-700 rounded w-2/3 mb-2"></div>
                          <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                          <div className="flex gap-3 text-xs text-slate-400">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>12 participants</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Active</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-600" />
                      </div>
                    </div>
                  ))}
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
                Join our community and be ready to explore trending debates on launch day!
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

  // Calculate trending score based on recent activity
  const getTrendingDebates = () => {
    return debates
      .map(debate => {
        const participants = userStances.filter(s => s.debate_id === debate.id);
        const waiting = participants.filter(p => p.status === "waiting").length;
        const matched = participants.filter(p => p.status === "matched").length;
        
        // Trending score: waiting participants are worth more (active interest)
        const trendingScore = (waiting * 2) + matched;
        
        return {
          ...debate,
          participants: participants.length,
          waiting,
          matched,
          trendingScore
        };
      })
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 20); // Top 20 trending debates
  };

  const trendingDebates = getTrendingDebates();

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
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent pb-2 leading-tight flex items-center gap-2">
                <span className="inline-block w-10 h-10 sm:w-12 sm:h-12">
                  <dotlottie-wc 
                    src="https://lottie.host/f7d4fc6c-db73-4ef5-aa6b-ec8eead0056f/miZ4thZDaW.lottie" 
                    style={{ width: '100%', height: '100%' }} 
                    autoplay 
                    loop
                  />
                </span>
                Trending Debates
              </h1>
            </div>
            <p className="text-xl text-slate-300 ml-15">
              The hottest topics with the most active participants right now
            </p>
          </div>

          {/* Error Message Display */}
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

          {/* Trending Debates List */}
          {isLoading ? (
            <div className="space-y-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-slate-800/50 rounded-2xl p-6 animate-pulse h-32 border border-slate-600" />
              ))}
            </div>
          ) : trendingDebates.length === 0 && !error ? (
            <Card className="bg-slate-800/60 backdrop-blur-md border-slate-600">
              <CardContent className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Trending Debates Yet</h3>
                <p className="text-slate-300">
                  Be the first to start a debate and make it trend!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {trendingDebates.map((debate, index) => (
                <motion.div
                  key={debate.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link to={createPageUrl(`TakeStance?id=${debate.id}`)}>
                    <Card 
                      className="group backdrop-blur-md border-slate-600 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 bg-slate-800/80"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Ranking Badge */}
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl flex-shrink-0 ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900' :
                            index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            #{index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold mb-2 line-clamp-1 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-white transition-colors">
                              {debate.title}
                            </h3>
                            <p className="text-sm mb-4 line-clamp-2 text-slate-300">
                              {debate.description}
                            </p>

                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span className="font-medium text-slate-300">
                                  {debate.participants} joined
                                </span>
                              </div>

                              {debate.waiting > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  <span className="font-medium text-slate-300">
                                    {debate.waiting} waiting
                                  </span>
                                </div>
                              )}

                              <Badge 
                                variant="outline" 
                                className="border-slate-500 text-slate-300"
                              >
                                {debate.category.replace('_', ' ')}
                              </Badge>

                              {debate.trendingScore > 5 && (
                                <Badge 
                                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 font-bold flex items-center gap-1"
                                >
                                  <span className="inline-block w-4 h-4">
                                    <dotlottie-wc 
                                      src="https://lottie.host/f7d4fc6c-db73-4ef5-aa6b-ec8eead0056f/miZ4thZDaW.lottie" 
                                      style={{ width: '100%', height: '100%' }} 
                                      autoplay 
                                      loop
                                    />
                                  </span>
                                  HOT
                                </Badge>
                              )}
                            </div>
                          </div>

                          
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}