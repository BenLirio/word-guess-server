import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { RequestWrapper } from '../types/shared';
import { buildUnknownFunctionHandler, functionHandlers } from '../functions';
import * as AWS from 'aws-sdk';
import OpenAI from 'openai';

const ddb = new AWS.DynamoDB.DocumentClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const functionResponse = await functionHandler({ event, context, ddb, openai })(request as any);
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
