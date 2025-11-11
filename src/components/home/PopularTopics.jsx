import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

const categoryColors = {
  politics: "bg-red-100 text-red-800",
  social_issues: "bg-purple-100 text-purple-800",
  technology: "bg-blue-100 text-blue-800",
  environment: "bg-green-100 text-green-800",
  economics: "bg-yellow-100 text-yellow-800",
  healthcare: "bg-pink-100 text-pink-800",
  education: "bg-indigo-100 text-indigo-800"
};

export default function PopularTopics({ debates, userStances, isLoading }) {
  if (isLoading) {
    return (
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Popular Debate Topics</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <Card key={index} className="bg-white border-slate-200">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-1/3 mb-3" />
                <Skeleton className="h-6 w-full mb-3" />
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
          Popular Debate Topics
        </h3>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Jump into these trending discussions where people are actively taking sides
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {debates.map((debate, index) => {
          const debateParticipants = userStances.filter(s => s.debate_id === debate.id);
          
          return (
            <motion.div
              key={debate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`${categoryColors[debate.category]} text-xs font-medium px-3 py-1`}>
                      {debate.category.replace('_', ' ')}
                    </Badge>
                    <div className="flex items-center text-xs text-slate-500 gap-1">
                      <Users className="w-3 h-3" />
                      {debateParticipants.length}
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-bold text-slate-900 leading-tight mb-3 group-hover:text-slate-700 transition-colors duration-200 flex-1">
                    {debate.title}
                  </h4>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                    {debate.description.length > 120 
                      ? debate.description.substring(0, 120) + "..."
                      : debate.description
                    }
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-sm text-slate-500 gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{debateParticipants.filter(p => p.status === "waiting").length} waiting</span>
                    </div>
                    
                    <Link to={createPageUrl(`TakeStance?id=${debate.id}`)}>
                      <Button 
                        size="sm"
                        className="bg-slate-900 hover:bg-slate-800 text-white group-hover:translate-x-1 transition-all duration-200"
                      >
                        Take Stance
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}