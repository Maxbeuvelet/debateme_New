import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

const categoryColors = {
  politics: "bg-red-100 text-red-800",
  technology: "bg-blue-100 text-blue-800", 
  science: "bg-green-100 text-green-800",
  society: "bg-purple-100 text-purple-800",
  culture: "bg-pink-100 text-pink-800",
  education: "bg-yellow-100 text-yellow-800",
  environment: "bg-emerald-100 text-emerald-800",
  economics: "bg-orange-100 text-orange-800"
};

export default function DebateCard({ debate, argumentsCount }) {
  return (
    <Card className="group bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden">
      <CardHeader className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge className={`${categoryColors[debate.category]} text-xs font-medium px-3 py-1`}>
            {debate.category}
          </Badge>
          <div className="flex items-center text-xs text-slate-500 gap-1">
            <Clock className="w-3 h-3" />
            {format(new Date(debate.created_date), "MMM d")}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-3 group-hover:text-slate-700 transition-colors duration-200">
          {debate.title}
        </h3>
        
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {debate.description}
        </p>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-slate-500 gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{argumentsCount} argument{argumentsCount !== 1 ? 's' : ''}</span>
          </div>
          
          <Link to={createPageUrl(`DebateDetails?id=${debate.id}`)}>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 group-hover:translate-x-1 transition-all duration-200"
            >
              Join Debate
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}