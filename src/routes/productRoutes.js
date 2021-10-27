const express = require("express");
const { getProductDetails } = require("../controllers/productController.js");


const { authMiddleware } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.get("/getproduct", authMiddleware, getProductDetails);
router.get("/getproducts", authMiddleware, getProductDetails);
router.post("/makeproduct", authMiddleware, getProductDetails);
router.post("/editproduct", authMiddleware, getProductDetails);

module.exports = router;

