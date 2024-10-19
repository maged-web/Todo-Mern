const mongoose = require("mongoose");
const { getDuration, calculateTotalHours } = require("../helpers"); 

const taskSchema=new mongoose.Schema({
    employeeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Employee',
        required: true
    },
    description:
    {
        type: String,
        required: true
    },
    from:{
        type:Date,
        required: true
    },
    to:{
        type: Date,
        required: true,
        validate:{
            validator: function(value)
            {
               let duration =getDuration(this.from,value)
               return duration<=8
            },
            message: 'Task duration cannot exceed 8 hours',
        }
    },
    date: {
        type: Date,
        //required: true,
       // default: () => new Date(new Date().setHours(0, 0, 0, 0)),
      },
})

taskSchema.pre('save', async function (next) {
  
  if (!this.date) {
    this.date = new Date(this.from).setHours(0, 0, 0, 0);
}

    const Task = mongoose.model('Task');
    
    const tasksOnSameDay = await Task.find({
      employeeId: this.employeeId,
      date: this.date,
    });
    
    const totalDuration = calculateTotalHours(tasksOnSameDay);
    
    const newTaskDuration = getDuration(this.from, this.to);
    
    if (totalDuration + newTaskDuration > 8) {
      return next(new Error('Total task duration for the day cannot exceed 8 hours'));
    }
  
    next();
  });
  
  module.exports = {
    Task: mongoose.model('Task', taskSchema),
    /* getDuration */
};
