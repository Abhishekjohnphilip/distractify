
'use server';

import { generateRelevantMeme, GenerateRelevantMemeInput, GenerateRelevantMemeOutput } from '@/ai/flows/generate-meme';
import { generateArticle, GenerateArticleInput, GenerateArticleOutput } from '@/ai/flows/generate-article-flow';

interface MemeActionResult {
  error?: string;
  data?: GenerateRelevantMemeOutput;
}

export async function getMemeAction(input: GenerateRelevantMemeInput): Promise<MemeActionResult> {
  try {
    const result = await generateRelevantMeme(input);
    if (!result || !result.memeDataUri) {
        return { error: 'The AI returned an empty meme. It might be on a break.' };
    }
    return { data: result };
  } catch (error) {
    console.error('Meme generation failed:', error);
    return { error: 'Failed to generate a meme. Our AI might be procrastinating too.' };
  }
}

interface ArticleActionResult {
    error?: string;
    data?: GenerateArticleOutput;
}

export async function getArticleAction(input: GenerateArticleInput): Promise<ArticleActionResult> {
    try {
        const result = await generateArticle(input);
        if (!result || !result.content) {
            return { error: 'The AI failed to write an article. It probably got distracted.' };
        }
        return { data: result };
    } catch (error) {
        console.error('Article generation failed:', error);
        return { error: 'Failed to generate an article. Our AI is busy procrastinating.' };
    }
}
