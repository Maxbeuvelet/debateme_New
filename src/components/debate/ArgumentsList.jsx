import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import ArgumentCard from "./ArgumentCard";

export default function ArgumentsList({ debateArguments, isLoading }) {
  const forArguments = debateArguments.filter(arg => arg.position === "for");
  const againstArguments = debateArguments.filter(arg => arg.position === "against");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                <Skeleton className="h-4 w-1/3 mb-3" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                <Skeleton className="h-4 w-1/3 mb-3" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* For Arguments */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 bg-green-500 rounded-full" />
            <h2 className="text-xl font-bold text-slate-900">
              Arguments For ({forArguments.length})
            </h2>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
              {forArguments.map((argument, index) => (
                <motion.div
                  key={argument.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ArgumentCard argument={argument} position="for" />
                </motion.div>
              ))}
            </AnimatePresence>
            {forArguments.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p>No arguments for this position yet.</p>
                <p className="text-sm mt-1">Be the first to share your perspective!</p>
              </div>
            )}
          </div>
        </div>

        {/* Against Arguments */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 bg-red-500 rounded-full" />
            <h2 className="text-xl font-bold text-slate-900">
              Arguments Against ({againstArguments.length})
            </h2>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
              {againstArguments.map((argument, index) => (
                <motion.div
                  key={argument.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ArgumentCard argument={argument} position="against" />
                </motion.div>
              ))}
            </AnimatePresence>
            {againstArguments.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p>No arguments against this position yet.</p>
                <p className="text-sm mt-1">Share a different perspective!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}