import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Crown, Flame, Eye } from "lucide-react";

const getRankIcon = (level) => {
  if (level >= 70) return Crown;
  if (level >= 60) return Flame;
  if (level >= 50) return Eye;
  return null;
};

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

export default function Ranked() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadRankedUsers();
  }, []);

  const loadRankedUsers = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const me = await User.me();
        setCurrentUser(me);
      }

      const allUsers = await base44.entities.User.list("-level", 100);
      const sortedUsers = allUsers.sort((a, b) => {
        const levelDiff = (b.level || 0) - (a.level || 0);
        if (levelDiff !== 0) return levelDiff;
        return (b.xp || 0) - (a.xp || 0);
      });
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error loading ranked users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (index) => {
    if (index === 0) return { label: "1st", color: "bg-yellow-600" };
    if (index === 1) return { label: "2nd", color: "bg-slate-400" };
    if (index === 2) return { label: "3rd", color: "bg-orange-600" };
    return { label: `#${index + 1}`, color: "bg-slate-700" };
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
            <Crown className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Global Leaderboard</h1>
          </div>
          <p className="text-slate-300">Top debaters ranked by level and experience</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-3">
          {users.slice(0, 50).map((user, index) => {
            const rankBadge = getRankBadge(index);
            const rankImage = getRankCustomImage(user.level || 1);
            const isCurrentUser = currentUser && user.id === currentUser.id;

            return (
              <Card 
                key={user.id} 
                className={`bg-slate-800 border-slate-700 transition-all hover:border-slate-500 ${
                  isCurrentUser ? "border-blue-500 ring-2 ring-blue-500" : ""
                }`}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Badge className={`${rankBadge.color} text-white font-bold text-sm px-4 py-2 flex-shrink-0`}>
                      {rankBadge.label}
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
                        {isCurrentUser && <span className="text-blue-400 ml-2">(You)</span>}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {user.debates_completed || user.debates_joined || 0} debates
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

        {users.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No users to display yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}