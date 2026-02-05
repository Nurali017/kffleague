'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  id: number | string;
  name: string;
  logo_url?: string | null;
}

interface MultiSelectProps {
  options: Option[];
  selected: (number | string)[];
  onChange: (selected: any[]) => void;
  placeholder?: string;
  className?: string;
  isStringId?: boolean;
  variant?: 'default' | 'hero';
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select...',
  className = '',
  isStringId = false,
  variant = 'default',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHero = variant === 'hero';

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOption = (id: number | string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const selectedOptions = options.filter(opt => selected.includes(opt.id));

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 pr-10 text-sm border rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-[#1E4D8C] dark:focus:ring-blue-500 transition-colors ${
          isHero
            ? 'bg-white/85 dark:bg-white/10 border-gray-200 dark:border-white/15'
            : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border'
        }`}
      >
        {selectedOptions.length === 0 ? (
          <span className={isHero ? 'text-gray-400 dark:text-white/50' : 'text-gray-400 dark:text-slate-500'}>
            {placeholder}
          </span>
        ) : selectedOptions.length <= 2 ? (
          <span className={`truncate block ${isHero ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-slate-100'}`}>
            {selectedOptions.map(opt => opt.name).join(', ')}
          </span>
        ) : (
          <span className={isHero ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-slate-100'}>
            {selectedOptions.length} выбрано
          </span>
        )}
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          } ${isHero ? 'text-gray-400 dark:text-white/50' : 'text-gray-400 dark:text-slate-500'}`}
        />
      </button>

      {isOpen && (
        <div className={`absolute z-50 mt-1 w-full max-h-60 overflow-auto border rounded-lg shadow-lg ${
          isHero
            ? 'bg-white/90 dark:bg-dark-bg/80 border-gray-200 dark:border-white/10'
            : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border'
        }`}>
          {options.map(option => (
            <label
              key={option.id}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors border-b last:border-b-0 ${
                isHero
                  ? 'hover:bg-gray-50 dark:hover:bg-white/10 border-gray-100 dark:border-white/10'
                  : 'hover:bg-gray-50 dark:hover:bg-dark-surface-soft border-gray-100 dark:border-dark-border'
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={() => toggleOption(option.id)}
                className={`w-4 h-4 text-[#1E4D8C] rounded focus:ring-[#1E4D8C] dark:focus:ring-blue-500 ${
                  isHero ? 'border-gray-300 dark:border-white/30' : 'border-gray-300 dark:border-dark-border-soft'
                }`}
              />
              {option.logo_url && (
                <img
                  src={option.logo_url}
                  alt={option.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <span className={`text-sm ${isHero ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-slate-100'}`}>
                {option.name}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
