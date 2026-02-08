import React from 'react';
export function SponsorBanner() {
  return <div className="w-full h-16 bg-black relative overflow-hidden flex items-center justify-center">
      {/* Orange diagonal stripes pattern background */}
      <div className="absolute inset-0 z-0" style={{
      backgroundColor: '#000',
      backgroundImage: `repeating-linear-gradient(
            -45deg,
            #000,
            #000 20px,
            #E5B73B 20px,
            #E5B73B 40px
          )`
    }} />

      {/* Content overlay */}
      <div className="relative z-10 flex items-center justify-center space-x-4 bg-black/80 px-12 py-2 transform -skew-x-12 border-2 border-accent">
        <span className="text-accent font-black text-2xl italic tracking-tighter transform skew-x-12">
          OLIMPBET
        </span>
        <span className="text-white font-bold text-xl uppercase tracking-wider transform skew-x-12">
          ГЕНЕРАЛЬНЫЙ ПАРТНЕР КПЛ
        </span>
      </div>
    </div>;
}