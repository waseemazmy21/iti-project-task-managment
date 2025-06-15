import cron from 'node-cron';
import Task from '../models/Task.js';
import { sendEmail } from './sendEmail.js';

// Runs every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  // Find tasks due in the next hour, not completed, and not reminded
  const tasks = await Task.find({
    dueDate: { $gte: now, $lte: oneHourLater },
    status: { $ne: 'Completed' },
    reminderSent: false,
  }).populate('user');

  for (const task of tasks) {
    if (task.user && task.user.email) {
      const subject = `Reminder: Task "${task.title}" is due soon!`;
      const text = `Hello,\n\nThis is a reminder that your task "${task.title}" is due at ${task.dueDate}.\n\nDescription: ${task.description || 'No description'}\n\nBest regards,\nTask Management App`;
      await sendEmail(task.user.email, subject, text);
      task.reminderSent = true;
      await task.save();
    }
  }
});
