const { Task, getDuration } = require("../models/task.model");
const { calculateTotalHours } = require("../helpers");

const getDailySummary = async (req, res) => {
  try {
      const { employeeId, date } = req.params;

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999); 

      const tasks = await Task.find({
          employeeId: employeeId,
          date: { $gte: startOfDay, $lte: endOfDay } 
      });

      const totalHours = calculateTotalHours(tasks); 
      const remainingHours = 8 - totalHours;

      return res.status(200).send({
          startOfDay,
          endOfDay,
          date: date,
          totalHours,
          remainingHours,
          tasks,
      });
  } catch (error) {
      return res.status(500).send({ error: error.message });
  }
};

module.exports = {
    getDailySummary
};
