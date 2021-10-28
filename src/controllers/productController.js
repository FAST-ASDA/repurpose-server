/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
/* #eslint-disable import/extensions */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/* eslint-disable semi */

const axios = require("axios");
const asyncHandler = require("express-async-handler");
const db = require("../config/db.js");
const {uploadS3} = require("../utils/uploadaws.js")

const getProductDetails = asyncHandler(async (req, res, next) => {
	const { productId } = req.query;
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
		`SELECT COUNT(*) as hits FROM hits WHERE productId = ?`, [productId],
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
	let productImages;
    db.query(
		`SELECT pictureId,key,productId FROM pictures WHERE productId = ?`, [productId],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			}
            else{
                productImages=results;
            }
		}
	);
	db.query(
		`SELECT productId,name,isSold,gender,category,kids,dateOfPurchase,size,seller,brand,totalPrice,productDescription, seller, firstName, lastName FROM products INNER JOIN users on products.seller=users.userId WHERE productId=?`,
		[productId],
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
                        hits: productHits,
						productImages
                    },
					success: true,
				});
			}
		}
	);
});



const createProduct = asyncHandler(async (req, res, next) => {

	let pictures = req.files.pictures;

	const { } = req.body;

	let promises = [], picturesArray = [];



	// console.log(Object.getPrototypeOf(files))
	if (Array.isArray(pictures)) { }
	else {
		pictures = [pictures]
	}

	for (var i = 0; i < pictures.length; i++) {
		var picture = pictures[i];
		console.log(picture)
		promises.push(uploadS3(picture, picturesArray));
	}

	Promise.all(promises).then(function (data) {
		// do all logic inside this
		res.status(200).json({
			msg: "Product Images",
			data: {
				picturesArray
			},
			success: true,
		});
		
	})
    
});

module.exports = {

	getProductDetails,
	createProduct

};
