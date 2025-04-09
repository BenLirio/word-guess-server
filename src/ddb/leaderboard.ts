import { FunctionContext } from '../types';
import { GuessWordResponse, LeaderboardEntry, WordSpectrum, WordTarget } from '../types/shared';

const sha256HashSpectrumAndTarget = (wordSpectrum: WordSpectrum, wordTarget: WordTarget) => {
  const hash = require('crypto').createHash('sha256');
  const parts = [
    wordSpectrum.x.left,
    wordSpectrum.x.right,
    wordSpectrum.y.left,
    wordSpectrum.y.right,
    wordTarget.x,
    wordTarget.y,
    wordTarget.size,
  ]
    .map((part) => part.toString())
    .join(':');
  hash.update(parts);
  return hash.digest('hex');
};

export const saveWin =
  ({ ddb, spectrum, target }: FunctionContext) =>
  async (result: GuessWordResponse) => {
    const data = JSON.stringify({ ...result, token: undefined });
    const hashKey = sha256HashSpectrumAndTarget(spectrum, target);

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.WORD_GUESS_LEADERBOARD_TABLE_NAME!,
      Item: {
        hashKey,
        id: result.id,
        token: result.token,
        timestamp: result.timestamp,
        data,
      },
    };
    try {
      await ddb.put(params).promise();
    } catch (error) {
      console.error('Error saving win:', error);
      throw new Error('Failed to save win');
    }
  };

export const getLeaderboardEntries =
  ({ ddb, spectrum, target }: FunctionContext) =>
  async (afterTimestamp: number): Promise<LeaderboardEntry[]> => {
    const hashKey = sha256HashSpectrumAndTarget(spectrum, target);

    let items: any[] = [];
    try {
      const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: process.env.WORD_GUESS_LEADERBOARD_TABLE_NAME!,
        KeyConditionExpression: 'hashKey = :hashKey',
        ExpressionAttributeValues: {
          ':hashKey': hashKey,
        },
        ExpressionAttributeNames: {
          '#ts': 'timestamp', // Alias for the reserved keyword
        },
      };

      if (afterTimestamp !== undefined) {
        params.FilterExpression = '#ts > :afterTimestamp';
        params.ExpressionAttributeValues = params.ExpressionAttributeValues || {};
        params.ExpressionAttributeValues[':afterTimestamp'] = afterTimestamp;
      }

      const result = await ddb.query(params).promise();
      items = result.Items!;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error('Failed to fetch leaderboard');
    }
    return items.map(({ data }) => ({ ...JSON.parse(data) }) as LeaderboardEntry);
  };
