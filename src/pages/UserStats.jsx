import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle }
  from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trophy, Clock, Users, TrendingUp, BarChart3, ArrowLeft, Zap, Star, Hexagon, Shield, Gem, Eye, Flame, Crown, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const categoryLabels = {
  politics: "Politics",
  technology: "Technology",
  environment: "Environment",
  economics: "Economics"
};

const categoryEmojis = {
  politics: "🏛️",
  technology: "💻",
  environment: "🌍",
  economics: "💰"
};

const categoryColors = {
  politics: "bg-gray-600",
  technology: "bg-blue-600",
  environment: "bg-green-600",
  economics: "bg-yellow-600"
};

// Level tier system
const getLevelTier = (level) => {
  if (level >= 70) {
    return {
      name: "Paragon",
      material: "Obsidian",
      icon: Crown,
      gradient: "",
      bgGradient: "",
      glow: "shadow-[0_0_50px_rgba(34,211,238,0.6)]",
      textColor: "text-cyan-400",
      description: "Legendary rank. Debating deity.",
      animation: {
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 1],
        y: [0, -5, 0]
      },
      customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/e707f104e_ranksilver.png"
    };
  } else if (level >= 60) {
    return {
      name: "Luminary",
      material: "Mythic",
      icon: Flame,
      gradient: "from-amber-500 via-yellow-500 to-orange-500",
      bgGradient: "from-amber-500/20 via-yellow-500/20 to-orange-500/20",
      glow: "shadow-[0_0_45px_rgba(251,191,36,0.5)]",
      textColor: "text-amber-300",
      description: "You don't argue—you inspire.",
      animation: {
        scale: [1, 1.2, 0.9, 1.1, 1],
        opacity: [1, 0.8, 1]
      },
      customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/83e5f6f36_rankgold.png"
    };
  } else if (level >= 50) {
    return {
      name: "Visionary",
      material: "Diamond",
      icon: Eye,
      gradient: "from-purple-400 via-purple-500 to-purple-600",
      bgGradient: "from-purple-500/20 via-purple-600/20 to-purple-700/20",
      glow: "shadow-[0_0_40px_rgba(168,85,247,0.4)]",
      textColor: "text-purple-300",
      description: "Insightful, transcendent thinker.",
      animation: {
        rotate: [0, 360],
        scale: [1, 1.15, 1]
      },
      customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/a139614f3_ranksilverpurple.png"
    };
  } else if (level >= 40) {
    return {
      name: "Philosopher",
      material: "Emerald",
      icon: Gem,
      gradient: "from-emerald-400 via-green-500 to-emerald-600",
      bgGradient: "from-emerald-500/20 via-green-500/20 to-emerald-600/20",
      glow: "shadow-[0_0_40px_rgba(16,185,129,0.4)]",
      textColor: "text-emerald-300",
      description: "Precision and calm control.",
      animation: {
        y: [0, -8, 0],
        rotate: [0, 3, -3, 0]
      },
      customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/cdc86a441_ranksilverblue.png"
    };
  } else if (level >= 30) {
    return {
      name: "Orator",
      material: "Gold",
      icon: Star,
      gradient: "from-orange-400 via-orange-500 to-orange-600",
      bgGradient: "from-orange-500/20 via-orange-600/20 to-red-600/20",
      glow: "shadow-[0_0_40px_rgba(249,115,22,0.4)]",
      textColor: "text-orange-300",
      description: "Confident, loud, eloquent.",
      animation: {
        rotate: [0, 180, 360],
        scale: [1, 1.2, 1]
      },
      customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/eb077c24e_rankbronze1.png"
    };
  } else if (level >= 20) {
    return {
      name: "Tactician",
      material: "Silver",
      icon: Zap,
      gradient: "from-yellow-400 via-amber-400 to-yellow-500",
      bgGradient: "from-yellow-500/20 via-amber-500/20 to-yellow-600/20",
      glow: "shadow-[0_0_35px_rgba(234,179,8,0.35)]",
      textColor: "text-yellow-300",
      description: "Sharp logic forming, sleek aesthetic.",
      animation: {
        rotate: [0, -10, 10, -5, 5, 0],
        scale: [1, 1.1, 1]
      },
      customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/21cc5a6d2_standartrankgold1.png"
    };
  } else if (level >= 10) {
    return {
      name: "Apprentice",
      material: "Bronze",
      icon: Shield,
      gradient: "from-slate-300 via-slate-400 to-slate-500",
      bgGradient: "from-slate-400/20 via-slate-500/20 to-slate-600/20",
      glow: "shadow-[0_0_30px_rgba(148,163,184,0.3)]",
      textColor: "text-slate-300",
      description: "Foundational skill, early respect.",
      animation: {
        y: [0, -5, 0],
        scale: [1, 1.05, 1]
      },
      customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/ed5a4b8bc_standartranksilver1.png"
    };
  } else {
    return {
      name: "Rookie",
      material: "Stone",
      icon: Hexagon,
      gradient: "from-amber-600 via-orange-600 to-amber-700",
      bgGradient: "from-amber-600/20 via-orange-600/20 to-amber-700/20",
      glow: "shadow-[0_0_20px_rgba(217,119,6,0.2)]",
      textColor: "text-amber-400",
      description: "Raw, unrefined, just entered the arena.",
      animation: {
        rotate: [0, 2, -2, 0]
      },
      customImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68da9d2bed6a011bee1c2750/8d99511b8_standartrankbronze.png"
    };
  }
};

