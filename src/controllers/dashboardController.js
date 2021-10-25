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
				const query = `SELECT *, (6371 * acos(cos( radians(latitude) ) * cos( radians( ${lat1} ) ) * cos( radians( ${lng1} ) - radians(longitude) ) + sin( radians(latitude) ) * sin( radians( ${lat1} ) ) ) ) as distance from products ORDER BY distance ASC LIMIT 10`
				db.query(
					query,
					async (err, results) => {
						if (err) {
							console.log(err);
							res.status(500);
							next(new Error("Server Error"));
						} else {
							res.status(200).json({
								msg: "Location Recorded",
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
	postLocation
};
