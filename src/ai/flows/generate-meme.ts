'use server';

/**
 * @fileOverview A meme generation AI agent that provides relevant memes to distract users.
 *
 * - generateRelevantMeme - A function that generates a relevant meme based on user context.
 * - GenerateRelevantMemeInput - The input type for the generateRelevantMeme function.
 * - GenerateRelevantMemeOutput - The return type for the generateRelevantMeme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRelevantMemeInputSchema = z.object({
  userContext: z
    .string()
    .describe(
      'Description of the user and their current context (e.g., working on a project, studying for an exam, etc.).'
    ),
});
export type GenerateRelevantMemeInput = z.infer<typeof GenerateRelevantMemeInputSchema>;

const GenerateRelevantMemeOutputSchema = z.object({
  memeDataUri: z
    .string()
    .describe(
      'The meme image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  altText: z.string().describe('Alternative text describing the meme.'),
});
export type GenerateRelevantMemeOutput = z.infer<typeof GenerateRelevantMemeOutputSchema>;

export async function generateRelevantMeme(
  input: GenerateRelevantMemeInput
): Promise<GenerateRelevantMemeOutput> {
  return generateRelevantMemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRelevantMemePrompt',
  input: {schema: GenerateRelevantMemeInputSchema},
  output: {schema: GenerateRelevantMemeOutputSchema},
  prompt: `You are a meme generator AI that provides a relevant meme based on the user\'s current context.

  The meme should be humorous and attention-grabbing to effectively distract the user.

  User context: {{{userContext}}}

  Generate a meme that is contextually relevant to the user's current situation. Respond with the image as a data URI and an alt text description. The image must be a meme.

  Meme: {{media url=memeDataUri}}`,
});

const generateRelevantMemeFlow = ai.defineFlow(
  {
    name: 'generateRelevantMemeFlow',
    inputSchema: GenerateRelevantMemeInputSchema,
    outputSchema: GenerateRelevantMemeOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {text: `Generate a meme that is contextually relevant to this situation: ${input.userContext}`},
      ],
      config: {responseModalities: ['TEXT', 'IMAGE']},
    });

    return {
      memeDataUri: media!.url,
      altText: `A relevant meme for the context: ${input.userContext}`,
    };
  }
);
