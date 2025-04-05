import { spectrum, target } from '../constants';
import { getAndDeleteToken } from '../ddb/token';
import { postMessageToThread } from '../discord/postMessage';
import { FunctionContext } from '../types';
import { PostWinRequest, PostWinResponse } from '../types/shared';

const formatTarget = (percent: number) => `${Math.round(percent * 100)}%`;

export const postWin: (
  ctxt: FunctionContext,
) => (request: PostWinRequest) => Promise<PostWinResponse> =
  (ctxt: FunctionContext) =>
  async ({ token, username }: PostWinRequest) => {
    const { word } = await getAndDeleteToken(ctxt)(token);
    const leftX = spectrum.x.left;
    const rightX = spectrum.x.right;
    const leftY = spectrum.y.left;
    const rightY = spectrum.y.right;
    const leftXPercent = formatTarget(target.x);
    const leftYPercent = formatTarget(target.y);
    const rightXPercent = formatTarget(1 - target.x);
    const rightYPercent = formatTarget(1 - target.y);
    const message = `User "${username}" has won with word "${word}"!
x-axis: ${leftXPercent} ${leftX} <----> ${rightXPercent} ${rightX}
y-axis: ${leftYPercent} ${leftY} <----> ${rightYPercent} ${rightY}`;
    await postMessageToThread(message);
    return {};
  };
