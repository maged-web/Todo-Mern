const {Task}=require("../models/task.model")
const Employee=require("../models/employee.model");
const { getDuration, calculateTotalHours } = require("../helpers");

const addTask = async (req, res) => {
  try {
      const { employeeId, description, from, to } = req.body; 
      const employee = await Employee.findById(employeeId);
      if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
      }

      const newTask = new Task({
          employeeId,
          description,
          from,
          to,
      });

      
      const savedTask = await newTask.save();

    const { date, ...taskResponse } = savedTask.toObject();

    return res.status(201).json(taskResponse); 
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to add task" });
  }
};

const getTasks=async(req,res)=>
  {
      try{
        const tasks = await Task.find({}).select('-date');
        if (tasks.length === 0) {
          return res.status(404).send({ error: 'Tasks not found' });
        }
    
            return res.status(200).send(tasks);
          } catch (error) {
            return res.status(500).send({ error: error.message });
          }
      
  }
const getTask=async(req,res)=>
{
    try{
        const task = await Task.findById(req.params.taskId).select('-date');
        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
          }
          return res.status(200).send(task);
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
    
}
const getTasksByEmployee = async (req, res) => {
    try {
      const tasks = await Task.find({ employeeId: req.params.employeeId }).select('-date');
      return  res.status(200).send(tasks);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
};

const updateTask = async (req, res) => {
  try {
    const { from, to } = req.body;

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    if (from && to) {
      const newTaskDuration = getDuration(from, to);
      if (newTaskDuration > 8) {
        return res.status(400).send({ error: 'Task duration cannot exceed 8 hours' });
      }
      
      const tasksOnSameDay = await Task.find({
        employeeId: task.employeeId,
        date: task.date, 
        _id: { $ne: task._id }, 
      });

      const totalDuration = calculateTotalHours(tasksOnSameDay);
      
      if (totalDuration + newTaskDuration > 8) {
        return res.status(400).send({ error: 'Total task duration for the day cannot exceed 8 hours' });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, {...req.body,} , { new: true });
    console.log("Updated Task:", updatedTask); 
    const { date, ...taskResponse } = updatedTask.toObject();
    return res.status(200).send(taskResponse);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.taskId);
      if (!task) {
        return res.status(404).send({ error: 'Task not found' });
      }
      return res.status(200).send({ message: 'Task deleted successfully' });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };
  
  
module.exports={
    addTask,
    getTask,
    getTasks,
    getTasksByEmployee,
    updateTask,
    deleteTask
}