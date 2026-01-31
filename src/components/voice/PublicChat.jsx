import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";


export default function PublicChat({ messages, onSendMessage, currentUser, participants }) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

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