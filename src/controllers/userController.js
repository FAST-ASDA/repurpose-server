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

module.exports = {
	login,
	register,
	googleLogin,
};
