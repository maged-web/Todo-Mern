const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasks.controller");

router.route('/')
    .post(tasksController.addTask)
    .get(tasksController.getTasks)

router.route('/:taskId')
    .get(tasksController.getTask)    
    .put(tasksController.updateTask) 
    .delete(tasksController.deleteTask); 

router.route('/employee/:employeeId')
    .get(tasksController.getTasksByEmployee); 

module.exports = router;
