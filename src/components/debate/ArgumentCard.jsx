import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Clock } from "lucide-react";
import { format } from "date-fns";

export default function ArgumentCard({ argument, position }) {
  const borderColor = position === "for" ? "border-l-green-500" : "border-l-red-500";
  const bgColor = position === "for" ? "bg-green-50/50" : "bg-red-50/50";

  return (
    <Card className={`${bgColor} border-slate-200 ${borderColor} border-l-4 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User className="w-4 h-4" />
            <span className="font-medium">{argument.author_name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            {format(new Date(argument.created_date), "MMM d, h:mm a")}
          </div>
        </div>
        
        <p className="text-slate-800 leading-relaxed">
          {argument.content}
        </p>
      </CardContent>
    </Card>
  );
}