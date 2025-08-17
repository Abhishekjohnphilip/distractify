'use server';

/**
 * @fileOverview An AI agent that generates short, engaging articles on tech topics.
 * 
 * - generateArticle - A function that generates an article based on a title.
 * - GenerateArticleInput - The input type for the generateArticle function.
 * - GenerateArticleOutput - The return type for the generateArticle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateArticleInputSchema = z.object({
  title: z.string().describe('The title of the article to generate.'),
});
export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

const GenerateArticleOutputSchema = z.object({
  content: z.string().describe('The generated content of the article in Markdown format.'),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;


const generateArticleFlow = ai.defineFlow(
  {
    name: 'generateArticleFlow',
    inputSchema: GenerateArticleInputSchema,
    outputSchema: GenerateArticleOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
        name: 'generateArticlePrompt',
        input: { schema: GenerateArticleInputSchema },
        output: { schema: GenerateArticleOutputSchema },
        prompt: `You are an expert tech writer who specializes in making complex topics fun and easy to understand.
        
        Your task is to write a short, engaging, and slightly humorous article based on the provided title.
        The article should be interesting enough to distract someone from their work.
        
        The output should be in Markdown format.

        Article Title: {{{title}}}
        `,
    });
      
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateArticle(input: GenerateArticleInput): Promise<GenerateArticleOutput> {
  return generateArticleFlow(input);
}
