import { FunctionContext, FunctionHandler } from '../types';
import { FunctionName } from '../types/shared';
import { guessWord } from './guessWord';

export const buildUnknownFunctionHandler: (functionName: string) => FunctionHandler =
  (functionName: string | undefined) =>
  (functionContext: FunctionContext) =>
  async (request: unknown) => {
    throw new Error(
      `Received unknown function name: <${functionName}> with request: <${JSON.stringify(request)}>`,
    );
  };

export const functionHandlers: Record<FunctionName, FunctionHandler> = {
  guessWord,
};
