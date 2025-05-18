import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface ActionButtonProps {
  isListening: boolean;
  onClick: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ isListening, onClick }) => {
  return (
    <div className="p-4 flex justify-center">
      <button
        onClick={onClick}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isListening ? (
          <MicOff className="h-8 w-8 text-white" />
        ) : (
          <Mic className="h-8 w-8 text-white" />
        )}
      </button>
    </div>
  );
};