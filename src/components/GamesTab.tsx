
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Puzzle, MousePointerClick, Lightbulb, Palette, BrainCircuit, RotateCcw } from 'lucide-react';
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

const UselessButtonGame = () => {
    const [clicks, setClicks] = useState(0);

    const messages = [
        "Nope.", "Still nothing.", "Try again.", "Are you sure?", "That did something... or did it?", "Click me again!", "You're persistent.", "I'm just a button.", "Okay, okay, you win... this click.", "One more time?"
    ];

    const handleClick = () => {
        setClicks(c => c + 1);
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
             <motion.div
                key={clicks}
                animate={{
                    x: [0, -5, 5, -5, 5, 0],
                    rotate: [0, -2, 2, -2, 2, 0],
                }}
                transition={{ duration: 0.3 }}
            >
                <Button onClick={handleClick} className="px-8 py-6 text-lg">
                    <MousePointerClick className="mr-2" />
                    Click Me
                </Button>
            </motion.div>
            <p className="text-sm text-muted-foreground h-5">
                {clicks > 0 ? messages[clicks % messages.length] : "There's a button. You can click it. That's it."}
            </p>
        </div>
    )
}

const uselessFacts = [
    "A group of flamingos is called a 'flamboyance'.",
    "A shrimp's heart is in its head.",
    "It is impossible for most people to lick their own elbow.",
    "A crocodile cannot stick its tongue out.",
    "The national animal of Scotland is the unicorn.",
    "A 'jiffy' is an actual unit of time: 1/100th of a second.",
    "Honey never spoils.",
    "An ostrich's eye is bigger than its brain.",
    "The Eiffel Tower can be 15 cm taller during the summer.",
    "A cockroach can live for a week without its head."
];

const UselessFactsGame = () => {
    const [fact, setFact] = useState("Click the button to get a useless fact!");

    const getNewFact = () => {
        let newFact = uselessFacts[Math.floor(Math.random() * uselessFacts.length)];
        while (newFact === fact) {
            newFact = uselessFacts[Math.floor(Math.random() * uselessFacts.length)];
        }
        setFact(newFact);
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 text-center w-full max-w-md">
            <p className="text-lg font-semibold h-16 flex items-center justify-center bg-accent/10 p-4 rounded-lg">
                "{fact}"
            </p>
            <Button onClick={getNewFact}>
                <Lightbulb className="mr-2" />
                Get another useless fact
            </Button>
        </div>
    )
}


const ColorBoxGame = () => {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f'];
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSequence, setPlayerSequence] = useState<number[]>([]);
    const [message, setMessage] = useState('Memorize the sequence!');
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [activeColor, setActiveColor] = useState<number | null>(null);
    const { toast } = useToast();

    const nextLevel = useCallback(() => {
        setIsPlayerTurn(false);
        setPlayerSequence([]);
        const nextColorIndex = Math.floor(Math.random() * colors.length);
        const newSequence = [...sequence, nextColorIndex];
        setSequence(newSequence);
        
        newSequence.forEach((colorIndex, i) => {
            setTimeout(() => {
                setActiveColor(colorIndex);
                setTimeout(() => setActiveColor(null), 300);
            }, (i + 1) * 600);
        });

        setTimeout(() => {
            setIsPlayerTurn(true);
            setMessage('Your turn!');
        }, (newSequence.length + 1) * 600);
    }, [sequence, colors.length]);

    const handleColorClick = (colorIndex: number) => {
        if (!isPlayerTurn) return;

        const newPlayerSequence = [...playerSequence, colorIndex];
        setPlayerSequence(newPlayerSequence);

        if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
            toast({
                variant: 'destructive',
                title: "Wrong Sequence!",
                description: `Game over! You reached level ${sequence.length}.`
            });
            resetGame();
            return;
        }

        if (newPlayerSequence.length === sequence.length) {
            toast({
                title: "Correct!",
                description: "Get ready for the next level."
            })
            setTimeout(nextLevel, 1000);
        }
    };

    const resetGame = () => {
        setSequence([]);
        setPlayerSequence([]);
        setMessage('Memorize the sequence!');
        setIsPlayerTurn(false);
    }
    
    useEffect(() => {
        if(sequence.length === 0 && !isPlayerTurn){
           setTimeout(nextLevel, 1000);
        }
    }, [sequence, isPlayerTurn, nextLevel])


    return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-lg font-semibold h-8">{message}</p>
            <div className="grid grid-cols-2 gap-2">
                {colors.map((color, index) => (
                    <motion.div
                        key={index}
                        onClick={() => handleColorClick(index)}
                        className="w-24 h-24 rounded-md cursor-pointer border-4"
                        style={{ backgroundColor: color, borderColor: activeColor === index ? 'white' : 'transparent' }}
                        whileTap={{ scale: 0.95 }}
                    />
                ))}
            </div>
             <p className="text-sm text-muted-foreground">Level: {sequence.length}</p>
        </div>
    );
};


