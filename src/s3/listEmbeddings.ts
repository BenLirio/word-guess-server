import { FunctionContext } from '../types';
import { sha256HashSpectrumAndTarget } from '../util/hash';
import * as zlib from 'zlib';
import { initializeBucket } from './initializeBucket';

export const listEmbeddings =
  (ctxt: FunctionContext) => async (): Promise<{ word: string; embedding: number[] }[]> => {
    const { s3, target, spectrum } = ctxt;
    const hash = sha256HashSpectrumAndTarget(spectrum, target);
    const bucketName = process.env.WORD_GUESS_EMBEDDING_BUCKET;

    if (!bucketName) {
      throw new Error('WORD_GUESS_EMBEDDING_BUCKET environment variable is not set');
    }

    const key = `${hash}.json.gz`;

    try {
      // Retrieve the gzipped file from S3
      const s3Object = await s3
        .getObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();

      if (!s3Object.Body) {
        throw new Error(`No body found in S3 object with key: ${key}`);
      }

      // Unzip the file
      const unzippedBuffer = zlib.gunzipSync(s3Object.Body as Buffer);

      // Parse the JSON content
      const embeddings = JSON.parse(unzippedBuffer.toString()) as {
        word: string;
        embedding: number[];
      }[];

      return embeddings;
    } catch (error: any) {
      if (error.code === 'NoSuchKey') {
        console.warn(`Key not found in S3: ${key}. Initializing bucket...`);
        await initializeBucket(ctxt)();
        return [];
      }

      console.error(`Error retrieving embeddings from S3: ${error.message}`);
      throw error;
    }
  };
