'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chevronRotate, dropdownMenu } from '@/lib/motion';
import { NavItem } from './types';

interface NavDropdownProps {
  item: NavItem;
  isActive?: boolean;
}

export function NavDropdown({ item, isActive }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Check if any child is active
  const hasActiveChild = item.children?.some(child => child.href === pathname);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href || '#'}
        className={`flex items-center gap-1 text-base font-bold ${
          isActive || hasActiveChild ? 'text-accent' : 'hover:text-accent'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={(e) => {
          // Если нет href, предотвращаем переход
          if (!item.href || item.href === '#') {
            e.preventDefault();
          }
        }}
        suppressHydrationWarning
      >
        {item.label}
        <motion.div
          animate={isOpen ? 'open' : 'closed'}
          variants={chevronRotate}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </Link>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={dropdownMenu}
            className="absolute top-full left-0 mt-2 min-w-[200px] bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 origin-top"
          >
            {item.children?.map((child) => (
              <Link
                key={child.key}
                href={child.href || '#'}
                className={`block px-4 py-3 text-sm font-medium ${
                  pathname === child.href
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                }`}
                onClick={() => setIsOpen(false)}
                suppressHydrationWarning
              >
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
