
import { MemeGenerator } from '@/components/MemeGenerator';
import { BroadcastMessage } from '@/components/BroadcastMessage';
import { PageVisibility } from '@/components/PageVisibility';
import { FeatureCard } from '@/components/FeatureCard';
import { Tv, Clock } from 'lucide-react';
import { ScheduledDistractions } from '@/components/ScheduledDistractions';
import { DistractifyIcon } from '@/components/DistractifyIcon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GamesTab } from '@/components/GamesTab';
import { ArticlesTab } from '@/components/ArticlesTab';
import { Clapperboard, Gamepad2, Newspaper, BellRing, Repeat } from 'lucide-react';
import { Reminder } from '@/components/Reminder';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="p-6 md:p-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary flex items-center gap-3">
            <DistractifyIcon className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            Distractify
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
            Your friendly neighborhood productivity-killer. Why do today what you can put off until tomorrow?
          </p>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="memes" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="memes"><Clapperboard className="mr-2"/>Memes</TabsTrigger>
                <TabsTrigger value="games"><Gamepad2 className="mr-2" />Games</TabsTrigger>
                <TabsTrigger value="articles"><Newspaper className="mr-2" />Articles</TabsTrigger>
              </TabsList>
              <TabsContent value="memes">
                <MemeGenerator />
              </TabsContent>
              <TabsContent value="games">
                <GamesTab />
              </TabsContent>
              <TabsContent value="articles">
                <ArticlesTab />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-8">
            <FeatureCard
              title="Screen-Off Simulation 👀"
              description="We'll notice when you try to leave."
              icon={Tv}
            >
              <PageVisibility />
            </FeatureCard>

            <BroadcastMessage />

            <FeatureCard
              title="Scheduled Notification 📝"
              description="Set a one-time, fixed notification to pull you away from work."
              icon={BellRing}
            >
              <Reminder />
            </FeatureCard>

            <FeatureCard
              title="Recurring Distractions ⏰"
              description="Get notifications at a regular interval to ensure you stay distracted."
              icon={Repeat}
            >
              <ScheduledDistractions />
            </FeatureCard>
          </div>

        </div>
      </main>
    </div>
  );
}
