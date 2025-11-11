
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { AlertCircle, UserCircle } from "lucide-react";

// List of inappropriate words to filter
const inappropriateWords = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'hell', 'crap', 'dick', 'pussy', 'cock',
  'nigga', 'nigger', 'fag', 'faggot', 'whore', 'slut', 'bastard', 'piss', 'cunt'
];

const containsInappropriateContent = (name) => {
  const lowerName = name.toLowerCase();
  return inappropriateWords.some(word => lowerName.includes(word));
};

export default function SetupProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // If user already has a username, redirect to home
      if (currentUser.username) {
        navigate(createPageUrl("Home"));
        return;
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking user:", error);
      // User not logged in, redirect to login with return URL
      await User.loginWithRedirect(window.location.href);
    }
  };

  const validateUsername = (name) => {
    if (!name.trim()) {
      setNameError("");
      return false;
    }
    
    if (name.trim().length < 3) {
      setNameError("Username must be at least 3 characters");
      return false;
    }
    
    if (name.trim().length > 20) {
      setNameError("Username must be less than 20 characters");
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      setNameError("Username can only contain letters, numbers, and underscores");
      return false;
    }
    
    if (containsInappropriateContent(name)) {
      setNameError("Please use an appropriate username");
      return false;
    }
    
    setNameError("");
    return true;
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value.trim()) {
      validateUsername(value);
    } else {
      setNameError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !validateUsername(username) || !user) return;

    setIsSubmitting(true);
    try {
      await User.updateMyUserData({
        username: username.trim(),
        xp: 0,
        level: 1,
        debates_joined: 0,
        debates_completed: 0,
        total_debate_time_minutes: 0,
        category_stats: {}
      });
      
      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Error setting up profile:", error);
      setNameError("Failed to save username. Please try again.");
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
          <CardHeader className="text-center p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-black text-white mb-2">
              Welcome to DebateMe!
            </CardTitle>
            <p className="text-slate-300">
              Choose a username to get started
            </p>
          </CardHeader>
          
          <CardContent className="p-8 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-lg font-semibold text-white">
                  Choose Your Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter a unique username"
                  className="h-12 text-lg bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500"
                  required
                  maxLength={20}
                />
                {nameError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{nameError}</span>
                  </div>
                )}
                <p className="text-sm text-slate-400">
                  This will be your display name in debates. Choose wisely!
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !username.trim() || !!nameError}
                className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white font-semibold text-lg shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up...
                  </div>
                ) : (
                  "Continue to DebateMe"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
