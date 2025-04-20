// src/services/notificationService.js
import { LocalNotifications } from '@capacitor/local-notifications';

export const NotificationService = {
  async requestPermissions() {
    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  },
  
  async scheduleTaskReminder(task) {
    if (!task.due_date) return;
    
    // Calculate notification time (1 day before due date)
    const dueDate = new Date(task.due_date);
    const notifyDate = new Date(dueDate);
    notifyDate.setDate(notifyDate.getDate() - 1);
    
    // Don't schedule if the notify date is in the past
    if (notifyDate <= new Date()) return;
    
    await LocalNotifications.schedule({
      notifications: [
        {
          id: parseInt(task.id.replace(/-/g, '').substring(0, 8), 16), // Generate numeric ID from UUID
          title: 'Task Reminder',
          body: `"${task.title}" is due tomorrow`,
          schedule: { at: notifyDate }
        }
      ]
    });
  },
  
  async cancelTaskReminder(task) {
    if (!task.id) return;
    
    const notificationId = parseInt(task.id.replace(/-/g, '').substring(0, 8), 16);
    
    await LocalNotifications.cancel({
      notifications: [{ id: notificationId }]
    });
  }
};