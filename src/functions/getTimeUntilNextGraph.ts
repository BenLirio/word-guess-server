import { FunctionContext } from '../types';
import { GetTimeUntilNextGraphRequest, GetTimeUntilNextGraphResponse } from '../types/shared';

export const getTimeUntilNextGraph: (
  ctxt: FunctionContext,
) => (request: GetTimeUntilNextGraphRequest) => Promise<GetTimeUntilNextGraphResponse> =
  ({ timeUntilNextGraph }: FunctionContext) =>
  async ({}: GetTimeUntilNextGraphRequest) => {
    return {
      timeUntilNextGraph,
    };
  };
