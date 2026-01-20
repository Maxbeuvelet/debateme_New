import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Keeping Input for completeness, though no longer used directly in this component's new logic.
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Users, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

// List of inappropriate words to filter (kept as per instruction)
const inappropriateWords = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'hell', 'crap', 'dick', 'pussy', 'cock',
  'nigga', 'nigger', 'fag', 'faggot', 'whore', 'slut', 'bastard', 'piss', 'cunt'
];

// containsInappropriateContent is no longer used in this component's logic, but kept as per instruction
const containsInappropriateContent = (name) => {
  const lowerName = name.toLowerCase();
  return inappropriateWords.some(word => lowerName.includes(word));
};

export default function StanceSelector({ debate, participantCounts, userName, onTakeStance, isSubmitting }) {
  const [selectedPosition, setSelectedPosition] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPosition) {
      onTakeStance(selectedPosition);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-white border-slate-200 shadow-xl">
        <CardHeader className="p-6 sm:p-8 border-b border-slate-100">
          <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">
            Choose Your Position
          </CardTitle>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Select which side you support to be matched with an opponent
          </p>
          {userName && (
            <div className="mt-4 bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-sm text-slate-600">
                Debating as: <span className="font-semibold text-slate-900">{userName}</span>
              </p>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Position Selection */}
            <div className="space-y-4">
              <Label className="text-base sm:text-lg font-semibold text-slate-900">Your Position</Label>
              <RadioGroup
                value={selectedPosition}
                onValueChange={setSelectedPosition}
                className="grid grid-cols-1 gap-4"
              >
                {/* Position A */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <label htmlFor="position_a" className={`block cursor-pointer rounded-xl border-2 p-4 sm:p-6 transition-all duration-200 ${
                    selectedPosition === "position_a" 
                      ? "border-green-500 bg-green-50" 
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <RadioGroupItem 
                        value="position_a" 
                        id="position_a" 
                        className="border-green-500 text-green-500 mt-1" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-900 break-words">
                            {debate.position_a}
                          </h3>
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-green-600">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{participantCounts.position_a || 0} supporters</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">
                          Support the "{debate.position_a}" position in this debate
                        </p>
                      </div>
                    </div>
                  </label>
                </motion.div>

                {/* Position B */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <label htmlFor="position_b" className={`block cursor-pointer rounded-xl border-2 p-4 sm:p-6 transition-all duration-200 ${
                    selectedPosition === "position_b" 
                      ? "border-red-500 bg-red-50" 
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <RadioGroupItem 
                        value="position_b" 
                        id="position_b" 
                        className="border-red-500 text-red-500 mt-1" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-900 break-words">
                            {debate.position_b}
                          </h3>
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-red-600">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{participantCounts.position_b || 0} supporters</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">
                          Support the "{debate.position_b}" position in this debate
                        </p>
                      </div>
                    </div>
                  </label>
                </motion.div>
              </RadioGroup>
            </div>

            {/* Name Input section removed as userName is now passed as a prop */}

            {/* Submit Button */}
            <div className="pt-4 sm:pt-6 border-t border-slate-100">
              <Button
                type="submit"
                // The button is disabled if submitting or no position is selected.
                // userName validation and presence check are removed as userName is from props.
                disabled={isSubmitting || !selectedPosition}
                className="w-full h-11 sm:h-12 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Taking Stance...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Take My Stance</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}