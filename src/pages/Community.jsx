
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Users, Sparkles, Trophy, Clock, Crown, Medal, Award, ExternalLink, Flame, Eye, Gem, Star, Zap, Shield, Hexagon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const getRankIcon = (level) => {
  if (level >= 70) return Crown;
  if (level >= 60) return Flame;
  if (level >= 50) return Eye;
  if (level >= 40) return Gem;
  if (level >= 30) return Star;
  if (level >= 20) return Zap;
  if (level >= 10) return Shield;
  return Hexagon;
};

const getRankCustomImage = (level) => {
  if (level >= 70) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/e707f104e_ranksilver.png";
  if (level >= 60 && level < 70) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/83e5f6f36_rankgold.png";
  if (level >= 50 && level < 60) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/a139614f3_ranksilverpurple.png";
  if (level >= 40 && level < 50) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/cdc86a441_ranksilverblue.png";
  if (level >= 30 && level < 40) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/eb077c24e_rankbronze1.png";
  if (level >= 20 && level < 30) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/21cc5a6d2_standartrankgold1.png";
  if (level >= 10 && level < 20) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/ed5a4b8bc_standartranksilver1.png";
  if (level < 10) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/8d99511b8_standartrankbronze.png";
  return null;
};

const formatDebateTime = (minutes) => {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours < 24) {
    return `${hours}h ${mins}m`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h`;
};

export default function Community() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      // Fetch current user
      const me = await base44.auth.me().catch(() => null);
      setCurrentUser(me);

      // Use backend function to fetch leaderboard (bypasses RLS)
      const response = await base44.functions.invoke('getLeaderboard');

      if (response.data.success) {
        setLeaderboard(response.data.leaderboard);
      } else {
        console.error("Failed to load leaderboard:", response.data.error);
        setLeaderboard([]);
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      setLeaderboard([]);
    }
    setIsLoading(false);
  };

  const getPositionBadge = (position) => {
    if (position === 1) {
      return (
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
          <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      );
    } else if (position === 2) {
      return (
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center shadow-lg">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" />
        </div>
      );
    } else if (position === 3) {
      return (
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-lg">
          <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
        <span className="text-gray-500 font-bold text-sm sm:text-base">#{position}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-800 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent pb-2 leading-tight">
                Community Hub
              </h1>
            </div>
            <p className="text-xl text-slate-300 ml-15 mb-6 sm:mb-8">
              Connect with others and build communities together
            </p>

            {/* Reddit Link */}
            <div className="flex justify-center">
              <a
                href="https://www.reddit.com/r/DebateSphere/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                  Join r/DebateSphere
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </div>

          {/* Leaderboard */}
          <Card className="bg-slate-800/80 backdrop-blur-md border-slate-600 overflow-hidden">
            <CardHeader className="p-4 sm:p-6 border-b border-slate-600">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                Top Debaters
              </CardTitle>
              <p className="text-slate-300 text-sm sm:text-base mt-1">
                Ranked by total debate time and activity
              </p>
            </CardHeader>
            
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {Array(10).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 animate-pulse">
                      <div className="w-12 h-12 bg-slate-600 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-600 rounded w-1/3" />
                        <div className="h-3 bg-slate-600 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2">No Debaters Yet</h3>
                  <p className="text-slate-300 text-sm sm:text-base">
                    Be the first to join and make it to the leaderboard!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-600">
                  {leaderboard.map((user, index) => {
                    const position = index + 1;
                    const RankIcon = getRankIcon(user.level || 1);
                    const rankCustomImage = getRankCustomImage(user.level || 1);
                    const isCurrentUser = currentUser && currentUser.id === user.id;

                    return (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className={`p-3 sm:p-4 hover:bg-slate-700/50 transition-colors ${
                          isCurrentUser ? 'bg-cyan-900/30 border-l-4 border-cyan-500' : ''
                        }`}
                      >
                        <Link to={createPageUrl("UserStats", { username: user.username })} className="flex items-center gap-3 sm:gap-4">
                          {position <= 3 ? (
                            <div className="flex-shrink-0">
                              {getPositionBadge(position)}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-slate-400 font-bold text-sm w-8 text-center">#{position}</span>
                            </div>
                          )}

                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-transparent flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
                            {rankCustomImage ? (
                              <img 
                                src={rankCustomImage} 
                                alt="Rank"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <RankIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent truncate">
                                @{user.username}
                              </h3>
                              {isCurrentUser && (
                                <Badge className="bg-cyan-500 text-white text-xs">You</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-slate-300 flex-wrap">
                              <span>Level {user.level || 1}</span>
                              <span>•</span>
                              <span>{user.debates_completed || 0} debates</span>
                            </div>
                          </div>

                          <div className="flex-shrink-0 text-right">
                            <div className="flex items-center gap-1 sm:gap-2 text-cyan-400 mb-1">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="font-bold text-sm sm:text-base">
                                {formatDebateTime(user.total_debate_time_minutes || 0)}
                              </span>
                            </div>
                            <div className="text-[10px] sm:text-xs text-slate-400">
                              debate time
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coming Soon Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <Card className="bg-slate-800/80 backdrop-blur-md border-slate-600">
              <CardContent className="p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-3">👥</div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">Discussion Groups</h3>
                <p className="text-slate-300 text-xs sm:text-sm">Join communities around your interests</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 backdrop-blur-md border-slate-600">
              <CardContent className="p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-3">📊</div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">Global Stats</h3>
                <p className="text-slate-300 text-xs sm:text-sm">View platform-wide debate statistics</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 backdrop-blur-md border-slate-600">
              <CardContent className="p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-3">🎯</div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">Achievements</h3>
                <p className="text-slate-300 text-xs sm:text-sm">Earn badges for your debate skills</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
