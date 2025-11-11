import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function DebateTimer({ duration = 30 }) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Handle debate end
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 300) return "text-green-600"; // More than 5 minutes
    if (timeLeft > 60) return "text-yellow-600";  // More than 1 minute
    return "text-red-600"; // Less than 1 minute
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-200"
    >
      <Clock className={`w-4 h-4 ${getTimerColor()}`} />
      <span className={`font-mono text-lg font-semibold ${getTimerColor()}`}>
        {formatTime(timeLeft)}
      </span>
    </motion.div>
  );
}