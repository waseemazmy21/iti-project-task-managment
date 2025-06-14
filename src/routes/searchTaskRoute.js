const express = require("express")
const { protect } = require("../middlewares/authMiddleware")
const searchTasks = require("../controllers/taskController")
const router = express.Router()

router.get('/',protect, searchTasks )

module.exports = router