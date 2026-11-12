import { Transition, Variants } from 'motion/react';

// Refined luxury cubic bezier easing
export const luxuryEase = [0.16, 1, 0.3, 1] as const;

export const transitionLuxury: Transition = {
  duration: 0.85,
  ease: [0.16, 1, 0.3, 1],
};

export const transitionSnappy: Transition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1],
};

export const transitionSpring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 28,
};

export const transitionGentleSpring: Transition = {
  type: 'spring',
  stiffness: 180,
  damping: 24,
};

// Fade up reveal for sections and cards
export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Staggered children container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Word / headline stagger
export const wordRevealContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.2,
    },
  },
};

export const wordItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Product card stagger item
export const productCardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Modal and drawer overlay
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

// Cart / Wishlist Drawer sliding from right
export const drawerVariants: Variants = {
  hidden: { x: '100%', opacity: 0.8 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 32,
      stiffness: 280,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.32, 0, 0.67, 0],
    },
  },
};

// Modal zoom / fade popup
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 28,
      stiffness: 260,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 15,
    transition: {
      duration: 0.25,
      ease: [0.32, 0, 0.67, 0],
    },
  },
};
