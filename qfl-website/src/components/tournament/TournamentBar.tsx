'use client';

import { TournamentIcons } from './TournamentIcons';

export function TournamentBar() {
  return (
    <div className="hidden lg:block">
      {/* Dark bar with tournament icons */}
      <div className="bg-[#0D1B2A]">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-3 md:px-6">
          {/* Tournament icons on the left */}
          <div className="min-w-0 flex-1 overflow-x-auto no-scrollbar">
            <TournamentIcons />
          </div>

          {/* Right side: KFF + Alatau City Bank */}
          <div className="hidden shrink-0 lg:flex items-center gap-4">
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
