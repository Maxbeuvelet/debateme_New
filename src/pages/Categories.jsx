import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Categories() {
  const navigate = useNavigate();
  const [debates, setDebates] = useState([]);
  const [premadeDebates, setPremadeDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", color: "bg-slate-600" },
    { id: "politics", name: "Politics", color: "bg-blue-600" },
    { id: "social_issues", name: "Social Issues", color: "bg-purple-600" },
    { id: "technology", name: "Technology", color: "bg-green-600" },
    { id: "environment", name: "Environment", color: "bg-emerald-600" },
    { id: "economics", name: "Economics", color: "bg-orange-600" },
    { id: "healthcare", name: "Healthcare", color: "bg-red-600" }
  ];

  useEffect(() => {
    loadDebates();
  }, [selectedCategory]);

  const loadDebates = async () => {
    setLoading(true);
    try {
      const filters = { status: "active" };
      if (selectedCategory !== "all") {
        filters.category = selectedCategory;
      }
      const data = await base44.entities.Debate.filter(filters);
      setDebates(data);

      // Load premade debates from Polymarket
      const premadeFilters = {};
      if (selectedCategory !== "all") {
        premadeFilters.category = selectedCategory;
      }
      const premadeData = await base44.entities.PremadeDebate.filter(premadeFilters, '-marketVolume', 15);
      setPremadeDebates(premadeData);
    } catch (error) {
      console.error("Error loading debates:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header Bar */}
      <div className="bg-slate-800 border-b border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Debate Categories</h1>
          <p className="text-slate-300 mt-2">Choose a topic and join the conversation</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === category.id
                  ? `${category.color} text-white shadow-lg scale-105`
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Premade Debates from Polymarket */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <>
            {premadeDebates.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-white">Trending Predictions</h2>
                  <Badge className="bg-purple-600">From Polymarket</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {premadeDebates.map((debate) => (
                    <Card key={debate.id} className="bg-slate-800 border-slate-700 hover:shadow-xl transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-lg text-white">{debate.title}</CardTitle>
                          <Badge className={categories.find(c => c.id === debate.category)?.color || "bg-slate-600"}>
                            {debate.category}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2 text-slate-400">
                          ${(debate.marketVolume / 1000).toFixed(0)}K volume
                        </CardDescription>
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
                            onClick={() => alert("Join debate functionality coming soon!")}
                          >
                            Join Debate
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {debates.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Community Debates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {debates.map((debate) => (
                    <Card key={debate.id} className="bg-slate-800 border-slate-700 hover:shadow-xl transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-lg text-white">{debate.title}</CardTitle>
                          <Badge className={categories.find(c => c.id === debate.category)?.color || "bg-slate-600"}>
                            {debate.category}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2 text-slate-400">{debate.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">Position A:</span>
                              <span className="font-medium text-slate-200">{debate.position_a}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">Position B:</span>
                              <span className="font-medium text-slate-200">{debate.position_b}</span>
                            </div>
                          </div>
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => navigate(createPageUrl("JoinDebate") + `?id=${debate.id}&premade=false`)}
                          >
                            Join Debate
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!loading && debates.length === 0 && premadeDebates.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No debates found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}