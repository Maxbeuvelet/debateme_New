
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
import { PlusCircle, AlertCircle, Users, Clock, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

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

export default function CreateDebate() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debates, setDebates] = useState([]);
  const [userStances, setUserStances] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
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
    loadData();
  }, []);

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
      if (!user.username) {
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
      await User.loginWithRedirect(window.location.href);
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

      // Update user's debates_created count
      await User.updateMyUserData({
        debates_created: (currentUser.debates_created || 0) + 1
      });

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
      await User.loginWithRedirect(window.location.href);
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
              onClick={() => setShowCreateDialog(true)}
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
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Button
                key={key}
                onClick={() => setSelectedCategory(key)}
                variant={selectedCategory === key ? "default" : "outline"}
                className={selectedCategory === key 
                  ? "bg-cyan-600 text-white hover:bg-cyan-700 border-cyan-600" 
                  : "border-slate-400 text-white hover:bg-slate-700 hover:border-cyan-500"
                }
              >
                {label}
              </Button>
            ))}
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
                  <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700">
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
                        <div className="flex items-center gap-4">
                          {/* Debate Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent truncate">
                                {debate.title}
                              </h3>
                              <Badge variant="outline" className="border-slate-500 text-slate-300 flex-shrink-0">
                                {categoryLabels[debate.category]}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-300 line-clamp-1 mb-2">
                              {debate.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
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

                          {/* Stance Preview and Join Button */}
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 text-right">
                              <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-lg px-4 py-2 min-w-[200px]">
                                <div className="text-xs text-emerald-400 mb-1">Creator's Stance</div>
                                <div className="text-sm font-medium text-emerald-200 line-clamp-2">
                                  {debate.position_a}
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                handleJoinDebate(debate);
                              }}
                              className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg"
                            >
                              Join Debate
                            </Button>
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
                {Object.entries(categoryLabels).filter(([key]) => key !== "all").map(([key, label]) => (
                  <Button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    variant={category === key ? "default" : "outline"}
                    className={category === key ? "bg-cyan-600 text-white hover:bg-cyan-700" : "border-slate-400 text-white hover:bg-slate-700 hover:border-cyan-500"}
                  >
                    {label}
                  </Button>
                ))}
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
                className="border-slate-400 text-white hover:bg-slate-700"
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
