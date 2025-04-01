import { z } from 'zod';
import { FunctionContext, Spectrum } from '../types';
import { zodResponseFormat } from 'openai/helpers/zod';

export interface RankResult {
  rank: number;
  reasoning: string;
}

const RankResult = z.object({
  rank: z.number(),
  reasoning: z.string(),
});

export const rankWord =
  ({ openai }: FunctionContext) =>
  (spectrum: Spectrum) =>
  (low: number, high: number) =>
  async (word: string) => {
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `Analyze words semantically based on their meaning, connotations, and cultural associations. When given a spectrum with two opposing concepts, evaluate where the word falls between them on a scale from ${low} to ${high}. The analysis should consider the word's inherent qualities, not any numerical value it might represent. Provide a concise reasoning for your ranking. Your reasoning should be only a few words long.`,
        },
        {
          role: 'user',
          content: `Spectrum: ${spectrum.left} (${low}) to ${spectrum.right} (${high})
Word to rank: "${word}"
Provide a ranking between ${low} and ${high} for where this word falls on the spectrum, along with your reasoning.`,
        },
      ],
      response_format: zodResponseFormat(RankResult, 'event'),
    });
    const rankResult: RankResult = {
      ...(completion.choices[0].message.parsed! as RankResult),
    };
    rankResult.rank = (rankResult.rank - low) / (high - low);
    return rankResult;
  };
