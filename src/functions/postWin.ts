import { getAndDeleteToken } from '../ddb/token';
import { incrementWin } from '../ddb/wins';
import { FunctionContext } from '../types';
import { PostWinRequest, PostWinResponse } from '../types/shared';

const formatTarget = (percent: number) => `${Math.round(percent * 100)}%`;

export const postWin: (
  ctxt: FunctionContext,
) => (request: PostWinRequest) => Promise<PostWinResponse> =
  (ctxt: FunctionContext) =>
  async ({ token, username }: PostWinRequest) => {
    const { spectrum, target } = ctxt;
    const { word } = await getAndDeleteToken(ctxt)(token);
    const leftX = spectrum.x.left;
    const rightX = spectrum.x.right;
    const leftY = spectrum.y.left;
    const rightY = spectrum.y.right;
    const rightXPercent = formatTarget(target.x);
    const rightYPercent = formatTarget(target.y);
    const leftXPercent = formatTarget(1 - target.x);
    const leftYPercent = formatTarget(1 - target.y);
    const message = `User "${username}" has won with word "${word}"!
x-axis: ${leftXPercent} ${leftX} <----> ${rightXPercent} ${rightX}
y-axis: ${leftYPercent} ${leftY} <----> ${rightYPercent} ${rightY}`;
    console.log('Posting message to thread:', message);
    // await postMessageToThread(message);
    const { incremented, winCount } = await incrementWin(ctxt)({ username });
    return {
      incremented,
      winCount,
    };
  };
