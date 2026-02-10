import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, TrendingUp, LayoutGrid, Users, Gavel, Trophy, Hexagon, Shield, Zap, Star, Gem, Eye, Flame, Crown, Bug, Menu, X, PlusCircle } from "lucide-react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

import { base44 } from "@/api/base44Client";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Create",
    url: createPageUrl("Create"),
    icon: PlusCircle,
  },
  {
    title: "Trending",
    url: createPageUrl("Trending"),
    icon: TrendingUp,
  },
  {
    title: "Categories",
    url: createPageUrl("Categories"),
    icon: LayoutGrid,
  },
  {
    title: "Achievements",
    url: createPageUrl("Achievements"),
    icon: Trophy,
  },
  {
    title: "Ranked",
    url: createPageUrl("Ranked"),
    icon: Gavel,
  },
  {
    title: "Community",
    url: createPageUrl("Community"),
    icon: Users,
  }
];

const getRankIcon = (level) => {
  if (level >= 70) return Crown;
  if (level >= 60) return Flame;
  if (level >= 50) return Eye;
  if (level >= 40) return Gem;
  if (level >= 30) return Star;
  if (level >= 20) return Zap;
  if (level >= 10) return Shield;
  return Hexagon;
};

const getRankGradient = (level) => {
  return ""; // Empty gradient for all ranks
};

