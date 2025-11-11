
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TrendingCarousel({ debates, userStances, isLoading }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div id="trending-carousel">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="h-8 sm:h-10 w-48 sm:w-64 bg-slate-700 rounded mx-auto mb-3 sm:mb-4 animate-pulse" />
          <div className="h-4 sm:h-6 w-64 sm:w-96 bg-slate-700 rounded mx-auto animate-pulse" />
        </div>
        <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-hidden px-3 sm:px-4">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="min-w-[280px] sm:min-w-[320px] lg:min-w-[360px] bg-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 h-[280px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!debates || debates.length === 0) {
    return null;
  }

  return (
    <div id="trending-carousel" className="scroll-mt-20">
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black mb-2 sm:mb-3 lg:mb-4 px-3 sm:px-4"
        >
          🔥 <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Trending Now</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-300 px-3 sm:px-4"
        >
          Join the hottest debates happening right now
        </motion.p>
      </div>

      {/* Carousel navigation buttons */}
      <div className="flex justify-end gap-2 mb-4 sm:mb-6 px-1 hidden sm:flex">
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll('left')}
          className="rounded-xl border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll('right')}
          className="rounded-xl border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-4 -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {debates.map((debate, index) => {
          const debateParticipants = userStances.filter(s => s.debate_id === debate.id);
          const waiting = debateParticipants.filter(p => p.status === "waiting").length;

          return (
            <motion.div
              key={debate.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[280px] sm:min-w-[350px] flex-shrink-0"
            >
              <Link to={createPageUrl(`TakeStance?id=${debate.id}`)}>
                <div className="group relative bg-white/80 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-gray-400 transition-all duration-300 h-full hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:scale-105">
                  {waiting > 2 && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      <Badge className="bg-gradient-to-r from-gray-400 to-gray-600 text-white border-0 animate-pulse text-xs">
                        <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                        HOT
                      </Badge>
                    </div>
                  )}

                  <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-black to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3 line-clamp-2 group-hover:from-blue-600 group-hover:to-black transition-colors">
                    {debate.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                    {debate.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      <span className="text-gray-600 font-medium">
                        {debateParticipants.length} joined
                      </span>
                    </div>

                    <Badge variant="outline" className="border-gray-300 text-gray-600 text-xs">
                      {debate.category.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-100/0 to-gray-200/0 group-hover:from-gray-100/10 group-hover:to-gray-200/10 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
