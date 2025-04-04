import { FunctionContext, FunctionHandler } from '../types';
import { FunctionName } from '../types/shared';
import { getSpectrum } from './getSpectrum';
import { getTarget } from './getTarget';
import { guessWord } from './guessWord';

export const buildUnknownFunctionHandler: (functionName: string) => FunctionHandler =
  (functionName: string | undefined) => (_ctxt: FunctionContext) => async (request: unknown) => {
    throw new Error(
      `Received unknown function name: <${functionName}> with request: <${JSON.stringify(request)}>`,
    );
  };

export const functionHandlers: Record<FunctionName, FunctionHandler> = {
  guessWord,
  getSpectrum,
  getTarget,
};
