import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import AWS from 'aws-sdk'; // Import AWS SDK
import { FunctionType, WordSpectrum, WordTarget } from './shared';
import OpenAI from 'openai';

export interface FunctionContext {
  timeUntilNextGraph: number;
  timeMod: number;
  spectrum: WordSpectrum;
  target: WordTarget;
  event: APIGatewayProxyEvent;
  context: Context;
  ddb: AWS.DynamoDB.DocumentClient;
  s3: AWS.S3;
  openai: OpenAI;
}

export type FunctionHandler = (functionContext: FunctionContext) => FunctionType;

export type DefaultFunctionHandler = (
  functionContext: FunctionContext,
) => (request: unknown) => Promise<never>;

export interface Spectrum {
  left: string;
  right: string;
}
