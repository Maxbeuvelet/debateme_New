import React from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

function RainbowRevealText({ text = "DebateMe" }) {
  return (
    <div className="relative overflow-hidden">
      <style>{`
        @keyframes stripeMove {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        
        .rainbow-stripes-text {
          background: repeating-linear-gradient(
            75deg,
            #ff0000 0px,
            #ff0000 8px,
            #ff7f00 8px,
            #ff7f00 16px,
            #ffff00 16px,
            #ffff00 24px,
            #00ff00 24px,
            #00ff00 32px,
            #00ccff 32px,
            #00ccff 40px,
            #0066ff 40px,
            #0066ff 48px,
            #9900ff 48px,
            #9900ff 56px,
            #ff00ff 56px,
            #ff00ff 64px
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: stripeMove 3s linear infinite;
        }
      `}</style>
      
      <h1 className="rainbow-stripes-text text-[60px] sm:text-[100px] md:text-[140px] lg:text-[180px] font-black select-none leading-none">
        {text}
      </h1>
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