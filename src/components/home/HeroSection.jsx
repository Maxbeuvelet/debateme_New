import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection({ totalDebates, totalParticipants, activeWaiting }) {
  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.1),transparent_70%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}Debate Partner
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Take a stance on topics that matter. Get matched with someone who disagrees. 
            Engage in respectful, meaningful debate.
          </p>
          
          <div className="flex justify-center mb-12">
            <Button 
              size="lg" 
              onClick={scrollToCategories}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Start Debating
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-cyan-400 mb-2">{totalDebates}</div>
              <div className="text-slate-300 text-sm uppercase tracking-wider">Active Topics</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-cyan-400 mb-2">{totalParticipants}</div>
              <div className="text-slate-300 text-sm uppercase tracking-wider">Waiting to Debate</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-cyan-400 mb-2">{activeWaiting}</div>
              <div className="text-slate-300 text-sm uppercase tracking-wider">Stances Taken</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}