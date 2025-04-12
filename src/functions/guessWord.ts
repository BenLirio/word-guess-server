import { rankWord } from '../ai/rankWord';
import { validateGuess } from '../ai/validateGuess';
import { saveWin } from '../ddb/leaderboard';
import { storeToken } from '../ddb/token';
import { listEmbeddings } from '../s3/listEmbeddings';
import { FunctionContext, Spectrum } from '../types';
import { GuessWordFunction, GuessWordRequest, WordTarget } from '../types/shared';
import { v4 as uuidv4 } from 'uuid';
import { findSimilarWords } from '../util';
import { getEmbedding } from '../ai/getEmbedding';
import { addEmbedding } from '../s3/addEmbedding';

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

const validateWord = (word: string) => {
  if (word.length < 3) {
    throw new Error('Word must be at least 3 characters long');
  }
  if (word.length > 20) {
    throw new Error('Word must be at most 20 characters long');
  }
};

export const guessWord: (ctxt: FunctionContext) => GuessWordFunction =
  (ctxt: FunctionContext) =>
  async ({ word }: GuessWordRequest) => {
    validateWord(word);
    const { spectrum, target } = ctxt;
    const [validationGuessResultX, validationGuessResultY] = await Promise.all([
      validateGuess(ctxt)({ word, spectrum: spectrum.x }),
      validateGuess(ctxt)({ word, spectrum: spectrum.y }),
    ]);
    console.log(validationGuessResultX);
    console.log(validationGuessResultY);
    if (!validationGuessResultX.isFair) {
      throw new Error(validationGuessResultX.reasoning);
    }
    if (!validationGuessResultY.isFair) {
      throw new Error(validationGuessResultY.reasoning);
    }

    const [resultX, resultY] = await Promise.all([
      rankSeveralRanges(ctxt)(spectrum.x)(word),
      rankSeveralRanges(ctxt)(spectrum.y)(word),
    ]);

    const x = formatRankResult(resultX.rank);
    const y = formatRankResult(resultY.rank);
    const hitTarget = didHitTarget({ x, y })(target);
    const token = hitTarget ? generateWinToken() : undefined;
    if (token !== undefined) {
      await storeToken(ctxt)({ token, word });
    }
    const result = {
      id: uuidv4(),
      word,
      x,
      y,
      hitTarget,
      token,
      timestamp: Date.now(),
    };

    if (hitTarget) {
      const embeddings = await listEmbeddings(ctxt)();
      const embedding = await getEmbedding(ctxt)(word);
      const similarWords = findSimilarWords(embeddings, { word, embedding }, 0.2);
      if (similarWords.length > 0) {
        throw new Error('Word is too similar to another players word: ' + similarWords.join(', '));
      }
      await addEmbedding(ctxt)({ word, embedding });
    }
    await saveWin(ctxt)(result);
    return result;
  };
