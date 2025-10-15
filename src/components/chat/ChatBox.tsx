import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, MessageCircle, Minimize2, Maximize2, RotateCcw, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useAuth } from '@/contexts/AuthContext';
import { Movie, MovieService } from '@/lib/movieService';
import { recommendationService, RecommendationRequest } from '@/lib/recommendationService';
import { toast } from '@/hooks/use-toast';

interface ChatBoxProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  sessionId: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  type: 'bot',
  content: `🎬 Welcome to CineBot! I'm your personal movie recommendation assistant.

I can help you find the perfect movie based on:
• Your mood (happy, romantic, thrilled, etc.)
• Specific genres (action, comedy, drama, etc.)
• Time periods (movies from specific years)
• Rating preferences
• Your viewing history

Just tell me what you're in the mood for, and I'll recommend something great!`,
  timestamp: new Date(),
  confidence: 1.0,
  reasoning: "Ready to help you discover amazing movies!"
};

const STORAGE_KEY = 'cineverse_chat_history';

export function ChatBox({ isOpen, onToggle, className }: ChatBoxProps) {
  const { user, isAuthenticated } = useAuth();
  const [chatState, setChatState] = useState<ChatState>({
    messages: [WELCOME_MESSAGE],
    isLoading: false,
    sessionId: `session_${Date.now()}`
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [chatState.messages, isOpen, scrollToBottom]);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          setChatState(prev => ({
            ...prev,
            messages: [...parsedHistory.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))]
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, []);

  // Save chat history to localStorage
  const saveChatHistory = useCallback((messages: ChatMessage[]) => {
    try {
      // Only save the last 50 messages to prevent localStorage bloat
      const messagesToSave = messages.slice(-50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, []);

  // Add message to chat
  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    setChatState(prev => {
      const updatedMessages = [...prev.messages, newMessage];
      saveChatHistory(updatedMessages);
      return {
        ...prev,
        messages: updatedMessages
      };
    });

    // Increment unread count if chat is closed
    if (!isOpen && message.type === 'bot') {
      setUnreadCount(prev => prev + 1);
    }

    return newMessage;
  }, [isOpen, saveChatHistory]);

  // Update message
  const updateMessage = useCallback((messageId: string, updates: Partial<ChatMessage>) => {
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    }));
  }, []);

  // Get user context for recommendations
  const getUserContext = useCallback(async () => {
    if (!isAuthenticated || !user) {
      return undefined;
    }

    try {
      const likedMovies = await MovieService.getLikedMovies();
      const preferences = await recommendationService.getUserPreferences(user.id);
      
      return {
        likedMovies,
        ratedMovies: [], // Would get from user's rating history in a real app
        preferences
      };
    } catch (error) {
      console.error('Failed to get user context:', error);
      return undefined;
    }
  }, [isAuthenticated, user]);

  // Handle sending messages and getting recommendations
  const handleSendMessage = useCallback(async (
    content: string, 
    options?: { mood?: string; quickAction?: string }
  ) => {
    // Add user message immediately
    const userMessage = addMessage({
      type: 'user',
      content,
      status: 'sent'
    });

    // Set loading state
    setChatState(prev => ({ ...prev, isLoading: true }));

    try {
      // Get user context
      const userContext = await getUserContext();

      // Create recommendation request
      const recommendationRequest: RecommendationRequest = {
        query: content,
        mood: options?.mood,
        maxResults: 8,
        userContext
      };

      console.log('💬 Chat: Sending recommendation request:', recommendationRequest);

      // Get recommendations
      const recommendations = await recommendationService.getRecommendations(recommendationRequest);
      
      console.log('💬 Chat: Received recommendations:', recommendations);

      // Create bot response
      let botResponse = recommendations.reasoning;
      
      if (recommendations.movies.length === 0) {
        botResponse = "I couldn't find any movies matching your request right now. This might be due to specific filters or temporary API issues. Try describing what you're looking for in a different way, or ask for popular movies instead!";
      } else if (recommendations.movies.length === 1) {
        botResponse += `\n\nI found the perfect movie for you!`;
      } else {
        botResponse += `\n\nI found ${recommendations.movies.length} great movies for you!`;
      }

      // Add bot message with recommendations
      addMessage({
        type: 'bot',
        content: botResponse,
        movies: recommendations.movies,
        reasoning: recommendations.reasoning,
        confidence: recommendations.confidence
      });

    } catch (error) {
      console.error('Failed to get recommendations:', error);
      
      // Add error message
      addMessage({
        type: 'bot',
        content: `I apologize, but I'm having trouble processing your request right now. This could be due to:\n\n• Temporary connectivity issues\n• High demand on our recommendation system\n• API limitations\n\nPlease try again in a moment, or try asking in a different way. I'm here to help! 🎬`,
        confidence: 0.1
      });
      
      // Show error toast
      toast({
        title: "Recommendation Error",
        description: "Failed to get movie recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setChatState(prev => ({ ...prev, isLoading: false }));
    }
  }, [addMessage, getUserContext]);

  // Handle movie selection from recommendations
  const handleMovieSelect = useCallback((movie: Movie) => {
    addMessage({
      type: 'system',
      content: `🎬 You selected: **${movie.title}** (${movie.year})\n\nRating: ⭐ ${movie.rating}/10\nGenre: ${movie.genre}\n\n${movie.description ? movie.description.substring(0, 200) + '...' : 'Great choice!'}`
    });
    
    // You could also trigger a movie details modal here
    // onMovieClick?.(movie);
    
    toast({
      title: "Movie Selected",
      description: `${movie.title} - Click to see details`,
    });
  }, [addMessage]);

  // Clear chat history
  const handleClearChat = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      messages: [WELCOME_MESSAGE],
      sessionId: `session_${Date.now()}`
    }));
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "Chat Cleared",
      description: "Your conversation history has been cleared.",
    });
  }, []);

  if (!isOpen) {
    // Chat toggle button when closed
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          onClick={onToggle}
          size="lg"
          className="relative h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        >
          <MessageCircle size={24} className="text-white" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] transition-all duration-300",
      isMinimized ? "h-14" : "h-[600px]",
      className
    )}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                CineBot
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {chatState.isLoading ? 'Finding recommendations...' : 'Your movie assistant'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="h-8 w-8 p-0"
              disabled={chatState.isLoading}
            >
              <RotateCcw size={16} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        {!isMinimized && (
          <>
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4">
                {chatState.messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onMovieSelect={handleMovieSelect}
                  />
                ))}
                {chatState.isLoading && (
                  <div className="flex gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 max-w-[80%]">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Finding perfect movies for you...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={chatState.isLoading}
              disabled={false}
            />
          </>
        )}
      </div>
    </div>
  );
}