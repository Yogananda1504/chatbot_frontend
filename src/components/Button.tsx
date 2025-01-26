import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function Button({ children, isLoading, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium 
        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
        focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors ${props.className || ''}`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
      ) : (
        children
      )}
    </button>
  );
}