import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Home() {
  return (
    <div className="w-full">
      <style>{`
        /* Forty Template Styles */
        #banner {
          background-image: url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        #banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }
        
        #banner .inner {
          position: relative;
          z-index: 1;
          text-align: center;
          color: white;
          padding: 2rem;
        }
        
        .tiles {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 0;
        }
        
        .tiles article {
          position: relative;
          overflow: hidden;
          height: 400px;
        }
        
        .tiles article .image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: transform 0.3s ease;
        }
        
        .tiles article:hover .image {
          transform: scale(1.1);
        }
        
        .tiles article::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 1;
          transition: background 0.3s ease;
        }
        
        .tiles article:hover::before {
          background: rgba(0, 0, 0, 0.6);
        }
        
        .tiles article header {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          z-index: 2;
          color: white;
        }
      `}</style>

      {/* Banner */}
      <section id="banner" className="major">
        <div className="inner max-w-4xl mx-auto">
          <header className="major mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">DebateMe</h1>
          </header>
          <div className="content">
            <p className="text-xl md:text-2xl mb-8">
              Engage in meaningful live video debates<br />
              with people who think differently
            </p>
            <ul className="actions flex justify-center gap-4">
              <Link to={createPageUrl("CreateDebate")} className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded transition-colors">
                Get Started
              </Link>
            </ul>
          </div>
        </div>
      </section>

      {/* Main */}
      <div id="main">
        {/* Tiles Section */}
        <section id="one" className="tiles">
          <article>
            <span className="image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2070')"}}></span>
            <header className="major">
              <h3>
                <Link to={createPageUrl("Categories")} className="text-white hover:text-orange-400 transition-colors">
                  Politics
                </Link>
              </h3>
              <p>Government policy and civic debates</p>
            </header>
          </article>
          <article>
            <span className="image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')"}}></span>
            <header className="major">
              <h3>
                <Link to={createPageUrl("Categories")} className="text-white hover:text-orange-400 transition-colors">
                  Technology
                </Link>
              </h3>
              <p>Innovation and digital future</p>
            </header>
          </article>
          <article>
            <span className="image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070')"}}></span>
            <header className="major">
              <h3>
                <Link to={createPageUrl("Categories")} className="text-white hover:text-orange-400 transition-colors">
                  Environment
                </Link>
              </h3>
              <p>Climate and sustainability</p>
            </header>
          </article>
          <article>
            <span className="image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070')"}}></span>
            <header className="major">
              <h3>
                <Link to={createPageUrl("Categories")} className="text-white hover:text-orange-400 transition-colors">
                  Economics
                </Link>
              </h3>
              <p>Markets and financial policy</p>
            </header>
          </article>
          <article>
            <span className="image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2032')"}}></span>
            <header className="major">
              <h3>
                <Link to={createPageUrl("Categories")} className="text-white hover:text-orange-400 transition-colors">
                  Social Issues
                </Link>
              </h3>
              <p>Society and culture</p>
            </header>
          </article>
          <article>
            <span className="image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070')"}}></span>
            <header className="major">
              <h3>
                <Link to={createPageUrl("Trending")} className="text-white hover:text-orange-400 transition-colors">
                  Trending
                </Link>
              </h3>
              <p>Hot topics right now</p>
            </header>
          </article>
        </section>

        {/* Two */}
        <section id="two" className="bg-gray-100 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <header className="major mb-6">
              <h2 className="text-4xl font-bold text-gray-900">Why DebateMe?</h2>
            </header>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Step out of your echo chamber. DebateMe connects you with real people for live video debates 
              on topics that matter. Challenge your perspectives, sharpen your arguments, and engage in 
              meaningful discourse with people who think differently. Whether you're passionate about politics, 
              technology, the environment, or social issues—there's a debate waiting for you.
            </p>
            <ul className="actions">
              <Link to={createPageUrl("CreateDebate")} className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded transition-colors">
                Start Debating
              </Link>
            </ul>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 DebateMe • Live Video 1 on 1 Debates • 
              <Link to={createPageUrl("PrivacyPolicy")} className="underline hover:text-gray-200 ml-2">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}