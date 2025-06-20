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

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(id);
    console.log('userid', userId);
    const task = await Task.findOne({
      _id: id,
      user: userId,
    });
    if (!task) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Task not found' });
    }
    res.json({ status: 'success', data: task });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, category, status } =
      req.body;

    if (!title || !dueDate || !priority || !status) {
      res.status(400).json({ error: 'All fields are required' });
    }
    const id = req.params.id;
    const userId = req.user.id;
    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        user: userId,
      },
      {
        title,
        description,
        dueDate,
        priority,
        category,
        status,
      },
      { new: true, runValidators: true },
    );
    if (!task) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Task not found' });
    }
    res.json({ status: 'success', data: task });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export async function searchTasks(req, res) {
  try {
    const queryParams = req.query;

    const limit = +queryParams.limit || 10;
    const page = +queryParams.page || 1;
    const skip = (page - 1) * limit;

    const filterbleFields = new Map([
      ['title', (val) => val.toLowerCase()],
      ['description', (val) => val.toLowerCase()],
      ['category', (val) => val.toLowerCase()],
    ]);

    const filter = {};

    filterbleFields.forEach((transformFun, key) => {
      if (queryParams[key]) {
        filter[key] = transformFun(queryParams[key]);
      }
    });

    if (req.user.role.toLowerCase() != 'admin' && req.body.user)
      filter.user = req.user.id;

    const sortBy = queryParams.sortBy || 'createdAt';
    const order = queryParams.order === 'asc' ? 1 : -1;

    const tasks = await Task.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ [sortBy]: order });

    res.status(201).json({
      status: 'success',
      message: 'get Tasks successfully',
      data: tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}
