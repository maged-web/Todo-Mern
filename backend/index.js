require("dotenv").config()

const express = require("express");
const cors = require("cors")

const app =express();

const mongoose=require("mongoose")

const url=process.env.MONGO_URL

mongoose.connect(url).then(()=>
{
    console.log("Connected To Database Successfully")

})

app.use(cors())

app.use(express.json())

const tasksRoutes = require("./routes/tasks.routes")
const dailySummaryRoutes = require("./routes/dailySummary.route")
const employeeRoutes = require('./routes/employee.route');




app.use("/tasks", tasksRoutes)
app.use("/daily-summary", dailySummaryRoutes)
app.use('/employees', employeeRoutes);



app.all('*', (req, res) => {
    return res.status(404).json({Message: 'This Resource Is Not Avaliable'})
})

app.listen(process.env.PORT,()=>
{
    console.log("Connected To Port Successfully")
})