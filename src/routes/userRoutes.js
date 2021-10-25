const express = require("express");

const {
	googleLogin,
} = require("../controllers/userController.js");

const router = express.Router();

router.post("/login", googleLogin);

module.exports = router;
