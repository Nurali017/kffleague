export function GoalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

export function YellowCardIcon({ className }: { className?: string }) {
  return (
    <div className={`bg-[#FFD700] border border-white/20 rounded-sm shadow-sm ${className}`} />
  );
}

export function RedCardIcon({ className }: { className?: string }) {
  return (
    <div className={`bg-[#FF4545] border border-white/20 rounded-sm shadow-sm ${className}`} />
  );
}

export function SubstitutionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 14h6m0 0l-3-3m3 3l-3 3" />
      <path d="M20 10h-6m0 0l3-3m-3 3l3 3" />
    </svg>
  );
}

export function PenaltyIcon({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="w-full h-full rounded-full border-2 border-current opacity-60"></div>
      <div className="absolute w-[40%] h-[40%] bg-current rounded-full"></div>
    </div>
  )
}
