import { getLeaderboardEntries } from '../ddb/leaderboard';
import { FunctionContext } from '../types';
import { GetLeaderboardRequest, GetLeaderboardResponse } from '../types/shared';

export const getLeaderboard: (
  ctxt: FunctionContext,
) => (request: GetLeaderboardRequest) => Promise<GetLeaderboardResponse> =
  (ctxt: FunctionContext) =>
  async ({ afterTimestamp }: GetLeaderboardRequest) => {
    const timestamp = Date.now();
    const leaderboardEntries = await getLeaderboardEntries(ctxt)(
      afterTimestamp === undefined ? 0 : afterTimestamp,
    );
    return {
      timestamp,
      leaderboardEntries,
    };
  };
