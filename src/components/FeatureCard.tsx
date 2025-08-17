import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function FeatureCard({ title, description, icon: Icon, children, className }: FeatureCardProps) {
  return (
    <Card className={`transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-6 h-6 text-accent" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
