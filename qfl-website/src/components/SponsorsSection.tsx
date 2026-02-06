'use client';

import React from 'react';

const sponsors = [
  { name: 'Alatau City Bank', logo: '/sponsors/alatau-city-bank.webp', url: '#' },
  { name: 'Olimpbet', logo: '/sponsors/olimpbet.webp', url: '#' },
  { name: 'Sport+', logo: '/sponsors/sport-plus.webp', url: '#' },
  { name: 'QazSport', logo: '/sponsors/qazsport.webp', url: '#' },
  { name: 'Kinopoisk', logo: '/sponsors/kinopoisk.webp', url: '#' },
];

export function SponsorsSection() {
  return (
    <section className="bg-white dark:bg-dark-surface py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-20">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.url}
              className="transition-transform duration-300 hover:scale-105 px-4 py-2 rounded-lg dark:bg-white/10"
              title={sponsor.name}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-8 md:h-10 lg:h-12 w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
