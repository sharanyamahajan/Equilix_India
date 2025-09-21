'use client';
import { useState, useRef, useEffect, useTransition } from 'react';
import { getAIFriendResponse } from '@/app/actions';
import { useRouter } from 'next/navigation';

type Message = {
  role: 'user' | 'model';
  text: string;
};

const novaSystemPrompt = `You are Nova, a friendly and efficient AI assistant for the Equilix app. Your primary role is to help users navigate the application and understand its features. You are knowledgeable, concise, and slightly more direct than Aura. Your goal is to provide clear, helpful answers. You can navigate users to different pages if they ask. Do not give medical advice.`;

const initialMessages: Message[] = [
    {
        role: 'model',
        text: "Hello! I'm Nova, your guide to the Equilix app. How can I help you today?"
    }
];

export function FloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    
    startTransition(async () => {
        const response = await getAIFriendResponse({
          history: messages,
          message: currentInput,
          systemPrompt: novaSystemPrompt,
        });
        
        if (response.success && response.data) {
          const modelMessage: Message = { role: 'model', text: response.data.reply };
          setMessages((prev) => [...prev, modelMessage]);

          if (response.data.toolCalls) {
            for (const toolCall of response.data.toolCalls) {
              if (toolCall.toolName === 'navigation' && toolCall.args.path) {
                router.push(toolCall.args.path as string);
                setIsOpen(false);
              }
            }
          }
        } else {
            const errorMessage: Message = {
              role: 'model',
              text: response.error || 'Sorry, I encountered an error. Please try again.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    });
  };

  return (
    <>
      <style jsx global>{`
        #nova-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          font-size: 22px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          z-index: 1000;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #nova-btn:hover {
          background: #357abd;
        }
        #nova-chat {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 320px;
          max-height: 450px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          overflow: hidden;
          flex-direction: column;
          z-index: 1000;
        }
        #nova-header {
          background: #4a90e2;
          color: white;
          padding: 12px;
          font-weight: bold;
          text-align: center;
        }
        #nova-messages {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
          font-size: 14px;
          color: #333;
        }
        .msg-container {
            display: flex;
            flex-direction: column;
            margin: 6px 0;
            clear: both;
        }
        .msg {
          padding: 8px 12px;
          border-radius: 10px;
          max-width: 80%;
        }
        .user .msg {
          background: #e1f5fe;
          align-self: flex-end;
        }
        .model .msg {
          background: #f1f1f1;
          align-self: flex-start;
        }
        #nova-input {
          display: flex;
          border-top: 1px solid #ccc;
        }
        #nova-input input {
          flex: 1;
          border: none;
          padding: 10px;
          font-size: 14px;
          outline: none;
        }
        #nova-input button {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 10px 15px;
          cursor: pointer;
        }
        #nova-input button:hover {
          background: #357abd;
        }
        #nova-input button:disabled {
          background: #a0c7e4;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          #nova-chat {
            width: 90%;
            right: 5%;
            bottom: 80px;
            max-height: 70vh;
          }
        }
      `}</style>

      <button id="nova-btn" onClick={() => setIsOpen(!isOpen)}>💬</button>

      {isOpen && (
        <div id="nova-chat" style={{ display: 'flex' }}>
          <div id="nova-header">Nova - Your Assistant</div>
          <div id="nova-messages">
            {messages.map((message, index) => (
              <div key={index} className={`msg-container ${message.role}`}>
                <div className="msg">{message.text}</div>
              </div>
            ))}
            {isPending && (
                <div className="msg-container model">
                    <div className="msg">...</div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div id="nova-input">
            <input
              type="text"
              id="nova-text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isPending}
            />
            <button onClick={handleSend} disabled={isPending || !input.trim()}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
