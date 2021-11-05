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
		`SELECT productId,title,isSold,gender,category,kids,dateOfPurchase,size,sellerId,brand,totalPrice,description, firstName, lastName FROM products INNER JOIN users on products.sellerId=users.userId WHERE productId=?`,
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

	const {title,brand, description, gender,category, isKids, dop, size, basePrice} = req.body;

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
		
		// make the product

		const product ={
			title: title,
			brand: brand,
			notThrift : 0,
			description: description,
			gender: gender,
			category: category,
			kids: isKids,
			dateOfPurchase: dop,
			size: size,
			sellerId: req.user.userId,
			basePrice: basePrice
		}
		let newProductId;
		db.query(
			`INSERT INTO products SET ?`,
			product,
			async (err, results) => {
				if (err) {
					console.log(err);
					res.status(500);
					next(new Error("Server Error"));
				}
				else{
					newProductId = results.insertId
				}
			}
		);

		// insert images at last
		let images = [];
		console.log(picturesArray)
		for (let i = 0; i < picturesArray.length; i++) {
			console.log('picturenm', picturesArray[i]);
			images.push([picturesArray[i], req.user.userId, req.user.userId], newProductId)
		}
		// do all logic inside this
		db.query(
			`INSERT INTO pictures (key, sellerId, userId, productId) VALUES ?`,
			[images],
			async (err, results) => {
				if (err) {
					console.log(err);
					res.status(500);
					next(new Error("Server Error"));
				} else {

					res.status(200).json({
						msg: "Product Images",
						data: {
							picturesArray
						},
						success: true,
					});
				}
			}
		);




		
	})
    
});

module.exports = {

	getProductDetails,
	createProduct

};
