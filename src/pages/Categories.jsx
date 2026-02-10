import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function Categories() {
  const [debates, setDebates] = useState([]);
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
    } catch (error) {
      console.error("Error loading debates:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Debate Categories</h1>
          <p className="text-slate-600 mt-2">Choose a topic and join the conversation</p>
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
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Debates Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {debates.map((debate) => (
              <Card key={debate.id} className="hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg">{debate.title}</CardTitle>
                    <Badge className={categories.find(c => c.id === debate.category)?.color || "bg-slate-600"}>
                      {debate.category}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2">{debate.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Position A:</span>
                      <span className="font-medium">{debate.position_a}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Position B:</span>
                      <span className="font-medium">{debate.position_b}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && debates.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-600 text-lg">No debates found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}