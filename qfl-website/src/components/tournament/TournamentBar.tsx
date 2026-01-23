'use client';

import { TournamentIcons } from './TournamentIcons';

export function TournamentBar() {
  return (
    <div>
      {/* Dark bar with tournament icons */}
      <div className="bg-[#0D1B2A]">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Tournament icons on the left */}
          <TournamentIcons />

          {/* Right side: KFF + Alatau City Bank */}
          <div className="hidden md:flex items-center gap-4">
            {/* KFF link with logo */}
            <a
              href="https://kff.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              <img
                src="/official/kff.svg"
                alt="KFF"
                className="h-7 w-7 object-contain"
              />
              <span className="text-[10px] font-medium text-white/80 leading-tight">
                Қазақстан футбол
                <br />
                федерациясы
              </span>
            </a>

            {/* Divider */}
            <div className="w-px h-6 bg-white/20" />

            {/* Alatau City Bank sponsor */}
            <a
              href="https://alataucitybank.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <img
                src="/sponsors/alatau-city-bank.webp"
                alt="Alatau City Bank"
                className="h-6 object-contain filter brightness-0 invert"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
