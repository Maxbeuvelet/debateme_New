import React, { useState, useEffect } from "react";
import { Debate, UserStance, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { PlusCircle, AlertCircle, Users, Clock, Filter, Sparkles, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import LaunchCountdown from "../components/home/LaunchCountdown";

// List of inappropriate words to filter
const inappropriateWords = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'hell', 'crap', 'dick', 'pussy', 'cock',
  'nigga', 'nigger', 'fag', 'faggot', 'whore', 'slut', 'bastard', 'piss', 'cunt'
];

const containsInappropriateContent = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return inappropriateWords.some(word => lowerText.includes(word));
};

const categoryLabels = {
  all: "All Categories",
  politics: "Politics",
  technology: "Technology",
  environment: "Environment",
  economics: "Economics"
};

const categoryColors = {
  politics: {
    selected: "bg-gradient-to-r from-gray-400 to-gray-600 text-black hover:from-gray-500 hover:to-gray-700 hover:text-black",
    unselected: "border-gray-400 text-black hover:bg-gray-700 hover:border-gray-500 hover:text-black"
  },
  technology: {
    selected: "bg-gradient-to-r from-blue-400 to-blue-600 text-black hover:from-blue-500 hover:to-blue-700 hover:text-black",
    unselected: "border-blue-400 text-blue-300 hover:bg-blue-700 hover:border-blue-500 hover:text-white"
  },
  environment: {
    selected: "bg-gradient-to-r from-emerald-400 to-emerald-600 text-black hover:from-emerald-500 hover:to-emerald-700 hover:text-black",
    unselected: "border-emerald-400 text-emerald-300 hover:bg-emerald-700 hover:border-emerald-500 hover:text-white"
  },
  economics: {
    selected: "bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:from-amber-500 hover:to-amber-700 hover:text-black",
    unselected: "border-amber-400 text-amber-300 hover:bg-amber-700 hover:border-amber-500 hover:text-white"
  }
};

