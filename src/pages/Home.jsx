import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageSquare, Users, Zap, Trophy } from "lucide-react";

export default function Home() {
  const [activeArticle, setActiveArticle] = useState(null);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        .article-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        
        .article-content {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 3rem;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        
        .article-content::-webkit-scrollbar {
          width: 8px;
        }
        
        .article-content::-webkit-scrollbar-track {
          background: #2d2d2d;
        }
        
        .article-content::-webkit-scrollbar-thumb {
          background: #666;
          border-radius: 4px;
        }
      `}</style>

      {/* Header */}
      <header className="text-center py-20 px-6 fade-in">
        <div className="mb-8">
          <div className="inline-block p-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full mb-6 border border-orange-500/30">
            <MessageSquare className="w-12 h-12 text-orange-400" />
          </div>
        </div>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
            DebateMe
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
            Engage in live video debates with people who think differently.<br />
            Challenge your views. Sharpen your arguments.
          </p>
        </div>
        <nav className="mt-12">
          <ul className="flex flex-wrap justify-center gap-4">
            <li>
              <button
                onClick={() => setActiveArticle('about')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveArticle('categories')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold transition-all duration-300 border border-white/20"
              >
                Categories
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveArticle('features')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold transition-all duration-300 border border-white/20"
              >
                Features
              </button>
            </li>
            <li>
              <Link
                to={createPageUrl("CreateDebate")}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold transition-all duration-300 border border-white/20 inline-block"
              >
                Start Debating
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content - Feature Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Live Video</h3>
            <p className="text-gray-300">
              Face-to-face debates in real-time with live video streaming
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105">
            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Smart Matching</h3>
            <p className="text-gray-300">
              Get paired with opponents who challenge your perspective
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 transform hover:scale-105">
            <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Quick Setup</h3>
            <p className="text-gray-300">
              Jump into debates in seconds - no complicated setup required
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 transform hover:scale-105">
            <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <Trophy className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Level Up</h3>
            <p className="text-gray-300">
              Earn XP and achievements as you engage in debates
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 backdrop-blur-sm rounded-2xl p-12 border border-orange-500/20">
            <h2 className="text-4xl font-bold mb-6">Ready to Challenge Your Views?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of debaters engaging in meaningful conversations on topics that matter.
            </p>
            <Link
              to={createPageUrl("CreateDebate")}
              className="inline-block px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Your First Debate
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gray-400">
            © 2025 DebateMe • Live Video 1 on 1 Debates • 
            <Link to={createPageUrl("PrivacyPolicy")} className="underline hover:text-gray-200 ml-2">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>

      {/* Article Overlay */}
      {activeArticle && (
        <div className="article-overlay" onClick={() => setActiveArticle(null)}>
          <div className="article-content fade-in" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
            >
              <span className="text-2xl">&times;</span>
            </button>

            {activeArticle === 'about' && (
              <>
                <h2 className="text-4xl font-bold mb-6 text-orange-400">About DebateMe</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    DebateMe is a platform designed to break you out of your echo chamber. We believe that meaningful 
                    discourse happens when people with different perspectives come together to challenge each other's ideas.
                  </p>
                  <p>
                    Through live video debates, you'll engage face-to-face with real people who hold different views. 
                    No trolls, no anonymous comments—just thoughtful, structured conversations that help you refine 
                    your arguments and broaden your understanding.
                  </p>
                  <p>
                    Whether you're passionate about politics, technology, the environment, or social issues, there's 
                    always someone ready to debate. Join our community and start having conversations that matter.
                  </p>
                </div>
              </>
            )}

            {activeArticle === 'categories' && (
              <>
                <h2 className="text-4xl font-bold mb-6 text-orange-400">Debate Categories</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-blue-400">Politics</h3>
                    <p className="text-gray-300">Engage in debates about government policy, elections, and civic issues.</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-purple-400">Technology</h3>
                    <p className="text-gray-300">Discuss AI, innovation, privacy, and the future of the digital world.</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-green-400">Environment</h3>
                    <p className="text-gray-300">Debate climate policy, sustainability, and conservation efforts.</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-yellow-400">Economics</h3>
                    <p className="text-gray-300">Challenge ideas about markets, wealth distribution, and trade policy.</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-pink-400">Social Issues</h3>
                    <p className="text-gray-300">Explore debates on culture, equality, justice, and societal norms.</p>
                  </div>
                </div>
                <div className="mt-8">
                  <Link
                    to={createPageUrl("Categories")}
                    className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
                    onClick={() => setActiveArticle(null)}
                  >
                    Browse All Categories
                  </Link>
                </div>
              </>
            )}

            {activeArticle === 'features' && (
              <>
                <h2 className="text-4xl font-bold mb-6 text-orange-400">Platform Features</h2>
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-white">Live Video Debates</h3>
                    <p>
                      Connect face-to-face with your debate partner through high-quality video streaming. 
                      See reactions, read body language, and have a real conversation.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-white">Smart Matching System</h3>
                    <p>
                      Our algorithm pairs you with opponents who hold opposing views on the topics you care about. 
                      Get ready for challenging, thought-provoking debates.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-white">Progression & Achievements</h3>
                    <p>
                      Level up your debate skills. Earn XP for participating, unlock achievements for milestones, 
                      and climb the leaderboard as you become a better debater.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-white">Private Notes</h3>
                    <p>
                      Take personal notes during debates to organize your thoughts, track key points, 
                      and improve your argumentation skills.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-white">Community Driven</h3>
                    <p>
                      Create your own debate topics, join trending discussions, and be part of a growing 
                      community of thoughtful debaters.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}