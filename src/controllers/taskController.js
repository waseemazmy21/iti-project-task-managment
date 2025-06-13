// creat task function 
export async function createTask(req, res) {
    try {
        const { title, description, category, status, dueDate, priority } = req.body;

        const userId = req.user.id;
        let categoryDoc = null;

        if (category) {
            categoryDoc = await Category.findOne({ name: category, user: userId });
            if (!categoryDoc) {
                categoryDoc = await Category.create({ name: category, user: userId });
            }
        }

        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            status,
            user: userId,
            category: categoryDoc?._id || null,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error: error.message });
    }
}


// get task function 
export async function getTask(req, res) {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// update task function 
export async function updateTask(req, res) {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// delete task function 
export async function deleteTask(req, res) {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}