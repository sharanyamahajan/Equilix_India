'use client';

import React, { useState, useRef, useEffect, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, CornerDownLeft, Loader2 } from 'lucide-react';
import { getAIFriendResponse } from "@/app/actions";
import type { AIFriendInput } from "@/ai/schemas/ai-friend";

function FloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "nova" }[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const welcomeMessage = { text: "Hello! I'm Nova, your friendly AI assistant. How can I help you today?", sender: "nova" } as const;

  useEffect(() => {
    if (isOpen) {
        setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = () => {
    if (!input.trim() || isPending) return;

    const userMsg = { text: input, sender: "user" } as const;
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    startTransition(async () => {
      const result = await getAIFriendResponse({
        message: currentInput,
        history: messages.slice(1).map(m => ({ role: m.sender === 'user' ? 'user' : 'model', text: m.text })),
      } as AIFriendInput);

      if (result.success && result.data?.reply) {
        setMessages((prev) => [...prev, { text: result.data.reply, sender: "nova" }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "⚠️ I couldn’t reach AI servers, but I’m still here to help!", sender: "nova" },
        ]);
      }
    });
  };

  return (
    <>
      <button
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className={cn(
            "fixed bottom-5 right-5 bg-primary text-primary-foreground rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-3xl hover:bg-primary/90 transition-all duration-300 z-50",
            isOpen && "scale-0 animate-out"
        )}
      >
       <Bot />
      </button>

      {isOpen && (
        <div className="fixed bottom-5 right-5 w-80 sm:w-96 max-w-[calc(100vw-2.5rem)] bg-card rounded-2xl shadow-xl flex flex-col z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center bg-primary text-primary-foreground font-semibold p-3">
             <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border-2 border-primary-foreground/50">
                    <AvatarFallback className="bg-transparent"><Bot /></AvatarFallback>
                </Avatar>
                <span>Nova</span>
            </div>
            <button onClick={toggleChat} className="text-primary-foreground/80 hover:text-primary-foreground">&times;</button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-4 h-96">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn("flex items-end gap-2",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.sender === 'nova' && <Avatar className="w-6 h-6"><AvatarFallback className="bg-secondary text-secondary-foreground"><Bot size={16}/></AvatarFallback></Avatar>}
                <div
                  className={cn("max-w-[85%] px-3 py-2 rounded-xl",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {msg.text}
                </div>
                 {msg.sender === 'user' && <Avatar className="w-6 h-6"><AvatarFallback className="bg-muted text-muted-foreground"><User size={16}/></AvatarFallback></Avatar>}
              </div>
            ))}
            {isPending && (
              <div className="flex items-end gap-2 justify-start">
                  <Avatar className="w-6 h-6"><AvatarFallback className="bg-secondary text-secondary-foreground"><Bot size={16}/></AvatarFallback></Avatar>
                   <div className="bg-secondary text-secondary-foreground px-3 py-2 rounded-xl self-start flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin"/>
                        <span>Thinking...</span>
                   </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center p-2 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-2 py-1 outline-none text-sm bg-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={isPending || !input.trim()}
              className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <CornerDownLeft size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export { FloatingBot };
