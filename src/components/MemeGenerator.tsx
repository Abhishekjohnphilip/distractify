
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { getMemeAction } from '@/app/actions';
import type { GenerateRelevantMemeOutput } from '@/ai/flows/generate-meme';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Dices } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { Separator } from './ui/separator';
import { PlaceholderIcon } from './PlaceholderIcon';

const formSchema = z.object({
  userContext: z
    .string()
    .min(10, { message: 'Come on, give me something to work with! At least 10 characters.' })
    .max(200, { message: "That's too much context, keep it brief!" }),
});

const randomContexts = [
  "procrastinating on a big project",
  "avoiding all my adult responsibilities",
  "watching funny animal videos instead of working",
  "the dread of an approaching deadline",
  "when you have 100 tabs open and only one is actually for work",
  "pretending to read important emails",
  "the immense joy of starting a new TV series when you have a mountain of work to do",
  "trying to understand a ridiculously complex topic",
  "when the code finally works after hours and hours of painful debugging",
  "that heart-stopping moment when you remember a deadline at the very last minute",
  "the universal pain of Monday mornings",
  "the feeling of being a senior developer and still having to Google basic syntax",
  "attending a meeting that could have been an email",
  "veettilottu pokan thonunnu, but there is so much work",
  "pani cheyyan madi aavunnu, can someone else do it?",
  "urangaൻ samayamayi, but I need to finish this, maybe tomorrow",
  "when you find a bug in production on a Friday afternoon",
  "chaya kudikkan നേരമായി",
  "YouTube is calling my name",
  "planning a vacation I can't afford instead of working"
];

export function MemeGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [meme, setMeme] = useState<GenerateRelevantMemeOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userContext: '',
    },
  });

  async function generateMeme(userContext: string) {
    setIsLoading(true);
    setMeme(null);

    const result = await getMemeAction({ userContext });

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: result.error,
      })
    } else if (result.data) {
      setMeme(result.data);
    }
    
    setIsLoading(false);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await generateMeme(values.userContext);
  }
  
  async function onRandomSubmit() {
    const randomContext = randomContexts[Math.floor(Math.random() * randomContexts.length)];
    form.setValue('userContext', randomContext);
    await generateMeme(randomContext);
  }

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="w-7 h-7 text-accent" />
          Meme Procrastinator ✨
        </CardTitle>
        <CardDescription>Tell us what you're avoiding, and we'll give you the perfect meme to help you avoid it longer.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userContext"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What task are you "working" on? 🤔</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'finishing my quarterly report', 'studying for finals', 'cleaning the garage'..."
                      {...field}
                      rows={2}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Brewing up a distraction... ☕' : 'Distract Me!'}
            </Button>
          </form>
        </Form>
        
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <Button onClick={onRandomSubmit} disabled={isLoading} className="w-full" variant="secondary">
          <Dices className="mr-2"/>
          {isLoading ? 'Finding a random meme...' : 'Feeling Lucky? Get a Random Meme 🎲'}
        </Button>

        <div className="mt-4 flex-1 flex items-center justify-center rounded-lg bg-muted/50 p-4 min-h-[300px] md:min-h-[400px]">
          {isLoading && (
            <div className="w-full space-y-4">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {!isLoading && meme && (
            <figure className="text-center">
              <Image
                src={meme.memeDataUri}
                alt={meme.altText}
                width={500}
                height={500}
                className="rounded-lg shadow-md object-contain max-h-[400px] w-auto"
                data-ai-hint="funny meme"
              />
              <figcaption className="text-sm text-muted-foreground mt-2 italic">{meme.altText}</figcaption>
            </figure>
          )}
          {!isLoading && !meme && (
            <div className="text-center text-muted-foreground flex flex-col items-center justify-center">
              <PlaceholderIcon className="w-40 h-40" />
              <p className="mt-4 text-lg">Your beautifully crafted distraction will appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
