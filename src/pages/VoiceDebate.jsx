import React, { useState, useEffect, useCallback, useRef } from "react";
import { DebateSession, Debate, UserStance, PublicMessage, User, SessionParticipant } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, PhoneOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
  const { id } = useParams();
  const qs = new URLSearchParams(window.location.search);
  const sessionId = qs.get("sessionId") || qs.get("session");
  const userName = qs.get('user');
  const isAiDebate = qs.get('ai') === 'true';
  
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

  useEffect(() => {
    if (!sessionId) return;

    (async () => {
      setIsLoading(true);
      
      try {
        // Get user for ID tracking
        let user;
        try {
          user = await User.me();
          setCurrentUserId(user.id);
        } catch (error) {
          user = null;
          setCurrentUserId(null);
        }

        const res = await base44.functions.invoke("getSessionData", {
          body: { sessionId }
        });

        console.log("getSessionData raw:", res);

        const payload = res?.data?.session ? res.data : res?.data?.data;

        if (!payload?.session || !payload?.debate) {
          console.error('Failed to load session');
          navigate(createPageUrl("Home"));
          return;
        }

        const { session: currentSession, debate: debateData, participants: sessionParticipants, messages: msgs } = payload;

        if (currentSession.status === "ended") {
          setDisconnectReason("ended");
          setShowDisconnectDialog(true);
          setIsLoading(false);
          return;
        }
        
        setSession(currentSession);
        setDebate(debateData);
        setPublicMessages(msgs || []);
        
        // For multi-participant debates (private rooms), use SessionParticipant
        // For legacy 1v1 debates, fall back to UserStance
        let participantsList = [];
        const isPrivateRoom = debateData.is_private && sessionParticipants.length > 0;
        
        if (isPrivateRoom) {
          // Multi-participant debate (private room with no sides)
          participantsList = sessionParticipants.map(sp => ({
            id: sp.id,
            user_id: sp.user_id,
            user_name: sp.user_name,
            position: null,
            side: null
          }));
        } else {
          // Legacy 1v1 debate with sides
          const stances = await UserStance.list();
          const participantStances = stances.filter(s => 
            s.id === currentSession.participant_a_id || s.id === currentSession.participant_b_id
          );
          participantsList = participantStances.map(s => ({
            ...s,
            side: s.position === 'position_a' ? 'A' : 'B'
          }));
          
          // Update authenticated user in UserStance if needed
          if (user?.username) {
            const userStance = participantStances.find(s => 
              s.user_id === user.id || s.user_id?.startsWith('guest_')
            );
            
            if (userStance) {
              const updates = {
                user_id: user.id,
                user_name: user.username
              };
              
              if (!userStance.session_start_time) {
                updates.session_start_time = new Date().toISOString();
              }
              
              await UserStance.update(userStance.id, updates);
            }
          }
        }
        
        setParticipants(participantsList);
        
        // Set current user
        if (user?.username) {
          setCurrentUser(user.username);
        } else if (userName) {
          setCurrentUser(userName);
        }
        
        await setupVideoRoom();
        setIsLoading(false);

      } catch (err) {
        console.error("Error loading session:", err);
        navigate(createPageUrl("Home"));
      }
    })();
  }, [sessionId, userName, navigate, setupVideoRoom]);

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
        sender_user_id: currentUserId,
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
          body: {
            sessionId: sessionId, 
            userId: currentUserId
          }
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
              <p className="text-gray-600 text-sm">
                {debate?.is_private 
                  ? `Private Debate Room • ${participants.length} participant${participants.length !== 1 ? 's' : ''}`
                  : `Live Video Debate • ${currentUser} vs ${opponent?.user_name || "Opponent"}`
                }
              </p>
              {debate?.is_private && participants.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 mt-1 text-xs text-gray-600">
                  {participants.map((p, i) => (
                    <React.Fragment key={p.id}>
                      {i > 0 && <span>•</span>}
                      <span className={p.user_name === currentUser ? 'font-semibold' : ''}>
                        {p.user_name}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              )}
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