import { WordSpectrum, WordTarget } from './types/shared';

export const spectrums: WordSpectrum[] = [
  { x: { left: 'Sweet', right: 'Savory' }, y: { left: 'Light Snack', right: 'Heavy Meal' } },
  { x: { left: 'Fiction', right: 'Non-Fiction' }, y: { left: 'Short Story', right: 'Epic Novel' } },
  {
    x: { left: 'Relaxing', right: 'Exciting' },
    y: { left: 'Home Activity', right: 'Travel Adventure' },
  },
  { x: { left: 'Budget', right: 'Luxury' }, y: { left: 'Basic Need', right: 'Total Indulgence' } },
  { x: { left: 'Digital', right: 'Analog' }, y: { left: 'Old Tech', right: 'New Tech' } },
  { x: { left: 'Popular', right: 'Obscure' }, y: { left: 'Mainstream', right: 'Cult Classic' } },
  { x: { left: 'Day', right: 'Night' }, y: { left: 'Morning Person', right: 'Night Owl' } },
  { x: { left: 'Past', right: 'Future' }, y: { left: 'Ancient', right: 'Futuristic' } },
  { x: { left: 'Safe', right: 'Risky' }, y: { left: 'Calculated', right: 'Impulsive' } },
  { x: { left: 'Urban', right: 'Rural' }, y: { left: 'Crowded', right: 'Isolated' } },
  { x: { left: 'Comedy', right: 'Drama' }, y: { left: 'Lighthearted', right: 'Serious' } },
  { x: { left: 'Indoors', right: 'Outdoors' }, y: { left: 'Stationary', right: 'Active' } },
  { x: { left: 'Science', right: 'Art' }, y: { left: 'Precise', right: 'Expressive' } },
  { x: { left: 'Formal', right: 'Casual' }, y: { left: 'Professional', right: 'Personal' } },
  { x: { left: 'Introverted', right: 'Extroverted' }, y: { left: 'Private', right: 'Public' } },
  {
    x: { left: 'Tradition', right: 'Innovation' },
    y: { left: 'Conventional', right: 'Experimental' },
  },
  { x: { left: 'Reality', right: 'Fantasy' }, y: { left: 'Natural', right: 'Magical' } },
  { x: { left: 'Easy', right: 'Challenging' }, y: { left: 'Beginner', right: 'Expert' } },
  { x: { left: 'Silent', right: 'Loud' }, y: { left: 'Peaceful', right: 'Chaotic' } },
  { x: { left: 'Structured', right: 'Spontaneous' }, y: { left: 'Planned', right: 'Improvised' } },
];

export const targets: WordTarget[] = [
  // { x: 0.25, y: 0.25, size: 0.25 },
  { x: 0.25, y: 0.6, size: 0.1 },
  { x: 0.8, y: 0.2, size: 0.1 },
  { x: 0.7, y: 0.9, size: 0.08 },
  { x: 0.9, y: 0.1, size: 0.05 },
  { x: 0.6, y: 0.3, size: 0.17 },
  { x: 0.4, y: 0.8, size: 0.13 },
  { x: 0.3, y: 0.7, size: 0.09 },
  { x: 0.2, y: 0.2, size: 0.2 },
  { x: 0.85, y: 0.3, size: 0.1 },
  { x: 0.75, y: 0.25, size: 0.06 },
  { x: 0.65, y: 0.6, size: 0.15 },
  { x: 0.6, y: 0.75, size: 0.07 },
  { x: 0.15, y: 0.35, size: 0.1 },
];

// validate targets
targets.forEach((target, idx) => {
  // make sure x and y plus size are between 0 and 1
  if (target.x - target.size < 0) {
    throw new Error(
      `Target idx=${idx} x is out of bounds with x=${target.x} and size=${target.size}`,
    );
  }
  if (target.x + target.size > 1) {
    throw new Error(
      `Target idx=${idx} x is out of bounds with x=${target.x} and size=${target.size}`,
    );
  }
  if (target.y - target.size < 0) {
    throw new Error(
      `Target idx=${idx} y is out of bounds with y=${target.y} and size=${target.size}`,
    );
  }
  if (target.y + target.size > 1) {
    throw new Error(
      `Target idx=${idx} y is out of bounds with y=${target.y} and size=${target.size}`,
    );
  }
});
