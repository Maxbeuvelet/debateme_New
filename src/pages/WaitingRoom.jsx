import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Copy, LogOut, Clock, Users } from "lucide-react";
import { createPageUrl } from "@/utils";
import AnimatedDMLogo from "@/components/AnimatedDMLogo";

export default function WaitingRoom() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [debate, setDebate] = useState(null);
  const [myStance, setMyStance] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(checkForOpponent, 2000);
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  const loadData = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const stanceId = params.get("stanceId");
      
      if (!stanceId) {
        navigate(createPageUrl("Categories"));
        return;
      }

      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const stanceData = await base44.entities.UserStance.get(stanceId);
      setMyStance(stanceData);

      // Load debate
      const debateData = await base44.entities.Debate.get(stanceData.debate_id);
      setDebate(debateData);

      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      navigate(createPageUrl("Categories"));
    }
  };

  const checkForOpponent = async () => {
    if (!myStance || !myStance.session_id) return;

    try {
      const session = await base44.entities.DebateSession.get(myStance.session_id);
      
      if (session) {
        const opponentStanceId = session.participant_a_id === myStance.id 
          ? session.participant_b_id 
          : session.participant_a_id;
        
        const opponentStance = await base44.entities.UserStance.get(opponentStanceId);
        setOpponent(opponentStance);

        // Navigate to debate room after brief delay
        setTimeout(() => {
          navigate(createPageUrl("DebateRoom") + `?sessionId=${session.id}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error checking opponent:", error);
    }
  };

  const handleCopyInvite = () => {
    const inviteUrl = window.location.origin + createPageUrl("JoinDebate") + `?id=${debate?.id}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = async () => {
    try {
      if (myStance) {
        await base44.entities.UserStance.delete(myStance.id);
      }
      navigate(createPageUrl("Categories"));
    } catch (error) {
      console.error("Error leaving:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || !debate || !myStance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b1220] to-[#0f172a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-slate-600 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] to-[#0f172a] relative overflow-hidden flex items-center justify-center p-4">
      {/* Ambient gradient blobs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 80, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 w-full max-w-[980px]">
        {/* Brand animation */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatedDMLogo />
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">{debate.title}</h1>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-600">{debate.category}</Badge>
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Room expires in {formatTime(timeRemaining)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyInvite}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Invite Link"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLeave}
                className="border-red-600/50 text-red-400 hover:bg-red-950/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave
              </Button>
            </div>
          </div>

          {/* Seats */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* My seat */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    @{user?.username || user?.email}
                  </h3>
                  <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                    {myStance.position === "position_a" ? debate.position_a : debate.position_b}
                  </Badge>
                  <p className="text-xs text-slate-400 mt-3">You</p>
                </div>
              </motion.div>

              {/* Opponent seat */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
              >
                <div className="text-center">
                  {opponent ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">
                          {opponent.user_name?.[0]?.toUpperCase() || "O"}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        @{opponent.user_name}
                      </h3>
                      <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                        {opponent.position === "position_a" ? debate.position_a : debate.position_b}
                      </Badge>
                      <p className="text-xs text-green-400 mt-3">✓ Ready</p>
                    </motion.div>
                  ) : (
                    <div>
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-slate-700/30 border-2 border-slate-600/50"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border-2 border-blue-500/50"
                        />
                        <div className="absolute inset-0 rounded-full bg-slate-800 flex items-center justify-center">
                          <Users className="w-8 h-8 text-slate-600" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-500 mb-1">
                        Waiting for opponent...
                      </h3>
                      <Badge variant="outline" className="border-slate-600 text-slate-400">
                        {myStance.position === "position_a" ? debate.position_b : debate.position_a}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-3">Empty</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Status bar */}
          <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-700/50">
            <div className="flex items-center justify-center gap-2">
              {opponent ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-green-500"
                  />
                  <span className="text-sm font-medium text-green-400">
                    Opponent joined! Starting debate...
                  </span>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-blue-500"
                  />
                  <span className="text-sm text-slate-400">
                    Searching for opponent...
                  </span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}