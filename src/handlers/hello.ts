import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const response: APIGatewayProxyResult = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Hello from Serverless TypeScript!',
        timestamp: new Date().toISOString(),
        requestContext: {
          requestId: context.awsRequestId,
        },
        queryStringParameters: event.queryStringParameters,
      }),
    };

    return response;
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