const AIGuessingGame = () => {
    const [targetNumber, setTargetNumber] = useState(0);
    const [guess, setGuess] = useState("");
    const [message, setMessage] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);
    const { toast } = useToast();

    const startGame = useCallback(() => {
        setTargetNumber(Math.floor(Math.random() * 100) + 1);
        setMessage("I've thought of a number between 1 and 100. Try to guess it!");
        setGuess("");
        setIsGameOver(false);
    }, []);

    useEffect(() => {
        startGame();
    }, [startGame]);

    const handleGuess = (e: React.FormEvent) => {
        e.preventDefault();
        if (isGameOver) return;

        const numGuess = parseInt(guess);
        if (isNaN(numGuess)) {
            setMessage("That's not a number! The AI is confused.");
            return;
        }

        if (numGuess < targetNumber) {
            setMessage("Too low! The AI is smarter than that.");
        } else if (numGuess > targetNumber) {
            setMessage("Too high! The AI is unimpressed.");
        } else {
            setMessage(`You guessed it! The number was ${targetNumber}.`);
            setIsGameOver(true);
            toast({
                title: "You won!",
                description: "You successfully distracted yourself from whatever you were supposed to be doing."
            })
        }
        setGuess("");
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 text-center w-full max-w-sm">
             <p className="text-lg font-semibold h-12">{message}</p>
            <form onSubmit={handleGuess} className="flex gap-2 w-full">
                <Input
                    type="number"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Enter your guess"
                    className="text-center"
                    disabled={isGameOver}
                />
                <Button type="submit" disabled={isGameOver}>Guess</Button>
            </form>
             {isGameOver ? (
                <Button onClick={startGame} variant="secondary">
                    <RotateCcw className="mr-2"/>
                    Play Again
                </Button>
            ) : (
                <p className="text-sm text-muted-foreground">Can you outsmart the AI? Probably not, but it's fun to try.</p>
            )}
        </div>
    )
}

const games = [
    {
        id: "useless-facts",
        title: "Useless Facts 🤔",
        description: "Distract yourself with wonderfully pointless knowledge.",
        icon: Lightbulb,
        component: <UselessFactsGame />,
    },
    {
        id: "useless-button",
        title: "The Useless Button  pointless",
        description: "There's a button. You can click it. That's it.",
        icon: MousePointerClick,
        component: <UselessButtonGame />,
    },
    {
        id: "color-box",
        title: "Color Box Game 🎨",
        description: "Test your memory with this simple color sequence game.",
        icon: Palette,
        component: <ColorBoxGame />,
    },
    {
        id: "ai-guesser",
        title: "AI Guessing Game 🤖",
        description: "Can you outsmart the AI? Probably not.",
        icon: BrainCircuit,
        component: <AIGuessingGame />,
    }
]

export function GamesTab() {
    const [activeGame, setActiveGame] = useState<string | null>(null);

    const GameComponent = games.find(g => g.id === activeGame)?.component;
    const activeGameDetails = games.find(g => g.id === activeGame);

    if (activeGame && GameComponent && activeGameDetails) {
        return (
             <Card className="h-full flex flex-col transition-all duration-300">
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <Button variant="ghost" onClick={() => setActiveGame(null)} className="self-start px-2">
                            &larr; Back to Games
                        </Button>
                        <div className="text-right">
                           <CardTitle>{activeGameDetails.title}</CardTitle>
                           <CardDescription>{activeGameDetails.description}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center p-8 md:p-12">
                   {GameComponent}
                </CardContent>
             </Card>
        )
    }

    return (
        <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg">
            <CardHeader>
                <CardTitle>Game Zone 🎮</CardTitle>
                <CardDescription>A collection of seriously unproductive (but fun) games.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {games.map((game) => (
                         <button key={game.id} onClick={() => setActiveGame(game.id)} className="text-left rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <Card className="flex h-full flex-col border-0 shadow-none bg-transparent">
                                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden flex items-center justify-center text-primary">
                                    <game.icon className="w-24 h-24" />
                                </div>
                                <CardHeader>
                                    <div>
                                        <CardTitle className="text-lg">{game.title}</CardTitle>
                                        <CardDescription className="text-xs mt-1">{game.description}</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                         </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
