import React from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

function RainbowRevealText({ text = "DebateMe" }) {
  return (
    <div className="relative overflow-hidden">
      {/* The text with animated gradient background clipped to text */}
      <motion.h1
        className="text-[60px] sm:text-[100px] md:text-[140px] lg:text-[180px] font-black select-none leading-none"
        style={{
          background: `linear-gradient(
            90deg,
            transparent 0%,
            #ff0000 10%,
            #ff7f00 20%,
            #ffff00 30%,
            #00ff00 40%,
            #0099ff 50%,
            #0000ff 60%,
            #4b0082 70%,
            #9400d3 80%,
            transparent 90%,
            transparent 100%
          )`,
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}
        animate={{
          backgroundPosition: ["200% 0%", "-200% 0%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {text}
      </motion.h1>
    </div>
  );
}

export default function HeroArena() {
  const scrollToCategories = () => {
    const section = document.getElementById('categories-arena');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-black" style={{ minHeight: '750px' }}>
      {/* Subtle glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-30"
          style={{
            background: "linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0099ff, #0000ff, #9400d3)",
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4" style={{ minHeight: '750px' }}>
        {/* Rainbow Reveal Text */}
        <RainbowRevealText text="DebateMe" />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-slate-500 text-lg sm:text-xl md:text-2xl mt-4 mb-8 font-medium"
        >
          Where Ideas Collide
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            onClick={scrollToCategories}
            size="lg"
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-6 text-lg font-bold rounded-xl hover:bg-white/20 hover:border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all duration-300"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start a Debate
          </Button>
        </motion.div>
      </div>
    </div>
  );
}