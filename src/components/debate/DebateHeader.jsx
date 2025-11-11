import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

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

export default function DebateHeader({ debate, argumentsCount }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge className={`${categoryColors[debate.category]} text-sm font-medium px-4 py-2`}>
              {debate.category}
            </Badge>
            <div className="flex items-center text-slate-500 gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {format(new Date(debate.created_date), "MMMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {argumentsCount} argument{argumentsCount !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {debate.created_by}
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            {debate.title}
          </h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              {debate.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}