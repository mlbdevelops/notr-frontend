import { LocalNotifications } from '@capacitor/local-notifications';

const CTA_MESSAGES = [
  "Discover the latest notes waiting for you 📝",
  "Catch today’s top notes in your feed!",
  "Something new just dropped—take a look!",
  "Share your thoughts with the world today!",
  "Have an idea? Write a note now 🖊️",
  "Your next note could inspire someone—start writing!",
  "See what’s trending in the note community!",
  "Explore new notes and find hidden gems!",
  "Your daily dose of ideas is ready—tap to see!",
  "React to notes and share your opinion!",
  "Vote for your favorite note today!",
  "Don’t let your notes gather dust—write one now!",
  "Your notes, your thoughts—check in today 📝",
  "Stay inspired—discover fresh notes now!"
];

const NOTIFICATION_HOURS = [9, 12, 15, 20];

export const requestNotificationPermission = async () => {
  const permission = await LocalNotifications.requestPermissions();
  return permission.display === 'granted';
};

export const scheduleDailyNotifications = async () => {
  const granted = await requestNotificationPermission();
  if (!granted) return;
  
  const extras = ['/', '/create_post']
  
  const notifications = NOTIFICATION_HOURS.map((hour, index) => ({
    id: index + 1,
    title: 'Notr',
    body: CTA_MESSAGES[index % CTA_MESSAGES.length],
    schedule: { every: { hour: hour, minute: 0 } },
    sound: null,
    smallIcon: 'ic_notification',
    extra: { targetPage: extras[index % extras.length] }
  }));
  
  await LocalNotifications.schedule({ notifications });
};

