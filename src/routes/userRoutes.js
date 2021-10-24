const express = require("express");

const {
	login,
	register,
	googleLogin,
} = require("../controllers/userController.js");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/googlelogin", googleLogin);

module.exports = router;
