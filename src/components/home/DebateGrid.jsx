import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import DebateCard from "./DebateCard";

export default function DebateGrid({ debates, debateArguments, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <Skeleton className="h-4 w-1/3 mb-3" />
            <Skeleton className="h-6 w-full mb-3" />
            <Skeleton className="h-16 w-full mb-4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (debates.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🤔</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No debates yet</h3>
          <p className="text-slate-600 mb-6">
            Be the first to start a meaningful discussion on this topic
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {debates.map((debate, index) => (
          <motion.div
            key={debate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <DebateCard 
              debate={debate}
              argumentsCount={debateArguments.filter(arg => arg.debate_id === debate.id).length}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}