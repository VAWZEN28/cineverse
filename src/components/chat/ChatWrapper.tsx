import React from 'react';
import { ChatBox } from './ChatBox';
import { useChat } from '@/contexts/ChatContext';

export function ChatWrapper() {
  const { isChatOpen, toggleChat } = useChat();

  return (
    <ChatBox
      isOpen={isChatOpen}
      onToggle={toggleChat}
    />
  );
}