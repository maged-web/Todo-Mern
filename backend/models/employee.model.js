const mongoose = require("mongoose");


const employeeSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
    /*   tasks: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task' 
        }
    ], */
})

module.exports= mongoose.model('Employee', employeeSchema);
