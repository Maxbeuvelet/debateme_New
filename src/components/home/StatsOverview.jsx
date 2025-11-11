import React from "react";
import { Card } from "@/components/ui/card";
import { MessageSquare, Users, TrendingUp, Gavel } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsOverview({ totalDebates, totalArguments, activeDebates }) {
  const stats = [
    {
      icon: Gavel,
      label: "Total Debates",
      value: totalDebates,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: MessageSquare,
      label: "Arguments Shared",
      value: totalArguments,
      color: "text-green-600", 
      bgColor: "bg-green-100"
    },
    {
      icon: TrendingUp,
      label: "Active Debates",
      value: activeDebates,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Users,
      label: "Engagement Rate",
      value: totalDebates > 0 ? `${Math.round((totalArguments / totalDebates) * 10) / 10}` : "0",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}