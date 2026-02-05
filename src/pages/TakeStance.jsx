import React, { useState, useEffect, useCallback } from "react";
import { Debate, UserStance, User, DebateSession, SessionParticipant } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Clock, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";

import { matchDebater } from "@/functions/matchDebater";

import StanceSelector from "../components/stance/StanceSelector";
import WaitingForMatch from "../components/stance/WaitingForMatch";

export default function TakeStance() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const debateId = urlParams.get("id");
  const inviteCode = urlParams.get("invite");

  const [debate, setDebate] = useState(null);
  const [userStances, setUserStances] = useState([]);
  const [currentUserStance, setCurrentUserStance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isPrivateDebate, setIsPrivateDebate] = useState(false);

  const loadDebateData = useCallback(async () => {
    setIsLoading(true);

    // Resolve current user (prefer logged-in user; fall back to guest)
    let user = null;

    try {
      // Prefer User.me() directly; isAuthenticated() can be stale/laggy and incorrectly force guest mode
      user = await User.me();

      // If user doesn't have a username, redirect to setup
      if (user && !user.username) {
        navigate(createPageUrl("SetupProfile"));
        return;
      }

      // If logged in, clear any stale guest identity
      sessionStorage.removeItem("guestUser");
    } catch (e) {
      user = null;
    }

    if (!user) {
      // Guest fallback
      const existingGuest = sessionStorage.getItem("guestUser");
      if (existingGuest) {
        user = JSON.parse(existingGuest);
      } else {
        const randomId = Math.random().toString(36).substring(2, 8);
        user = {
          id: `guest_${randomId}`,
          username: `Guest${randomId}`,
          email: null,
        };
        sessionStorage.setItem("guestUser", JSON.stringify(user));
      }
    }

    setCurrentUser(user);

    try {
      // Load all needed data (no Debate.list())
      const [allStances, allSessions] = await Promise.all([
        UserStance.list(),
        DebateSession.list(),
      ]);

      // Find debate by ID or invite code
      let debateData;
      let actualDebateId = debateId;

      if (inviteCode) {
        console.log("Looking for debate with invite code:", inviteCode);
        
        // For private debates, use joinPrivateDebate backend function
        // This will be handled in the private debate flow below
        setIsPrivateDebate(true);
      } else if (debateId) {
        // Fetch single debate by ID
        debateData = await Debate.get(debateId);
        actualDebateId = debateId;
      }

      if (!debateData && !inviteCode) {
        alert("Debate not found.");
        navigate(createPageUrl("CreateDebate"));
        return;
      }

      // Handle private debate invite flow - auto-join immediately
      if (inviteCode) {
        try {
          const result = await base44.functions.invoke('joinPrivateDebate', {
            inviteCode: inviteCode
          });
          
          console.log('✅ Joined private debate:', result);
          
          // Navigate directly to the session
          navigate(createPageUrl(`VoiceDebate?session=${result.sessionId}&user=${user.username}`));
          return;
        } catch (error) {
          console.error('❌ Failed to join private debate:', error);
          alert(error.response?.data?.error || 'Failed to join private debate');
          navigate(createPageUrl('CreateDebate'));
          return;
        }
      }

      // Set debate data for non-private debates
      setDebate(debateData);

      // STEP 1: Find ALL stances by this user for this debate
      const myStancesForThisDebate = allStances.filter(
        (s) => s.debate_id === actualDebateId && s.user_id === user.id
      );

      // STEP 2: Check for active sessions first, or an existing queue stance
      // IMPORTANT:
      // - Do NOT delete stances client-side (it causes "queue resets")
      // - Private debates should honor waiting/matching regardless of age (server will clean up stale records)
      const isPrivate = !!debateData?.is_private;
      const recentTimeAgo = new Date(Date.now() - 10 * 60 * 1000); // used only for public debates display heuristics
      let foundActiveOrWaiting = false;

      for (const stance of myStancesForThisDebate) {
        if (stance.session_id) {
          const session = allSessions.find((s) => s.id === stance.session_id);

          if (session && session.status === "active") {
            console.log(
              `User ${user.id} found in active session ${stance.session_id}. Redirecting.`
            );
            navigate(
              createPageUrl(
                `VoiceDebate?id=${stance.session_id}&user=${encodeURIComponent(
                  user.username
                )}`
              )
            );
            setIsLoading(false);
            return;
          }
        }

        // Accept waiting/matching stance (private debates ignore age; public uses 10m heuristic)
        if (
          (stance.status === "waiting" || stance.status === "matching") &&
          (isPrivate || new Date(stance.updated_date) > recentTimeAgo)
        ) {
          console.log(
            `User ${user.id} has existing queue stance. Showing waiting screen.`
          );
          setCurrentUserStance(stance);
          foundActiveOrWaiting = true;
          break;
        }
      }

      // STEP 3: (Client-side deletion removed) — the server function handles stale stance cleanup.

      // STEP 4: Get recent stances from OTHER users (for display in StanceSelector/WaitingForMatch)
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const recentOtherUserWaitingStances = allStances.filter(
        (stance) =>
          stance.debate_id === actualDebateId &&
          stance.user_id !== user.id &&
          new Date(stance.updated_date) > tenMinutesAgo &&
          stance.status === "waiting"
      );

      setUserStances(recentOtherUserWaitingStances);

      // If we didn't find one in the loop, keep as-is (private render doesn't show selector anyway)
      if (!foundActiveOrWaiting && !debateData?.is_private) {
        setCurrentUserStance(null);
      }
    } catch (error) {
      console.error("Error loading debate data:", error);
      alert("Failed to load debate. Please try again.");
      navigate(createPageUrl("CreateDebate"));
    } finally {
      setIsLoading(false);
    }
  }, [debateId, inviteCode, navigate]);

  useEffect(() => {
    loadDebateData();
  }, [loadDebateData]);

  const handleTakeStance = async (position) => {
    if (!currentUser) return;

    setIsSubmitting(true);

    try {

      // Handle public debate (original flow)
      if (!debate) return;

      const newStance = await UserStance.create({
        debate_id: debate.id,
        user_name: currentUser.username,
        user_id: currentUser.id,
        position,
        status: "waiting",
      });

      setCurrentUserStance(newStance);

      // Try to match immediately
      console.log('🔍 Calling matchDebater with:', { debateId: debate.id, stanceId: newStance.id });
      
      const matchResponse = await matchDebater({
        debateId: debate.id,
        stanceId: newStance.id,
      });
      
      console.log('✅ matchDebater response:', matchResponse.data);

      if (matchResponse.data.matched) {
        navigate(
          createPageUrl(
            `VoiceDebate?id=${matchResponse.data.sessionId}&user=${encodeURIComponent(
              currentUser.username
            )}`
          )
        );
        return;
      }
    } catch (error) {
      console.error("❌ Error taking stance:", error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      alert("Failed to take stance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackFromWaiting = () => {
    // For private debates, back should go to CreateDebate or wherever you prefer
    if (debate?.is_private) {
      navigate(createPageUrl("CreateDebate"));
      return;
    }
    setCurrentUserStance(null);
  };

  const participantCounts = {
    position_a: userStances.filter((s) => s.position === "position_a").length,
    position_b: userStances.filter((s) => s.position === "position_b").length,
  };

  const totalWaiting = participantCounts.position_a + participantCounts.position_b;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }



  if (!debate) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        Debate not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/10"
            onClick={() => navigate(createPageUrl("Community"))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {debate?.is_private && (
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <Badge variant="secondary">Private Debate</Badge>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{debate.title}</h1>
              <div className="flex items-center gap-3 text-white/70">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{totalWaiting} waiting for matches</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Live</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {debate?.is_private ? (
          <WaitingForMatch
            stance={currentUserStance}
            debate={debate}
            participantCounts={participantCounts}
            onBack={handleBackFromWaiting}
          />
        ) : currentUserStance ? (
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
      </div>
    </div>
  );
}