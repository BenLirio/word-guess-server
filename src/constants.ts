import { WordSpectrum, WordTarget } from './types/shared';

export const spectrums: WordSpectrum[] = [
  { x: { left: 'Crunchy', right: 'Soft' }, y: { left: 'Sweet', right: 'Savory' } },
  {
    x: { left: 'Makes you laugh', right: 'Makes you cry' },
    y: { left: 'Watch with friends', right: 'Watch alone' },
  },
  {
    x: { left: 'Likely to cuddle', right: 'Likely to bite' },
    y: { left: 'Can live in apartment', right: 'Definitely outdoor-only' },
  },
  {
    x: { left: 'Helpful in emergencies', right: 'Helpful at parties' },
    y: { left: 'Subtle power', right: 'Very flashy power' },
  },
  { x: { left: 'Practical', right: 'Novelty' }, y: { left: 'Expensive', right: 'Cheap' } },
  {
    x: { left: 'Pleasant sound', right: 'Annoying sound' },
    y: { left: 'Very loud', right: 'Barely audible' },
  },
  {
    x: { left: 'Physically exhausting', right: 'Mentally exhausting' },
    y: { left: 'Relaxing afterward', right: 'Stressful afterward' },
  },
  { x: { left: 'Fast', right: 'Slow' }, y: { left: 'Stylish', right: 'Embarrassing' } },
  {
    x: { left: 'Minimalist', right: 'Cluttered' },
    y: { left: 'Timeless', right: 'Quickly outdated' },
  },
  {
    x: { left: 'Friendly', right: 'Hostile' },
    y: { left: 'Majestic-looking', right: 'Silly-looking' },
  },
  {
    x: { left: 'Easy to spell', right: 'Impossible to spell' },
    y: { left: 'Fun to say', right: 'Awkward to say' },
  },
  {
    x: { left: 'Can buy in bulk', right: 'Only sold individually' },
    y: { left: 'Lasts forever', right: 'Spoils immediately' },
  },
  { x: { left: 'Common pet', right: 'Wild animal' }, y: { left: 'Fluffy', right: 'Scaly' } },
  {
    x: { left: 'Smells wonderful', right: 'Smells terrible' },
    y: { left: 'Safe to touch', right: 'Dangerous to touch' },
  },
  {
    x: { left: 'Common fear', right: 'Irrational fear' },
    y: { left: 'Very serious', right: 'Silly' },
  },
  { x: { left: 'Healthy', right: 'Unhealthy' }, y: { left: 'Delicious', right: 'Disgusting' } },
  {
    x: { left: 'High-tech', right: 'Low-tech' },
    y: { left: 'User-friendly', right: 'Infuriating to use' },
  },
  { x: { left: 'Better hot', right: 'Better cold' }, y: { left: 'Liquid', right: 'Solid' } },
  {
    x: { left: 'Realistic', right: 'Fantasy' },
    y: { left: 'Appropriate for kids', right: 'Strictly adults only' },
  },
  { x: { left: 'Ancient', right: 'Modern' }, y: { left: 'Peaceful', right: 'Chaotic' } },
  {
    x: { left: 'Highly addictive', right: 'Completely unappealing' },
    y: { left: 'Socially acceptable', right: 'Socially frowned-upon' },
  },
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
