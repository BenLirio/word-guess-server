import { FunctionContext } from '../types';

export const storeToken =
  ({ ddb }: FunctionContext) =>
  async ({ token, word }: { token: string; word: string }) => {
    const params = {
      TableName: process.env.WORD_GUESS_TOKENS_TABLE_NAME!,
      Item: {
        token,
        word,
      },
    };

    await ddb.put(params).promise();
  };

export const getAndDeleteToken =
  ({ ddb }: FunctionContext) =>
  async (token: string): Promise<{ token: string; word: string }> => {
    const tableName = process.env.WORD_GUESS_TOKENS_TABLE_NAME!;

    try {
      // First, retrieve the item
      const getResult = await ddb
        .get({
          TableName: tableName,
          Key: { token },
        })
        .promise();

      const retrievedItem = getResult.Item;
      if (!retrievedItem) {
        throw new Error('Token does not exist.');
      }

      // Then, delete the item
      await ddb
        .delete({
          TableName: tableName,
          Key: { token },
          ConditionExpression: 'attribute_exists(#token)',
          ExpressionAttributeNames: {
            '#token': 'token', // Map the reserved keyword "token" to a placeholder
          },
        })
        .promise();

      return { token: retrievedItem.token, word: retrievedItem.word };
    } catch (error: any) {
      if (error.code === 'TransactionCanceledException') {
        throw new Error('Token does not exist or could not be deleted.');
      }
      throw error;
    }
  };
