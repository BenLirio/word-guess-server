import { WordSpectrum, WordTarget } from '../types/shared';

export const sha256HashSpectrumAndTarget = (wordSpectrum: WordSpectrum, wordTarget: WordTarget) => {
  const hash = require('crypto').createHash('sha256');
  const parts = [
    wordSpectrum.x.left,
    wordSpectrum.x.right,
    wordSpectrum.y.left,
    wordSpectrum.y.right,
    wordTarget.x,
    wordTarget.y,
    wordTarget.size,
  ]
    .map((part) => part.toString())
    .join(':');
  hash.update(parts);
  return hash.digest('hex');
};
