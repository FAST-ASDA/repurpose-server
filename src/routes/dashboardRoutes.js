const express = require("express");

const {
	getTrendingThrifts, postLocation
} = require("../controllers/dashboardController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.get("/trendingthrifts", authMiddleware, getTrendingThrifts);
router.post("/postlocation", authMiddleware, postLocation);


module.exports = router;

