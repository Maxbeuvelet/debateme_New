import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Video, Mic, MicOff, VideoOff, Phone } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function DebateRoom() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [debate, setDebate] = useState(null);
  const [session, setSession] = useState(null);
  const [stance, setStance] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [videoRoom, setVideoRoom] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const dailyCallRef = useRef(null);

  useEffect(() => {
    // Load Daily.co script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@daily-co/daily-js';
    script.async = true;
    document.head.appendChild(script);
    
    script.onload = () => {
      loadDebateRoom();
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (session) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            endDebate();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const messageSubscription = base44.entities.PublicMessage.subscribe((event) => {
        if (event.type === 'create' && event.data.session_id === session.id) {
          setMessages((prev) => [...prev, event.data]);
        }
      });

      return () => {
        clearInterval(timer);
        messageSubscription();
      };
    }
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadDebateRoom = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      if (!sessionId) {
        navigate(createPageUrl("Categories"));
        return;
      }

      const currentUser = await base44.auth.me();
      if (!currentUser) {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }

      const sessionData = await base44.entities.DebateSession.filter({ id: sessionId });
      if (!sessionData || sessionData.length === 0) {
        navigate(createPageUrl("Categories"));
        return;
      }

      const currentSession = sessionData[0];
      const debateData = await base44.entities.Debate.filter({ id: currentSession.debate_id });
      const currentDebate = debateData[0];

      const stanceA = await base44.entities.UserStance.filter({ id: currentSession.participant_a_id });
      const stanceB = await base44.entities.UserStance.filter({ id: currentSession.participant_b_id });

      const myStance = stanceA[0]?.user_id === currentUser.id ? stanceA[0] : stanceB[0];
      const opponentStance = stanceA[0]?.user_id === currentUser.id ? stanceB[0] : stanceA[0];

      const chatMessages = await base44.entities.PublicMessage.filter(
        { session_id: sessionId },
        "-created_date"
      );

      // Create video room
      const roomResponse = await base44.functions.invoke('createVideoRoom', {
        session_id: sessionId
      });

      setUser(currentUser);
      setDebate(currentDebate);
      setSession(currentSession);
      setStance(myStance);
      setOpponent(opponentStance);
      setMessages(chatMessages.reverse());
      setVideoRoom(roomResponse.data.roomUrl);

      // Initialize Daily.co
      if (roomResponse.data.room_url && window.DailyIframe) {
        const callFrame = window.DailyIframe.createFrame({
          showLeaveButton: false,
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '8px'
          }
        });
        dailyCallRef.current = callFrame;
        await callFrame.join({ url: roomResponse.data.room_url });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading debate room:", error);
      navigate(createPageUrl("Categories"));
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !session || !stance) return;

    try {
      await base44.entities.PublicMessage.create({
        session_id: session.id,
        sender_name: user.username || user.email,
        sender_position: stance.position,
        content: newMessage
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const endDebate = async () => {
    try {
      if (dailyCallRef.current) {
        await dailyCallRef.current.leave();
        dailyCallRef.current.destroy();
      }

      if (session) {
        await base44.entities.DebateSession.update(session.id, { status: "ended" });
        
        const sessionStartTime = new Date(session.created_date);
        const sessionEndTime = new Date();
        const durationMinutes = Math.floor((sessionEndTime - sessionStartTime) / 1000 / 60);

        await base44.functions.invoke('trackDebateTime', {
          session_id: session.id,
          duration_minutes: durationMinutes
        });
      }

      navigate(createPageUrl("Categories"));
    } catch (error) {
      console.error("Error ending debate:", error);
      navigate(createPageUrl("Categories"));
    }
  };

  const toggleVideo = () => {
    if (dailyCallRef.current) {
      dailyCallRef.current.setLocalVideo(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (dailyCallRef.current) {
      dailyCallRef.current.setLocalAudio(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{debate.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">You:</span>
                  <Badge className="bg-blue-600">{stance?.position === 'position_a' ? debate.position_a : debate.position_b}</Badge>
                </div>
                <span className="text-slate-400">vs</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">@{opponent?.user_name}:</span>
                  <Badge className="bg-purple-600">{opponent?.position === 'position_a' ? debate.position_a : debate.position_b}</Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{formatTime(timeRemaining)}</div>
              <div className="text-sm text-slate-400">Time Remaining</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Video Area */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-slate-800 border-slate-700 p-4">
              <div id="video-container" className="aspect-video bg-slate-900 rounded-lg overflow-hidden mb-4"></div>
              
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={toggleVideo}
                  variant={isVideoEnabled ? "default" : "destructive"}
                  size="lg"
                  className="rounded-full w-14 h-14"
                >
                  {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </Button>
                <Button
                  onClick={toggleAudio}
                  variant={isAudioEnabled ? "default" : "destructive"}
                  size="lg"
                  className="rounded-full w-14 h-14"
                >
                  {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </Button>
                <Button
                  onClick={endDebate}
                  variant="destructive"
                  size="lg"
                  className="rounded-full w-14 h-14"
                >
                  <Phone className="w-6 h-6" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 h-[600px] flex flex-col">
              <div className="p-4 border-b border-slate-700">
                <h2 className="text-lg font-bold text-white">Debate Chat</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      msg.sender_name === (user.username || user.email) ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="text-xs text-slate-400 mb-1">
                      {msg.sender_name}
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg max-w-[80%] ${
                        msg.sender_name === (user.username || user.email)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}