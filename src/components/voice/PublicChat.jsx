import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { generateVoiceAudio } from "@/functions/generateVoiceAudio";

export default function PublicChat({ messages, onSendMessage, currentUser, participants, isAiDebate }) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const audioRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      await onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const getParticipantInfo = (senderName) => {
    return participants.find(p => p.user_name === senderName);
  };

  const getPositionColor = (position) => {
    return position === "position_a" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-red-100 text-red-800";
  };

  // Neural TTS for AI messages using OpenAI
  React.useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];

    // Only speak if it's a new AI message
    if (latestMessage.id !== lastMessageIdRef.current && 
        latestMessage.sender_name === "AI Debater") {

      lastMessageIdRef.current = latestMessage.id;

      // Play AI voice
      const playAudio = async () => {
        try {
          console.log('🎤 Generating voice for:', latestMessage.content.substring(0, 50));
          
          // Use base44 functions to get the endpoint URL
          const user = await base44.auth.me();
          const token = user?.access_token;
          
          // Call backend function directly with fetch to get binary data
          const response = await fetch(`https://api.base44.app/v1/functions/generateVoiceAudio`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: latestMessage.content })
          });
          
          if (!response.ok) {
            throw new Error(`Failed to generate voice: ${response.statusText}`);
          }
          
          // Get the audio as blob
          const audioBlob = await response.blob();
          console.log('🔊 Blob size:', audioBlob.size, 'type:', audioBlob.type);
          
          // Create object URL and play
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log('🎵 Created audio URL:', audioUrl);

          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = audioUrl;
            audioRef.current.load();
            
            audioRef.current.play()
              .then(() => console.log('✅ AI VOICE PLAYING'))
              .catch(error => console.error('❌ Play error:', error));
          }
        } catch (error) {
          console.error('❌ Voice generation error:', error);
        }
      };

      playAudio();
    }
  }, [messages]);

  // Cleanup audio on unmount
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Speech recognition for AI debates
  React.useEffect(() => {
    if (!isAiDebate) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported");
      return;
    }

    let isActive = true;
    let isRestarting = false;
    let processedResultsCount = 0;
    let silenceTimeout = null;
    let accumulatedTranscript = '';

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    const startRecognition = () => {
      if (!isActive || isRestarting) return;
      
      try {
        recognition.start();
        isRestarting = false;
        processedResultsCount = 0;
      } catch (error) {
        if (error.name === 'InvalidStateError') {
          // Already running, ignore
          return;
        }
        console.error("Error starting recognition:", error);
      }
    };

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setIsListening(true);
      isRestarting = false;
    };

    recognition.onresult = (event) => {
      // Clear any existing silence timeout
      if (silenceTimeout) {
        clearTimeout(silenceTimeout);
      }

      // Accumulate transcript from all results
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript + ' ';
      }

      accumulatedTranscript = currentTranscript.trim();
      console.log("Current speech:", accumulatedTranscript);

      // Set timeout to send message after 2 seconds of silence
      silenceTimeout = setTimeout(() => {
        if (accumulatedTranscript.trim()) {
          console.log("Sending after silence:", accumulatedTranscript);
          onSendMessage(accumulatedTranscript);
          accumulatedTranscript = '';
          processedResultsCount = event.results.length;
        }
      }, 2000);
    };

    recognition.onerror = (event) => {
      console.log("Speech recognition error:", event.error);

      // Don't restart on these errors
      if (event.error === 'aborted' || event.error === 'not-allowed') {
        isActive = false;
        setIsListening(false);
        return;
      }

      // Allow restart on other errors
    };

    recognition.onend = () => {
      console.log("Speech recognition ended, isActive:", isActive);
      setIsListening(false);

      if (isActive && !isRestarting) {
        isRestarting = true;
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }
        restartTimeoutRef.current = setTimeout(() => {
          if (isActive) {
            startRecognition();
          }
        }, 500);
      }
    };

    recognitionRef.current = recognition;
    startRecognition();

    return () => {
      console.log("Cleaning up speech recognition");
      isActive = false;
      isRestarting = true;
      if (silenceTimeout) {
        clearTimeout(silenceTimeout);
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          setIsListening(false);
        } catch (error) {
          console.log("Cleanup error:", error);
        }
      }
    };
  }, [isAiDebate, onSendMessage]);

  return (
    <Card className="bg-white border-slate-200 shadow-sm h-full flex flex-col">
      {/* Hidden audio element for AI voice playback */}
      <audio ref={audioRef} autoPlay style={{ display: 'none' }} />
      
      <CardHeader className="p-3 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <MessageSquare className="w-4 h-4" />
          Public Chat
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ maxHeight: "300px" }}>
          {messages.length === 0 && (
            <div className="text-center py-4">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-xs">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}
          <AnimatePresence>
            {messages.map((message, index) => {
              const participant = getParticipantInfo(message.sender_name);
              const isCurrentUser = message.sender_name === currentUser;
              
              return (
                <motion.div
                  key={`${message.id}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${
                    isCurrentUser 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-100 text-slate-900'
                  } rounded-lg px-3 py-2`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-medium">
                        {isCurrentUser ? 'You' : message.sender_name}
                      </span>
                      {participant && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${getPositionColor(participant.position)}`}>
                          {participant.position === "position_a" ? "Pro" : "Con"}
                        </span>
                      )}
                      <span className={`text-xs ${isCurrentUser ? 'text-slate-300' : 'text-slate-500'}`}>
                        {format(new Date(message.created_date), 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed break-words">{message.content}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-slate-100">
          {isAiDebate && (
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
              {isListening ? (
                <>
                  <Mic className="w-4 h-4 text-green-600 animate-pulse" />
                  <span className="text-green-600 font-medium">Listening to your voice...</span>
                </>
              ) : (
                <>
                  <MicOff className="w-4 h-4 text-slate-400" />
                  <span>Microphone inactive</span>
                </>
              )}
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isAiDebate ? "Or type your message..." : "Type your message..."}
              className="flex-1 border-slate-300 focus:border-slate-500 text-sm"
              maxLength={500}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              size="icon"
              className="bg-slate-900 hover:bg-slate-800"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-slate-500 mt-1">
            {newMessage.length}/500 characters
          </p>
        </div>
      </CardContent>
    </Card>
  );
}