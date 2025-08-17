// Distractify Service Worker

let recurringTimerId = null;
const reminderTimers = new Map();

// --- Notification Content ---

const recurringMessages = [
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
  "Chaya kudikkan poyalo? Oru cheriya break aavam. ☕",
  "Oru cheriya urakkam aavashyamanu. 😴",
  "Veettil poyi kidannu urangikkoode? 🏡",
  "Kure neram aayallo irikkunnu. Onnu ezhunettu nadannittu vaa. 🚶‍♂️",
  "Facebook-il entha puthiya news? Onnu nokkiyalo? 🤔",
  "Ee pani eppozha theerunne? Adutha masam aavumalle? 😅"
];

const recurringTitles = [
    "A Wild Distraction Appeared!",
    "🚨 Productivity Alert! 🚨",
    "An Urgent Message From Your Couch",
    "Your Procrastination Partner Has Arrived",
    "Time For An Unscheduled Break!",
    "You've Earned a Distraction!",
    "Your Attention Is Required Elsewhere",
];

const recurringImages = [
    { url: 'https://picsum.photos/600/300', aiHint: 'funny meme' },
    { url: 'https://picsum.photos/600/300', aiHint: 'procrastination' },
    { url: 'https://picsum.photos/600/300', aiHint: 'cat video' },
    { url: 'https://picsum.photos/600/300', aiHint: 'funny fail' },
];


// --- Event Listeners ---

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data.command === 'start') {
    startRecurringNotifications(event.data.interval);
  } else if (event.data.command === 'stop') {
    stopRecurringNotifications();
  } else if (event.data.command === 'set-reminder') {
    setReminder(event.data);
  } else if (event.data.command === 'cancel-reminder') {
    cancelReminder(event.data.id);
  }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Focus the app window if it's open
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            return clients.openWindow('/');
        })
    );
});


// --- Helper Functions ---

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- Recurring Notifications ---

const startRecurringNotifications = (interval) => {
  stopRecurringNotifications(); // Clear any existing timer before starting a new one
  if (interval > 0) {
    recurringTimerId = setInterval(showRecurringNotification, interval);
  }
};

const stopRecurringNotifications = () => {
  if (recurringTimerId) {
    clearInterval(recurringTimerId);
    recurringTimerId = null;
  }
};

const showRecurringNotification = () => {
  const randomMessage = getRandomItem(recurringMessages);
  const randomTitle = getRandomItem(recurringTitles);
  const randomImage = getRandomItem(recurringImages);

  self.registration.showNotification(randomTitle, {
    body: randomMessage,
    icon: '/distractify-notification-icon.svg',
    image: randomImage.url,
    badge: '/distractify-notification-icon.svg',
    actions: [
      { action: 'embrace', title: 'Embrace Distraction' },
      { action: 'resist', title: 'Resist (For Now)' },
    ],
    data: {
        aiHint: randomImage.aiHint
    }
  });
};


// --- Scheduled (One-Time) Reminders ---

const setReminder = (reminder) => {
  const { id, delay, message, localTime } = reminder;

  // Clear any existing timer for this ID before setting a new one
  if (reminderTimers.has(id)) {
    clearTimeout(reminderTimers.get(id));
  }

  const timer = setTimeout(() => {
    showReminderNotification(message, localTime);
    reminderTimers.delete(id); // Clean up after firing
  }, delay);

  reminderTimers.set(id, timer);
};

const cancelReminder = (id) => {
  if (reminderTimers.has(id)) {
    clearTimeout(reminderTimers.get(id));
    reminderTimers.delete(id);
  }
};

const showReminderNotification = (message, localTime) => {
  const body = localTime 
      ? `A friendly reminder for you, scheduled at ${localTime}.` 
      : 'A friendly reminder for you.';

  self.registration.showNotification('Your Scheduled Distraction!', {
      body: message,
      icon: '/distractify-notification-icon.svg',
      badge: '/distractify-notification-icon.svg',
  });
};
