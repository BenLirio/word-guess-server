import { FunctionContext } from '../types';
import { sha256HashSpectrumAndTarget } from '../util/hash';
import * as zlib from 'zlib';

export const initializeBucket =
  ({ s3, target, spectrum }: FunctionContext) =>
  async (): Promise<void> => {
    const hash = sha256HashSpectrumAndTarget(spectrum, target);
    const bucketName = process.env.WORD_GUESS_EMBEDDING_BUCKET;

    if (!bucketName) {
      throw new Error('WORD_GUESS_EMBEDDING_BUCKET environment variable is not set');
    }

    const key = `${hash}.json.gz`;

    try {
      // Create a gzipped empty array
      const emptyArray = JSON.stringify([]);
      const gzippedBuffer = zlib.gzipSync(emptyArray);

      // Upload the gzipped empty array to S3
      await s3
        .putObject({
          Bucket: bucketName,
          Key: key,
          Body: gzippedBuffer,
          ContentType: 'application/json',
          ContentEncoding: 'gzip',
        })
        .promise();

      console.log(`Initialized S3 bucket with empty array at key: ${key}`);
    } catch (error: any) {
      console.error(`Error initializing S3 bucket: ${error.message}`);
      throw error;
    }
  };
