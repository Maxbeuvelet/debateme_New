import { MessageCircle, Trophy, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Navigation */}
      <nav className="absolute top-6 left-0 right-0 flex justify-center gap-6 text-sm opacity-80">
        <a href="#intro" className="hover:opacity-100 transition">Intro</a>
        <a href="#features" className="hover:opacity-100 transition">Features</a>
        <a href="#about" className="hover:opacity-100 transition">About</a>
        <Link to={createPageUrl("CreateDebate")} className="hover:opacity-100 transition">Join</Link>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen text-center px-8">
        <div id="intro" className="max-w-xl">
          <h1 className="text-5xl font-bold mb-6">DebateMe</h1>
          <p className="text-lg opacity-80 mb-8">
            Enter the arena. Challenge opinions. Earn respect.
          </p>
          <Link
            to={createPageUrl("CreateDebate")}
            className="inline-block px-6 py-3 bg-indigo-500 rounded-xl text-lg hover:bg-indigo-400 transition"
          >
            Enter Arena
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Live Debates */}
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30 hover:border-indigo-400/50 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-indigo-500/30 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Live Debates</h3>
              <p className="text-sm opacity-80">
                Face-to-face video debates with real-time interaction
              </p>
            </div>

            {/* Rankings */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Rankings</h3>
              <p className="text-sm opacity-80">
                Climb the leaderboard and prove your debate skills
              </p>
            </div>

            {/* Private Rooms */}
            <div className="bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30 hover:border-pink-400/50 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-pink-500/30 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-pink-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Private Rooms</h3>
              <p className="text-sm opacity-80">
                Create invite-only debates with specific opponents
              </p>
            </div>

            {/* XP + Achievements */}
            <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30 hover:border-orange-400/50 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">XP + Achievements</h3>
              <p className="text-sm opacity-80">
                Level up and unlock badges as you debate more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-8 bg-indigo-900/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">About DebateMe</h2>
          <p className="text-lg opacity-90 leading-relaxed mb-6">
            DebateMe is a platform where ideas clash and perspectives evolve. 
            We connect people with opposing views for structured, meaningful debates 
            that challenge thinking and sharpen argumentation skills.
          </p>
          <p className="text-lg opacity-90 leading-relaxed">
            Whether you're passionate about politics, technology, or social issues, 
            there's always someone ready to engage. Join our community of thoughtful 
            debaters and start having conversations that matter.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-white/10 text-center opacity-60">
        <p>© 2026 DebateMe • Live Video Debates • 
          <Link to={createPageUrl("PrivacyPolicy")} className="underline hover:opacity-100 ml-2">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}