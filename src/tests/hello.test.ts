import { handler } from '../handlers/hello';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

describe('Hello Handler', () => {
  it('should return 200 with a proper message', async () => {
    // Mock event and context
    const event = {
      queryStringParameters: { name: 'Tester' },
    } as unknown as APIGatewayProxyEvent;
    
    const context = {
      awsRequestId: 'test-request-id',
    } as unknown as Context;

    // Call the handler
    const result = await handler(event, context, () => {});
    const body = JSON.parse(result.body);

    // Assertions
    expect(result.statusCode).toBe(200);
    expect(body.message).toBe('Hello from Serverless TypeScript!');
    expect(body.requestContext.requestId).toBe('test-request-id');
    expect(body.queryStringParameters).toEqual({ name: 'Tester' });
  });
});
