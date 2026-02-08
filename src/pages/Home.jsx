import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-screen h-screen overflow-hidden relative before:block before:absolute before:bg-black before:h-full before:w-full before:top-0 before:left-0 before:z-10 before:opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070" 
          className="absolute top-0 left-0 min-h-full w-full object-cover" 
          alt="Debate background" 
        />
        <div className="relative z-20 max-w-screen-lg mx-auto grid grid-cols-12 h-full items-center px-6">
          <div className="col-span-12 md:col-span-6">
            <span className="uppercase text-white text-xs font-bold mb-2 block">WE ARE THE PLATFORM</span>
            <h1 className="text-white font-extrabold text-4xl md:text-5xl mb-8">
              DebateMe provides Live Video Debates in different ways
            </h1>
            <p className="text-stone-100 text-base mb-6">
              Connect face-to-face with people who think differently. Engage in meaningful 1-on-1 video debates on topics that matter.
            </p>
            <Link to={createPageUrl("CreateDebate")}>
              <button className="mt-8 text-white uppercase py-4 text-base font-light px-10 border border-white hover:bg-white hover:bg-opacity-10 transition-all">
                Get started
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="bg-[#f7d0b6] py-20">
        <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-6">
          <div className="max-w-xl">
            <h2 className="font-black text-sky-950 text-3xl mb-4">
              Join thousands of debaters engaging in thoughtful discussions worldwide
            </h2>
            <p className="text-base text-sky-950">
              From politics to technology, economics to social issues - explore diverse perspectives through live video conversations.
            </p>
          </div>
          <Link to={createPageUrl("Categories")}>
            <button className="text-sky-950 uppercase py-3 text-base px-10 border border-sky-950 hover:bg-sky-950 hover:bg-opacity-10 transition-all whitespace-nowrap">
              Browse Topics
            </button>
          </Link>
        </div>
      </div>

      {/* Feature Section 1 */}
      <div className="py-12 relative overflow-hidden bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-screen-lg mx-auto">
          <div className="w-full flex flex-col items-end md:pr-16 px-6">
            <h2 className="text-[#64618C] font-bold text-2xl max-w-xs text-right mb-12 mt-10">
              Live Video Debates
            </h2>
            <div className="h-full mt-auto overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069" 
                className="h-full w-full object-cover rounded-lg" 
                alt="Video debate" 
              />
            </div>
          </div>

          <div className="py-20 bg-slate-100 relative before:absolute before:h-full before:w-screen before:bg-sky-950 before:top-0 before:left-0">
            <div className="relative z-20 pl-6 md:pl-12 pr-6">
              <h2 className="text-[#f7d0b6] font-black text-4xl md:text-5xl leading-snug mb-10">
                Real-time face-to-face discussions
              </h2>
              <p className="text-white text-sm mb-6">
                Experience the power of live video debates. Connect with your debate partner through webcam and have meaningful conversations in real-time. No pre-recorded videos, just authentic human interaction.
              </p>
              <Link to={createPageUrl("Trending")}>
                <button className="mt-8 text-white uppercase py-3 text-sm px-10 border border-white hover:bg-white hover:bg-opacity-10 transition-all">
                  View Trending
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section 2 */}
      <div className="py-4 relative overflow-hidden bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-screen-lg mx-auto">
          <div className="py-20 bg-slate-100 relative before:absolute before:h-full before:w-screen before:bg-[#f7d0b6] before:top-0 before:right-0 order-2 md:order-1">
            <div className="relative z-20 pl-6 md:pl-12 pr-6">
              <h2 className="text-sky-950 font-black text-4xl md:text-5xl leading-snug mb-10">
                Choose your stance and find your match
              </h2>
              <p className="text-sky-950 text-sm mb-6">
                Select a debate topic, pick your position, and get matched with someone who holds the opposite view. Our platform ensures balanced, fair, and engaging debates on subjects you care about.
              </p>
              <Link to={createPageUrl("Categories")}>
                <button className="mt-8 text-sky-950 uppercase py-3 text-sm px-10 border border-sky-950 hover:bg-white hover:bg-opacity-10 transition-all">
                  Explore Categories
                </button>
              </Link>
            </div>
          </div>
          
          <div className="w-full flex flex-col pl-6 md:pl-16 order-1 md:order-2">
            <h2 className="text-[#64618C] font-bold text-2xl max-w-xs text-left mb-12 mt-10">
              Smart Matching System
            </h2>
            <div className="h-full mt-auto overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070" 
                className="h-full w-full object-cover rounded-lg" 
                alt="People debating" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section 3 */}
      <div className="py-12 relative overflow-hidden bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-screen-lg mx-auto">
          <div className="w-full flex flex-col items-end md:pr-16 px-6">
            <h2 className="text-[#64618C] font-bold text-2xl max-w-xs text-right mb-12 mt-10">
              Track Your Progress
            </h2>
            <div className="h-full mt-auto overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070" 
                className="h-full w-full object-cover rounded-lg" 
                alt="Progress tracking" 
              />
            </div>
          </div>

          <div className="py-20 bg-slate-100 relative before:absolute before:h-full before:w-screen before:bg-sky-950 before:top-0 before:left-0">
            <div className="relative z-20 pl-6 md:pl-12 pr-6">
              <h2 className="text-[#f7d0b6] font-black text-4xl md:text-5xl leading-snug mb-10">
                Earn achievements and level up
              </h2>
              <p className="text-white text-sm mb-6">
                Complete debates to earn XP, unlock achievements, and climb the leaderboard. Track your debate time, completed sessions, and see how you rank against other debaters in the community.
              </p>
              <Link to={createPageUrl("Achievements")}>
                <button className="mt-8 text-white uppercase py-3 text-sm px-10 border border-white hover:bg-white hover:bg-opacity-10 transition-all">
                  View Achievements
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 text-center">
        <div className="max-w-screen-lg mx-auto px-6">
          <p className="text-slate-400 text-sm">
            © 2025 DebateMe • Live Video 1 on 1 Debates • 
            <Link to={createPageUrl("PrivacyPolicy")} className="underline hover:text-slate-200 ml-2">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}