'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
    return (
        <nav className={`flex items-center space-x-2 text-sm text-white/80 ${className}`}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={index} className="flex items-center">
                        {index > 0 && (
                            <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
                        )}

                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="hover:text-white transition-colors duration-200"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={`font-medium ${isLast ? 'text-white' : ''}`}>
                                {item.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
