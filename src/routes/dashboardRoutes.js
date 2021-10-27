const express = require("express");

const {
	getTrendingThrifts, postLocation, getTrendingSellers
} = require("../controllers/dashboardController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.post("/postlocation", authMiddleware, postLocation);
router.get("/trendingthrifts", authMiddleware, getTrendingThrifts);
router.get("/trendingsellers", authMiddleware, getTrendingSellers);


module.exports = router;

