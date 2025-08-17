
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from './ui/progress';

const timeOptions = [
  { value: 3000, label: 'Every 3 seconds' },
  { value: 5000, label: 'Every 5 seconds' },
  { value: 10000, label: 'Every 10 seconds' },
  { value: 20000, label: 'Every 20 seconds' },
  { value: 30000, label: 'Every 30 seconds' },
  { value: 60000, label: 'Every 1 minute' },
  { value: 300000, label: 'Every 5 minutes' },
  { value: 600000, label: 'Every 10 minutes' },
  { value: 900000, label: 'Every 15 minutes' },
  { value: 1800000, label: 'Every 30 minutes' },
  { value: 3600000, label: 'Every 1 hour' },
  { value: 7200000, label: 'Every 2 hours' },
  { value: 86400000, label: 'Every 1 day' },
];

export function ScheduledDistractions() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [intervalMs, setIntervalMs] = useState(300000); // Default to 5 minutes
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Register service worker on component mount
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(error => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }, []);

  const stopProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(0);
  }, []);

  const startProgress = useCallback(() => {
    stopProgress();
    const updateFrequency = 100; // ms
    const totalSteps = intervalMs / updateFrequency;
    let currentStep = 0;

    progressIntervalRef.current = setInterval(() => {
      currentStep++;
      setProgress((currentStep / totalSteps) * 100);
      if (currentStep >= totalSteps) {
        currentStep = 0; // Reset for next cycle
      }
    }, updateFrequency);
  }, [intervalMs, stopProgress]);


  const handleToggle = async (checked: boolean) => {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
        toast({
            variant: 'destructive',
            title: 'Browser Not Supported',
            description: 'This browser does not support notifications.',
        });
        setIsEnabled(false);
        return;
    }
    
    if (checked) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
          toast({
              title: 'Distractions Enabled!',
              description: "Get ready to be wonderfully unproductive.",
          });
          setIsEnabled(true);
          const sw = await navigator.serviceWorker.ready;
          sw.active?.postMessage({ command: 'start', interval: intervalMs });
          startProgress();
      } else {
          toast({
            variant: 'destructive',
            title: 'Permission Denied',
            description: 'You blocked notifications. Please enable them in your browser settings.',
          });
          setIsEnabled(false); // Ensure switch is off if permission is denied
      }
    } else {
      setIsEnabled(false);
      const sw = await navigator.serviceWorker.ready;
      sw.active?.postMessage({ command: 'stop' });
      stopProgress();
      toast({
            title: 'Distractions Disabled',
            description: "Okay, back to work... for now.",
      });
    }
  };
  
  const handleIntervalChange = async (value: string) => {
    const newInterval = Number(value);
    setIntervalMs(newInterval);
    if (isEnabled) {
      // If already enabled, restart the timer with the new interval
      const sw = await navigator.serviceWorker.ready;
      sw.active?.postMessage({ command: 'start', interval: newInterval });
      startProgress();
    }
  }

  const getFrequencyLabel = () => {
    return timeOptions.find(o => o.value === intervalMs)?.label.replace('Every ', '');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
         <Label htmlFor="distraction-mode" className="font-semibold flex-1 pr-4">
            Enable Distractions
          </Label>
        <Switch
          id="distraction-mode"
          checked={isEnabled}
          onCheckedChange={handleToggle}
          aria-label="Enable or disable scheduled distractions"
        />
      </div>

       {isEnabled && (
        <div className="px-1 space-y-3">
            <p className="text-sm text-muted-foreground">
                Next distraction in {getFrequencyLabel()}. Stay focused... or don't.
            </p>
            <Progress value={progress} className="w-full h-2" />
        </div>
       )}

      <div>
        <Label htmlFor="distraction-interval">Distraction Frequency</Label>
        <Select
            value={String(intervalMs)}
            onValueChange={handleIntervalChange}
            disabled={isEnabled}
        >
            <SelectTrigger id="distraction-interval">
                <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
                {timeOptions.map(option => (
                    <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
         <p className="text-xs text-muted-foreground mt-2">Notifications will appear even if the app is closed.</p>
      </div>
    </div>
  );
}
