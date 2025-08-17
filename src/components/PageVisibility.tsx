'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function PageVisibility() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Can't access document on server, so check for window
    if (typeof window === 'undefined' || !document) return;

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    // Set initial state
    handleVisibilityChange();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="flex items-center justify-center space-x-4 rounded-lg bg-muted/50 p-4">
      {isVisible ? (
        <Eye className="h-8 w-8 text-accent animate-pulse" />
      ) : (
        <EyeOff className="h-8 w-8 text-destructive" />
      )}
      <div className="text-left flex-1">
        <p className="font-semibold">
          {isVisible ? 'You are here!' : 'Hey! Come back!'}
        </p>
        <p className="text-sm text-muted-foreground">
          {isVisible ? 'Good. Stay a while.' : 'You were gone. We missed you.'}
        </p>
      </div>
    </div>
  );
}
