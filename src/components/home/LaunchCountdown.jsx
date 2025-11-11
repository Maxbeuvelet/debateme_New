import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LaunchCountdown({ launchDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(launchDate) - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds }
  ];

  return (
    <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 flex-wrap">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="relative"
        >
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px] shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 bg-clip-text mb-2">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">
              {unit.label}
            </div>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 blur-xl opacity-50 -z-10" />
        </motion.div>
      ))}
    </div>
  );
}