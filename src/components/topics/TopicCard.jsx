import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TopicCard({ debate, participantCounts }) {
  const totalParticipants = (participantCounts.position_a || 0) + (participantCounts.position_b || 0);
  
  return (
    <Card className="group bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-slate-700 transition-colors duration-200 flex-1 pr-4">
            {debate.title}
          </h3>
          <div className="flex items-center text-sm text-slate-500 gap-1">
            <Users className="w-4 h-4" />
            <span>{totalParticipants}</span>
          </div>
        </div>
        
        <p className="text-slate-600 leading-relaxed mb-6">
          {debate.description}
        </p>
        
        <div className="space-y-4">
          {/* Position Options Preview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-sm font-medium text-green-800 mb-1">{debate.position_a}</div>
              <div className="text-xs text-green-600">
                {participantCounts.position_a || 0} supporters
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-sm font-medium text-red-800 mb-1">{debate.position_b}</div>
              <div className="text-xs text-red-600">
                {participantCounts.position_b || 0} supporters  
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Active now</span>
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                {debate.category.replace('_', ' ')}
              </Badge>
            </div>
            
            <Link to={createPageUrl(`TakeStance?id=${debate.id}`)}>
              <Button 
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white group-hover:translate-x-1 transition-all duration-200"
              >
                Join Debate
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}