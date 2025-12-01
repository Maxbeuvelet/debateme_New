import React, { useState, useEffect } from "react";
import { Debate, UserStance } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

import TopicCard from "../components/topics/TopicCard";

const categoryLabels = {
  politics: "Politics",
  technology: "Technology",
  environment: "Environment",
  economics: "Economics"
};

const categoryDescriptions = {
  politics: "Hot-button political issues that divide public opinion",
  technology: "The impact of technology on society and our future",
  environment: "Climate change and environmental protection debates",
  economics: "Economic policies and their effects on society"
};

export default function CategoryTopics() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  
  const [debates, setDebates] = useState([]);
  const [userStances, setUserStances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (category) {
      const loadCategoryDebates = async () => {
        setIsLoading(true);
        const [debatesData, stancesData] = await Promise.all([
          Debate.filter({ category: category, status: "active" }, "-created_date"),
          UserStance.list("-created_date")
        ]);
        setDebates(debatesData);
        
        // Filter to only include stances from the last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentStances = stancesData.filter(stance => 
          new Date(stance.created_date) > oneHourAgo
        );
        
        setUserStances(recentStances);
        setIsLoading(false);
      };
      
      loadCategoryDebates();
    }
  }, [category]);

  if (!category || !categoryLabels[category]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Category not found</h1>
          <Button onClick={() => navigate(createPageUrl("Home"))}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Home"))}
              className="rounded-full border-slate-300 hover:bg-slate-100 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 sm:mb-2 truncate">
                {categoryLabels[category]}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
                {categoryDescriptions[category]}
              </p>
            </div>
          </div>

          <div className="mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-slate-200">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 flex-shrink-0" />
            <span className="text-slate-700 text-sm sm:text-base">
              <strong>{debates.length}</strong> topics available • 
              <strong className="ml-2">{userStances.filter(s => debates.some(d => d.id === s.debate_id)).length}</strong> participants waiting
            </span>
          </div>

          <div className="grid gap-4 sm:gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse">
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
              ))
            ) : (
              debates.map((debate, index) => (
                <motion.div
                  key={debate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TopicCard 
                    debate={debate}
                    participantCounts={userStances.filter(s => s.debate_id === debate.id).reduce((acc, stance) => {
                      acc[stance.position] = (acc[stance.position] || 0) + 1;
                      return acc;
                    }, {})}
                  />
                </motion.div>
              ))
            )}
          </div>

          {!isLoading && debates.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🤔</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No topics yet</h3>
                <p className="text-slate-600 mb-6">
                  We're working on adding more debate topics to this category.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}