import { FunctionContext } from '../types';
import { GetTimeUntilNextGraphRequest, GetTimeUntilNextGraphResponse } from '../types/shared';

export const getTimeUntilNextGraph: (
  ctxt: FunctionContext,
) => (request: GetTimeUntilNextGraphRequest) => Promise<GetTimeUntilNextGraphResponse> =
  ({ timeUntilNextGraph, timeMod }: FunctionContext) =>
  async ({}: GetTimeUntilNextGraphRequest) => {
    const now = Date.now();
    return {
      timeOfNextGraph: now + timeUntilNextGraph,
      timeMod,
    };
  };
