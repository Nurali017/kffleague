import { Variant } from 'motion/react';

/**
 * Reusable Motion animation variants
 * Compatible with Tailwind CSS and TypeScript
 */

// Fade in with upward movement (replaces animate-fadeIn-stagger)
export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
} as const;

// Simple fade in (opacity only)
export const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
} as const;

// Scale in animation
export const scaleIn = {
  hidden: {
    scale: 0.95,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
} as const;

// Stagger container (for grids and lists)
export const staggerContainer = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
} as const;

// Slide in from directions
export const slideInLeft = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
} as const;

export const slideInRight = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
} as const;

export const slideInTop = {
  hidden: {
    opacity: 0,
    y: -100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
} as const;

export const slideInBottom = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
} as const;

// Modal/Overlay animations
export const modalBackdrop = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
} as const;

export const modalContent = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
} as const;

// Bottom sheet slide (from bottom)
export const bottomSheetSlideUp = {
  hidden: {
    y: '100%',
  },
  visible: {
    y: 0,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 320,
    },
  },
  exit: {
    y: '100%',
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 320,
    },
  },
} as const;

// Mobile menu slide (from right)
export const mobileMenuSlide = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    x: '100%',
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },
} as const;

// Stagger container for menu items
export const menuItemsStagger = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
} as const;

// Individual menu item
export const menuItem = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
} as const;

// Image hover effects
export const imageZoom = {
  rest: { scale: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
} as const;

export const imageZoomMedium = {
  rest: { scale: 1, transition: { duration: 0.5 } },
  hover: { scale: 1.1, transition: { duration: 0.5 } },
} as const;

// Card effects
export const cardLift = {
  rest: {
    y: 0,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    transition: { duration: 0.3 },
  },
  hover: {
    y: -4,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    transition: { duration: 0.3 },
  },
} as const;

// Table/List row hover
export const tableRowHover = {
  rest: {
    y: 0,
    backgroundColor: 'transparent',
    transition: { duration: 0.2 },
  },
  hover: {
    y: -2,
    backgroundColor: 'rgba(30, 77, 140, 0.05)',
    transition: { duration: 0.2 },
  },
} as const;

// Scale animations
export const scaleHover = {
  rest: { scale: 1 },
  hover: { scale: 1.1, transition: { type: 'spring', stiffness: 400, damping: 20 } },
} as const;

export const scaleHoverLarge = {
  rest: { scale: 1 },
  hover: { scale: 1.25, transition: { type: 'spring', stiffness: 400, damping: 20 } },
} as const;

// Dropdown animations
export const chevronRotate = {
  closed: { rotate: 0, transition: { duration: 0.2 } },
  open: { rotate: 180, transition: { duration: 0.2 } },
} as const;

export const dropdownMenu = {
  closed: { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.2 } },
  open: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
} as const;

// Button visibility (BackToTop)
export const buttonVisibility = {
  hidden: { opacity: 0, y: 16, transition: { duration: 0.3 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
} as const;
