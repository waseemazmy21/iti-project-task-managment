import jwt from 'jsonwebtoken';
import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, category } =
      req.body;
    const creatorId = req.user.id;

    if (!title) {
      return res.status(400).json({ error: 'Missing required field: title' });
    }
    if (!dueDate) {
      return res
        .status(400)
        .json({ error: 'Missing required field: due date' });
    }
    const task = await Task.insertOne({
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority,
      status: status,
      category: category,
      user: creatorId,
    });
    return res
      .status(200)
      .json({ message: 'Task Created successfully', createTask: task });
  } catch (err) {
    console.error(`Create Task Error: ${err}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const creatorId = req.user.id;

    await Task.findOneAndDelete({ _id: id, user: creatorId });
    return res
      .status(200)
      .json({ messgae: `Task with id ${id} deleted successfully` });
  } catch (err) {
    console.error(`Delete Task Error: ${err}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const filterTasks = async (req, res) => {
  try {
    const { limit = 10, skip = 0, category, priority, status } = req.query;

    const userID = req.user.id;

    const query = { user: userID };
    if (category) {
      query.category = category;
    }
    if (priority) {
      query.priority = priority;
    }
    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query).limit(limit).skip(skip);
    res.body = tasks;
    console.log(query);
    return res
      .status(200)
      .json({ message: 'Tasks retrieved successfully', retrievedTasks: tasks });
  } catch (err) {
    console.error(`Filter Tasks Error: ${err}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// Get all tasks based on ROle 

export const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let tasks;

    if (userRole === 'admin') {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({ user: userId });
    }

    return res.status(200).json({
      message: 'Tasks retrieved successfully',
      retrievedTasks: tasks,
    });
  } catch (err) {
    console.error(`Get All Tasks Error: ${err}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