export default function CreateDebate() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debates, setDebates] = useState([]);
  const [userStances, setUserStances] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Launch date: Friday, January 3rd, 2026 at 6pm
  const LAUNCH_DATE = new Date(2026, 0, 3, 18, 0, 0).getTime(); // year, month (0=Jan), day, hour, min, sec
  const isLaunched = new Date().getTime() >= LAUNCH_DATE;
  
  // Form state
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userStance, setUserStance] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [userStanceError, setUserStanceError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLaunched) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [isLaunched]);

  // Add effect to reload data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also reload when window gets focus
    window.addEventListener('focus', loadData);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', loadData);
    };
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      if (user && !user.username) {
        navigate(createPageUrl("SetupProfile"));
        return;
      }
      setCurrentUser(user);

      const [debatesData, stancesData] = await Promise.all([
        Debate.filter({ status: "active", is_user_created: true }, "-created_date"),
        UserStance.list("-created_date")
      ]);

      setDebates(debatesData);
      
      // Filter to recent waiting stances
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const recentStances = stancesData.filter(stance => 
        new Date(stance.created_date) > tenMinutesAgo &&
        stance.status === "waiting"
      );
      
      setUserStances(recentStances);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (value, fieldName) => {
    if (!value.trim()) {
      return `${fieldName} cannot be empty.`;
    }
    if (containsInappropriateContent(value)) {
      return `Please use appropriate language in the ${fieldName.toLowerCase()}.`;
    }
    return "";
  };

  const handleCreateDebate = async (e) => {
    e.preventDefault();
    setFormError("");

    const titleValidation = validateField(title, "Title");
    const descriptionValidation = validateField(description, "Description");
    const userStanceValidation = validateField(userStance, "Your Stance");

    if (titleValidation) setTitleError(titleValidation); else setTitleError("");
    if (descriptionValidation) setDescriptionError(descriptionValidation); else setDescriptionError("");
    if (userStanceValidation) setUserStanceError(userStanceValidation); else setUserStanceError("");

    if (titleValidation || descriptionValidation || userStanceValidation || !category) {
      setFormError("Please correct the errors in the form.");
      return;
    }
    if (!currentUser) {
      setFormError("You must be logged in to create a debate.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newDebate = await Debate.create({
        title: title.trim(),
        description: description.trim(),
        category: category,
        position_a: userStance.trim(),
        position_b: "Opposing view",
        status: "active",
        is_user_created: true
      });

      await UserStance.create({
        debate_id: newDebate.id,
        user_id: currentUser.id,
        user_name: currentUser.username,
        position: "position_a",
        status: "waiting"
      });

      // Update user's debates_created count and award XP (50 XP for first debate created)
      const debatesCreated = (currentUser.debates_created || 0) + 1;
      const isFirstDebate = debatesCreated === 1;
      
      // Award XP if this is their first debate
      if (isFirstDebate) {
        const currentXp = currentUser.xp || 0;
        const currentLevel = currentUser.level || 1;
        let newXp = currentXp + 50; // Award 50 XP for creating first debate
        let newLevel = currentLevel;
        
        // Check for level up
        const xpForNextLevel = currentLevel * 100;
        if (newXp >= xpForNextLevel) {
          newLevel = currentLevel + 1;
          newXp = newXp - xpForNextLevel;
        }
        
        await User.updateMyUserData({
          debates_created: debatesCreated,
          xp: newXp,
          level: newLevel
        });
      } else {
        await User.updateMyUserData({
          debates_created: debatesCreated
        });
      }

      // Reset form and close dialog
      setTitle("");
      setDescription("");
      setUserStance("");
      setCategory("");
      setShowCreateDialog(false);
      
      // Reload data to show new debate
      await loadData();

      // Navigate to the debate
      navigate(createPageUrl(`TakeStance?id=${newDebate.id}`));

    } catch (error) {
      console.error("Error creating debate:", error);
      setFormError("Failed to create debate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinDebate = async (debate) => {
    if (!currentUser) {
      alert("Please log in to join a debate");
      return;
    }

    try {
      // Create stance for opposing position (position_b since creator is always position_a)
      const newStance = await UserStance.create({
        debate_id: debate.id,
        user_id: currentUser.id,
        user_name: currentUser.username,
        position: "position_b",
        status: "waiting"
      });

      // Update user stats
      const categoryStats = currentUser.category_stats || {};
      const category = debate.category;
      categoryStats[category] = (categoryStats[category] || 0) + 1;
      
      await User.updateMyUserData({
        debates_joined: (currentUser.debates_joined || 0) + 1,
        category_stats: categoryStats
      });

      // Navigate to take stance page which will try to match
      navigate(createPageUrl(`TakeStance?id=${debate.id}`));
    } catch (error) {
      console.error("Error joining debate:", error);
    }
  };

  const filteredDebates = selectedCategory === "all" 
    ? debates 
    : debates.filter(d => d.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-600 border-t-slate-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If not launched yet, show coming soon page
  if (!isLaunched) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Animated background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">Coming Soon</span>
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Create Your Own Debates
              </span>
            </motion.h1>

            {/* Launch Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Launch Day: Friday, January 3rd at 7pm
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 mb-6 leading-relaxed">
                Soon you'll be able to create your own debate topics and<br className="hidden sm:block" />
                <span className="text-purple-400 font-semibold"> challenge others in live video debates</span>
              </p>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <LaunchCountdown launchDate={LAUNCH_DATE} />
            </motion.div>

            {/* Preview of Create Debate Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.2)] relative overflow-hidden">
                {/* Overlay to indicate disabled */}
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-xl font-bold text-white">Available Jan 3rd at 6pm</p>
                  </div>
                </div>

                {/* Preview Form (disabled look) */}
                <div className="space-y-6 opacity-50">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Create Your Debate</h3>
                  </div>

                  <div>
                    <Label className="text-slate-300 mb-2 block">Select Category</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(categoryLabels).filter(([key]) => key !== "all").map(([key, label]) => (
                        <div key={key} className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-300">
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300 mb-2 block">Debate Title</Label>
                    <div className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-500">
                      Should pineapple be allowed on pizza?
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300 mb-2 block">Description</Label>
                    <div className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-500 min-h-[100px]">
                      Provide context and details for your debate topic...
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300 mb-2 block">Your Stance</Label>
                    <div className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-500 min-h-[80px]">
                      State your position on the debate...
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="px-8 py-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg text-white font-semibold">
                      Create Debate
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Discord Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mb-6"
            >
              <a
                href="https://discord.gg/aXQevrYxBm"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-block"
              >
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                  </svg>
                  Join Our Discord Community
                </button>
              </a>
            </motion.div>

            {/* Footer text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-slate-500 text-sm"
            >
              <p>
                Join our community and be ready to create debates on launch day!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header with Create Button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent pb-2 leading-tight">
                Browse Debates
              </h1>
              <p className="text-xl text-slate-300 mt-2">
                Join an existing debate or create your own
              </p>
            </div>
            
            <Button
              onClick={() => {
                if (!currentUser) {
                  alert("Please log in to create a debate");
                  return;
                }
                setShowCreateDialog(true);
              }}
              className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-semibold text-lg py-6 px-8 rounded-lg shadow-lg"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              CREATE
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">FILTER:</span>
            </div>
            {Object.entries(categoryLabels).map(([key, label]) => {
              if (key === "all") {
                return (
                  <Button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    variant={selectedCategory === key ? "default" : "outline"}
                    className={selectedCategory === key 
                      ? "bg-cyan-600 text-black hover:bg-cyan-700 hover:text-black border-cyan-600 font-bold" 
                      : "border-slate-400 text-white hover:bg-slate-700 hover:border-cyan-500"
                    }
                  >
                    {label}
                  </Button>
                );
              }
              
              const colors = categoryColors[key];
              return (
                <Button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  variant={selectedCategory === key ? "default" : "outline"}
                  className={selectedCategory === key 
                    ? `${colors.selected} font-bold border-0` 
                    : colors.unselected
                  }
                >
                  {label}
                </Button>
              );
            })}
          </div>

          {/* Debates List */}
          <div className="space-y-3">
            {filteredDebates.length === 0 ? (
              <Card className="bg-slate-800/60 backdrop-blur-md border-slate-600">
                <CardContent className="p-12 text-center">
                  <PlusCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {selectedCategory === "all" ? "No Debates Yet" : "No Debates in This Category"}
                  </h3>
                  <p className="text-slate-300 mb-4">
                    {selectedCategory === "all" 
                      ? "Be the first to create a debate and start a discussion!" 
                      : `Be the first to create a ${categoryLabels[selectedCategory].toLowerCase()} debate!`
                    }
                  </p>
                  <Button 
                    onClick={() => {
                      if (!currentUser) {
                        alert("Please log in to create a debate");
                        return;
                      }
                      setShowCreateDialog(true);
                    }}
                    className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700"
                  >
                    Create Debate
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredDebates.map((debate, index) => {
                const debateStances = userStances.filter(s => s.debate_id === debate.id);
                const waiting = debateStances.length;
                const creator = debateStances[0]; // First stance is the creator

                return (
                  <motion.div
                    key={debate.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="group bg-slate-800/80 backdrop-blur-md border-slate-600 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4">
                          {/* Header Row: Title + Category + Join Button */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-lg font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                                  {debate.title}
                                </h3>
                                <Badge variant="outline" className="border-slate-500 text-slate-300 flex-shrink-0">
                                  {categoryLabels[debate.category]}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-300 mb-2">
                                {debate.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                                {creator && (
                                  <span className="font-medium">
                                    Created by @{creator.user_name}
                                  </span>
                                )}
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{waiting} waiting</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>Active</span>
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                handleJoinDebate(debate);
                              }}
                              className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg flex-shrink-0"
                            >
                              Join Debate
                            </Button>
                          </div>

                          {/* Creator's Stance */}
                          <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-lg px-4 py-3">
                            <div className="text-xs text-emerald-400 mb-1">Creator's Stance</div>
                            <div className="text-sm font-medium text-emerald-200">
                              {debate.position_a}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* Create Debate Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Create New Debate</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateDebate} className="space-y-6 mt-4">
            <div>
              <Label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(categoryLabels).filter(([key]) => key !== "all").map(([key, label]) => {
                  const colors = categoryColors[key];
                  return (
                    <Button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      variant={category === key ? "default" : "outline"}
                      className={category === key 
                        ? `${colors.selected} font-bold border-0` 
                        : `${colors.unselected} font-medium`
                      }
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
              {!category && formError && (
                <p className="text-sm text-red-400 mt-2">Please select a category.</p>
              )}
            </div>

            <div>
              <Label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">Debate Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTitleError(validateField(e.target.value, "Title"));
                }}
                placeholder="e.g., Should pineapple be allowed on pizza?"
                className="w-full bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                maxLength={100}
              />
              {titleError && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{titleError}</span>
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1">{title.length}/100 characters</p>
            </div>

            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setDescriptionError(validateField(e.target.value, "Description"));
                }}
                placeholder="Provide more context or details for the debate..."
                className="w-full min-h-[100px] bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                maxLength={500}
              />
              {descriptionError && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{descriptionError}</span>
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1">{description.length}/500 characters</p>
            </div>

            <div>
              <Label htmlFor="userStance" className="block text-sm font-medium text-slate-300 mb-2">Your Stance</Label>
              <Textarea
                id="userStance"
                value={userStance}
                onChange={(e) => {
                  setUserStance(e.target.value);
                  setUserStanceError(validateField(e.target.value, "Your Stance"));
                }}
                placeholder="e.g., 'Pineapple on pizza is a culinary masterpiece!'"
                className="w-full min-h-[80px] bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                maxLength={200}
              />
              {userStanceError && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{userStanceError}</span>
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1">{userStance.length}/200 characters</p>
              <p className="text-xs text-slate-400 mt-2">
                💡 Tip: Others who join will automatically take the opposing view
              </p>
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !category || titleError || descriptionError || userStanceError || !title.trim() || !description.trim() || !userStance.trim()}
                className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Debate
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}