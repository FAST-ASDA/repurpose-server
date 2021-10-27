const express = require("express");

const {
	googleLogin, updateBaseLocation, getProfile,
} = require("../controllers/userController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/login", googleLogin);
router.post("/updatelocation",authMiddleware ,updateBaseLocation);
router.get("/profile",authMiddleware ,getProfile);

module.exports = router;
