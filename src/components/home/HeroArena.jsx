import React from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroArena() {
  const scrollToCategories = () => {
    const section = document.getElementById('categories-arena');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-black" style={{ minHeight: '750px' }}>
      <style>{`
        @keyframes rainbowWave {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .rainbow-text-reveal {
          font-size: clamp(4rem, 15vw, 12rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          background: linear-gradient(
            90deg,
            transparent 0%,
            transparent 35%,
            #ff0000 40%,
            #ff7f00 45%,
            #ffff00 50%,
            #00ff00 55%,
            #0000ff 60%,
            #4b0082 65%,
            #9400d3 70%,
            transparent 75%,
            transparent 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rainbowWave 4s linear infinite;
          text-shadow: none;
        }
        
        .glow-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            transparent 35%,
            rgba(255, 0, 0, 0.3) 40%,
            rgba(255, 127, 0, 0.3) 45%,
            rgba(255, 255, 0, 0.3) 50%,
            rgba(0, 255, 0, 0.3) 55%,
            rgba(0, 0, 255, 0.3) 60%,
            rgba(75, 0, 130, 0.3) 65%,
            rgba(148, 0, 211, 0.3) 70%,
            transparent 75%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: rainbowWave 4s linear infinite;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      {/* Animated glow effect behind text */}
      <div className="glow-effect" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center" style={{ minHeight: '750px' }}>
        {/* DebateMe text with rainbow reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="rainbow-text-reveal select-none">
            DebateMe
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-slate-500 text-lg sm:text-xl md:text-2xl mt-4 font-medium"
          >
            Where Ideas Collide
          </motion.p>
        </motion.div>

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