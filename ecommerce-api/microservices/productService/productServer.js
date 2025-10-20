
// connection of mongo db and redis
//require statements
const express = require("express");
const mongoose = require("mongoose");
const { createClient } = require("redis");
// const createBugsRoute = require( "./Routes/createBugsRoute" );
const  productRoute = require("./Routes/productRoute");

require("dotenv").config();

// import dotenv from "dotenv";

//builds a mini server call app
const app = express();

//understands json format of data
app.use(express.json());

//mongodb connection
mongoose.connect(process.env.PRODUCT_SERVICE_MONGO_URI, {
    // deprecated in mongoose 6.x
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
})
.then(() =>
    console.log("mongodb connected to user product serviceDb😎")
)
.catch(err =>
    console.error(err)
);

// taking the port number from the .env file and store in port
const port = process.env.PRODUCT_SERVICE_PORT;

// redis connection
const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (err) =>
    console.log("Redis Client Error", err)
);

redisClient.connect();

redisClient.on("connect", () => 
    console.log("Connected to Redis")
);

//attaching redis as middleware for route use
app.use((req, res, next) => {
  req.redis = redisClient; // attach redis to req for route use
  next();
});

//server mounting at "/" +  route path = final url "/bug"

// create product server mount
app.use( '/', productRoute);

//listening for incoming requests
app.listen(port, () => {
    console.log(`server is running on port ${port}!🚀 for the product service`)
});