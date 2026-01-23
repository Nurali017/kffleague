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
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select...',
  className = '',
  isStringId = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark-surface text-left focus:outline-none focus:ring-2 focus:ring-[#1E4D8C] dark:focus:ring-blue-500 transition-colors"
      >
        {selectedOptions.length === 0 ? (
          <span className="text-gray-400 dark:text-slate-500">{placeholder}</span>
        ) : selectedOptions.length <= 2 ? (
          <span className="text-gray-900 dark:text-slate-100 truncate block">
            {selectedOptions.map(opt => opt.name).join(', ')}
          </span>
        ) : (
          <span className="text-gray-900 dark:text-slate-100">
            {selectedOptions.length} выбрано
          </span>
        )}
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg">
          {options.map(option => (
            <label
              key={option.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-dark-surface-soft cursor-pointer transition-colors border-b border-gray-100 dark:border-slate-700 last:border-b-0"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={() => toggleOption(option.id)}
                className="w-4 h-4 text-[#1E4D8C] border-gray-300 dark:border-slate-600 rounded focus:ring-[#1E4D8C] dark:focus:ring-blue-500"
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
              <span className="text-sm text-gray-900 dark:text-slate-100">{option.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
