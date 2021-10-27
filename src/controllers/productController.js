/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
/* #eslint-disable import/extensions */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/* eslint-disable semi */

const axios = require("axios");
const asyncHandler = require("express-async-handler");

const db = require("../config/db.js");


const getProductDetails = asyncHandler(async (req, res, next) => {
	const { productId } = req.params;
    const hit ={
        userId: req.user.userId,
        productId: productId
    }

    db.query(
		`INSERT INTO hits SET ?`,
		hit,
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			}
		}
	);
    let productHits;
    db.query(
		`SELECT COUNT(*) FROM hits WHERE productId = ?`, [productId],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			}
            else{
                productHits=results[0];
            }
		}
	);
	
	db.query(
		`SELECT * FROM products INNER JOIN users on products.seller=users.userId WHERE productId=?`,
		completed,
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			} else {
                const product = results[0];
				res.status(200).json({
					msg: "Product Info",
                    data: {
                        product,
                        hits: productHits
                    },
					success: true,
				});
			}
		}
	);
});





module.exports = {

	getProductDetails,

};
