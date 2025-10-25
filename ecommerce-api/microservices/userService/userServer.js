//THIS IS THE SERVER

//require statements
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require( "./Routes/userRoute" );

//loading the environment variables
require("dotenv").config();

//builds a mini server call app
const app = express();

//understands json format of data - middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

//server mounting at "/" +  route path = final url "/register"

// create user server mount
app.use( '/', userRoute);

//mongodb connection
mongoose.connect(process.env.USER_SERVICE_MONGO_URI, {
    // deprecated in mongoose 6.x
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
})
.then(() =>
    console.log("*************************************"),
    console.log("Mongodb connected to user the user service database")
)
.catch(err =>
    console.error(err)
);

// taking the port number from the .env file and store in port
const port = process.env.USER_SERVICE_PORT;

//listening for incoming requests
app.listen(port, () => {
    console.log("*************************************")
    console.log(`server is running on port ${port}!🚀`)
    console.log("*************************************")
});

