import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, TrendingUp, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Trending() {
  const navigate = useNavigate();
  const [premadeDebates, setPremadeDebates] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "politics", name: "Politics", color: "bg-blue-600" },
    { id: "social_issues", name: "Social Issues", color: "bg-purple-600" },
    { id: "technology", name: "Technology", color: "bg-green-600" },
    { id: "environment", name: "Environment", color: "bg-emerald-600" },
    { id: "economics", name: "Economics", color: "bg-orange-600" },
    { id: "healthcare", name: "Healthcare", color: "bg-red-600" },
    { id: "gaming", name: "Gaming", color: "bg-pink-600" }
  ];

  useEffect(() => {
    loadTrendingDebates();
  }, []);

  const loadTrendingDebates = async () => {
    setLoading(true);
    try {
      // Load top trending debates by market volume
      const premadeData = await base44.entities.PremadeDebate.filter({}, '-marketVolume', 20);
      setPremadeDebates(premadeData);
    } catch (error) {
      console.error("Error loading trending debates:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header Bar */}
      <div className="bg-slate-800 border-b border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-3xl font-bold text-white">Trending Debates</h1>
              <p className="text-slate-300 mt-1">Hottest topics right now</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premadeDebates.map((debate, index) => (
              <Card key={debate.id} className="bg-slate-800 border-slate-700 hover:shadow-xl transition-all relative overflow-hidden">
                {/* Trending rank badge */}
                {index < 3 && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? "bg-yellow-500 text-slate-900" :
                      index === 1 ? "bg-slate-400 text-slate-900" :
                      "bg-orange-600 text-white"
                    }`}>
                      #{index + 1}
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg text-white pr-12">{debate.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={categories.find(c => c.id === debate.category)?.color || "bg-slate-600"}>
                      {debate.category}
                    </Badge>
                    <Badge variant="outline" className="text-orange-400 border-orange-400">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      ${(debate.marketVolume / 1000).toFixed(0)}K
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Position A:</span>
                        <span className="font-medium text-slate-200">{debate.positionA}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Position B:</span>
                        <span className="font-medium text-slate-200">{debate.positionB}</span>
                      </div>
                      {debate.tags && debate.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {debate.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs text-slate-400 border-slate-600">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate(createPageUrl("JoinDebate") + `?id=${debate.id}&premade=true`)}
                    >
                      Join Debate
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && premadeDebates.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No trending debates at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}