export function GoalIcon({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill={color} className={className}>
      <path d="M231.8,134.8a4.8,4.8,0,0,0,0-1.2c.1-1.9.2-3.7.2-5.6a103.2,103.2,0,0,0-23-65.1,5.5,5.5,0,0,0-1.4-1.7,103.9,103.9,0,0,0-41.1-29.8l-1.1-.4a103.4,103.4,0,0,0-74.8,0l-1.1.4A103.9,103.9,0,0,0,48.4,61.2,5.5,5.5,0,0,0,47,62.9,103.2,103.2,0,0,0,24,128c0,1.9.1,3.7.2,5.6a4.8,4.8,0,0,0,0,1.2,104.2,104.2,0,0,0,15.7,48.4,9.9,9.9,0,0,0,1.1,1.7,104.3,104.3,0,0,0,60.3,43.6h.3a104.2,104.2,0,0,0,52.8,0h.3A104.3,104.3,0,0,0,215,184.9a9.9,9.9,0,0,0,1.1-1.7A104.2,104.2,0,0,0,231.8,134.8ZM68.5,117.1l13.2,4.3,12.7,39.2-8.1,11.2H51.7a86.2,86.2,0,0,1-11.2-34.3Zm119,0,28,20.4a86.2,86.2,0,0,1-11.2,34.3H169.7l-8.1-11.2,12.7-39.2ZM193.2,69l-10.7,32.9-13.2,4.3L136,81.9V68.1l28-20.4A87,87,0,0,1,193.2,69ZM92,47.7l28,20.4V81.9L86.7,106.2l-13.2-4.3L62.8,69A87,87,0,0,1,92,47.7Zm18,166.4L99.3,181.2l8.1-11.2h41.2l8.1,11.2L146,214.1a86.2,86.2,0,0,1-36,0Z" />
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

export function JerseyIcon({ number, color, className }: { number: number; color: string; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full drop-shadow-md">
        <path
          fill={color}
          d="M107.327 21.364c-5.413-4.466-26.674-9.136-27.576-9.333a1.304 1.304 0 0 0-1.101.256c-16.692 13.303-29.519.649-30.057.105a1.322 1.322 0 0 0-1.428-.295 1.301 1.301 0 0 0-.657.582c-1.217.777-7.31 2.45-11.802 3.683-10.71 2.942-13.946 3.998-14.754 5.33C18.5 24.09 8 56.523 8 58.613c0 1.04.97 1.624 1.297 1.822l.005.003c2.182 1.303 8.025 2.748 13.997 2.746 3.27 0 6.546-.476 9.312-1.602l-1.95 46.035c-.017.494.25.954.69 1.187.204.108 13.879 7.197 32.955 7.197 9.594 0 20.556-1.794 31.855-7.172.465-.221.755-.693.741-1.203l-1.625-46.034c9.061 2.65 23.322-3.26 23.926-3.515a1.29 1.29 0 0 0 .764-1.48c-.724-3.135-7.228-30.765-12.64-35.232Z"
        />
        <path fill="rgba(0,0,0,0.2)" d="M119.177 58.115c-.604.254-14.866 6.164-23.927 3.515l12.05-40.228c5.412 4.468 11.917 32.097 12.641 35.233a1.29 1.29 0 0 1-.764 1.48ZM8 58.589c0-2.09 10.5-34.522 11.952-36.919.808-1.332 12.659 39.888 12.659 39.888-2.766 1.127-6.041 1.602-9.312 1.602-5.972.002-11.815-1.443-13.997-2.746l-.005-.003C8.97 60.214 8 59.63 8 58.589Z" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold pt-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
        {number}
      </span>
    </div>
  );
}
