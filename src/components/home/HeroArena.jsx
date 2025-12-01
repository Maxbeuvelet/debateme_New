import React from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroArena() {
  const text = "DebateMe";
  
  const scrollToCategories = () => {
    const section = document.getElementById('categories-arena');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-black" style={{ minHeight: '750px' }}>
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center" style={{ minHeight: '750px' }}>
        {/* Rainbow Reveal Text Section */}
        <div className="relative w-full flex items-center justify-center overflow-hidden mb-4">
          {/* Animated Rainbow Layer */}
          <motion.div
            className="absolute inset-0 bg-[url('https://i.imgur.com/CSqG6bP.png')] bg-cover bg-[length:400%_400%]"
            initial={{ x: "-200%" }}
            animate={{ x: "200%" }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              WebkitMaskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><text x="50%" y="55%" font-size="200" font-weight="900" text-anchor="middle" fill="white" font-family="Arial Black">${text}</text></svg>')`,
              WebkitMaskRepeat: "no-repeat",
              maskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><text x="50%" y="55%" font-size="200" font-weight="900" text-anchor="middle" fill="white" font-family="Arial Black">${text}</text></svg>')`,
              maskRepeat: "no-repeat",
              backgroundBlendMode: "screen"
            }}
          />

          {/* Invisible Text Placeholder for Layout */}
          <h1 className="text-transparent text-[80px] sm:text-[120px] md:text-[160px] font-extrabold select-none">
            {text}
          </h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-slate-500 text-lg sm:text-xl md:text-2xl mb-8 font-medium"
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