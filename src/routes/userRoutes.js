const express = require("express");

const {
	googleLogin, updateBaseLocation, getProfile, getSellerProfile, addSellerPictures, updateAddress
} = require("../controllers/userController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/login", googleLogin);
router.post("/updatelocation", authMiddleware, updateBaseLocation);
router.post("/addsellerpictures", authMiddleware, addSellerPictures);
router.get("/profile", authMiddleware, getProfile);
router.get("/sellerprofile", authMiddleware, getSellerProfile);
router.post("/updateaddress", authMiddleware, updateAddress)

module.exports = router;
