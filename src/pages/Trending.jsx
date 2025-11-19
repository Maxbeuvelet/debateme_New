import React, { useState, useEffect } from "react";
import { Debate, UserStance } from "@/entities/all";
import { motion } from "framer-motion";
import { TrendingUp, Users, Clock, ArrowRight, Sparkles, Calendar } from "lucide-react";
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
                Debates Launch This Saturday!
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 mb-6 leading-relaxed">
                Get ready to challenge perspectives and build understanding through<br className="hidden sm:block" />
                <span className="text-purple-400 font-semibold"> real-time voice debates</span> that matter.
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
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent pb-2 leading-tight">
                🔥 Trending Debates
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
                                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 font-bold"
                                >
                                  🔥 HOT
                                </Badge>
                              )}
                            </div>
                          </div>

                          <ArrowRight className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
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