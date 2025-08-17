
'use client';

import { useState } from 'react';
import { getArticleAction } from '@/app/actions';
import { marked } from 'marked';
import { BrainCircuit, FunctionSquare, GitBranch, Cloud, Newspaper, Lightbulb, Filter } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const articlesByCategory = {
    'Tech Humor': [
        {
            title: "Why Your Side Project Will Never Be Finished (And That's OK)",
            description: "An oddly comforting look at the nature of creative projects and the joy of the process over the outcome.",
            icon: GitBranch,
        },
        {
            title: "The Cloud is Just Someone Else's Computer",
            description: "Demystifying cloud computing with simple analogies and explaining where your data actually lives.",
            icon: Cloud,
        }
    ],
    'Tech Deep Dive': [
        {
            title: "The History of AI: From Turing to Transformers",
            description: "A deep dive into the evolution of artificial intelligence and its impact on modern technology.",
            icon: BrainCircuit,
        },
        {
            title: "Quantum Computing: The Next Frontier?",
            description: "Exploring the mind-bending principles of quantum mechanics and its potential to revolutionize computing.",
            icon: FunctionSquare,
        }
    ],
    'Life Advice': [
        {
            title: "The Subtle Art of Not Giving a... Wait, I Forgot",
            description: "A humorous take on prioritizing what truly matters, if you can remember what that is.",
            icon: Lightbulb,
        },
        {
            title: "How to Win Friends and Pretend to Listen to People",
            description: "Master the art of social interaction without having to actually pay attention.",
            icon: Newspaper,
        }
    ]
};

const categories = ['All', ...Object.keys(articlesByCategory)];

type Article = {
    title: string;
    description: string;
    icon: React.ElementType;
}

export function ArticlesTab() {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [articleContent, setArticleContent] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const { toast } = useToast();

    const handleReadArticle = async (article: Article) => {
        setSelectedArticle(article);
        setIsLoading(true);
        setArticleContent('');

        const result = await getArticleAction({ title: article.title });
        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Failed to generate article',
                description: result.error,
            });
            setSelectedArticle(null); // Close dialog on error
        } else if (result.data) {
            const htmlContent = await marked.parse(result.data.content);
            setArticleContent(htmlContent);
        }
        setIsLoading(false);
    }
    
    const getVisibleArticles = () => {
        if (activeCategory === 'All') {
            return Object.values(articlesByCategory).flat();
        }
        return articlesByCategory[activeCategory as keyof typeof articlesByCategory] || [];
    };

    return (
        <>
            <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg">
                <CardHeader>
                    <CardTitle>📰 Distracting Reads</CardTitle>
                    <CardDescription>We've curated a collection of interesting articles to keep you occupied. Choose a category to get started.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-6">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Filter className="w-5 h-5 text-muted-foreground"/>
                        {categories.map(category => (
                            <Button 
                                key={category} 
                                variant={activeCategory === category ? 'default' : 'outline'}
                                onClick={() => setActiveCategory(category)}
                                className="rounded-full"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getVisibleArticles().map((article) => (
                            <button
                                key={article.title}
                                onClick={() => handleReadArticle(article)}
                                className="text-left p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-start gap-4"
                            >
                                <article.icon className="w-8 h-8 text-accent shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold">{article.title}</h3>
                                    <p className="text-sm text-muted-foreground">{article.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selectedArticle} onOpenChange={(isOpen) => !isOpen && setSelectedArticle(null)}>
                <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
                     <DialogHeader>
                        <DialogTitle>{selectedArticle?.title}</DialogTitle>
                        <DialogDescription>{selectedArticle?.description}</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-6 -mr-6 py-4">
                        {isLoading ? (
                            <div className="space-y-4 mt-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <br/>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                        ) : (
                             <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: articleContent }} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
