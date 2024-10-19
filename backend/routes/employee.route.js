const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");

router.route('/')
    .post(employeeController.addEmployee)
    .get(employeeController.getAllEmployees)
router.route('/:employeeId')
    .get(employeeController.getEmployeeWithTasks);

module.exports = router;
