import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function WaitingForMatch({ stance, debate, participantCounts, onBack }) {
  const oppositePosition = stance.position === "position_a" ? "position_b" : "position_a";
  const oppositeCount = participantCounts[oppositePosition] || 0;
  const positionLabel = stance.position === "position_a" ? debate.position_a : debate.position_b;
  const oppositeLabel = stance.position === "position_a" ? debate.position_b : debate.position_a;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white border-slate-200 shadow-xl">
        <CardHeader className="p-8 border-b border-slate-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Stance Registered!
          </CardTitle>
          <p className="text-slate-600 mt-2">
            You're now waiting to be matched with someone who disagrees
          </p>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Your Position */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800 uppercase tracking-wide">Your Position</span>
              </div>
              <h3 className="text-lg font-bold text-green-900">{positionLabel}</h3>
              <div className="flex items-center gap-2 mt-2 text-sm text-green-700">
                <Users className="w-4 h-4" />
                <span>{participantCounts[stance.position] || 1} people support this position</span>
              </div>
            </div>

            {/* Matching Status */}
            <div className="text-center py-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
                <div className="relative flex justify-between items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-slate-500 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Looking for your debate partner...
                </h3>
                <p className="text-slate-600 text-sm">
                  We're finding someone who supports "{oppositeLabel}" to debate with you
                </p>
              </div>
            </div>

            {/* Opponent Pool */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Potential Opponents</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{oppositeLabel}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Users className="w-4 h-4" />
                <span>
                  {oppositeCount > 0 
                    ? `${oppositeCount} people available to match with`
                    : "Waiting for someone to take the opposite position"
                  }
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Status: Waiting for match
              </Badge>
            </div>

            {/* Back Button */}
            <div className="pt-6 border-t border-slate-100 text-center">
              <Button
                variant="outline"
                onClick={onBack}
                className="border-slate-300 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Change Position
              </Button>
              <p className="text-xs text-slate-500 mt-2">
                You can change your position anytime before being matched
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}