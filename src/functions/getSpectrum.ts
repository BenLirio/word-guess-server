import { FunctionContext } from '../types';
import { GetSpectrumRequest, GetSpectrumResponse } from '../types/shared';

export const getSpectrum: (
  ctxt: FunctionContext,
) => (request: GetSpectrumRequest) => Promise<GetSpectrumResponse> =
  ({ spectrum }: FunctionContext) =>
  async ({}: GetSpectrumRequest) => {
    return spectrum;
  };
