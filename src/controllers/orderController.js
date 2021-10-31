const axios = require("axios");
const asyncHandler = require("express-async-handler");
const db = require("../config/db.js");
const { uploadS3 } = require("../utils/uploadaws.js")
const { dummyOrders } = require('../helper/dummyOrders.js')

const insertDummyOrders = asyncHandler(async (req, res, next) => {
    let values = dummyOrders(1000)
    console.log(values)
    db.query("INSERT INTO orders (products, userId,sellerId, status,deliveryCharge,basePrice,ifPaid) VALUES ?", [values], async (err, results) => {
        if (err) {
            console.log(err)
            res.status(500)
            next(new Error("SERVER ERROR"))
        }
        else {
            res.send(results)
        }
    })

})


const getAllOrderDetails = asyncHandler(async (req, res, next) => {
    db.query(`SELECT * FROM orders`, async (err, results) => {
        if (err) {
            console.log(err)
            res.status(500)
            next(new Error("SERVER ERROR"))
        }
        else {
            res.send(results)
        }
    })
})

// async function getPriceFromProduct(productId) {

//     db.query(`SELECT basePrice FROM products WHERE productId=?`, [productId],
//         async (err, results) => {

//             if (err) {
//                 // console.log(err)
//                 return -1;
//             }
//             else {
//                 // console.log(results);
//                 return results[0].basePrice;

//             }
//         }
//     )
// }
// async function getBasePrice(products) {
//     let originalBasePrice = 0;

//     for (let index in products) {
//         let temp = await getPriceFromProduct(products[index].productId)
//         if (temp == -1) {
//             return -1;
//         }
//         else {
//             originalBasePrice = originalBasePrice + (temp);

//         }
//     }
//     console.log(`orignal base price first ${originalBasePrice}`);
//     return originalBasePrice
// }

const makeOrder = asyncHandler(async (req, res, next) => {
    const { products, userId, sellerId, status, deliveryCharge, basePrice } = req.body;
    db.query(`INSERT INTO orders (products, userId,sellerId, status,deliveryCharge,basePrice) VALUES (?)`,
        [[JSON.stringify(products), userId, sellerId, status, deliveryCharge, basePrice]],
        async (err, results) => {
            if (err) {
                console.log(err)
                res.status(500)
                next(new Error("SERVER ERROR"))
            }
            else {
                res.send(results)
            }
        }
    )
})
const updatePaymentDetails = asyncHandler(async (req, res, next) => {
    const { orderId, metadata } = req.body;
    db.query(`UPDATE orders SET ifPaid=1`,
        async (err, results) => {
            if (err) {
                console.log(err)
                res.status(500)
                next(new Error("SERVER ERROR"))
            }
            else {
                console.log(results)
            }
        }
    )
    db.query(`INSERT INTO transactions (orderId,metadata) VALUES (?)`, [[orderId, JSON.stringify(metadata)]],
        async (err, results) => {
            if (err) {
                console.log(err)
                res.status(500)
                next(new Error("SERVER ERROR"))
            }
            else {
                res.send(results)
            }
        }
    )
})
const getOrderDetails = asyncHandler(async (req, res, next) => {
    const { orderId } = req.query;
    db.query(`SELECT * FROM orders WHERE orderId=?`, orderId, async (err, results) => {
        if (err) {
            console.log(err)
            res.status(500)
            next(new Error("SERVER ERROR"))
        }
        else {
            res.send(results)
        }
    })
})

module.exports = {
    getAllOrderDetails,
    insertDummyOrders,
    makeOrder,
    getOrderDetails,
    updatePaymentDetails
}