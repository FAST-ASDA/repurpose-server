const express = require("express");

const {
	getDashboard
} = require("../controllers/dashboardController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboard);


module.exports = router;

