import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  isDarkMode: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, isDarkMode }) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${
      isDarkMode 
        ? 'from-gray-900 via-gray-800 to-blue-900' 
        : 'from-blue-50 via-slate-50 to-gray-100'
    } text-gray-900 dark:text-white`}>
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto shadow-2xl rounded-lg overflow-hidden my-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
        {children}
      </div>
    </div>
  );
};