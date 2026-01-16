import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function PublicChat({ messages, onSendMessage, currentUser, participants, isAiDebate }) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);

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

  // Text-to-speech for AI messages
  React.useEffect(() => {
    if (messages.length === 0) return;
    
    const latestMessage = messages[messages.length - 1];
    
    // Only speak if it's a new AI message
    if (latestMessage.id !== lastMessageIdRef.current && 
        latestMessage.sender_name === "AI Debater") {
      
      lastMessageIdRef.current = latestMessage.id;
      
      // Cancel any ongoing speech before starting new one
      window.speechSynthesis.cancel();
      
      // Small delay to ensure cancel completes
      setTimeout(() => {
        // Use Web Speech API
        const utterance = new SpeechSynthesisUtterance(latestMessage.content);
        
        // Select voice in priority order
        const voices = window.speechSynthesis.getVoices();
        const voicePriority = [
          'Microsoft Aria Online (Natural)',
          'Microsoft Jenny Online (Natural)',
          'Microsoft Guy Online (Natural)',
          'Google US English',
          'Samantha',
          'Alex'
        ];
        
        let selectedVoice = null;
        for (const voiceName of voicePriority) {
          selectedVoice = voices.find(v => v.name === voiceName);
          if (selectedVoice) break;
        }
        
        // Fallback to any English voice if priority voices not found
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        utterance.rate = 0.95; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Speak the message
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  }, [messages]);

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
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
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
      // Only process new results that we haven't seen yet
      let newTranscript = '';
      for (let i = processedResultsCount; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newTranscript += event.results[i][0].transcript + ' ';
          processedResultsCount = i + 1;
        }
      }
      
      if (newTranscript.trim()) {
        const transcript = newTranscript.trim();
        console.log("Recognized speech:", transcript);
        onSendMessage(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      
      if (event.error === 'aborted') {
        // Don't restart on aborted
        return;
      }
      
      if (event.error === 'no-speech') {
        // Just continue, will restart on end
        return;
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);
      
      if (isActive && !isRestarting) {
        isRestarting = true;
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }
        restartTimeoutRef.current = setTimeout(() => {
          startRecognition();
        }, 1000);
      }
    };

    recognitionRef.current = recognition;
    startRecognition();

    return () => {
      isActive = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
          setIsListening(false);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, [isAiDebate, onSendMessage]);

  return (
    <Card className="bg-white border-slate-200 shadow-sm h-full flex flex-col">
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