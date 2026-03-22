'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Send,
  Brain,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const STARTER_QUESTIONS = [
  'How can I improve my cash flow?',
  "What's a healthy gross margin for residential construction?",
  'How do I calculate bonding capacity?',
  'Explain WIP accounting',
  'Tax strategies for contractors',
  'How to manage retainage effectively',
];

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add placeholder for AI response
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            userMessage,
          ].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        fullContent += text;

        // Update the assistant message with streamed content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: fullContent }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error:', error);
      // Update error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  'Sorry, I encountered an error processing your request. Please try again.',
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[#2a2a3d] bg-[#12121a] px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="text-[#6366f1]" size={28} />
            <h1 className="text-3xl font-bold text-[#e8e8f0]">CFO Advisor</h1>
          </div>
          <p className="text-[#8888a0]">
            AI-powered financial guidance for contractors
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            // Empty state with starter questions
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center">
                    <Sparkles className="text-[#6366f1]" size={32} />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-[#e8e8f0]">
                  Welcome to your CFO Advisor
                </h2>
                <p className="text-[#8888a0] max-w-md mx-auto">
                  Get expert financial guidance on construction accounting, cash
                  flow, tax planning, and more.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {STARTER_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="p-4 rounded-lg border border-[#2a2a3d] bg-[#12121a] hover:bg-[#1a1a26] hover:border-[#6366f1]/50 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <MessageSquare
                        className="text-[#6366f1] group-hover:text-[#8b5cf6] flex-shrink-0 mt-1"
                        size={18}
                      />
                      <p className="text-sm text-[#e8e8f0] group-hover:text-white transition-colors">
                        {question}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Messages
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex gap-3 w-full max-w-2xl">
                      <div className="w-8 h-8 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center flex-shrink-0">
                        <Brain className="text-[#6366f1]" size={18} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Card className="bg-[#12121a] border-[#2a2a3d] px-4 py-3">
                          <p className="text-[#e8e8f0] text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </Card>
                      </div>
                    </div>
                  )}

                  {message.role === 'user' && (
                    <div className="flex-1 flex justify-end max-w-2xl">
                      <Card className="bg-[#6366f1] border-[#6366f1] px-4 py-3">
                        <p className="text-white text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </Card>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 w-full max-w-2xl">
                    <div className="w-8 h-8 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center flex-shrink-0">
                      <Brain className="text-[#6366f1]" size={18} />
                    </div>
                    <div className="flex-1">
                      <Card className="bg-[#12121a] border-[#2a2a3d] px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce"
                              style={{ animationDelay: '0.1s' }}
                            />
                            <div
                              className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </div>
                          <span className="text-[#8888a0] text-xs">
                            Thinking...
                          </span>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-[#2a2a3d] bg-[#12121a] p-6">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your CFO advisor..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3d] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white gap-2 px-6"
            >
              <Send size={18} />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
          <div className="text-xs text-[#8888a0] text-center">
            Powered by Claude
          </div>
        </div>
      </div>
    </div>
  );
}
