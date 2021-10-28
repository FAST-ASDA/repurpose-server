/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
/* eslint-disable import/extensions */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/* eslint-disable semi */
const argon2 = require("argon2");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const db = require("../config/db.js");
const { uploadS3 } = require("../utils/uploadaws.js");

dotenv.config();

const login = asyncHandler(async (req, res, next) => {
	var { email, password } = req.body;
	console.log(req.body);

	db.query(
		"SELECT * FROM users WHERE userEmail = ?",
		[email],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			}
			if (results.length > 0) {
				const user = results[0];
				if (await argon2.verify(user.userPassword, password)) {
					// password match
					const token = jwt.sign(
						{
							email: user.userEmail,
							userId: user.userId.toString(),
						},
						process.env.JWT_SECRET,
						{ expiresIn: "30d" }
					);
					res.status(200).json({
						msg: "successfully logged in.",
						success: true,
						data: { token: token, userId: user.userId.toString() },
					});
				} else {
					// password did not match
					res.status(403).json({
						msg: "Incorrect Password",
						success: false,
					});
				}
			} else {
				res.status(403).json({
					msg: `Register first!`,
					success: false,
				});
			}
		}
	);
});

const register = asyncHandler(async (req, res, next) => {
	var { email, password, confirmPassword, firstName, lastName } = req.body;

	console.log(req.body);
	db.query(
		"SELECT * FROM users WHERE userEmail = ?",
		[email],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			}
			if (results.length > 0) {
				res.status(200).json({
					msg: "user exists",
					success: false,
				});
			} else if (password !== confirmPassword) {
				res.status(200).json({
					msg: "Passwords don't match",
					success: false,
				});
			} else {
				let hashedPass = await argon2.hash(password, 8);
				const newUser = {
					userEmail: email,
					userPassword: hashedPass,
					userFirstName: firstName,
					userLastName: lastName,
				};
				db.query("INSERT INTO users SET ?", newUser, (err, results) => {
					if (err) {
						console.log(err);
						res.status(500);
						next(new Error("Server Error"));
					} else {
						const token = jwt.sign(
							{
								email: email,
								userId: results.insertId,
							},
							process.env.JWT_SECRET,
							{ expiresIn: "30d" }
						);
						res.status(201).json({
							msg: "user registered",
							success: true,
							data: { token: token, userId: results.insertId },
						});
					}
				});
			}
		}
	);
});

const googleLogin = asyncHandler(async (req, res, next) => {
	var { email, firstName, lastName, googleId } = req.body;

	console.log(req.body);
	db.query(
		"SELECT * FROM users WHERE email = ?",
		[email],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			} else if (results.length > 0) {
				// update the user with the google login
				const user = results[0];
				if (user.googleId) {
					if (user.googleId === googleId) {
						const token = jwt.sign(
							{
								email: email,
								userId: user.userId,
							},
							process.env.JWT_SECRET,
							{ expiresIn: "30d" }
						);
						res.status(200).json({
							msg: "successfully logged in.",
							success: true,
							data: { token: token, userId: user.userId },
						});
					} else {
						res.status(403).json({
							msg: "Incorrect google account",
							success: false,
						});
					}
				} else {
					db.query(
						"UPDATE users SET googleId= ? WHERE userId=?",
						[googleId, user.userId],
						async (err, results) => {
							if (err) {
								console.log(err);
								res.status(500);
								next(new Error("Server Error"));
							} else {
								const token = jwt.sign(
									{
										email: email,
										userId: user.userId,
									},
									process.env.JWT_SECRET,
									{ expiresIn: "30d" }
								);
								res.status(200).json({
									msg: "successfully logged in.",
									success: true,
									data: { token: token, userId: user.userId },
								});
							}
						}
					);
				}
			} else {
				const newUser = {
					email: email,
					firstName: firstName,
					lastName: lastName,
					googleID: googleId,
				};
				db.query("INSERT INTO users SET ?", newUser, (err, results) => {
					if (err) {
						console.log(err);
						res.status(500);
						next(new Error("Server Error"));
					} else {
						const token = jwt.sign(
							{
								email: email,
								userId: results.insertId,
							},
							process.env.JWT_SECRET,
							{ expiresIn: "30d" }
						);
						res.status(201).json({
							msg: "user registered",
							success: true,
							data: { token: token, userId: results.insertId },
						});
					}
				});
			}
		}
	);
});

