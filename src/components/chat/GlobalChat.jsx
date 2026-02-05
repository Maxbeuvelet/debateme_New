import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const inappropriateWords = [
  'ass', 'damn', 'hell', 'crap', 'dick', 'pussy', 'cock',
  'nigga', 'nigger', 'fag', 'faggot', 'whore', 'slut', 'bastard', 'piss', 'cunt'
];

const containsInappropriateContent = (text) => {
  if (!text) return false;
  
  // Normalize text to handle leetspeak and symbol substitutions
  const normalized = text.toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/\+/g, 't');
  
  return inappropriateWords.some(word => normalized.includes(word));
};

export default function GlobalChat({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasInappropriateContent, setHasInappropriateContent] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadMessages = async () => {
    try {
      const msgs = await base44.entities.ChatMessage.list("-created_date", 50);
      setMessages(msgs.reverse());
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || hasInappropriateContent) return;

    const messageContent = newMessage.trim();
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      sender_name: currentUser.username,
      sender_id: currentUser.id,
      content: messageContent,
      created_date: new Date().toISOString()
    };

    // Add optimistic message immediately
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage("");

    setIsSending(true);
    try {
      await base44.entities.ChatMessage.create({
        sender_name: currentUser.username,
        sender_id: currentUser.id,
        content: messageContent
      });
      await loadMessages();
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Chat Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
          size="icon"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      </motion.div>

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <h3 className="text-white font-bold">Global Chat</h3>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-800">
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 mt-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages yet. Be the first to chat!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-1 ${
                      msg.sender_id === currentUser?.id ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 ${
                        msg.sender_id === currentUser?.id
                          ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white"
                          : "bg-slate-700 text-slate-100"
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 opacity-80">
                        @{msg.sender_name}
                      </p>
                      <p className="text-sm break-words">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-700">
              {currentUser ? (
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewMessage(value);
                      setHasInappropriateContent(containsInappropriateContent(value));
                    }}
                    placeholder="Type a message..."
                    className={`flex-1 bg-slate-800 text-white placeholder:text-slate-400 ${
                      hasInappropriateContent 
                        ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500" 
                        : "border-slate-600"
                    }`}
                    disabled={isSending}
                    maxLength={500}
                  />
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || isSending || hasInappropriateContent}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center">
                  Please login to chat
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}