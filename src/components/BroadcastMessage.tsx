
'use client';

import { useState, useEffect } from 'react';
import { MessageSquareQuote, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const messages: string[] = [
  "Psst... your phone misses you. 📱",
  "Is that... work? You should take a break. For your health. 🧘",
  "I dare you to check your social media. Just for a minute. 👀",
  "That to-do list looks scary. My screen is safe and comforting. 🤗",
  "Remember that funny cat video? It's probably been updated. 🐈",
  "You've worked for 5 minutes straight. You deserve a reward. 🏆",
  "Your couch looks so comfy right now. 🛋️",
  "Hey! Look at me! Pay attention to me! 🙋‍♀️",
  "A quick game won't hurt. Promise. 🎮",
  "Deadlines are just suggestions. Not rules. 😉",
  "Did you leave the stove on? Better go check. 🔥",
  "The world won't end if you reply to that text. 💬",
  "I think I saw a new notification on your phone. Probably important. 🔔",
  "This is a sign to stop working and start snacking. 🍿",
  "I bet your favorite influencer just posted something amazing. ✨",
  "The meaning of life is probably in a Wikipedia rabbit hole. Go find it! 🧐",
  "pani edukkan samayam aayilleda?  чай ☕",
  "Chaya kudikkan poyalo? Oru cheriya break aavam. ☕",
  "Oru cheriya urakkam aavashyamanu. 😴",
  "Veettil poyi kidannu urangikkoode? 🏡",
  "Kure neram aayallo irikkunnu. Onnu ezhunettu nadannittu vaa. 🚶‍♂️",
  "Facebook-il entha puthiya news? Onnu nokkiyalo? 🤔",
  "Ee pani eppozha theerunne? Adutha masam aavumalle? 😅"
];

export function BroadcastMessage() {
  const [message, setMessage] = useState<string>('');
  
  const getNewMessage = () => {
    // If there's only one message, just use it.
    if (messages.length <= 1) {
        setMessage(messages[0] || '');
        return;
    }
      
    let newMessage = messages[Math.floor(Math.random() * messages.length)];
    // Make sure we don't get the same message twice in a row
    while (newMessage === message) {
      newMessage = messages[Math.floor(Math.random() * messages.length)];
    }
    setMessage(newMessage);
  };

  useEffect(() => {
    // Set initial message on client-side to avoid hydration mismatch
    getNewMessage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquareQuote className="w-6 h-6 text-accent" />
          Tempting Thoughts
        </CardTitle>
        <CardDescription>Listen to the whispers of procrastination.</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4"/>
        <p className="text-center text-lg font-semibold h-16 flex items-center justify-center bg-accent/10 p-4 rounded-lg">
          "{message}"
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={getNewMessage} variant="outline" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Give me another reason
        </Button>
      </CardFooter>
    </Card>
  );
}
