'use client';

import { Check, X, Minus } from 'lucide-react';

interface ResultIconProps {
  result: string | null;
  size?: 'sm' | 'md';
}

export function ResultIcon({ result, size = 'md' }: ResultIconProps) {
  const sizeClasses = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  const iconSize = size === 'sm' ? 12 : 14;

  if (!result) {
    return <div className={`${sizeClasses}`} />;
  }

  if (result === 'W') {
    return (
      <div className={`${sizeClasses} rounded-full bg-blue-500 flex items-center justify-center`}>
        <Check className="text-white" size={iconSize} strokeWidth={3} />
      </div>
    );
  }

  if (result === 'D') {
    return (
      <div className={`${sizeClasses} rounded-full bg-gray-400 flex items-center justify-center`}>
        <Minus className="text-white" size={iconSize} strokeWidth={3} />
      </div>
    );
  }

  if (result === 'L') {
    return (
      <div className={`${sizeClasses} rounded-full bg-red-500 flex items-center justify-center`}>
        <X className="text-white" size={iconSize} strokeWidth={3} />
      </div>
    );
  }

  return <div className={`${sizeClasses}`} />;
}
