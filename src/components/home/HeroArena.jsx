import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import * as THREE from "three";

function RainbowRevealText({ text = "DebateMe" }) {
  return (
    <div className="relative overflow-hidden">
      <style>{`
        @keyframes auroraFlow {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        
        .aurora-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        
        .aurora-layer {
          position: absolute;
          width: 200%;
          height: 100%;
          animation: auroraFlow 6s linear infinite;
        }
      `}</style>
      
      <div className="relative">
        {/* The text acts as a mask for the aurora animation */}
        <h1 
          className="text-[60px] sm:text-[100px] md:text-[140px] lg:text-[180px] font-black select-none leading-none relative"
          style={{
            background: 'transparent',
            color: 'transparent',
          }}
        >
          {/* Aurora animation layer clipped to text */}
          <span
            className="absolute inset-0"
            style={{
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <span className="aurora-container">
              <svg 
                className="aurora-layer" 
                viewBox="0 0 1200 300" 
                preserveAspectRatio="none"
                style={{ width: '200%', height: '100%' }}
              >
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="8" result="blur"/>
                    <feMerge>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Flowing curved rainbow bands */}
                <path d="M-50,150 Q100,50 200,150 T400,150 T600,150 T800,150 T1000,150 T1200,150 T1400,150" 
                      stroke="url(#grad1)" strokeWidth="35" fill="none" filter="url(#glow)" opacity="0.9"/>
                <path d="M-100,100 Q50,200 150,100 T350,100 T550,100 T750,100 T950,100 T1150,100 T1350,100" 
                      stroke="url(#grad2)" strokeWidth="30" fill="none" filter="url(#glow)" opacity="0.85"/>
                <path d="M-80,200 Q70,100 180,200 T380,200 T580,200 T780,200 T980,200 T1180,200 T1380,200" 
                      stroke="url(#grad3)" strokeWidth="28" fill="none" filter="url(#glow)" opacity="0.9"/>
                <path d="M-30,130 Q120,230 220,130 T420,130 T620,130 T820,130 T1020,130 T1220,130 T1420,130" 
                      stroke="url(#grad4)" strokeWidth="32" fill="none" filter="url(#glow)" opacity="0.85"/>
                <path d="M-60,180 Q90,80 190,180 T390,180 T590,180 T790,180 T990,180 T1190,180 T1390,180" 
                      stroke="url(#grad5)" strokeWidth="26" fill="none" filter="url(#glow)" opacity="0.9"/>
                <path d="M-40,70 Q110,170 210,70 T410,70 T610,70 T810,70 T1010,70 T1210,70 T1410,70" 
                      stroke="url(#grad6)" strokeWidth="30" fill="none" filter="url(#glow)" opacity="0.85"/>
                <path d="M-90,240 Q60,140 160,240 T360,240 T560,240 T760,240 T960,240 T1160,240 T1360,240" 
                      stroke="url(#grad7)" strokeWidth="25" fill="none" filter="url(#glow)" opacity="0.8"/>
                
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff0080"/>
                    <stop offset="50%" stopColor="#ff0040"/>
                    <stop offset="100%" stopColor="#ff0080"/>
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff6600"/>
                    <stop offset="50%" stopColor="#ffaa00"/>
                    <stop offset="100%" stopColor="#ff6600"/>
                  </linearGradient>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffff00"/>
                    <stop offset="50%" stopColor="#aaff00"/>
                    <stop offset="100%" stopColor="#ffff00"/>
                  </linearGradient>
                  <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00ff66"/>
                    <stop offset="50%" stopColor="#00ffaa"/>
                    <stop offset="100%" stopColor="#00ff66"/>
                  </linearGradient>
                  <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00ccff"/>
                    <stop offset="50%" stopColor="#0088ff"/>
                    <stop offset="100%" stopColor="#00ccff"/>
                  </linearGradient>
                  <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6600ff"/>
                    <stop offset="50%" stopColor="#aa00ff"/>
                    <stop offset="100%" stopColor="#6600ff"/>
                  </linearGradient>
                  <linearGradient id="grad7" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff00aa"/>
                    <stop offset="50%" stopColor="#ff00ff"/>
                    <stop offset="100%" stopColor="#ff00aa"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            {text}
          </span>
          
          {/* Invisible text for layout */}
          <span className="opacity-0">{text}</span>
        </h1>
        
        {/* Actual visible text with aurora as background */}
        <h1 
          className="absolute inset-0 text-[60px] sm:text-[100px] md:text-[140px] lg:text-[180px] font-black select-none leading-none overflow-hidden"
          style={{
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          <motion.span
            className="absolute inset-0 block"
            style={{
              width: '200%',
              height: '100%',
              background: `
                radial-gradient(ellipse 120px 300px at 5% 50%, rgba(255,0,128,0.95) 0%, transparent 60%),
                radial-gradient(ellipse 100px 280px at 15% 30%, rgba(255,80,0,0.9) 0%, transparent 60%),
                radial-gradient(ellipse 110px 320px at 25% 70%, rgba(255,220,0,0.95) 0%, transparent 60%),
                radial-gradient(ellipse 130px 290px at 35% 40%, rgba(80,255,0,0.9) 0%, transparent 60%),
                radial-gradient(ellipse 95px 310px at 45% 60%, rgba(0,255,180,0.95) 0%, transparent 60%),
                radial-gradient(ellipse 115px 280px at 55% 35%, rgba(0,180,255,0.9) 0%, transparent 60%),
                radial-gradient(ellipse 125px 300px at 65% 65%, rgba(60,0,255,0.95) 0%, transparent 60%),
                radial-gradient(ellipse 105px 290px at 75% 45%, rgba(140,0,255,0.9) 0%, transparent 60%),
                radial-gradient(ellipse 120px 320px at 85% 55%, rgba(255,0,200,0.95) 0%, transparent 60%),
                radial-gradient(ellipse 110px 280px at 95% 40%, rgba(255,0,100,0.9) 0%, transparent 60%)
              `,
            }}
            animate={{
              x: ["-50%", "0%"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          {text}
        </h1>
      </div>
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