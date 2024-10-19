const Employee = require('../models/employee.model');
const {Task} = require('../models/task.model'); 

const addEmployee = async (req, res) => {
    try {
        const { name } = req.body; 
        
        const newEmployee = new Employee({ name });

        const savedEmployee = await newEmployee.save();

        return res.status(201).json(savedEmployee); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to add employee" });
    }
};

const getEmployeeWithTasks = async (req, res) => {
    try {
        const { employeeId } = req.params; 

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }


        const tasks = await Task.find({ employeeId }).select('-date'); 

   
        const response = {
            id: employee._id,
            name: employee.name, 
            tasks: tasks 
        };

        return res.status(200).json(response); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to retrieve employee" });
    }
};

const getAllEmployeesWithTasks = async (req, res) => {
    try {
        const employees = await Employee.find();

        const response = await Promise.all(employees.map(async (employee) => {
            const tasks = await Task.find({ employeeId: employee._id }).select('-date');
            return {
                id: employee._id,
                name: employee.name,
                tasks: tasks
            };
        }));

        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to retrieve employees" });
    }
};


const getAllEmployees = async (req, res) => {
    try{
        const employees = await Employee.find({})
        if (employees.length === 0) {
          return res.status(404).send({ error: 'Employees not found' });
        }
    
            return res.status(200).send(employees);
          } catch (error) {
            return res.status(500).send({ error: error.message });
          }
};
module.exports = {
    addEmployee,
    getEmployeeWithTasks,
    getAllEmployeesWithTasks,
    getAllEmployees
};
