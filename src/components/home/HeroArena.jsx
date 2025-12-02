import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
/* eslint-disable no-unused-vars */
import * as THREE from "three";



export default function HeroArena() {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    const loadVanta = async () => {
      // Load Vanta Globe script
      const vantaScript = document.createElement('script');
      vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js';
      vantaScript.async = true;
      
      vantaScript.onload = () => {
        if (vantaRef.current && window.VANTA) {
          vantaEffect.current = window.VANTA.GLOBE({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x3fafff,
            color2: 0xffffff,
            size: 1,
            backgroundColor: 0x23153c
          });
        }
      };
      
      document.head.appendChild(vantaScript);
    };

    loadVanta();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  const scrollToCategories = () => {
    const section = document.getElementById('categories-arena');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={vantaRef} className="relative overflow-hidden" style={{ minHeight: '750px', backgroundColor: '#23153c' }}>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-start justify-center px-4 sm:px-8 lg:px-12" style={{ minHeight: '750px' }}>
        {/* DebateMe Title */}
        <h1 
          className="text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px] font-semibold text-white select-none leading-none antialiased"
          style={{ fontFamily: 'Inter', letterSpacing: '-0.02em' }}
        >
          DebateMe
        </h1>



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