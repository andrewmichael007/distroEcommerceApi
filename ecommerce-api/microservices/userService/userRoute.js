//THIS IS THE ROUTE

//requiring necessary modules express
const express = require("express");

const router = express.Router();

//the functions created in the controller
const { register , validator , login , getUser, updateUser, deleteUser } = require("./userController.js");


//then come and make a route for them over here
//register route
router.post( "/users/register", validator, register, );

//login route
router.post ( "/users/login", login );

//get user route
router.get ( "/users/:id", getUser );

//update user route
router.put ( "/users/:id", updateUser );

//delete user route
router.delete ( "/users/:id", deleteUser );

module.exports = router;