export default function UserStats() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const usernameParam = urlParams.get('username');

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadUserStats();
  }, [usernameParam]);

  const loadUserStats = async () => {
    setIsLoading(true);
    try {
      const currentUser = await base44.auth.me();

      if (!currentUser.username) {
        navigate(createPageUrl("SetupProfile"));
        return;
      }

      // If no username parameter or it's the current user's username, show own profile
      if (!usernameParam || usernameParam === currentUser.username) {
        setUser(currentUser);
        setIsOwnProfile(true);
      } else {
        // Fetch the other user's data using backend function
        const response = await base44.functions.invoke('getUserByUsername', {
          username: usernameParam
        });

        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          setIsOwnProfile(false);
        } else {
          // User not found, redirect to own profile
          navigate(createPageUrl("UserStats"));
        }
      }
    } catch (error) {
      console.error("Error loading user stats:", error);
      await base44.auth.loginWithRedirect(window.location.href);
    }
    setIsLoading(false);
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} mins`;
    }
    const hours = Math.floor(minutes / 60);
    return `${hours} hrs`;
  };

  const calculateXpForNextLevel = (level) => {
    return level * 100;
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await base44.functions.invoke('deleteAccount');
      await base44.auth.logout();
    } catch (error) {
      console.error("Error deleting account:", error);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const categoryStats = user.category_stats || {};
  const sortedCategories = Object.entries(categoryStats).sort(([, a], [, b]) => b - a);
  const maxCategoryValue = sortedCategories.length > 0 ? sortedCategories[0][1] : 1;

  const currentLevel = user.level || 1;
  const currentXp = user.xp || 0;
  const xpForNextLevel = calculateXpForNextLevel(currentLevel);
  const xpProgress = (currentXp / xpForNextLevel) * 100;

  const levelTier = getLevelTier(currentLevel);
  const TierIcon = levelTier.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-white">
                {isOwnProfile ? "Your Stats" : `${user.username}'s Stats`}
              </h1>
              <p className="text-xl text-slate-300 mt-2">@{user.username}</p>
            </div>
          </div>

          {/* Level & XP Progress Card */}
          <Card className={`bg-slate-900/90 backdrop-blur-xl border-slate-700/50 mb-8 ${levelTier.glow}`}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="relative w-20 h-20 rounded-2xl bg-transparent flex items-center justify-center shadow-lg overflow-hidden"
                    whileHover={levelTier.animation}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                  >
                    {levelTier.customImage ? (
                      <img
                        src={levelTier.customImage}
                        alt={levelTier.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <TierIcon className="w-10 h-10 text-white" />
                    )}

                    {/* Crack effect overlay for Rookie Stone */}
                    {currentLevel < 10 && (
                      <div className="absolute inset-0 rounded-2xl opacity-30 bg-[radial-gradient(circle_at_40%_60%,transparent_0%,transparent_45%,rgba(255,255,255,0.1)_45%,rgba(255,255,255,0.1)_47%,transparent_47%)]" />
                    )}
                    {currentLevel >= 70 && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: 'radial-gradient(circle at 30% 40%, rgba(220,38,38,0.3) 0%, transparent 70%)',
                        }}
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.div>
                  <div>
                    <div className={`text-sm font-bold ${levelTier.textColor} uppercase tracking-wider mb-1`}>
                      {levelTier.name}
                    </div>
                    <h2 className="text-4xl font-black text-white mb-1">Level {currentLevel}</h2>
                    <p className="text-slate-400 text-sm italic">{levelTier.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{currentXp} XP</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    {xpForNextLevel - currentXp} XP to Level {currentLevel + 1}
                  </p>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Progress to Level {currentLevel + 1}</span>
                  <span className="text-slate-300 font-semibold">{Math.round(xpProgress)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`bg-gradient-to-r ${levelTier.gradient} h-full rounded-full relative`}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0 XP</span>
                  <span>{xpForNextLevel} XP</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid - Overwatch Style */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Stats Cards */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-4xl font-black text-white mb-1">
                    {user.debates_joined || 0}
                  </div>
                  <div className="text-sm text-slate-400">
                    Debates Joined
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-black text-white mb-1">
                    {user.debates_completed || 0}
                  </div>
                  <div className="text-sm text-slate-400">
                    Debates Completed
                  </div>
                </CardContent>
              </Card>

              {/* Category Bars - Overwatch Style */}
              <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
                <CardHeader className="p-6 border-b border-slate-800">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
                    <BarChart3 className="w-5 h-5" />
                    Most Debated Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {sortedCategories.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-400">
                        No debates yet. Join your first debate to see stats!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedCategories.map(([category, count], index) => {
                        if (!categoryLabels[category]) return null;

                        const percentage = (count / maxCategoryValue) * 100;

                        return (
                          <motion.div
                            key={category}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{categoryEmojis[category]}</span>
                              <span className="font-semibold text-white uppercase tracking-wide">
                                {categoryLabels[category]}
                              </span>
                            </div>
                            <div className="relative h-8 bg-slate-800/50 rounded overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                                className={`h-full ${categoryColors[category]} flex items-center justify-end pr-3`}
                              >
                                <span className="text-white text-xs font-bold">{count}</span>
                              </motion.div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Time Debated Circle */}
            <div className="space-y-4">
              <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48 mb-6">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border-8 border-slate-800"></div>

                    {/* Progress Ring - Full Circle */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-cyan-500"
                      />
                    </svg>

                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Clock className="w-8 h-8 text-cyan-400 mb-2" />
                      <div className="text-4xl font-black text-white">
                        {formatTime(user.total_debate_time_minutes || 0)}
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                        Time in Debates
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-slate-400">Total Debate Time</p>
                  </div>
                </CardContent>
              </Card>

              {/* XP Info Card */}
              <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">How to Earn XP:</h3>
                  <div className="space-y-2 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>Join a debate: <strong className="text-white">+50 XP</strong></span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                      <Zap className="w-4 h-4 text-slate-500" />
                      <span>More ways coming soon...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delete Account Card - Only show for own profile */}
              {isOwnProfile && (
                <Card className="bg-red-900/20 backdrop-blur-xl border-red-800/50">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button
                      onClick={() => setShowDeleteDialog(true)}
                      variant="destructive"
                      size="sm"
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-900 border-red-800">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <AlertDialogTitle className="text-center text-xl text-white">
              Delete Account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-300">
              This will permanently delete your account, all your debates, stats, and achievements. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}