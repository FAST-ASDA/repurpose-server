const axios = require("axios");
const asyncHandler = require("express-async-handler");
const db = require("../config/db.js");
const { uploadS3 } = require("../utils/uploadaws.js");
const { dummyOrders } = require("../helper/dummyOrders.js");

const insertDummyOrders = asyncHandler(async (req, res, next) => {
  let values = dummyOrders(1000);
  console.log(values);
  db.query(
    "INSERT INTO orders (products, userId,sellerId, status,deliveryCharge,basePrice,ifPaid) VALUES ?",
    [values],
    async (err, results) => {
      if (err) {
        console.log(err);
        res.status(500);
        next(new Error("SERVER ERROR"));
      } else {
        res.status(200).json({
          msg: "Orders created",
          success: true,
        });
      }
    }
  );
});

const getAllOrderDetails = asyncHandler(async (req, res, next) => {
  db.query(`SELECT * FROM orders`, async (err, results) => {
    if (err) {
      console.log(err);
      res.status(500);
      next(new Error("SERVER ERROR"));
    } else {
      res.status(200).json({
        msg: "Order Details",
        data: {
          Orders: results,
        },
        success: true,
      });
    }
  });
});

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
async function getBasePrice(products) {
  let productDetails = [];
  // console.log(products)
  const promises = products.map((product) =>
    fetchProductDetails(product, productDetails)
  );
  await Promise.all(promises);
  return productDetails;
}

const fetchProductDetails = (product, productDetails) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * from products WHERE productId=?`,
      [product],
      async (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(productDetails.push(results[0]));
        }
      }
    );
  });
};
const makeOrder = asyncHandler(async (req, res, next) => {
  const { products, sellerId, basePrice } = req.body;

  let originalPrice = 0;

  const productDetails = await getBasePrice(products);

  for (let product of productDetails) {
    console.log(product.basePrice);
    if (product === null) {
      originalPrice = basePrice;
      break;
    } else {
      originalPrice += product.basePrice;
    }
  }
  if (typeof originalPrice !== "number") {
    originalPrice = basePrice;
  }
  const commission = parseFloat(originalPrice) * 0.02;
  const deliveryCharge = 10;
  db.query(
    `INSERT INTO orders (products, userId,sellerId,deliveryCharge,basePrice,commission) VALUES (?)`,
    [
      [
        JSON.stringify(products),
        req.user.userId,
        sellerId,
        deliveryCharge,
        originalPrice,
        commission,
      ],
    ],
    async (err, results) => {
      if (err) {
        console.log(err);
        res.status(500);
        next(new Error("SERVER ERROR"));
      } else {
        res.status(200).json({
          msg: "Order Created",
          data: {
            orderId: results.insertId,
          },
          success: true,
        });
      }
    }
  );
});
const updatePaymentDetails = asyncHandler(async (req, res, next) => {
  const { orderId, metadata } = req.body;
  db.query(`UPDATE orders SET ifPaid=1`, async (err, results) => {
    if (err) {
      console.log(err);
      res.status(500);
      next(new Error("SERVER ERROR"));
    }
  });
  db.query(
    `INSERT INTO transactions (orderId,metadata) VALUES (?)`,
    [[orderId, JSON.stringify(metadata)]],
    async (err, results) => {
      if (err) {
        console.log(err);
        res.status(500);
        next(new Error("SERVER ERROR"));
      } else {
        res.status(200).json({
          msg: "Transaction Successful",
          data: {
            transactionId: results.insertId,
          },
          success: true,
        });
      }
    }
  );
});
const getOrderDetails = asyncHandler(async (req, res, next) => {
  const { orderId } = req.query;
  db.query(
    `SELECT * FROM orders WHERE orderId=?`,
    orderId,
    async (err, results) => {
      if (err) {
        console.log(err);
        res.status(500);
        next(new Error("SERVER ERROR"));
      } else {
        res.status(200).json({
          msg: "Order Details",
          data: {
            Order: results[0],
          },
          success: true,
        });
      }
    }
  );
});

module.exports = {
  getAllOrderDetails,
  insertDummyOrders,
  makeOrder,
  getOrderDetails,
  updatePaymentDetails,
};
