const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const db = require("../config/db.js");
dotenv.config();

const authMiddleware = asyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer ")
	) {
		token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		db.query(
			"SELECT * FROM users WHERE userId = ?",
			[decoded.userId],
			(err, results) => {
				if (err) {
					res.status(401);
					next(new Error("Not authorized, token failed"));
				}
				if (results?.length > 0) {
					req.user = results[0];
					next();
				} else {
					next(new Error("Invalid Token"));
				}
			}
		);
	}
	if (!token) {
		res.status(401);
		next(new Error("Not authorized, token failed"));
	}
});

module.exports = {
	authMiddleware,
};
