/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
/* #eslint-disable import/extensions */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/* eslint-disable semi */

const axios = require("axios");
const asyncHandler = require("express-async-handler");

const db = require("../config/db.js");


const postLocation = asyncHandler(async (req, res, next) => {
	const { latitude, longitude } = req.body;
	const completed = {
		userId: req.user.userId,
		latitude: latitude,
		longitude: longitude
	};
	db.query(
		`INSERT INTO locations SET ?`,
		completed,
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			} else {
				res.status(200).json({
					msg: "Location Recorded",
					success: true,
				});
			}
		}
	);
});
const getTrendingThrifts = asyncHandler(async (req, res, next) => {
	
	db.query(
		`SELECT longitude, latitude FROM locations WHERE userId=? ORDER BY timestamp DESC LIMIT 1`,
		req.user.userId,
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			} else {
				const userLocation = results[0];
				const lat1 = userLocation.latitude;
				const lng1 = userLocation.longitude
		
				const query = `SELECT *, (6371 * acos(cos( radians(baseLatitude) ) * cos( radians( ${lat1} ) ) * cos( radians( ${lng1} ) - radians(baseLongitude) ) + sin( radians(baseLatitude) ) * sin( radians( ${lat1} ) ) ) ) as distance from products INNER JOIN users ON products.sellerId=users.userId ORDER BY distance ASC LIMIT 10`
				db.query(
					query,
					async (err, results) => {
						if (err) {
							console.log(err);
							res.status(500);
							next(new Error("Server Error"));
						} else {
							res.status(200).json({
								msg: "Nearby Trending Thrifts",
								data: results,
								success: true,
							});
						}
					}
				);
			}
		}
	);
});


const getTrendingSellers = asyncHandler(async (req, res, next) => {
	
	db.query(
		`SELECT longitude, latitude FROM locations WHERE userId=? ORDER BY timestamp DESC LIMIT 1`,
		req.user.userId,
		async (err, results) => {
			if (err) {
				console.log(err);
				res.status(500);
				next(new Error("Server Error"));
			} else {
				const userLocation = results[0];
				const lat1 = userLocation.latitude;
				const lng1 = userLocation.longitude
		
				const query = `SELECT *, (6371 * acos(cos( radians(baseLatitude) ) * cos( radians( ${lat1} ) ) * cos( radians( ${lng1} ) - radians(baseLongitude) ) + sin( radians(baseLatitude) ) * sin( radians( ${lat1} ) ) ) ) as distance from users WHERE isSeller=1 AND userId <> ${req.user.userId} ORDER BY distance ASC LIMIT 10`
				db.query(
					query,
					async (err, results) => {
						if (err) {
							console.log(err);
							res.status(500);
							next(new Error("Server Error"));
						} else {
							res.status(200).json({
								msg: "Nearby Trending Sellers",
								data: results,
								success: true,
							});
						}
					}
				);
			}
		}
	);
});


module.exports = {
	getTrendingThrifts,
	postLocation,
	getTrendingSellers
};
