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

export async function searchTasks(req, res, next) {
  try {
    const queryParams = req.query;

    const limit = +queryParams.limit || 10;
    const page = +queryParams.page || 1;
    const skip = (page - 1) * limit;

    const filterbleFields = new Map([
      [
        'priority',
        (val) =>
          val
            .trim()
            .split(' ')
            .map((v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase())
            .join(' '),
      ],
      [
        'status',
        (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
      ],
      ['category', (val) => val.trim()],
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
