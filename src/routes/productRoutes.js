const express = require("express");
const { getProductDetails, createProduct } = require("../controllers/productController.js");


const { authMiddleware } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.get("/getproduct", authMiddleware, getProductDetails);
router.get("/getproducts", authMiddleware, getProductDetails);
router.post("/createproduct", authMiddleware, createProduct);
router.post("/editproduct", authMiddleware, getProductDetails);

module.exports = router;

