import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Users, MessageCircle, Crown, ExternalLink } from "lucide-react";

const getRankCustomImage = (level) => {
  if (level >= 70) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/e707f104e_ranksilver.png";
  if (level >= 60 && level < 70) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/83e5f6f36_rankgold.png";
  if (level >= 50 && level < 60) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/a139614f3_ranksilverpurple.png";
  if (level >= 40 && level < 50) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/cdc86a441_ranksilverblue.png";
  if (level >= 30 && level < 40) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/eb077c24e_rankbronze1.png";
  if (level >= 20 && level < 30) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/21cc5a6d2_standartrankgold1.png";
  if (level >= 10 && level < 20) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/ed5a4b8bc_standartranksilver1.png";
  return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/8d99511b8_standartrankbronze.png";
};

export default function Community() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopDebaters();
  }, []);

  const loadTopDebaters = async () => {
    try {
      const allUsers = await base44.entities.User.list("-level", 5);
      const sortedUsers = allUsers.sort((a, b) => {
        const levelDiff = (b.level || 0) - (a.level || 0);
        if (levelDiff !== 0) return levelDiff;
        return (b.xp || 0) - (a.xp || 0);
      });
      setTopUsers(sortedUsers.slice(0, 5));
    } catch (error) {
      console.error("Error loading top debaters:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">Community</h1>
          </div>
          <p className="text-slate-300">Connect with fellow debaters and join our Discord</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discord Section - Takes 1 column */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-700 sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageCircle className="w-6 h-6" />
                  Join Our Discord
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                  <p className="text-slate-200 text-sm mb-4">
                    Connect with debaters, get updates, share feedback, and participate in community events!
                  </p>
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                    onClick={() => window.open('https://discord.gg/ZKFGtTg4', '_blank')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Join Discord Server
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <span className="text-lg">💬</span>
                    <span>Chat with other debaters</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <span className="text-lg">🎮</span>
                    <span>Participate in events</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <span className="text-lg">📢</span>
                    <span>Get latest updates</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <span className="text-lg">🏆</span>
                    <span>Compete in tournaments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Debaters Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Top Debaters</h2>
            </div>

            <div className="space-y-3">
              {topUsers.map((user, index) => {
                const rankImage = getRankCustomImage(user.level || 1);
                const rankColor = index === 0 ? "bg-yellow-600" : index === 1 ? "bg-slate-400" : index === 2 ? "bg-orange-600" : "bg-slate-700";

                return (
                  <Card key={user.id} className="bg-slate-800 border-slate-700 hover:border-slate-500 transition-all">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <Badge className={`${rankColor} text-white font-bold text-sm px-3 py-1 flex-shrink-0`}>
                          #{index + 1}
                        </Badge>

                        <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {rankImage && (
                            <img 
                              src={rankImage} 
                              alt="Rank"
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-100 text-lg truncate">
                            @{user.username || user.email}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {user.debates_completed || user.debates_joined || 0} debates completed
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="font-bold text-yellow-400 text-lg">Level {user.level || 1}</p>
                        <p className="text-slate-400 text-sm">{user.xp || 0} XP</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {topUsers.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-400 text-lg">No debaters to display yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}