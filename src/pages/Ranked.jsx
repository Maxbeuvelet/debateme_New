import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Sparkles } from "lucide-react";

const ranks = [
  {
    name: "ROOKIE",
    level: 1,
    xpRequired: 0,
    color: "orange",
    borderColor: "border-orange-600",
    textColor: "text-orange-400",
    icon: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/8d99511b8_standartrankbronze.png"
  },
  {
    name: "APPRENTICE",
    level: 10,
    xpRequired: 1000,
    color: "slate",
    borderColor: "border-slate-500",
    textColor: "text-slate-300",
    icon: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/ed5a4b8bc_standartranksilver1.png"
  },
  {
    name: "TACTICIAN",
    level: 20,
    xpRequired: 3000,
    color: "yellow",
    borderColor: "border-yellow-600",
    textColor: "text-yellow-400",
    icon: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/21cc5a6d2_standartrankgold1.png"
  },
  {
    name: "ORATOR",
    level: 30,
    xpRequired: 6000,
    color: "orange",
    borderColor: "border-orange-600",
    textColor: "text-orange-400",
    icon: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/eb077c24e_rankbronze1.png"
  },
  {
    name: "PHILOSOPHER",
    level: 40,
    xpRequired: 10000,
    color: "cyan",
    borderColor: "border-cyan-600",
    textColor: "text-cyan-400",
    icon: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/cdc86a441_ranksilverblue.png"
  },
  {
    name: "VISIONARY",
    level: 50,
    xpRequired: 15000,
    color: "purple",
    borderColor: "border-purple-600",
    textColor: "text-purple-400",
    icon: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/a139614f3_ranksilverpurple.png"
  },
  {
    name: "LUMINARY",
    level: 60,
    xpRequired: 21000,
    color: "yellow",
    borderColor: "border-yellow-600",
    textColor: "text-yellow-400",
    icon: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/83e5f6f36_rankgold.png"
  },
  {
    name: "PARAGON",
    level: 70,
    xpRequired: 28000,
    color: "cyan",
    borderColor: "border-cyan-600",
    textColor: "text-cyan-400",
    icon: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/e707f104e_ranksilver.png",
    isMaxRank: true
  }
];

export default function Ranked() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const me = await User.me();
      setCurrentUser(me);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentRank = (level) => {
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (level >= ranks[i].level) {
        return ranks[i];
      }
    }
    return ranks[0];
  };

  const userRank = currentUser ? getCurrentRank(currentUser.level || 1) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-slate-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Rank <span className="text-cyan-400">System</span>
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Progress through the ranks as you debate and earn XP</p>
        </div>

        {/* Rank Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {ranks.map((rank) => {
            const isCurrent = userRank && userRank.name === rank.name;
            
            return (
              <Card 
                key={rank.name}
                className={`bg-slate-800/50 ${rank.borderColor} border-2 ${
                  isCurrent ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge className={`${rank.textColor} bg-transparent text-xs font-bold mb-2 px-0`}>
                        {rank.name}
                      </Badge>
                      <h3 className="text-2xl font-bold text-white">Level {rank.level}+</h3>
                    </div>
                    {isCurrent && (
                      <Badge className="bg-white text-slate-900 text-xs font-semibold">
                        Current
                      </Badge>
                    )}
                  </div>

                  <div className="w-16 h-16 mx-auto my-4">
                    <img 
                      src={rank.icon} 
                      alt={rank.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-700">
                    <span className="text-slate-400">XP Required:</span>
                    <span className="font-bold text-white">{rank.xpRequired.toLocaleString()} XP</span>
                  </div>

                  {rank.isMaxRank && (
                    <div className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-orange-400">
                      <Sparkles className="w-3 h-3" />
                      Maximum Rank
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How to Earn XP Section */}
        <Card className="bg-slate-800/50 border-slate-700 max-w-md mx-auto">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 text-center">How to Earn XP</h3>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <div className="flex-1">
                <span className="text-slate-300">Join a debate: </span>
                <span className="text-green-400 font-bold">+50 XP</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm text-center mt-4">
              More ways to earn XP coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}