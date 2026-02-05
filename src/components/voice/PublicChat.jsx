import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";


export default function PublicChat({ messages, onSendMessage, currentUser, participants }) {
  const [newMessage, setNewMessage] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Sync messages from parent
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageContent = newMessage.trim();
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        sender_name: currentUser,
        content: messageContent,
        created_date: new Date().toISOString()
      };

      // Add optimistic message immediately
      setLocalMessages(prev => [...prev, optimisticMessage]);
      setNewMessage("");

      try {
        await onSendMessage(messageContent);
      } catch (error) {
        console.error("Error sending message:", error);
        // Remove optimistic message on error
        setLocalMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      }
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

  return (
    <Card className="bg-card border-border shadow-sm h-full flex flex-col">
      <CardHeader className="p-3 border-b border-border">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <MessageSquare className="w-4 h-4" />
          Public Chat
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ maxHeight: "300px" }}>
          {messages.length === 0 && (
            <div className="text-center py-4">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-muted-foreground text-xs">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}
          <AnimatePresence>
            {localMessages.map((message, index) => {
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
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground'
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

        <div className="p-3 border-t border-border">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type your message..."
              className="flex-1 border-border text-sm"
              maxLength={500}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-1">
            {newMessage.length}/500 characters
          </p>
        </div>
      </CardContent>
    </Card>
  );
}