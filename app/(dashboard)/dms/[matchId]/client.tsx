"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, Send, Phone, Video, MoreVertical } from "lucide-react";

type MinimalUser = {
  id: string;
  name: string;
  photoUrl: string;
};

// We don't have a Message model in schema.prisma right now, so this is just UI mocking
// A real app would fetch messages from the DB here
type Message = {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
};

export default function ChatClient({ 
  matchId, 
  otherUser, 
  currentUser 
}: { 
  matchId: string;
  otherUser: MinimalUser;
  currentUser: MinimalUser;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages from DB
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages?matchId=${matchId}`);
      if (res.ok) {
        const data = await res.json();
        // The API returns timestamp as string (ISO), we convert to Date for formatting
        setMessages(data.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.createdAt)
        })));
      }
    } catch (error) {
      console.error("Failed to fetch messages");
    }
  }, [matchId]);

  // Initial fetch and polling
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const newMsgContent = inputText.trim();

    // Optimistic UI update
    const optimisticMessage: Message = {
      id: tempId,
      text: newMsgContent,
      senderId: currentUser.id,
      timestamp: new Date(),
    };
    setMessages([...messages, optimisticMessage]);
    setInputText("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, text: newMsgContent }),
      });
      
      if (!res.ok) {
        // Revert on failure
        setMessages(messages.filter(m => m.id !== tempId));
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      setMessages(messages.filter(m => m.id !== tempId));
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[100dvh]">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-4 bg-neutral-900 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dms" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden relative">
              {otherUser.photoUrl ? (
                <img src={otherUser.photoUrl} alt={otherUser.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xs text-neutral-500">No Pic</div>
              )}
            </div>
            <div>
              <h2 className="font-bold text-white leading-tight">{otherUser.name.split(" ")[0]}</h2>
              <p className="text-xs text-green-400 font-medium">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-neutral-400">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Phone className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Video className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.length === 0 && (
           <div className="flex flex-col items-center justify-center h-full text-neutral-500 mt-10">
              <p className="text-sm">No messages yet.</p>
              <p className="text-xs mt-1">Say hi to {otherUser.name.split(" ")[0]}!</p>
           </div>
        )}

        {messages.map((msg, i) => {
          const isMine = msg.senderId === currentUser.id;
          const showAvatar = !isMine && (i === 0 || messages[i - 1]?.senderId !== msg.senderId);

          return (
            <div key={msg.id} className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[75%] gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar dot for other user */}
                {!isMine && (
                  <div className="w-6 shrink-0 flex flex-col justify-end pb-1">
                    {showAvatar && (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-neutral-800">
                        {otherUser.photoUrl && <img src={otherUser.photoUrl} className="w-full h-full object-cover" />}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                  <div 
                    className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed relative ${
                      isMine 
                        ? "bg-orange-600 text-white rounded-br-sm shadow-[0_4px_10px_rgba(234,88,12,0.3)]" 
                        : "bg-neutral-800 text-white border border-white/5 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1 px-1 font-medium select-none">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>

              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-neutral-900 border-t border-white/10 shrink-0 mb-safe">
        <form onSubmit={handleSend} className="flex items-center gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-black border border-white/10 rounded-full px-5 py-3.5 text-[15px] text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 placeholder:text-neutral-600"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 transition-all hover:bg-orange-400 focus:scale-95"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
