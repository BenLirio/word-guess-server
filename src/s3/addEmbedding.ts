import { FunctionContext } from '../types';
import { sha256HashSpectrumAndTarget } from '../util/hash';
import * as zlib from 'zlib';
import { initializeBucket } from './initializeBucket';

export const addEmbedding =
  (ctxt: FunctionContext) =>
  async (newEmbedding: { word: string; embedding: number[] }): Promise<void> => {
    const { s3, target, spectrum } = ctxt;
    const hash = sha256HashSpectrumAndTarget(spectrum, target);
    const bucketName = process.env.WORD_GUESS_EMBEDDING_BUCKET;

    if (!bucketName) {
      throw new Error('WORD_GUESS_EMBEDDING_BUCKET environment variable is not set');
    }

    const key = `${hash}.json.gz`;

    try {
      // Retrieve the existing embeddings
      const s3Object = await s3
        .getObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();

      let embeddings: { word: string; embedding: number[] }[] = [];

      if (s3Object.Body) {
        const unzippedBuffer = zlib.gunzipSync(s3Object.Body as Buffer);
        embeddings = JSON.parse(unzippedBuffer.toString());
      }

      // Add the new embedding
      embeddings.push(newEmbedding);

      // Gzip the updated embeddings
      const updatedBuffer = zlib.gzipSync(JSON.stringify(embeddings));

      // Upload the updated file back to S3
      await s3
        .putObject({
          Bucket: bucketName,
          Key: key,
          Body: updatedBuffer,
          ContentType: 'application/json',
          ContentEncoding: 'gzip',
        })
        .promise();

      console.log(`Added new embedding for word: ${newEmbedding.word}`);
    } catch (error: any) {
      if (error.code === 'NoSuchKey') {
        console.warn(`Key not found in S3: ${key}. Initializing bucket...`);
        await initializeBucket(ctxt)();

        // Retry adding the embedding after initializing the bucket
        return addEmbedding(ctxt)(newEmbedding);
      }

      console.error(`Error adding embedding to S3: ${error.message}`);
      throw error;
    }
  };
