import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categoryInfo = {
  politics: {
    name: "Politics",
    description: "Constitutional rights, government policies, and civic governance",
    icon: "🏛️",
    color: "from-red-500 to-red-600"
  },
  social_issues: {
    name: "Social Issues", 
    description: "Equality, justice, and community values",
    icon: "🤝",
    color: "from-purple-500 to-purple-600"
  },
  technology: {
    name: "Technology",
    description: "AI, privacy, and the digital future",
    icon: "💻",
    color: "from-blue-500 to-blue-600"
  },
  environment: {
    name: "Environment",
    description: "Climate change and sustainability",
    icon: "🌍",
    color: "from-green-500 to-green-600"
  },
  economics: {
    name: "Economics",
    description: "Markets, taxation, and economic policy",
    icon: "💰",
    color: "from-yellow-500 to-yellow-600"
  },
  healthcare: {
    name: "Healthcare",
    description: "Medical ethics and healthcare access",
    icon: "🏥",
    color: "from-pink-500 to-pink-600"
  },
  education: {
    name: "Education",
    description: "Learning methods and educational policy",
    icon: "📚",
    color: "from-indigo-500 to-indigo-600"
  }
};

export default function CategoryGrid({ debates, categoryCounts, isLoading }) {
  const categories = Object.keys(categoryInfo);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
              <div className="w-8 h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="h-6 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 bg-slate-200 rounded mb-4"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((categoryKey, index) => {
        const category = categoryInfo[categoryKey];
        const count = categoryCounts[categoryKey] || 0;
        
        return (
          <motion.div
            key={categoryKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="group bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                    {category.icon}
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    {count} topics
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors duration-200">
                  {category.name}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {category.description}
                </p>
                
                <Link to={createPageUrl(`CategoryTopics?category=${categoryKey}`)}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-slate-700 hover:text-slate-900 hover:bg-slate-100 group-hover:translate-x-1 transition-all duration-200"
                    disabled={count === 0}
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Explore Topics
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}