import { spectrum } from '../constants';
import { FunctionContext } from '../types';
import { GetSpectrumRequest, GetSpectrumResponse } from '../types/shared';

export const getSpectrum: (
  ctxt: FunctionContext,
) => (request: GetSpectrumRequest) => Promise<GetSpectrumResponse> =
  ({}: FunctionContext) =>
  async ({}: GetSpectrumRequest) => {
    return spectrum;
  };
