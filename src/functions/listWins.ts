import { listWinsFromDB } from '../ddb/wins';
import { FunctionContext } from '../types';
import { ListWinsRequest, ListWinsResponse } from '../types/shared';

export const listWins: (
  ctxt: FunctionContext,
) => (request: ListWinsRequest) => Promise<ListWinsResponse> =
  (ctxt: FunctionContext) =>
  async ({}: ListWinsRequest) => {
    const wins = await listWinsFromDB(ctxt)();
    return {
      wins,
    };
  };
