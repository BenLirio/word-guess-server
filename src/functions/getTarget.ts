import { target } from '../constants';
import { FunctionContext } from '../types';
import { GetTargetRequest, GetTargetResponse } from '../types/shared';

export const getTarget: (
  ctxt: FunctionContext,
) => (request: GetTargetRequest) => Promise<GetTargetResponse> =
  ({}: FunctionContext) =>
  async ({}: GetTargetRequest) => {
    return target;
  };
