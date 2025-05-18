import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { User, Bot } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`flex items-start gap-3 ${
            message.role === 'assistant' ? 'justify-start' : 'justify-end'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Bot size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
          )}
          
          <div 
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              message.role === 'assistant' 
                ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm' 
                : 'bg-blue-600 text-white shadow-sm'
            }`}
          >
            <p>{message.content}</p>
          </div>
          
          {message.role === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};