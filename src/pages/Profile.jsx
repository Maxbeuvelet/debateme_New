import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Trophy, Clock, Gavel, LogOut, Crown, Flame, Eye, Gem, Star, Zap, Shield, Hexagon } from "lucide-react";
import { motion } from "framer-motion";

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

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Load recent debate sessions
      const allSessions = await base44.entities.DebateSession.filter({}, '-created_date', 10);
      const userStances = await base44.entities.UserStance.filter({ user_id: currentUser.id });
      const userStanceIds = userStances.map(s => s.id);
      
      const userSessions = allSessions.filter(s => 
        userStanceIds.includes(s.participant_a_id) || userStanceIds.includes(s.participant_b_id)
      );
      
      setRecentSessions(userSessions.slice(0, 5));
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await User.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Please log in to view your profile</p>
          <Button onClick={() => base44.auth.redirectToLogin(window.location.href)}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  const currentLevel = user.level || 1;
  const currentXp = user.xp || 0;
  const xpForNextLevel = currentLevel * 100;
  const xpProgress = Math.min(100, (currentXp / xpForNextLevel) * 100);
  
  const RankIcon = getRankIcon(currentLevel);
  const rankCustomImage = getRankCustomImage(currentLevel);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-transparent flex items-center justify-center shadow-lg overflow-hidden">
                    {rankCustomImage ? (
                      <img 
                        src={rankCustomImage} 
                        alt="Rank"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <RankIcon className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">@{user.username || user.email}</h1>
                    <p className="text-slate-400">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-blue-600">Level {currentLevel}</Badge>
                      <span className="text-sm text-slate-400">{currentXp} XP</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Progress to Level {currentLevel + 1}</span>
                  <span className="text-slate-400">{currentXp} / {xpForNextLevel} XP</span>
                </div>
                <Progress value={xpProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-400 text-sm font-medium flex items-center gap-2">
                  <Gavel className="w-4 h-4" />
                  Debates Joined
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{user.debates_joined || 0}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-400 text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Total Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {Math.floor((user.total_debate_time || 0) / 60)} min
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-400 text-sm font-medium flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {(user.achievements || []).length}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Debates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Debates</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSessions.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No debates yet. Join your first debate!</p>
              ) : (
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50"
                    >
                      <div className="flex items-center gap-3">
                        <Gavel className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Debate Session</p>
                          <p className="text-sm text-slate-400">
                            {new Date(session.created_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={session.status === 'active' ? 'bg-green-600' : 'bg-slate-600'}>
                        {session.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}