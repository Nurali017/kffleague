interface HeroBackgroundProps {
  className?: string;
  patternClassName?: string;
}

export function HeroBackground({ className, patternClassName }: HeroBackgroundProps) {
  const gradientPosition = className ?? 'absolute inset-0';
  const patternPosition = patternClassName ?? 'absolute inset-0';

  return (
    <>
      <div
        className={`${gradientPosition} bg-gradient-to-r from-primary to-[#3B82F6] dark:from-[#0a1929] dark:via-primary dark:to-[#1a3a5c]`}
      />
      <div
        className={`${patternPosition} bg-cover bg-center bg-no-repeat dark:opacity-40`}
        style={{ backgroundImage: 'url(/footer-bg.webp)' }}
      />
    </>
  );
}
