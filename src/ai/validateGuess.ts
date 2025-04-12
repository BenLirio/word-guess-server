import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { FunctionContext } from '../types';

export interface ValidationGuessResult {
  isFair: boolean;
  reasoning: string;
}

const ValidationGuessResult = z.object({
  isFair: z.boolean(),
  reasoning: z.string(),
});

export const validateGuess =
  ({ openai }: FunctionContext) =>
  async ({ word, spectrum }: { word: string; spectrum: { left: string; right: string } }) => {
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `
Your task is to decide whether a given word or phrase is fair or unfair within a specific spectrum of related concepts.

Only mark a word or phrase unfair if:
It directly repeats a word from the spectrum.

It trivially restates a spectrum word — for example:

Adding words like "something", "kind of", "really", or "thing" to a spectrum term without introducing a new idea.

Example: "something hot", "very cold", or "solid object" are unfair because they rely on the spectrum term without adding meaning.

Otherwise, mark the word or phrase fair — even if:
It is unrelated, strange, or abstract.

It does not directly clarify the spectrum.

It is creative or unexpected.

Key Principle:
Only block words that are obviously abusing the spectrum — by directly repeating or trivially modifying spectrum words.

Being off-topic, vague, or creative is totally acceptable — the goal is not to over-police unrelated answers.
`,
        },
        {
          role: 'user',
          content: `Spectrum : ${spectrum.left} ←→ ${spectrum.right}
Clue: "${word}"`,
        },
      ],
      response_format: zodResponseFormat(ValidationGuessResult, 'event'),
    });
    const validationGuessResult: ValidationGuessResult = completion.choices[0].message.parsed!;
    return validationGuessResult;
  };
