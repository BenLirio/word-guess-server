import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import AWS from 'aws-sdk'; // Import AWS SDK
import { FunctionType } from './shared';
import OpenAI from 'openai';

export interface FunctionContext {
  event: APIGatewayProxyEvent;
  context: Context;
  ddb: AWS.DynamoDB.DocumentClient;
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
