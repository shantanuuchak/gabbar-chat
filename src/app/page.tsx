"use client";

import type { FormEvent } from 'react';
import { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Paperclip, Mic, Plus, Send, Bot, User, Sparkles, ChevronDown, CornerDownLeft } from 'lucide-react';
import { handleChatInteraction } from '@/app/actions';
import type { AiActionResult } from '@/app/actions';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  avatarUrl?: string;
  name: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (event?: FormEvent) => {
    if (event) event.preventDefault();
    const currentInput = inputValue.trim();
    if (!currentInput) return;

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      text: currentInput,
      sender: 'user',
      name: 'You',
      avatarUrl: 'https://placehold.co/40x40.png?text=U',
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue('');

    startTransition(async () => {
      const formData = new FormData();
      formData.append('userInput', currentInput);
      formData.append('history', JSON.stringify(messages.slice(-10))); // Send last 10 messages as history

      const result = await handleChatInteraction(formData);

      if (result.output) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          text: result.output,
          sender: 'ai',
          name: 'AI Assistant',
          avatarUrl: 'https://placehold.co/40x40.png?text=AI',
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else if (result.error) {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          text: `Error: ${result.error}`,
          sender: 'ai',
          name: 'AI Assistant',
          avatarUrl: 'https://placehold.co/40x40.png?text=AI',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    });
     if (inputRef.current) {
      inputRef.current.style.height = 'auto'; // Reset height before recalculating
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'; // Reset height to shrink if text is deleted
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // Grow to fit content
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };


  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
      {messages.length === 0 && (
        <div className="text-center my-auto">
          <h1 className="text-4xl font-semibold text-foreground/90 mb-8">
            Hey, what&apos;s on your mind today?
          </h1>
        </div>
      )}

      <ScrollArea className={cn("flex-grow w-full mb-4", messages.length > 0 ? "block" : "hidden")}>
        <div className="space-y-6 pr-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="mt-auto sticky bottom-0 pb-4 bg-background">
        <div className="relative flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-lg">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Copilot..."
            className="w-full resize-none border-0 bg-transparent focus:ring-0 focus-visible:ring-0 p-2 pr-20 min-h-[40px] max-h-[200px] text-base"
            rows={1}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-sm text-foreground/80 hover:bg-muted">
                    <Sparkles className="w-4 h-4 mr-2 text-accent" />
                    Quick response
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Suggestion 1</DropdownMenuItem>
                  <DropdownMenuItem>Suggestion 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
               <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground">
                <Plus className="w-5 h-5" />
                <span className="sr-only">Add attachment</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground">
                <Mic className="w-5 h-5" />
                <span className="sr-only">Use microphone</span>
              </Button>
            </div>
            <Button 
              type="submit" 
              size="icon" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg w-9 h-9"
              disabled={isPending || !inputValue.trim()}
            >
              {isPending ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
         <p className="text-xs text-center text-muted-foreground mt-2 px-2">
           Press <CornerDownLeft className="inline h-3 w-3" /> to send. AI can make mistakes.
        </p>
      </form>
    </div>
  );
}
