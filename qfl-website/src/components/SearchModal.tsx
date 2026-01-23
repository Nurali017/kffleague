'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Loader2 } from 'lucide-react';
import { useLatestNews } from '@/hooks';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { latestNews } = useLatestNews({ limit: 20 });

  // Filter news based on query
  const searchResults = query.length >= 2
    ? latestNews.filter(news =>
        news.title.toLowerCase().includes(query.toLowerCase()) ||
        (news.excerpt && news.excerpt.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.length >= 2) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative max-w-2xl mx-auto mt-20 px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center px-6 py-4 border-b border-gray-100">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по новостям..."
              className="flex-1 text-lg outline-none placeholder-gray-400"
            />
            {isSearching && (
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin mr-2" />
            )}
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Закрыть поиск"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {query.length >= 2 ? (
              searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((news) => (
                    <Link
                      key={news.id}
                      href={`/news/${news.id}`}
                      onClick={handleClose}
                      className="flex items-start px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      {news.image_url && (
                        <img
                          src={news.image_url}
                          alt=""
                          className="w-16 h-16 object-cover rounded-lg mr-4 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#1E4D8C] line-clamp-2 mb-1">
                          {news.title}
                        </h4>
                        {news.excerpt && (
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {news.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <p>Ничего не найдено по запросу &ldquo;{query}&rdquo;</p>
                </div>
              )
            ) : (
              <div className="py-8 text-center text-gray-400">
                <p>Введите минимум 2 символа для поиска</p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Быстрые ссылки</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/news"
                onClick={handleClose}
                className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-full hover:border-[#1E4D8C] hover:text-[#1E4D8C] transition-colors"
              >
                Все новости
              </Link>
              <Link
                href="/table"
                onClick={handleClose}
                className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-full hover:border-[#1E4D8C] hover:text-[#1E4D8C] transition-colors"
              >
                Таблица
              </Link>
              <Link
                href="/matches"
                onClick={handleClose}
                className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-full hover:border-[#1E4D8C] hover:text-[#1E4D8C] transition-colors"
              >
                Матчи
              </Link>
            </div>
          </div>
        </div>

        {/* Keyboard hint */}
        <div className="mt-4 text-center">
          <span className="text-white/60 text-sm">
            Нажмите <kbd className="px-2 py-1 bg-white/20 rounded text-white/80">ESC</kbd> для закрытия
          </span>
        </div>
      </div>
    </div>
  );
}
