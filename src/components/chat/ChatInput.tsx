import React, { useState, useRef, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Send, Loader2, Smile, Mic, Paperclip, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (message: string, options?: { mood?: string; quickAction?: string }) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const QUICK_SUGGESTIONS = [
  { text: 'Recommend me a comedy movie', mood: 'funny' },
  { text: 'I want to watch something scary', mood: 'scared' },
  { text: 'Show me romantic movies', mood: 'romantic' },
  { text: 'I\'m feeling adventurous', mood: 'adventurous' },
  { text: 'Something thoughtful and deep', mood: 'thoughtful' },
  { text: 'Popular movies this year', quickAction: 'trending' },
];

const MOOD_OPTIONS = [
  { label: '😄 Happy', value: 'happy' },
  { label: '😍 Romantic', value: 'romantic' },
  { label: '😱 Thrilled', value: 'thrilled' },
  { label: '🤔 Thoughtful', value: 'thoughtful' },
  { label: '😌 Chill', value: 'chill' },
  { label: '😢 Emotional', value: 'emotional' },
];

export function ChatInput({ 
  onSendMessage, 
  isLoading = false, 
  disabled = false, 
  placeholder = "Ask me for movie recommendations... e.g., 'I want a good sci-fi movie from 2020'" 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading || disabled) return;

    onSendMessage(trimmedMessage, { 
      mood: selectedMood || undefined 
    });
    
    setMessage('');
    setSelectedMood('');
    setShowSuggestions(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: typeof QUICK_SUGGESTIONS[0]) => {
    setMessage(suggestion.text);
    if (suggestion.mood) {
      setSelectedMood(suggestion.mood);
    }
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <TooltipProvider>
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        {/* Quick Suggestions */}
        {showSuggestions && (
          <div className="mb-4 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quick Suggestions
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mood Selector */}
        {selectedMood && (
          <div className="mb-3 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Mood:
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                {MOOD_OPTIONS.find(m => m.value === selectedMood)?.label || selectedMood}
              </span>
              <button
                onClick={() => setSelectedMood('')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Main Input Area */}
        <div className="flex gap-2">
          {/* Mood Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    selectedMood && "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                  )}
                  onClick={() => {
                    const moodMenu = document.createElement('div');
                    moodMenu.className = 'absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 min-w-[150px] z-50';
                    moodMenu.innerHTML = MOOD_OPTIONS.map(mood => 
                      `<button class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded" data-mood="${mood.value}">${mood.label}</button>`
                    ).join('');
                    
                    moodMenu.addEventListener('click', (e) => {
                      const target = e.target as HTMLElement;
                      const mood = target.getAttribute('data-mood');
                      if (mood) {
                        setSelectedMood(mood);
                      }
                      moodMenu.remove();
                    });
                    
                    document.body.appendChild(moodMenu);
                    
                    // Remove on click outside
                    setTimeout(() => {
                      const handleClickOutside = (e: MouseEvent) => {
                        if (!moodMenu.contains(e.target as Node)) {
                          moodMenu.remove();
                          document.removeEventListener('click', handleClickOutside);
                        }
                      };
                      document.addEventListener('click', handleClickOutside);
                    }, 100);
                  }}
                  disabled={disabled || isLoading}
                >
                  <Smile size={18} className={selectedMood ? "text-purple-600 dark:text-purple-400" : ""} />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Set your mood for better recommendations</p>
            </TooltipContent>
          </Tooltip>

          {/* Text Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              className={cn(
                "min-h-[50px] max-h-[120px] resize-none pr-12 rounded-2xl transition-colors",
                "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                "placeholder:text-gray-500 dark:placeholder:text-gray-400"
              )}
              rows={1}
            />
            
            {/* Suggestions Toggle Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  disabled={disabled || isLoading}
                >
                  <Sparkles size={16} className={showSuggestions ? "text-yellow-500" : "text-gray-400"} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show quick suggestions</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Send Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleSubmit}
                disabled={!message.trim() || disabled || isLoading}
                size="icon"
                className={cn(
                  "flex-shrink-0 transition-all duration-200",
                  message.trim() 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg" 
                    : "bg-gray-200 dark:bg-gray-700"
                )}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send message (Enter)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Input Help Text */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            Try: "romantic comedy", "sci-fi from 2020", "I'm feeling adventurous"
          </span>
          <span>
            {message.length}/500
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
}