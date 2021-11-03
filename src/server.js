const http = require("http");

const cors = require("cors");
const express = require("express");

const fileUpload = require("express-fileupload");
const socketio = require("socket.io");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require('./routes/orderRoutes.js')
const app = express();
const dotenv = require("dotenv");


// const AWS = require("aws-sdk");
dotenv.config();

// AWS.config.update({
// 	accessKeyId: process.env.AWS_ACCESS_KEY,
// 	secretAccessKey: process.env.AWS_SECRET_KEY,
// 	region: process.env.AWS_REGION,
// });
const port = process.env.PORT || 5000;
// const s3 = new AWS.S3();
const server = http.createServer(app);
const io = socketio(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		transports: ["websocket", "polling"],
		credentials: true,
	},
	allowEIO3: true,
});

const run = () => {
	app.set("io", io);
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(
		fileUpload({
			limits: { fileSize: 50 * 1024 * 1024 },
		})
	);

	app.use(cors());
	app.get("/", function (req, res) {
		res.send("Hello hi I am repurpose server");
	});
	app.use("/api/user", userRoutes);
	app.use("/api/dashboard", dashboardRoutes);
	app.use("/api/product", productRoutes);
	app.use('/api/order', orderRoutes)
	app.use(notFound);
	app.use(errorHandler);


	server.listen(port, () => {
		console.log(`Example app listening at http://localhost:${port}`);
	});
};

module.exports = run;


