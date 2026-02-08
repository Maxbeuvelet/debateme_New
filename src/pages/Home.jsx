import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Home() {
  return (
    <div className="w-full">
      <style>{`
        @keyframes word {
          0% {
            transform: translateY(100%);
          }
          15% {
            transform: translateY(-10%);
            animation-timing-function: ease-out;
          }
          20% {
            transform: translateY(0);
          }
          40%,
          100% {
            transform: translateY(-110%);
          }
        }

        .animate-word {
          animation: word 7s infinite;
        }
        .animate-word-delay-1 {
          animation: word 7s infinite;
          animation-delay: -1.4s;
        }
        .animate-word-delay-2 {
          animation: word 7s infinite;
          animation-delay: -2.8s;
        }
        .animate-word-delay-3 {
          animation: word 7s infinite;
          animation-delay: -4.2s;
        }
      `}</style>

      <div className="flex min-h-screen items-center justify-center bg-black font-bold text-white">
        <div className="text-center space-y-12 px-6">
          <div className="text-center text-4xl sm:text-5xl md:text-6xl font-bold">
            DebateMe about
            <div className="relative inline-grid grid-cols-1 grid-rows-1 gap-12 overflow-hidden ml-4">
              <span className="animate-word col-span-full row-span-full">Politics</span>
              <span className="animate-word-delay-1 col-span-full row-span-full">Environment</span>
              <span className="animate-word-delay-2 col-span-full row-span-full">Economics</span>
              <span className="animate-word-delay-3 col-span-full row-span-full">Social Issues</span>
            </div>
          </div>
          <p className="text-white text-lg sm:text-xl">
            Ready to engage in meaningful debate? <Link className="underline hover:text-gray-300" to={createPageUrl("CreateDebate")}>Start here</Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-8 text-center border-t border-gray-800">
        <div className="max-w-screen-lg mx-auto px-6">
          <p className="text-gray-400 text-sm">
            © 2025 DebateMe • Live Video 1 on 1 Debates • 
            <Link to={createPageUrl("PrivacyPolicy")} className="underline hover:text-gray-200 ml-2">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}