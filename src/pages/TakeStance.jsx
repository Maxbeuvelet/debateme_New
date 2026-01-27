import React, { useState, useEffect, useCallback } from "react";
import { Debate, UserStance, User, DebateSession } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Clock, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

import { matchDebater } from "@/functions/matchDebater";

import StanceSelector from "../components/stance/StanceSelector";
import WaitingForMatch from "../components/stance/WaitingForMatch";

export default function TakeStance() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const debateId = urlParams.get('id');
  const inviteCode = urlParams.get('invite');
  
  const [debate, setDebate] = useState(null);
  const [userStances, setUserStances] = useState([]);
  const [currentUserStance, setCurrentUserStance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isPrivateDebate, setIsPrivateDebate] = useState(false);

  const loadDebateData = useCallback(async () => {
    setIsLoading(true);
    
    // Try to get logged in user, but don't require it
    let user = null;
    try {
      user = await User.me();
      
      // If user doesn't have a username, redirect to setup
      if (user && !user.username) {
        navigate(createPageUrl("SetupProfile"));
        return;
      }
    } catch (error) {
      // User not logged in - that's okay, generate anonymous username
      const randomId = Math.random().toString(36).substring(2, 8);
      user = {
        id: `guest_${randomId}`,
        username: `Guest${randomId}`,
        email: null
      };
    }
    
    setCurrentUser(user);
    
    try {
      // Load all data first
      const [allDebates, allStances, allSessions] = await Promise.all([
        Debate.list(),
        UserStance.list(),
        DebateSession.list()
      ]);
      
      // Find debate by ID or invite code
      let debateData;
      let actualDebateId = debateId;
      
      if (inviteCode) {
        console.log("Looking for debate with invite code:", inviteCode);
        
        // Try exact match with trimming and case-insensitive comparison
        debateData = allDebates.find(d => 
          d.invite_code && 
          d.invite_code.trim().toUpperCase() === inviteCode.trim().toUpperCase() && 
          d.is_private === true
        );
        
        console.log("Found debate:", debateData);
        
        if (!debateData) {
          console.error("No debate found with invite code:", inviteCode);
          alert("Invalid invite link. The debate may not exist or has been deleted.");
          navigate(createPageUrl("CreateDebate"));
          return;
        }
        
        // Check if debate is still active
        if (debateData.status !== "active") {
          alert("This debate has ended.");
          navigate(createPageUrl("CreateDebate"));
          return;
        }
        actualDebateId = debateData.id;
        setIsPrivateDebate(true);
        
        // For private debates via invite, auto-join the person to opposite position of creator
        const creatorStance = allStances.find(s => s.debate_id === actualDebateId && s.status === "waiting");
        
        if (creatorStance && creatorStance.user_id !== user.id) {
          console.log("Auto-joining private debate as opposite position");
          // Auto-join as the opposite position
          const oppositePosition = creatorStance.position === "position_a" ? "position_b" : "position_a";
          
          const newStance = await UserStance.create({
            debate_id: actualDebateId,
            user_name: user.username,
            user_id: user.id,
            position: oppositePosition,
            status: "waiting"
          });
          
          console.log("Created stance:", newStance);
          
          // Update user stats
          const categoryStats = user.category_stats || {};
          const category = debateData.category;
          categoryStats[category] = (categoryStats[category] || 0) + 1;
          
          await User.updateMyUserData({
            debates_joined: (user.debates_joined || 0) + 1,
            category_stats: categoryStats
          });
          
          console.log("Attempting to match with debate ID:", actualDebateId);
          
          // Try to match immediately - pass the debate ID directly
          const matchResponse = await matchDebater({ 
            debateId: actualDebateId, 
            stanceId: newStance.id 
          });
          
          console.log("Match response:", matchResponse);
          
          if (matchResponse.data.matched) {
            console.log("Matched! Navigating to debate session");
            // Successfully matched! Navigate to debate
            navigate(createPageUrl(`VoiceDebate?id=${matchResponse.data.sessionId}&user=${encodeURIComponent(user.username)}`));
            return;
          } else {
            console.log("Not matched yet, showing waiting screen");
          }
        } else if (creatorStance && creatorStance.user_id === user.id) {
          console.log("User is the creator, will show waiting screen");
        } else {
          console.log("No creator stance found yet");
        }
      } else if (debateId) {
        debateData = allDebates.find(d => d.id === debateId);
        actualDebateId = debateId;
      }
      
      // Set debate data early so it's available for all operations
      setDebate(debateData);
      
      // STEP 1: Find ALL stances by this user for this debate (match by user_id for both logged-in and guest users)
      const myStancesForThisDebate = allStances.filter(s => 
        s.debate_id === actualDebateId && s.user_id === user.id
      );
      
      // STEP 2: Check for active sessions first, or recent waiting stances
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      let foundActiveOrWaiting = false;
      
      for (const stance of myStancesForThisDebate) {
        if (stance.session_id) {
          const session = allSessions.find(s => s.id === stance.session_id);
          
          if (session && session.status === "active") {
            console.log(`User ${user.id} found in active session ${stance.session_id}. Redirecting.`);
            navigate(createPageUrl(`VoiceDebate?id=${stance.session_id}&user=${encodeURIComponent(user.username)}`));
            setIsLoading(false); 
            return;
          }
        }
        
        // Check for recent waiting stances (created in the last minute)
        if (stance.status === "waiting" && new Date(stance.created_date) > oneMinuteAgo) {
          console.log(`User ${user.id} has recent waiting stance. Showing waiting screen.`);
          setCurrentUserStance(stance);
          foundActiveOrWaiting = true;
          break;
        }
      }
      
      // STEP 3: Delete old stances if no active/recent waiting stance found
      if (!foundActiveOrWaiting) {
        // Only delete stances that are older than 1 minute
        const stancesToDelete = myStancesForThisDebate.filter(s => 
          new Date(s.created_date) <= oneMinuteAgo
        );

        for (const stance of stancesToDelete) {
          await UserStance.delete(stance.id);
        }

        // If no active session or recent waiting stance found, ensure currentUserStance is null
        setCurrentUserStance(null);
      }
      
      // STEP 4: Get recent stances from OTHER users (for display in StanceSelector/WaitingForMatch)
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const recentOtherUserWaitingStances = allStances.filter(stance => 
        stance.debate_id === actualDebateId &&
        stance.user_id !== user.id && // Exclude current user's stances
        new Date(stance.updated_date) > tenMinutesAgo &&
        stance.status === "waiting" // Only show waiting stances
      );
      
      setUserStances(recentOtherUserWaitingStances);
      
    } catch (error) {
      console.error("Error loading debate data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [debateId, inviteCode, navigate]);

  useEffect(() => {
    if (debateId || inviteCode) {
      loadDebateData();
    }
  }, [debateId, inviteCode, loadDebateData]);

  const tryMatch = useCallback(async (stanceId) => {
    try {
      const actualDebateId = debate?.id;
      if (!actualDebateId) {
        console.error("No debate ID for matching");
        return false;
      }

      const response = await matchDebater({ 
        debateId: actualDebateId, 
        stanceId: stanceId 
      });
      
      if (response.data.matched) {
        // Successfully matched! Navigate to debate
        navigate(createPageUrl(`VoiceDebate?id=${response.data.sessionId}&user=${encodeURIComponent(response.data.userName)}`));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error trying to match:", error);
      if (error.response && error.response.status === 404 && error.response.data && error.response.data.stanceDeleted) {
        // Propagate this specific error for the polling mechanism to handle
        throw { response: { data: { stanceDeleted: true } } };
      }
      return false;
    }
  }, [debateId, navigate]);

  const calculateXpForNextLevel = (currentLevel) => {
    return currentLevel * 100;
  };

  const awardXpAndCheckLevelUp = useCallback(async (xpToAdd) => {
    if (!currentUser) return;

    let newXp = (currentUser.xp || 0) + xpToAdd;
    let updatedLevel = currentUser.level || 1;

    // Keep leveling up until XP is below the requirement
    while (true) {
      const xpNeededForNextLevel = calculateXpForNextLevel(updatedLevel);
      
      if (newXp >= xpNeededForNextLevel) {
        updatedLevel = updatedLevel + 1;
        newXp = newXp - xpNeededForNextLevel;
      } else {
        break;
      }
    }

    await User.updateMyUserData({
      xp: newXp,
      level: updatedLevel
    });
    
    // Update currentUser state locally as well
    setCurrentUser(prevUser => ({
      ...prevUser,
      xp: newXp, 
      level: updatedLevel
    }));
  }, [currentUser]);

  const handleBackFromWaiting = async () => {
    if (!currentUserStance || !debate) return;
    
    try {
      // Check if this is a user-created debate and user is the only one waiting
      const isUserCreated = debate.is_user_created;
      const otherWaitingUsers = userStances.length; // userStances only contains OTHER users' stances
      
      if (isUserCreated && otherWaitingUsers === 0) {
        // User is the creator and the only one waiting - delete everything
        console.log("Deleting user-created debate with no other users waiting");
        
        // Delete the stance
        await UserStance.delete(currentUserStance.id);
        console.log("Deleted stance:", currentUserStance.id);
        
        // Delete the debate
        await Debate.delete(debate.id);
        console.log("Deleted debate:", debate.id);
        
        // Wait a moment to ensure deletions propagate
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Navigate back with a refresh parameter to force reload
        window.location.href = createPageUrl("CreateDebate");
      } else {
        // Just delete the stance - either not user-created or others are waiting
        console.log("Just deleting stance, not the debate");
        await UserStance.delete(currentUserStance.id);
        setCurrentUserStance(null);
        loadDebateData();
      }
    } catch (error) {
      console.error("Error handling back:", error);
      // Even if there's an error, navigate away
      window.location.href = createPageUrl("CreateDebate");
    }
  };

  const handleTakeStance = async (position) => {
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      // Get actual debate ID (handles both direct ID and invite code)
      const actualDebateId = debate?.id;
      if (!actualDebateId) {
        console.error("No debate ID found");
        return;
      }

      // Create stance for human opponent matching
      const newStance = await UserStance.create({
        debate_id: actualDebateId,
        user_name: currentUser.username,
        user_id: currentUser.id,
        position: position,
        status: "waiting"
      });

      // Update user stats only if logged in
      if (currentUser.email) {
        const categoryStats = currentUser.category_stats || {};
        const category = debate.category;
        categoryStats[category] = (categoryStats[category] || 0) + 1;

        await User.updateMyUserData({
          debates_joined: (currentUser.debates_joined || 0) + 1,
          category_stats: categoryStats
        });
        setCurrentUser(prevUser => ({
          ...prevUser,
          debates_joined: (prevUser.debates_joined || 0) + 1,
          category_stats: categoryStats
        }));
      }

      // Try to match immediately
      const matched = await tryMatch(newStance.id);

      if (matched && currentUser.email) {
        // Award XP for joining a debate (50 XP) - only for logged in users
        await awardXpAndCheckLevelUp(50);
      }
      
      if (!matched) {
        setCurrentUserStance(newStance);
      }

    } catch (error) {
      console.error("Error taking stance:", error);
    }
    setIsSubmitting(false);
  };

  const handleTopBackButton = async () => {
    // If user is waiting for a match, handle cleanup before navigating
    if (currentUserStance && debate) {
      await handleBackFromWaiting();
    } else {
      // Otherwise just navigate normally
      if (debate?.category) {
        navigate(createPageUrl(`CategoryTopics?category=${debate.category}`));
      } else {
        navigate(createPageUrl("Home"));
      }
    }
  };

  // Poll for matches when waiting - with exponential backoff for efficiency
  useEffect(() => {
    if (!currentUserStance) return;

    let pollInterval = 1500; // Start with 1.5 seconds
    let attempts = 0;
    let timeoutId;

    const pollForMatch = async () => {
      try {
        const matched = await tryMatch(currentUserStance.id);
        if (matched) {
          // Award XP for joining a debate (50 XP) - only if matched and logged in
          if (currentUser?.email) {
            await awardXpAndCheckLevelUp(50);
          }
          return; // Stop polling
        }
        
        // Increase interval slightly after each attempt (max 4 seconds)
        attempts++;
        if (attempts > 3 && pollInterval < 4000) {
          pollInterval = Math.min(pollInterval + 500, 4000);
        }
        
        // Schedule next poll
        timeoutId = setTimeout(pollForMatch, pollInterval);
      } catch (error) {
        console.error("Error during match polling:", error);
        // If stance was deleted, reload the page
        if (error.response?.data?.stanceDeleted) {
          console.log("Stance was deleted, reloading debate data");
          setCurrentUserStance(null);
          await loadDebateData();
          return;
        }
        
        // Retry on error after a brief delay
        timeoutId = setTimeout(pollForMatch, 2000);
      }
    };

    // Start polling immediately
    pollForMatch();
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentUserStance, tryMatch, awardXpAndCheckLevelUp, loadDebateData, currentUser]);

  if (!debateId && !inviteCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Debate not found</h1>
          <Button onClick={() => navigate(createPageUrl("Home"))}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading debate topic...</p>
        </div>
      </div>
    );
  }

  // If loading is done but no debate was found (e.g., invalid ID)
  if (!debate && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Debate not found</h1>
          <Button onClick={() => navigate(createPageUrl("Home"))}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Calculate participant counts including the current user's waiting stance if applicable
  const participantCounts = userStances.reduce((acc, stance) => {
    acc[stance.position] = (acc[stance.position] || 0) + 1;
    return acc;
  }, {});

  let totalParticipants = userStances.length;
  let totalWaiting = userStances.length; // userStances already filtered for 'waiting'

  if (currentUserStance && currentUserStance.status === "waiting") {
    participantCounts[currentUserStance.position] = (participantCounts[currentUserStance.position] || 0) + 1;
    totalParticipants += 1;
    totalWaiting += 1;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handleTopBackButton}
              className="rounded-full border-slate-300 hover:bg-slate-100 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-semibold text-slate-900 truncate">
                Back to Topics
              </h1>
            </div>
          </div>

          {/* Debate Topic Header */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            {isPrivateDebate && (
              <div className="mb-3 flex items-center gap-2">
                <Badge className="bg-cyan-100 text-cyan-800 border-cyan-300">
                  <Lock className="w-3 h-3 mr-1" />
                  Private Debate
                </Badge>
              </div>
            )}
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">
              {debate.title}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed mb-4 sm:mb-6">
              {debate.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{totalParticipants} participants</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{totalWaiting} waiting for matches</span>
              </div>
            </div>
          </div>

          {currentUserStance ? (
            <WaitingForMatch 
              stance={currentUserStance}
              debate={debate}
              participantCounts={participantCounts}
              onBack={handleBackFromWaiting}
            />
          ) : (
            <StanceSelector
              debate={debate}
              participantCounts={participantCounts}
              userName={currentUser?.username}
              onTakeStance={handleTakeStance}
              isSubmitting={isSubmitting}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}