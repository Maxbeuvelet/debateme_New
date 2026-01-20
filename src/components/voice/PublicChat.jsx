import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";


export default function PublicChat({ messages, onSendMessage, currentUser, participants, isAiDebate }) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);

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

  // Play AI voice when new AI message arrives
  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];

    // Only play if it's a new AI message
    if (latestMessage.id !== lastMessageIdRef.current && 
        latestMessage.sender_name === "AI Debater" && 
        isAiDebate) {

      lastMessageIdRef.current = latestMessage.id;

      const playAudio = async () => {
        try {
          setIsGeneratingVoice(true);
          console.log('🎤 Generating voice for:', latestMessage.content.substring(0, 50));
          
          // Use direct fetch to get binary audio data
          const response = await fetch('https://api.base44.app/v1/functions/generateVoiceAudio', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: latestMessage.content })
          });
          
          if (!response.ok) {
            throw new Error('Failed to generate audio');
          }
          
          const audioBlob = await response.blob();
          console.log('🔊 Blob size:', audioBlob.size, 'Type:', audioBlob.type);
          
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log('🎵 Audio URL:', audioUrl);

          // Create a new Audio element and play
          const audio = new Audio(audioUrl);
          audio.volume = 1.0;
          
          audio.onended = () => {
            setIsGeneratingVoice(false);
            URL.revokeObjectURL(audioUrl);
          };

          audio.onerror = (e) => {
            console.error('Audio playback error:', e);
            setIsGeneratingVoice(false);
            URL.revokeObjectURL(audioUrl);
          };
          
          await audio.play();
          console.log('✅ AI VOICE PLAYING');
          
        } catch (error) {
          console.error('❌ Voice generation error:', error);
          setIsGeneratingVoice(false);
        }
      };

      playAudio();
    }
  }, [messages, isAiDebate]);



  return (
    <Card className="bg-white border-slate-200 shadow-sm h-full flex flex-col">
      <CardHeader className="p-3 border-b border-slate-100">
        <CardTitle className="flex items-center justify-between text-base font-semibold text-slate-900">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Public Chat
          </div>
          {isAiDebate && isGeneratingVoice && (
            <div className="flex items-center gap-1 text-xs text-purple-600 animate-pulse">
              <Volume2 className="w-3 h-3" />
              <span>AI speaking...</span>
            </div>
          )}
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
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
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