import jwt from 'jsonwebtoken';
import Task from '../models/Task.js'

export const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, status, category } = req.body;
        const token = req.headers['authorization']?.split(' ')[1];
        const creatorId = jwt.decode(token).sub;


        if (!title) {
            return res.status(400).json({ error: 'Missing required field: title' });
        }
        if (!dueDate) {
            return res.status(400).json({ error: 'Missing required field: due date' });
        }
        const task = await Task.insertOne({ title: title, description: description, dueDate: dueDate, priority: priority, status: status, category: category, user: creatorId });
        return res.status(200).json({ message: "Task Created successfully", createTask: task });
    }
    catch (err) {
        console.error(`Create Task Error: ${err}`);
        return res.status(500).json({ error: 'Internal server error' });

    }
}


