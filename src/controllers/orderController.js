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

const makeOrder = asyncHandler(async (req, res, next) => {
    const { products, userId, sellerId, status, deliveryCharge, ifPaid, basePrice } = req.body;
    let originalBasePrice = 0;

    for (let index in products) {
        db.query(`SELECT basePrice FROM products WHERE productId=?`, [products[index].productId],
            async (err, results) => {

                if (err) {
                    console.log(err)
                    originalBasePrice = basePrice
                }
                else {
                    // console.log(typeof (results[0].basePrice))
                    originalBasePrice += (results[0].basePrice)

                }
            }
        )
    }


    db.query(`INSERT INTO orders (products, userId,sellerId, status,deliveryCharge,basePrice,ifPaid) VALUES (?)`,
        [[JSON.stringify(products), userId, sellerId, status, deliveryCharge, originalBasePrice, ifPaid]],
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
    getOrderDetails
}