import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Sparkles, User, X } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  title: string;
  description: string;
  duration: string;
  price: string;
  level: string;
}

interface ChatInterfaceProps {
  onCoursesUpdate?: (courses: Course[]) => void;
}

const ChatInterface = ({ onCoursesUpdate }: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (inputRef.current && messages.length === 0) {
      inputRef.current.focus();
    }
  }, [messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages: updatedMessages },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Update course recommendations if provided
      if (data.recommendations && onCoursesUpdate) {
        onCoursesUpdate(data.recommendations);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    if (onCoursesUpdate) {
      onCoursesUpdate([]);
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
                        onClick={() => sendMessage(prompt)}
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
                
                {isLoading && (
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
