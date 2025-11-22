import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Sparkles, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatSocket } from "@/hooks/use-chat-socket";
import type { CourseRecommendation } from "@/services/chat/chat-socket.service";
import { getOrCreateUserId } from "@/utils/user-id";

const suggestedPrompts = [
  "How to get OSHA licence?",
  "Quiz me on Unit 1: Working in the Private Security Industry",
  "What documents do I need for the exams?",
  "Which OSHA licence should I get?",
  "How can I find jobs in the security industry?",
  "Who made you?",
  "What is the difference between Door Supervision and Security Guard licence?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Course {
  courseId: string;
  courseName: string;
  description: string;
  duration: string;
  price: string;
  url: string;
  level?: string;
  tag?: string;
}

interface ChatInterfaceProps {
  onCoursesUpdate?: (courses: Course[]) => void;
}

const ChatInterface = ({ onCoursesUpdate }: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handlePartial = useCallback(
    (payload: { delta: string }) => {
      setCurrentAssistantMessage((prev) => prev + payload.delta);
    },
    []
  );

  const handleFinal = useCallback(
    (payload: {
      reply: string;
      hasNewRecommendations: boolean;
      recommendations: CourseRecommendation[];
      sessionId: string;
    }) => {
      setCurrentAssistantMessage("");
      const assistantMessage: Message = {
        role: "assistant",
        content: payload.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setSessionId(payload.sessionId);

      if (payload.hasNewRecommendations && onCoursesUpdate) {
        const courses: Course[] = payload.recommendations.map((rec) => ({
          courseId: rec.courseId,
          courseName: rec.courseName,
          description: rec.description,
          duration: rec.duration,
          price: rec.price,
          url: rec.url,
        }));
        onCoursesUpdate(courses);
      }

      setIsLoading(false);
    },
    [onCoursesUpdate]
  );

  const handleError = useCallback((payload: { message: string }) => {
    toast({
      title: "Error",
      description: payload.message || "Failed to get response. Please try again.",
      variant: "destructive",
    });
    setCurrentAssistantMessage("");
    setIsLoading(false);
    setMessages((prev) => prev.slice(0, -1));
  }, [toast]);

  const handleSessionStarted = useCallback(
    (payload: { sessionId: string }) => {
      setSessionId(payload.sessionId);
    },
    []
  );

  const userId = useMemo(() => getOrCreateUserId(), []);

  const { startSession, sendMessage, isConnected } = useChatSocket({
    userId,
    handlers: {
      onPartial: handlePartial,
      onFinal: handleFinal,
      onError: handleError,
      onSessionStarted: handleSessionStarted,
      onConnect: () => {
        console.log("Connected to chat server");
      },
      onDisconnect: () => {
        console.log("Disconnected from chat server");
      },
    },
  });

  useEffect(() => {
    if (inputRef.current && messages.length === 0) {
      inputRef.current.focus();
    }
  }, [messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentAssistantMessage]);

  useEffect(() => {
    if (isConnected() && !sessionId) {
      startSession();
    }
  }, [isConnected, sessionId, startSession]);

  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim() || isLoading || !isConnected()) {
      if (!isConnected()) {
        toast({
          title: "Connection Error",
          description: "Not connected to chat server. Please wait...",
          variant: "destructive",
        });
      }
      return;
    }

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setCurrentAssistantMessage("");

    try {
      sendMessage(messageText, sessionId);
    } catch (error) {
      console.error("Error sending message:", error);
      handleError({
        message: "Failed to send message. Please try again.",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setCurrentAssistantMessage("");
    setSessionId(undefined);
    if (onCoursesUpdate) {
      onCoursesUpdate([]);
    }
    if (isConnected()) {
      startSession();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-full">
      <div className="flex flex-col h-full bg-card/30 backdrop-blur-sm rounded-3xl border-2 border-border overflow-hidden shadow-xl">
        
        {/* Header with Close Button */}
        {messages.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Chat with SafetyPartner</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleNewChat}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Messages Area with Scroll */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6 max-w-4xl mx-auto min-h-full flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="space-y-6 text-center max-w-2xl">
                  <p className="text-muted-foreground text-lg">Choose a question below or type your own</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        className="px-5 py-2.5 bg-card hover:bg-muted text-foreground text-sm rounded-full transition-all border border-border hover:border-primary/40 focus:outline-none focus:ring-0 shadow-sm animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => handleSendMessage(prompt)}
                        tabIndex={-1}
                        disabled={isLoading}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-muted-foreground">
                      {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNewChat}
                    className="text-xs hover:text-primary"
                  >
                    New Chat
                  </Button>
                </div>
                
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 animate-fade-in ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-6 py-4 max-w-2xl ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-card text-foreground border-2 border-border shadow-md"
                      }`}
                    >
                      <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0 w-10 h-10 bg-foreground/10 rounded-full flex items-center justify-center border border-border">
                        <User className="h-5 w-5 text-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && currentAssistantMessage && (
                  <div className="flex gap-4 justify-start animate-fade-in">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                      <Bot className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <div className="rounded-2xl px-6 py-4 bg-card border-2 border-border shadow-md">
                      <p className="text-base leading-relaxed whitespace-pre-wrap">
                        {currentAssistantMessage}
                        <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
                      </p>
                    </div>
                  </div>
                )}

                {isLoading && !currentAssistantMessage && (
                  <div className="flex gap-4 justify-start animate-fade-in">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                      <Bot className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <div className="rounded-2xl px-6 py-4 bg-card border-2 border-border">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>

        {/* Input Area - Fixed at Bottom */}
        <div className="p-6 border-t-2 border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3 items-center bg-background/50 rounded-2xl p-4 border-2 border-primary/30 hover:border-primary/50 transition-all shadow-lg focus-within:border-primary focus-within:shadow-primary/20">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center border border-primary/30">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={messages.length === 0 ? "Ask me anything about OSHA training..." : "Ask a follow-up question..."}
                className="flex-1 h-12 text-lg border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 font-medium"
                autoFocus
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 text-primary-foreground font-bold px-6 gap-2 rounded-xl h-12 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all group"
                tabIndex={0}
                disabled={isLoading}
              >
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">{isLoading ? "..." : "Ask"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
