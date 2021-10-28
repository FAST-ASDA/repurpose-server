const express = require("express");

const {
	googleLogin, updateBaseLocation, getProfile, getSellerProfile, addSellerPictures,
} = require("../controllers/userController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/login", googleLogin);
router.post("/updatelocation",authMiddleware ,updateBaseLocation);
router.post("/addsellerpictures",authMiddleware ,addSellerPictures);
router.get("/profile",authMiddleware ,getProfile);
router.get("/sellerprofile",authMiddleware ,getSellerProfile);

module.exports = router;