const updateBaseLocation = asyncHandler(async (req, res, next) => {
	const { latitude, longitude } = req.body;
	
	db.query(
		`UPDATE users SET baseLatitude = ?, baseLongitude = ? WHERE userId=?;`,
		[latitude,longitude,req.user.userId],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			} else {
				res.status(200).json({
					msg: "Base Location Updated",
					success: true,
				});
			}
		}
	);
});

const updateProfile = asyncHandler(async (req, res, next) => {
	const { latitude, longitude } = req.body;
	
	db.query(
		`UPDATE users SET baseLatitude = ?, baseLongitude = ? WHERE userId=?;`,
		[latitude,longitude,req.user.userId],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			} else {
				res.status(200).json({
					msg: "Base Location Updated",
					success: true,
				});
			}
		}
	);
});
const getProfile = asyncHandler(async (req, res, next) => {
	
	let userInfo;
	db.query(
		`SELECT * FROM users WHERE userId=?`,
		[req.user.userId],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			} else {
				userInfo=results[0];
			}
		}
	);

	let sellerProducts;
	db.query(
		`SELECT * FROM products WHERE seller=?`,
		[req.user.userId],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			} else {
				sellerProducts=results;
			}
		}
	);

	let sellerOrders;
	db.query(
		`SELECT * FROM orders WHERE sellerId=?`,
		[req.user.userId],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			} else {
				sellerOrders=results;
			}
		}
	);

	let myOrders;
	db.query(
		`SELECT * FROM orders WHERE userId=?`,
		[req.user.userId],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			} else {
				myOrders=results;
				res.status(200).json({
					msg: "User Profile Info",
					data:{
						userInfo,
						sellerProducts,
						sellerOrders,
						myOrders
					},
					success: true,
				});
			}
		}
	);
});
const getSellerProfile = asyncHandler(async (req, res, next) => {
	const { sellerId } = req.query;

    const hit ={
        userId: req.user.userId,
        sellerId: sellerId
    }

	// insert the hit into the database
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
	// fetch sellerhits
	let sellerHits;
    db.query(
		`SELECT COUNT(*) as hits FROM hits WHERE sellerId = ?`, [sellerId],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			}
            else{
                sellerHits=results[0];
            }
		}
	);
	

	// fetch seller info
	let sellerInfo;
	db.query(
		`SELECT firstName, lastName, email, city,state, country FROM users WHERE userId=? and isSeller=1`,
		[sellerId],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			} else {
				sellerInfo=results[0];
			}
		}
	);

	let sellerProducts;
	db.query(
		`SELECT * FROM products WHERE seller=?`,
		[sellerId],
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			} else {
				sellerProducts=results;
				res.status(200).json({
					msg: "Seller profile Info",
					data:{
						sellerHits,
						sellerInfo,
						sellerProducts
					},
					success: true,
				});
			}
		}
	);

});


const addSellerPictures = asyncHandler(async (req, res, next) => {

    let pictures = req.files.pictures;

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

		let images = [];
		console.log(picturesArray)
		for (let i = 0; i < picturesArray.length; i++) {
			console.log('picturenm', picturesArray[i]);
			images.push([picturesArray[i], req.user.userId, req.user.userId ])
		}
		// do all logic inside this
		db.query(
			`INSERT INTO pictures (key, sellerId, userId) VALUES ?`,
			[images],
			async (err, results) => {
				if (err) {
					console.log(err);
					res.status(500);
					next(new Error("Server Error"));
				} else {
				
					res.status(200).json({
						msg: "Seller Images",
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
	login,
	register,
	googleLogin,
	updateBaseLocation,
	getProfile,
	getSellerProfile,
	addSellerPictures
};
