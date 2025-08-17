
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { AlarmClockPlus, CalendarIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const reminderSchema = z.object({
  message: z.string().min(1, 'Reminder message cannot be empty.').max(100, 'Message is too long.'),
  datetime: z.date({
    required_error: "A date and time is required.",
  }).min(new Date(), { message: "Reminder must be in the future." }),
});

type Reminder = z.infer<typeof reminderSchema> & { id: string };

export function Reminder() {
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    // Load reminders from localStorage on component mount
    try {
      const storedReminders = localStorage.getItem('distractify-reminders');
      if (storedReminders) {
        const parsed = JSON.parse(storedReminders);
        // Convert date strings back to Date objects
        const remindersWithDates = parsed.map((r: any) => ({...r, datetime: new Date(r.datetime)}));
        setReminders(remindersWithDates);
      }
    } catch (error) {
      console.error("Failed to parse reminders from localStorage", error);
    }
  }, []);

  useEffect(() => {
    // Save reminders to localStorage whenever they change
    try {
        localStorage.setItem('distractify-reminders', JSON.stringify(reminders));
    } catch(error) {
        console.error("Failed to save reminders to localStorage", error);
    }
  }, [reminders]);

  const form = useForm<z.infer<typeof reminderSchema>>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      message: 'Time for a break!',
      datetime: undefined,
    },
  });

  const handleSetReminder = async (values: z.infer<typeof reminderSchema>) => {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
        toast({
            variant: 'destructive',
            title: 'Browser Not Supported',
            description: 'This browser does not support notifications.',
        });
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        toast({
            variant: 'destructive',
            title: 'Permission Denied',
            description: 'You blocked notifications. Please enable them in your browser settings.',
        });
        return;
    }
    
    // Ensure the service worker is ready before posting a message
    const swRegistration = await navigator.serviceWorker.ready;
    const delayMs = values.datetime.getTime() - Date.now();
    const localTime = format(values.datetime, "PPpp");
    const id = Date.now().toString();

    swRegistration.active?.postMessage({
        command: 'set-reminder',
        id,
        message: values.message,
        delay: delayMs,
        localTime,
    });
    
    const newReminder = { ...values, id };
    setReminders(prev => [...prev, newReminder].sort((a, b) => a.datetime.getTime() - b.datetime.getTime()));

    toast({
        title: 'Notification Scheduled!',
        description: `We'll distract you with "${values.message}" at ${localTime}.`,
    });
    form.reset({ message: 'Time for another break!', datetime: undefined });
  };

  const handleDeleteReminder = async (id: string) => {
    const swRegistration = await navigator.serviceWorker.ready;
    swRegistration.active?.postMessage({ command: 'cancel-reminder', id });
    setReminders(prev => prev.filter(r => r.id !== id));
    toast({
      title: 'Notification Removed',
      description: 'You will no longer be distracted by this notification.',
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSetReminder)} className="space-y-4">
              <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>Notification Message</FormLabel>
                          <FormControl>
                              <Input placeholder="e.g., Stop working now!" {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                control={form.control}
                name="datetime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date and Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP p")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                         <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            initialFocus
                          />
                          <div className="p-2 border-t border-border">
                            <Input
                                type="time"
                                onChange={(e) => {
                                    if (!field.value) {
                                      field.onChange(new Date());
                                    }
                                    const [hours, minutes] = e.target.value.split(':').map(Number);
                                    const newDate = new Date(field.value || new Date());
                                    newDate.setHours(hours, minutes);
                                    field.onChange(newDate);
                                }}
                                value={field.value ? format(field.value, 'HH:mm') : ''}
                            />
                          </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
                />
              <Button type="submit" className="w-full">
                  <AlarmClockPlus className="mr-2" />
                  Schedule Notification
              </Button>
          </form>
      </Form>
      
      {reminders.length > 0 && (
        <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Upcoming Notifications</h4>
            <ul className="space-y-2">
                {reminders.map(reminder => (
                    <li key={reminder.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50 text-sm">
                        <div className="flex flex-col">
                            <span>{reminder.message}</span>
                            <span className="text-xs text-muted-foreground">{format(reminder.datetime, "eee, MMM d 'at' p")}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteReminder(reminder.id)} className="shrink-0 h-8 w-8">
                            <Trash2 className="h-4 w-4"/>
                            <span className="sr-only">Delete reminder</span>
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
}
