/**
 * Motion configuration and utility functions
 * Includes transition presets and accessibility support
 */

// Transition presets
export const transitions = {
  smooth: {
    duration: 0.3,
    ease: 'easeOut',
  },
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 24,
  },
  springBouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 20,
  },
  springSoft: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 30,
  },
  fast: {
    duration: 0.2,
    ease: 'easeOut',
  },
  slow: {
    duration: 0.6,
    ease: 'easeOut',
  },
} as const;

// Viewport detection defaults
export const viewportDefaults = {
  once: true,
  margin: '-50px',
  amount: 0.2,
} as const;

// Hover animation presets
export const hoverPresets = {
  lift: {
    y: -8,
    scale: 1.02,
    transition: transitions.spring,
  },
  liftSmall: {
    y: -4,
    scale: 1.01,
    transition: transitions.spring,
  },
  scale: {
    scale: 1.05,
    transition: transitions.spring,
  },
  scaleSmall: {
    scale: 1.02,
    transition: transitions.spring,
  },
} as const;

// Tap animation presets
export const tapPresets = {
  scale: {
    scale: 0.95,
  },
  scaleSmall: {
    scale: 0.98,
  },
} as const;

/**
 * Check if user prefers reduced motion
 * For accessibility support
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get transition based on reduced motion preference
 */
export function getTransition(transition: any) {
  return shouldReduceMotion() ? { duration: 0 } : transition;
}

/**
 * Get variants with reduced motion support
 */
export function getVariants(variants: any) {
  if (shouldReduceMotion()) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0 } },
    };
  }
  return variants;
}
