import { FunctionContext } from '../types';
import { GetTargetRequest, GetTargetResponse } from '../types/shared';

export const getTarget: (
  ctxt: FunctionContext,
) => (request: GetTargetRequest) => Promise<GetTargetResponse> =
  ({ target }: FunctionContext) =>
  async ({}: GetTargetRequest) => {
    return target;
  };
