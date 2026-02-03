import React, { useState, useEffect, useCallback, useRef } from "react";
import { DebateSession, Debate, UserStance, PublicMessage, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, PhoneOff } from "lucide-react";
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
import { base44 } from "@/api/base44Client";

import { createVideoRoom } from "@/functions/createVideoRoom";

import DebateTimer from "../components/voice/DebateTimer";
import PublicChat from "../components/voice/PublicChat";
import PrivateNotes from "../components/voice/PrivateNotes";
import VideoChat from "../components/voice/VideoChat";

export default function VoiceDebate() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('id');
  const userName = urlParams.get('user');
  const isAiDebate = urlParams.get('ai') === 'true';
  
  const [session, setSession] = useState(null);
  const [debate, setDebate] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [publicMessages, setPublicMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(userName || "");
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [disconnectReason, setDisconnectReason] = useState("ended"); // This will now mostly be "ended" from checkStatus
  const [currentUserId, setCurrentUserId] = useState(null);
  
  const [videoRoomUrl, setVideoRoomUrl] = useState(null);
  const [videoToken, setVideoToken] = useState(null);
  const [videoError, setVideoError] = useState(null);
  
  const messagesIntervalRef = useRef(null);
  const statusIntervalRef = useRef(null);

  const loadMessages = useCallback(async () => {
    if (!sessionId) return;
    try {
      const msgs = await PublicMessage.filter({ session_id: sessionId }, "created_date");
      setPublicMessages(msgs);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }, [sessionId]);

  const checkStatus = useCallback(async () => {
    if (!sessionId) return;
    try {
      const sessions = await DebateSession.list();
      const current = sessions.find(s => s.id === sessionId);
      if (current?.status === "ended") {
        setDisconnectReason("ended"); // Explicitly set to "ended" if the session itself is marked as ended
        setShowDisconnectDialog(true);
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  }, [sessionId]);

  const setupVideoRoom = useCallback(async () => {
    if (!sessionId || !userName) return;
    
    try {
      const response = await createVideoRoom({
        sessionId: sessionId,
        userName: userName
      });
      
      if (response.data.error) {
        setVideoError(response.data.error);
      } else {
        setVideoRoomUrl(response.data.roomUrl);
        setVideoToken(response.data.token);
      }
    } catch (error) {
      console.error("Error setting up video room:", error);
      setVideoError("Failed to connect to video service");
    }
  }, [sessionId, userName]);

  const loadData = useCallback(async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    try {
      // Try to get user, but allow anonymous
      let user;
      try {
        user = await User.me();
        setCurrentUserId(user.id);
      } catch (error) {
        // Anonymous user
        user = null;
        setCurrentUserId(null);
      }
      
      const [sessions, msgs, debates, stances] = await Promise.all([
        DebateSession.list(),
        PublicMessage.filter({ session_id: sessionId }, "created_date"),
        Debate.list(),
        UserStance.list()
      ]);
      
      const currentSession = sessions.find(s => s.id === sessionId);
      if (!currentSession) {
        navigate(createPageUrl("Home"));
        return;
      }

      if (currentSession.status === "ended") {
        setDisconnectReason("ended");
        setShowDisconnectDialog(true);
        return;
      }
      
      setSession(currentSession);
      setPublicMessages(msgs);
      
      const debateData = debates.find(d => d.id === currentSession.debate_id);
      setDebate(debateData);
      
      const participantStances = stances.filter(s => 
        s.id === currentSession.participant_a_id || s.id === currentSession.participant_b_id
      );
      setParticipants(participantStances);
      
      // CRITICAL FIX: Authenticated user data ALWAYS takes priority over guest data
      // If user is logged in, use their username. Guest username from URL is discarded.
      if (user?.username) {
        setCurrentUser(user.username);
        
        // Update the UserStance to use authenticated user's data if it was previously a guest
        const userStance = participantStances.find(s => 
          s.user_id === user.id || s.user_id?.startsWith('guest_')
        );
        
        if (userStance) {
          // Replace guest identity with authenticated user identity
          const updates = {
            user_id: user.id,
            user_name: user.username
          };
          
          if (!userStance.session_start_time) {
            updates.session_start_time = new Date().toISOString();
          }
          
          await UserStance.update(userStance.id, updates);
        }
      } else if (userName) {
        // Only use URL userName for anonymous users (guests)
        setCurrentUser(userName);
      }
      
      await setupVideoRoom();


    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  }, [sessionId, userName, navigate, setupVideoRoom, isAiDebate]);

  useEffect(() => {
    if (sessionId) loadData();
  }, [sessionId, loadData]);

  useEffect(() => {
    if (!sessionId || isLoading) return;

    const msgInterval = setInterval(loadMessages, 5000);
    const statusInterval = setInterval(checkStatus, 3000);
    
    return () => {
      clearInterval(msgInterval);
      clearInterval(statusInterval);
    };
  }, [sessionId, isLoading, loadMessages, checkStatus]);

  const handleSendMessage = async (content) => {
    if (!currentUser || !sessionId) {
      console.log("Missing currentUser or sessionId");
      return;
    }

    const participant = participants.find(p => p.user_name === currentUser);
    if (!participant) {
      console.log("No participant found for currentUser:", currentUser);
      return;
    }
    
    console.log("Sending message:", content);
    
    try {
      await PublicMessage.create({
        session_id: sessionId,
        sender_name: currentUser,
        sender_position: participant.position,
        content: content
      });

      console.log("Message created, reloading messages immediately");
      await loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEndDebate = async () => {
    if (!sessionId || !session) {
      console.error("Missing sessionId or session");
      navigate(createPageUrl("Home"));
      return;
    }

    try {
      // Stop speech synthesis and speech recognition immediately
      window.speechSynthesis.cancel();
      
      // Show loading state
      setIsLoading(true);
      
      // Mark BOTH participant stances as completed before ending session
      const stancesToComplete = [session.participant_a_id, session.participant_b_id];
      await Promise.all(
        stancesToComplete.map(stanceId => 
          UserStance.update(stanceId, { status: "completed" }).catch(() => {})
        )
      );
      
      // Track debate time and check for achievements
      if (currentUserId) {
        await base44.functions.invoke('trackDebateTime', { 
          sessionId: sessionId, 
          userId: currentUserId 
        }).catch(err => {
          console.error("Error tracking debate time:", err);
        });
      }
      
      // Mark debate as inactive (remove from browse list)
      if (debate?.id) {
        await Debate.update(debate.id, { status: "inactive" }).catch(() => {});
      }
      
      // End the session
      await DebateSession.update(sessionId, { status: "ended" });
      
      // Navigate away immediately without showing a dialog for self-initiated exit
      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Error ending debate:", error);
      // Even if there's an error, navigate away to prevent being stuck
      navigate(createPageUrl("Home"));
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Session not found</h1>
          <Button onClick={() => navigate(createPageUrl("Home"))} className="bg-slate-700 hover:bg-slate-600 text-white">Back to Home</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-600 border-t-slate-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading debate...</p>
        </div>
      </div>
    );
  }

  if (!session || !debate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Session not found</h1>
          <Button onClick={() => navigate(createPageUrl("Home"))} className="bg-slate-700 hover:bg-slate-600 text-white">Back to Home</Button>
        </div>
      </div>
    );
  }

  const opponent = participants.find(p => p.user_name !== currentUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      <AlertDialog open={showDisconnectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-xl">Debate Ended</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              The debate session has ended.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              onClick={() => navigate(createPageUrl("Home"))}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
            >
              Return to Home
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{debate?.title || "Loading..."}</h1>
              <p className="text-gray-600 text-sm">Live Video Debate • {currentUser} vs {opponent?.user_name || "Opponent"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DebateTimer duration={session?.duration_minutes || 30} />
            <Button
              onClick={handleEndDebate}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
            >
              <PhoneOff className="w-4 h-4" />
              End Debate
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <VideoChat 
              roomUrl={videoRoomUrl}
              token={videoToken}
              userName={currentUser}
              isAiDebate={isAiDebate}
              opponentName={opponent?.user_name}
            />
            
            <PublicChat 
              messages={publicMessages}
              onSendMessage={handleSendMessage}
              currentUser={currentUser}
              participants={participants}
            />
          </div>

          <div className="space-y-6">
            <PrivateNotes />
          </div>
        </div>
      </div>
    </div>
  );
}