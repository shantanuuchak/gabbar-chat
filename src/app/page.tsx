
"use client";

import type { FormEvent } from 'react';
import { useState, useTransition, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Paperclip, Mic, Send, Bot, User, Sparkles, ChevronDown, CornerDownLeft, Camera, Video, AlertTriangle, Loader2 } from 'lucide-react';
import { handleChatInteraction } from '@/app/actions';
import type { AiActionResult } from '@/app/actions';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


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

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleCamera = useCallback(() => {
    setIsCameraOpen(prev => !prev);
    setCameraError(null); 
  }, []);

  useEffect(() => {
    if (isCameraOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setVideoStream(stream);
          setHasCameraPermission(true);
          setCameraError(null);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          setVideoStream(null);
          const errorName = error instanceof Error ? error.name : "UnknownError";
          let errorMessage = `Camera access denied: ${errorName}. Please enable camera permissions in your browser settings.`;
          if (errorName === 'NotAllowedError') {
            errorMessage = 'Camera permission was denied. Please enable it in your browser settings to use this feature.';
          } else if (errorName === 'NotFoundError') {
            errorMessage = 'No camera was found. Please ensure a camera is connected and enabled.';
          }
          setCameraError(errorMessage);
          toast({
            variant: 'destructive',
            title: 'Camera Access Issue',
            description: errorMessage,
          });
        }
      };
      getCameraPermission();
    } else {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setVideoStream(null);
    }

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen, toast]);


  const handleSubmit = async (event?: FormEvent) => {
    if (event) event.preventDefault();
    const currentInput = inputValue.trim();
    if (!currentInput && !isCameraOpen) return; // Need input if camera is off

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      text: currentInput || (isCameraOpen && videoStream ? "(Analyzing image...)" : "Empty message"),
      sender: 'user',
      name: 'You',
      avatarUrl: 'https://placehold.co/40x40.png?text=U',
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue('');

    startTransition(async () => {
      const formData = new FormData();
      formData.append('userInput', currentInput);
      formData.append('history', JSON.stringify(messages.slice(-10)));

      if (isCameraOpen && videoRef.current && videoRef.current.readyState >= videoRef.current.HAVE_CURRENT_DATA && videoStream) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          try {
            const imageDataUri = canvas.toDataURL('image/webp', 0.8); // Use webp for better compression
            formData.append('imageDataUri', imageDataUri);
          } catch (e) {
            console.error("Error converting canvas to Data URI:", e);
             toast({
              variant: 'destructive',
              title: 'Image Capture Failed',
              description: 'Could not capture image from camera. Please try again.',
            });
          }
        }
      }

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
      inputRef.current.style.height = 'auto';
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
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
      {messages.length === 0 && !isCameraOpen && (
        <div className="text-center my-auto">
          <h1 className="text-4xl font-semibold text-foreground/90 mb-8">
            Hey, what&apos;s on your mind today?
          </h1>
        </div>
      )}

      <ScrollArea className={cn("flex-grow w-full mb-4", messages.length > 0 || isCameraOpen ? "block" : "hidden")}>
        <div className="space-y-6 pr-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {isCameraOpen && (
        <div className="mb-2 border border-border rounded-md overflow-hidden shadow-md bg-card">
          <video 
            ref={videoRef} 
            className={cn("w-full aspect-video", { 'hidden': !videoStream && hasCameraPermission !== false })} // Hide if no stream unless explicit error
            autoPlay 
            muted 
            playsInline 
          />
          {hasCameraPermission === false && cameraError && (
            <div className="w-full aspect-video flex flex-col items-center justify-center p-4 text-destructive-foreground bg-destructive/80">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p className="font-semibold">Camera Error</p>
              <p className="text-sm text-center">{cameraError}</p>
            </div>
          )}
          {hasCameraPermission === null && !cameraError && ( // Initial loading state
            <div className="w-full aspect-video flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Requesting camera access...</p>
            </div>
          )}
        </div>
      )}


      <form onSubmit={handleSubmit} className="mt-auto sticky bottom-0 pb-4 bg-background">
        <div className="relative flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-lg">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask Gabbar..."
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
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("text-foreground/60 hover:text-foreground", isCameraOpen && videoStream && "text-primary bg-primary/10")}
                onClick={toggleCamera}
                type="button"
                title={isCameraOpen ? "Turn off camera" : "Turn on camera"}
              >
                {isCameraOpen ? <Video className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                <span className="sr-only">{isCameraOpen ? "Turn off camera & video input" : "Turn on camera for video input"}</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground" title="Use microphone (disabled)">
                <Mic className="w-5 h-5" />
                <span className="sr-only">Use microphone</span>
              </Button>
            </div>
            <Button 
              type="submit" 
              size="icon" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg w-9 h-9"
              disabled={isPending || (!inputValue.trim() && (!isCameraOpen || !videoStream))}
              title="Send message"
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

