import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Trophy, Clock, Gavel, LogOut, Crown, Flame, Eye, Gem, Star, Zap, Shield, Hexagon, Mail } from "lucide-react";
import { motion } from "framer-motion";
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

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Load match history
      const userStances = await base44.entities.UserStance.filter({ user_id: currentUser.id }, '-created_date', 20);
      const sessionIds = userStances.filter(s => s.session_id).map(s => s.session_id);
      
      const matchHistoryData = [];
      for (const sessionId of sessionIds.slice(0, 10)) {
        try {
          const session = await base44.entities.DebateSession.get(sessionId);
          const debate = await base44.entities.Debate.get(session.debate_id);
          const myStance = userStances.find(s => s.session_id === sessionId);
          
          const opponentStanceId = session.participant_a_id === myStance.id 
            ? session.participant_b_id 
            : session.participant_a_id;
          const opponentStance = await base44.entities.UserStance.get(opponentStanceId);
          
          matchHistoryData.push({
            session,
            debate,
            myStance,
            opponentStance
          });
        } catch (err) {
          console.error("Error loading match:", err);
        }
      }
      
      setMatchHistory(matchHistoryData);
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
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <Button
            onClick={handleLogout}
            size="sm"
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-transparent flex items-center justify-center shadow-lg overflow-hidden mb-4">
                    {rankCustomImage ? (
                      <img 
                        src={rankCustomImage} 
                        alt="Rank"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <RankIcon className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white">@{user.username || user.email?.split('@')[0]}</h2>
                  <p className="text-sm text-slate-400 mb-4">#{user.id?.slice(0, 8)}</p>
                  
                  <div className="w-full space-y-3 text-left mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="text-sm text-white break-all">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Stats & History */}
          <div className="lg:col-span-9 space-y-6">
            {/* Stats Overview */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-base">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Metric</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-sm text-slate-300">Total Debates</td>
                        <td className="py-3 px-4 text-sm font-medium text-white">{user.debates_joined || 0}</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-sm text-slate-300">Total Time in Debates</td>
                        <td className="py-3 px-4 text-sm font-medium text-white">{Math.floor((user.total_debate_time || 0) / 60)} minutes</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-sm text-slate-300">Achievements Earned</td>
                        <td className="py-3 px-4 text-sm font-medium text-white">{(user.achievements || []).length}</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-sm text-slate-300">Current Level</td>
                        <td className="py-3 px-4 text-sm font-medium text-white">Level {currentLevel}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-sm text-slate-300">Experience Points</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-white">{currentXp} / {xpForNextLevel} XP</span>
                            <div className="flex-1 max-w-[200px]">
                              <Progress value={xpProgress} className="h-2" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Match History */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-base">Match History</CardTitle>
              </CardHeader>
              <CardContent>
                {matchHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Gavel className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No matches yet. Join your first debate!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Debate</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">My Position</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Opponent</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Date</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matchHistory.map((match, idx) => (
                          <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Gavel className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                <span className="text-sm text-white line-clamp-1">{match.debate.title}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                                {match.myStance.position === "position_a" ? match.debate.position_a : match.debate.position_b}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-300">
                              @{match.opponentStance.user_name}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-400">
                              {new Date(match.session.created_date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={match.session.status === 'active' ? 'bg-green-600' : 'bg-slate-600'}>
                                {match.session.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}