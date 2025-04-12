import { FunctionContext } from '../types';
import { sha256HashSpectrumAndTarget } from '../util/hash';

export const incrementWin =
  ({ ddb, spectrum, target }: FunctionContext) =>
  async ({ username }: { username: string }) => {
    const tableName = process.env.WORD_GUESS_WINS_TABLE_NAME;
    if (!tableName) {
      throw new Error('Table name is not defined in environment variables');
    }

    const hash = sha256HashSpectrumAndTarget(spectrum, target);

    try {
      // Fetch the user's record
      const result = await ddb
        .get({
          TableName: tableName,
          Key: { username },
        })
        .promise();

      const userRecord = result.Item;

      if (userRecord) {
        const winHashes = new Set(userRecord.winHashes || []);

        // Check if the hash already exists in the set
        if (winHashes.has(hash)) {
          return { incremented: false, winCount: userRecord.winCount };
        }

        // Add the hash to the set and increment the win count
        winHashes.add(hash);
        const updatedRecord = await ddb
          .update({
            TableName: tableName,
            Key: { username },
            UpdateExpression: 'SET winCount = winCount + :increment, winHashes = :winHashes',
            ExpressionAttributeValues: {
              ':increment': 1,
              ':winHashes': Array.from(winHashes),
            },
            ReturnValues: 'UPDATED_NEW',
          })
          .promise();

        return { incremented: true, winCount: updatedRecord.Attributes?.winCount };
      } else {
        // Create a new record for the user with the hash in the set
        await ddb
          .put({
            TableName: tableName,
            Item: {
              username,
              winCount: 1,
              winHashes: [hash],
            },
          })
          .promise();

        return { incremented: true, winCount: 1 };
      }
    } catch (error) {
      console.error('Error incrementing win count:', error);
      throw new Error('Failed to increment win count');
    }
  };

export const listWinsFromDB =
  ({ ddb }: FunctionContext) =>
  async () => {
    const tableName = process.env.WORD_GUESS_WINS_TABLE_NAME;
    if (!tableName) {
      throw new Error('Table name is not defined in environment variables');
    }

    try {
      // Scan the table to retrieve all records
      const result = await ddb
        .scan({
          TableName: tableName,
          ProjectionExpression: 'username, winCount', // Only retrieve username and winCount
        })
        .promise();

      // Map the results to the desired format
      const winsList =
        result.Items?.map((item) => ({
          username: item.username,
          winCount: item.winCount,
        })) || [];

      return winsList as { username: string; winCount: number }[];
    } catch (error) {
      console.error('Error listing wins:', error);
      throw new Error('Failed to list wins');
    }
  };
