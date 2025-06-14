# Task Management Project

A lightweight Node.js REST API for managing tasks — including creating, retrieving, updating, and deleting tasks. Built with Express and MongoDB (Mongoose).

## 🔧 Features

- CRUD operations on tasks:
  - Create new tasks
  - Find and Filter tasks by category, priority and/or status.
  - Delete tasks

- Input validation and error handling
- MongoDB data persistence
- Modular structure: routes, controllers, models

## 🚀 Quick Start

1. Clone the repo:

    ```bash
    git clone https://github.com/waseemazmy21/iti-project-task-managment.git
    cd iti-project-task-managment
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure environment:
    - Copy .env.example to .env
    - Set MONGO_URI to your MongoDB connection string
    - Optionally set PORT (default: 8000)

4. Run the server:

    ```bash
    npm run dev
    ```

The API will run at <http://localhost:8000>

## 📦 API Endpoints

Method Endpoint Description
GET /tasks List all tasks
POST /tasks Create a new task
GET /tasks/:id Get a task by ID
PATCH /tasks/:id Update task
DELETE /tasks/:id Delete a task

## 🧩 Project Structure

```bash
.
├── controllers/    # Request handlers
├── models/         # Mongoose schemas
├── routes/         # API routes setup
├── app.js          # Express app entry point
├── server.js       # Starts the server
└── .env.example    # Template env config
```

## 📝 License

MIT
