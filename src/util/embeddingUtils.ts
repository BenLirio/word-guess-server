export const cosineSimilarity = (embeddingA: number[], embeddingB: number[]) => {
  const dotProduct = embeddingA.reduce((sum, a, idx) => sum + a * embeddingB[idx], 0);
  const magnitudeA = Math.sqrt(embeddingA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(embeddingB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) {
    throw new Error('One of the embeddings has zero magnitude, cannot compute cosine similarity.');
  }

  return dotProduct / (magnitudeA * magnitudeB);
};

export const embeddingDiff = (embeddingA: number[], embeddingB: number[]) =>
  embeddingA.map((a, idx) => a - embeddingB[idx]);

export const normalizeEmbedding = (embedding: number[]) => {
  const magnitude = Math.sqrt(embedding.reduce((sum, a) => sum + a * a, 0));
  if (magnitude === 0) {
    throw new Error('Embedding has zero magnitude, cannot normalize.');
  }
  return embedding.map((a) => a / magnitude);
};
