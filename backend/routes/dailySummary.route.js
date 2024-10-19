const express = require("express");
const router = express.Router();
const DailySummaryController = require("../controllers/dailySummary.controller");

router.route('/:employeeId/:date')
    .get(DailySummaryController.getDailySummary)  



module.exports = router;
