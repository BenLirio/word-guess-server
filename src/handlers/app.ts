import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { RequestWrapper } from '../types/shared';
import { buildUnknownFunctionHandler, functionHandlers } from '../functions';
import * as AWS from 'aws-sdk';
import OpenAI from 'openai';
import { spectrums, targets } from '../constants';

const ddb = new AWS.DynamoDB.DocumentClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const start = 1743818606072;

export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        },
        body: '',
      };
    }

    const { functionName, request } = JSON.parse(event.body || '{}') as RequestWrapper;
    const functionHandler =
      functionHandlers[functionName] || buildUnknownFunctionHandler(functionName);
    const timeDiff = Date.now() - start;
    const oneHour = 1000 * 60 * 60;
    const timeMod = oneHour;
    const timeUntilNextGraph = oneHour - (timeDiff % timeMod);
    const idx = Math.floor(timeDiff / oneHour);
    const functionResponse = await functionHandler({
      event,
      context,
      ddb,
      openai,
      spectrum: spectrums[idx % spectrums.length],
      target: targets[idx % targets.length],
      timeUntilNextGraph,
    })(request as any);
    const response: APIGatewayProxyResult = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify(functionResponse),
    };

    return response;
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
