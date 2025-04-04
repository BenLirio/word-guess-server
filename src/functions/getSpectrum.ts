import { FunctionContext } from '../types';
import { GetSpectrumRequest, GetSpectrumResponse } from '../types/shared';

export const getSpectrum: (
  ctxt: FunctionContext,
) => (request: GetSpectrumRequest) => Promise<GetSpectrumResponse> =
  (ctxt: FunctionContext) =>
  async ({}: GetSpectrumRequest) => {
    const spectrum: GetSpectrumResponse = {
      x: {
        left: 'big',
        right: 'small',
      },
      y: {
        left: 'cool',
        right: 'lame',
      },
    };
    return spectrum;
  };
