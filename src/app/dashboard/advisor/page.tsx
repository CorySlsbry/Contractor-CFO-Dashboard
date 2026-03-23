'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Send,
  Brain,
  Sparkles,
  MessageSquare,
  RotateCcw,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const STARTER_QUESTIONS = [
  { text: 'How can I improve my cash flow?', icon: '💰' },
  { text: "What's a healthy gross margin for residential construction?", icon: '📊' },
  { text: 'How do I calculate bonding capacity?', icon: '🏗️' },
  { text: 'Explain WIP accounting for contractors', icon: '📋' },
  { text: 'Tax strategies for construction businesses', icon: '📑' },
  { text: 'How to manage retainage effectively', icon: '🔒' },
];

// Simple markdown-like renderer for AI responses
function FormattedMessage({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const Tag = listType;
      elements.push(
        <Tag
          key={`list-${elements.length}`}
          className={`${listType === 'ol' ? 'list-decimal' : 'list-disc'} pl-5 space-y-1.5 my-3`}
        >
          {listItems.map((item, i) => (
            <li key={i} className="text-[#c8c8d8] text-sm leading-relaxed">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </Tag>
      );
      listItems = [];
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headers
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${i}`} className="text-sm font-bold text-[#e8e8f0] mt-4 mb-2 uppercase tracking-wide">
          {renderInlineFormatting(line.slice(4))}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${i}`} className="text-base font-bold text-[#e8e8f0] mt-5 mb-2 border-b border-[#2a2a3d] pb-2">
          {renderInlineFormatting(line.slice(3))}
        </h3>
      );
    } else if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${i}`} className="text-lg font-bold text-[#e8e8f0] mt-5 mb-3">
          {renderInlineFormatting(line.slice(2))}
        </h2>
      );
    }
    // Numbered list
    else if (/^\d+\.\s/.test(line)) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listItems.push(line.replace(/^\d+\.\s/, ''));
    }
    // Bullet list
    else if (/^[-*]\s/.test(line.trim())) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listItems.push(line.trim().replace(/^[-*]\s/, ''));
    }
    // Horizontal rule
    else if (/^---+$/.test(line.trim())) {
      flushList();
      elements.push(<hr key={`hr-${i}`} className="border-[#2a2a3d] my-4" />);
    }
    // Empty line
    else if (line.trim() === '') {
      flushList();
    }
    // Regular paragraph
    else {
      flushList();
      elements.push(
        <p key={`p-${i}`} className="text-[#c8c8d8] text-sm leading-relaxed my-2">
          {renderInlineFormatting(line)}
        </p>
      );
    }
  }
  flushList();

  return <div className="space-y-0.5">{elements}</div>;
}

function renderInlineFormatting(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  // Bold: **text**
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let keyIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={`b-${keyIdx++}`} className="font-semibold text-[#e8e8f0]">
        {match[1]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: fullContent } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: 'Sorry, I encountered an error processing your request. Please try again.' }
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

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-[#2a2a3d]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
              <Brain className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#e8e8f0]">CFO Advisor</h1>
              <p className="text-xs text-[#8888a0]">AI-powered financial guidance for contractors</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8888a0] hover:text-[#e8e8f0] hover:bg-[#2a2a3d] transition-all"
            >
              <RotateCcw size={14} />
              New Chat
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="space-y-8 pt-8">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 border border-[#6366f1]/30 flex items-center justify-center">
                    <Sparkles className="text-[#6366f1]" size={28} />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-[#e8e8f0]">
                  How can I help your business?
                </h2>
                <p className="text-sm text-[#8888a0] max-w-md mx-auto">
                  Ask me about cash flow, job costing, tax strategy, bonding, WIP accounting, or any construction financial topic.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STARTER_QUESTIONS.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(q.text)}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-[#2a2a3d] bg-[#12121a] hover:bg-[#1a1a26] hover:border-[#6366f1]/40 transition-all duration-200 text-left group"
                  >
                    <span className="text-lg flex-shrink-0">{q.icon}</span>
                    <p className="text-sm text-[#a0a0b8] group-hover:text-[#e8e8f0] transition-colors leading-snug">
                      {q.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[75%]">
                        <div className="bg-[#6366f1] rounded-2xl rounded-br-md px-4 py-3">
                          <p className="text-white text-sm leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <Brain className="text-white" size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl rounded-tl-md px-5 py-4">
                          {message.content ? (
                            <FormattedMessage content={message.content} />
                          ) : (
                            <div className="flex items-center gap-2 py-1">
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                              </div>
                              <span className="text-[#8888a0] text-xs ml-1">Analyzing...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-[#2a2a3d] bg-[#0a0a0f] px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2.5 items-center bg-[#12121a] border border-[#2a2a3d] rounded-xl px-4 py-2 focus-within:border-[#6366f1] focus-within:ring-1 focus-within:ring-[#6366f1]/50 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask your CFO advisor..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-[#e8e8f0] text-sm placeholder-[#666680] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed py-1.5"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              size="sm"
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg px-3 h-8 disabled:opacity-30"
            >
              <Send size={15} />
            </Button>
          </div>
          <p className="text-[10px] text-[#555568] text-center mt-2">
            Powered by Claude &middot; Not a substitute for professional financial advice
          </p>
        </div>
      </div>
    </div>
  );
}