const getRankCustomImage = (level) => {
  if (level >= 70) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/e707f104e_ranksilver.png";
  if (level >= 60 && level < 70) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/83e5f6f36_rankgold.png";
  if (level >= 50 && level < 60) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/a139614f3_ranksilverpurple.png";
  if (level >= 40 && level < 50) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/cdc86a441_ranksilverblue.png";
  if (level >= 30 && level < 40) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/eb077c24e_rankbronze1.png";
  if (level >= 20 && level < 30) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/21cc5a6d2_standartrankgold1.png";
  if (level >= 10 && level < 20) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/ed5a4b8bc_standartranksilver1.png";
  if (level < 10) return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/8d99511b8_standartrankbronze.png";
  return null;
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [isLoadingUser, setIsLoadingUser] = React.useState(true);
  const [hasUserLoadedOnce, setHasUserLoadedOnce] = React.useState(false);
  const [hasNewAchievements, setHasNewAchievements] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const [showBugDialog, setShowBugDialog] = React.useState(false);
  const [bugDescription, setBugDescription] = React.useState("");
  const [isSubmittingBug, setIsSubmittingBug] = React.useState(false);
  const [bugSubmitMessage, setBugSubmitMessage] = React.useState("");

  // Add Google Ads tracking
  React.useEffect(() => {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17646709249';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-17646709249');
    `;
    document.head.appendChild(script2);

    return () => {
      if (script1.parentNode) script1.parentNode.removeChild(script1);
      if (script2.parentNode) script2.parentNode.removeChild(script2);
    };
  }, []);

  // Add X (Twitter) conversion tracking
  React.useEffect(() => {
    const script1 = document.createElement('script');
    script1.innerHTML = `
      !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
      },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
      a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
      twq('config','qnpw1');
    `;
    script1.id = 'twitter-pixel-script'; 
    document.head.appendChild(script1);

    return () => {
      const scriptToRemove = document.getElementById('twitter-pixel-script');
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
    };
  }, []);

  React.useEffect(() => {
    const loadInitialUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const currentUser = await User.me();
          setUser(currentUser);

          if (currentUser && currentUser.new_achievements && currentUser.new_achievements.length > 0) {
            setHasNewAchievements(true);
          }


        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoadingUser(false);
        setHasUserLoadedOnce(true);
      }
    };
    
    if (!hasUserLoadedOnce) {
      loadInitialUser();
    }
  }, [hasUserLoadedOnce, currentPageName]);

  React.useEffect(() => {
    if (currentPageName === "Achievements" && hasNewAchievements && user) {
      const clearNewAchievements = async () => {
        try {
          await User.updateMyUserData({
            new_achievements: []
          });
          setHasNewAchievements(false);
          setUser(prevUser => ({
            ...prevUser,
            new_achievements: []
          }));
        } catch (error) {
          console.error("Error clearing new achievements:", error);
        }
      };
      clearNewAchievements();
    }
  }, [currentPageName, hasNewAchievements, user]);

  const handleBugSubmit = async () => {
    if (!bugDescription.trim()) {
      setBugSubmitMessage("Please describe the bug before submitting.");
      return;
    }

    setIsSubmittingBug(true);
    setBugSubmitMessage("");

    try {
      const response = await base44.functions.invoke('reportBug', {
        bugDescription: bugDescription,
        currentPage: window.location.href,
        userAgent: navigator.userAgent
      });

      setBugSubmitMessage("Thanks! Your bug report has been sent.");
      setBugDescription("");
      
      setTimeout(() => {
        setShowBugDialog(false);
        setBugSubmitMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error submitting bug:", error);
      
      let errorMsg = "Failed to send bug report. Please try again.";
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.data?.details) {
        errorMsg = `Error: ${error.response.data.details}`;
      }
      
      setBugSubmitMessage(errorMsg);
    } finally {
      setIsSubmittingBug(false);
    }
  };

  const currentLevel = user?.level || 1;
  const currentXp = user?.xp || 0;
  const xpForNextLevel = currentLevel * 100;
  const xpProgress = Math.min(100, (currentXp / xpForNextLevel) * 100);
  
  const RankIcon = getRankIcon(currentLevel);
  const rankGradient = getRankGradient(currentLevel); // This will now always be an empty string
  const rankCustomImage = getRankCustomImage(currentLevel);

  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-50 overflow-x-hidden">
      <style>{`
        :root {
          --primary-navy: #0F172A;
          --primary-blue: #1E40AF;
          --accent-cyan: #06B6D4;
          --warm-gray: #64748B;
          --light-gray: #F8FAFC;
        }

        .debate-gradient {
          background: linear-gradient(135deg, #475569 0%, #334155 100%);
        }

        .accent-gradient {
          background: linear-gradient(135deg, var(--accent-cyan) 0%, var(--primary-blue) 100%);
        }

        body {
          overflow-x: hidden;
        }
      `}</style>
      
      {/* Top Navigation Bar - Desktop */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/a5f3d3437_Debate.png" 
                alt="DebateMe" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-slate-900 text-base">DebateMe</span>
            </Link>

            {/* Navigation Links - Center */}
            <div className="flex items-center gap-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.url
                      ? 'text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.title}
                  {item.title === "Achievements" && hasNewAchievements && (
                    <span className="ml-1 inline-block w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side - User Info & Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowBugDialog(true)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium"
              >
                <Bug className="w-4 h-4 mr-1.5" />
                Report Bug
              </Button>

              {isLoadingUser && !hasUserLoadedOnce ? (
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" />
               </div>
              ) : user ? (
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center overflow-hidden">
                   {rankCustomImage ? (
                     <img 
                       src={rankCustomImage} 
                       alt="Rank"
                       className="w-full h-full object-contain"
                     />
                   ) : (
                     <RankIcon className="w-5 h-5 text-slate-700" />
                   )}
                 </div>
                 <span className="text-sm font-medium text-slate-900">@{user.username || user.email}</span>
               </div>
              ) : (
                <Button
                  onClick={() => base44.auth.redirectToLogin(window.location.href)}
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm h-9 px-5"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="hidden md:block h-16" />

      {/* Mobile Header */}
      <header className="bg-white border-b border-slate-200 p-3 sm:p-4 md:hidden flex items-center justify-between fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-full flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/a5f3d3437_Debate.png" 
              alt="DebateMe" 
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain flex-shrink-0"
            />
            <h1 className="font-bold text-slate-900 text-sm sm:text-base truncate">DebateMe</h1>
          </div>
        </div>
        {user && (
          <div className="flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-transparent flex items-center justify-center shadow-md overflow-hidden">
              {rankCustomImage ? (
                <img 
                  src={rankCustomImage} 
                  alt="Rank"
                  className="w-full h-full object-contain"
                />
              ) : (
                <RankIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed mobile header */}
      <div className="md:hidden h-[52px] sm:h-[60px]" />

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-72 bg-slate-100 z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="border-b border-slate-300/60 p-4 bg-slate-50 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/a5f3d3437_Debate.png" 
                    alt="DebateMe" 
                    className="w-8 h-8 object-contain"
                  />
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">DebateMe</h2>
                    <p className="text-[10px] text-slate-600 font-medium">Thoughtful Discourse</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 bg-slate-100">
                <div className="mb-4">
                  <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-3 py-2">
                    Navigation
                  </div>
                  <nav className="space-y-1">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                          location.pathname === item.url
                            ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                        {item.title === "Achievements" && hasNewAchievements && (
                          <div className="absolute right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                        )}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>

              <div className="border-t border-slate-300/60 p-3 bg-slate-50 flex-shrink-0">
                <Button
                  onClick={() => {
                    setShowBugDialog(true);
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full mb-2 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-900 font-medium text-xs"
                >
                  <Bug className="w-3 h-3 mr-1" />
                  Report a Bug
                </Button>

                {isLoadingUser && !hasUserLoadedOnce ? (
                  <div className="flex items-center gap-2 p-2">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="flex-1">
                      <div className="h-3 bg-slate-200 rounded mb-1 animate-pulse" />
                      <div className="h-2 bg-slate-200 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ) : user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-slate-200/50 rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-transparent flex items-center justify-center shadow-lg overflow-hidden">
                        {rankCustomImage ? (
                          <img 
                            src={rankCustomImage} 
                            alt="Rank"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <RankIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate text-sm">@{user.username || user.email}</p>
                        <p className="text-[10px] text-slate-600 font-medium">Level {currentLevel} · {currentXp} XP</p>
                      </div>
                    </div>
                    
                    <div className="px-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-semibold text-slate-700">{currentXp} XP</span>
                        <span className="text-[10px] font-semibold text-slate-700">{xpForNextLevel} XP</span>
                      </div>
                      <div className="h-1.5 bg-slate-300 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-slate-600 to-slate-700 transition-all duration-500 rounded-full"
                          style={{ width: `${xpProgress}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={async () => {
                        await User.logout();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900 font-medium text-xs"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => base44.auth.redirectToLogin(window.location.href)}
                    size="sm"
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold shadow-lg text-xs"
                  >
                    Login to Join
                  </Button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>



      {/* Bug Report Dialog */}
      <Dialog open={showBugDialog} onOpenChange={setShowBugDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Bug className="w-6 h-6 text-red-600" />
            </div>
            <DialogTitle className="text-center text-xl">Report a Bug</DialogTitle>
            <DialogDescription className="text-center">
              Found something broken? Let us know so we can fix it quickly!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                What happened? Please describe the bug:
              </label>
              <Textarea
                value={bugDescription}
                onChange={(e) => setBugDescription(e.target.value)}
                placeholder="Example: When I clicked the join debate button, nothing happened..."
                className="min-h-[120px] resize-none"
                disabled={isSubmittingBug}
              />
              <p className="text-xs text-slate-500 mt-2">
                💡 Tip: Include what you were trying to do and what happened instead
              </p>
            </div>

            {bugSubmitMessage && (
              <div className={`text-sm text-center p-3 rounded-lg ${
                bugSubmitMessage.includes("Thanks") 
                  ? "bg-green-50 text-green-700" 
                  : "bg-red-50 text-red-700"
              }`}>
                {bugSubmitMessage}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBugDialog(false);
                setBugDescription("");
                setBugSubmitMessage("");
              }}
              disabled={isSubmittingBug}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBugSubmit}
              disabled={isSubmittingBug || !bugDescription.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmittingBug ? "Sending..." : "Send Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}