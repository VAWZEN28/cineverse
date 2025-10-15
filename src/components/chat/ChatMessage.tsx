import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Movie } from '@/lib/movieService';
import { MovieCard } from '@/components/MovieCard';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  movies?: Movie[];
  reasoning?: string;
  confidence?: number;
}

interface ChatMessageProps {
  message: ChatMessage;
  onMovieSelect?: (movie: Movie) => void;
}

export function ChatMessage({ message, onMovieSelect }: ChatMessageProps) {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 animate-in slide-in-from-bottom-2 duration-300',
        isUser && 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold',
          isUser
            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
            : isSystem
            ? 'bg-gradient-to-r from-gray-500 to-gray-600'
            : 'bg-gradient-to-r from-yellow-500 to-orange-500'
        )}
      >
        {isUser ? <User size={16} /> : isSystem ? <Clock size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Content */}
      <div className={cn('flex-1 max-w-[80%]', isUser && 'flex flex-col items-end')}>
        {/* Message Bubble */}
        <div
          className={cn(
            'relative px-4 py-3 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : isSystem
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
          )}
        >
          {/* Message Status Indicator */}
          {isUser && message.status && (
            <div className="absolute -bottom-1 -right-1">
              {message.status === 'sending' && (
                <Clock size={12} className="text-white/70 animate-spin" />
              )}
              {message.status === 'sent' && (
                <CheckCircle size={12} className="text-white/70" />
              )}
              {message.status === 'error' && (
                <XCircle size={12} className="text-red-300" />
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-2">
            <p className="whitespace-pre-wrap">{message.content}</p>

            {/* Reasoning and Confidence */}
            {message.reasoning && !isUser && (
              <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  {message.reasoning}
                </p>
                {message.confidence && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Confidence:
                    </span>
                    <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          message.confidence > 0.8
                            ? 'bg-green-500'
                            : message.confidence > 0.6
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        )}
                        style={{ width: `${message.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(message.confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Movie Recommendations */}
        {message.movies && message.movies.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              🎬 Movie Recommendations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {message.movies.slice(0, 6).map((movie) => (
                <div
                  key={movie.id}
                  className="transform transition-all duration-200 hover:scale-105 cursor-pointer"
                  onClick={() => onMovieSelect?.(movie)}
                >
                  <MovieCard
                    movie={movie}
                    compact
                    showQuickActions={false}
                  />
                </div>
              ))}
            </div>
            
            {message.movies.length > 6 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                And {message.movies.length - 6} more recommendations...
              </p>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={cn(
            'mt-1 text-xs text-gray-500 dark:text-gray-400',
            isUser ? 'text-right' : 'text-left'
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}