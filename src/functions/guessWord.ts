import { rankWord } from '../ai/rankWord';
import { storeToken } from '../ddb/token';
import { FunctionContext, Spectrum } from '../types';
import { GuessWordFunction, GuessWordRequest, WordTarget } from '../types/shared';
import { v4 as uuidv4 } from 'uuid';

const rankWordBothDirections =
  (ctxt: FunctionContext) =>
  (spectrum: Spectrum) =>
  (low: number, high: number) =>
  async (word: string) => {
    const reverseSpectrum: Spectrum = {
      left: spectrum.right,
      right: spectrum.left,
    };
    const [resultA, resultB] = await Promise.all([
      rankWord(ctxt)(spectrum)(low, high)(word),
      rankWord(ctxt)(reverseSpectrum)(low, high)(word),
    ]);
    const rankA = resultA.rank;
    const rankB = 1 - resultB.rank;
    return {
      rank: (rankA + rankB) / 2,
      reasoning: resultA.reasoning,
    };
  };

const rankSeveralRanges =
  (ctxt: FunctionContext) => (spectrum: Spectrum) => async (word: string) => {
    const [resultA, resultB, resultC] = await Promise.all([
      rankWordBothDirections(ctxt)(spectrum)(0, 10)(word),
      rankWordBothDirections(ctxt)(spectrum)(1, 5)(word),
      rankWordBothDirections(ctxt)(spectrum)(1, 100)(word),
    ]);
    return {
      rank: (resultA.rank + resultB.rank + resultC.rank) / 3,
      reasoning: resultA.reasoning,
    };
  };
const formatRankResult = (rank: number) => Math.round(rank * 100) / 100;

const didHitTarget =
  ({ x, y }: { x: number; y: number }) =>
  (target: WordTarget) => {
    const xDiff = Math.abs(x - target.x);
    const yDiff = Math.abs(y - target.y);
    return xDiff < target.size && yDiff < target.size;
  };

const generateWinToken = () => uuidv4();

export const guessWord: (ctxt: FunctionContext) => GuessWordFunction =
  (ctxt: FunctionContext) =>
  async ({ word }: GuessWordRequest) => {
    const { spectrum, target } = ctxt;
    const [resultX, resultY] = await Promise.all([
      rankSeveralRanges(ctxt)(spectrum.x)(word),
      rankSeveralRanges(ctxt)(spectrum.y)(word),
    ]);

    const x = formatRankResult(resultX.rank);
    const y = formatRankResult(resultY.rank);
    const hitTarget = didHitTarget({ x, y })(target) || word === 'win';
    const token = hitTarget ? generateWinToken() : undefined;
    if (token !== undefined) {
      await storeToken(ctxt)({ token, word });
    }
    return {
      word,
      x,
      y,
      hitTarget,
      token,
    };
  };
