const express = require('express')

const { makeOrder, getAllOrderDetails, insertDummyOrders, getOrderDetails, updatePaymentDetails } = require('../controllers/orderController.js')
const { authMiddleware } = require('../middleware/authMiddleware.js')
const router = express.Router();


router.get('/getallorders', authMiddleware, getAllOrderDetails)
router.get('/insertdummydata', authMiddleware, insertDummyOrders)
router.post('/makeorder', authMiddleware, makeOrder);
router.get('/getorder', authMiddleware, getOrderDetails)
router.post('/payment', authMiddleware, updatePaymentDetails)
module.exports = router
// router.get("/getproduct",authMiddleware,getOrderDetails)
//


