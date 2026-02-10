import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedDMLogo() {
  const [phase, setPhase] = React.useState(0);
  const [showCursor, setShowCursor] = React.useState(false);

  React.useEffect(() => {
    const timeline = [
      { duration: 1500, action: () => setPhase(0) },      // DM
      { duration: 800, action: () => setPhase(1) },       // Expand to Debate
      { duration: 300, action: () => setShowCursor(true) }, // Show cursor
      { duration: 600, action: () => setPhase(2) },       // Type Me -> DebateMe
      { duration: 1200, action: () => setShowCursor(false) }, // Hide cursor, pause
      { duration: 800, action: () => setPhase(3) },       // Collapse to DM
      { duration: 400, action: () => setPhase(4) },       // Bounce
      { duration: 500, action: () => setPhase(0) }        // Back to start
    ];

    let currentStep = 0;
    let timeoutId;

    const runTimeline = () => {
      const step = timeline[currentStep];
      step.action();
      
      timeoutId = setTimeout(() => {
        currentStep = (currentStep + 1) % timeline.length;
        runTimeline();
      }, step.duration);
    };

    runTimeline();

    return () => clearTimeout(timeoutId);
  }, []);

  const getText = () => {
    if (phase === 0 || phase === 4) return "DM";
    if (phase === 1) return "Debate";
    if (phase === 2) return "DebateMe";
    if (phase === 3) return "DM";
    return "DM";
  };

  const getScale = () => {
    if (phase === 4) return 1.1;
    return 1;
  };

  const text = getText();

  return (
    <div className="relative">
      {/* Gradient glow */}
      <motion.div
        className="absolute inset-0 blur-2xl opacity-60"
        animate={{
          background: [
            "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main text */}
      <motion.div
        className="relative flex items-center justify-center"
        animate={{ scale: getScale() }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={phase}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
            initial={{ 
              opacity: 0, 
              filter: "blur(10px)",
              x: phase === 1 || phase === 2 ? -20 : 0
            }}
            animate={{ 
              opacity: 1, 
              filter: "blur(0px)",
              x: 0
            }}
            exit={{ 
              opacity: 0, 
              filter: "blur(10px)",
              x: phase === 3 ? 20 : 0
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {text}
          </motion.span>
        </AnimatePresence>

        {/* Typing cursor */}
        <AnimatePresence>
          {showCursor && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 0, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="ml-1 text-4xl md:text-5xl font-bold text-purple-400"
            >
              |
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}