import cron from 'node-cron';
import Task from '../models/Task.js';
import { sendEmail } from './sendEmail.js';

// Runs every 10 minutes
cron.schedule('*/1 * * * *', async () => {
  console.log('node mailller schedule');
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  const tasks = await Task.find({
    status: { $ne: 'Completed' },
    reminderSent: false,
  }).populate('user');

  console.log(tasks);

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
