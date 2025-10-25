//THIS IS THE ROUTE

//requiring necessary modules express
const express = require("express");

const router = express.Router();

//the functions created in the controller
const { register , validator , login , getUser, updateUser, deleteUser } = require("../userController.js");

//then come and make a route for them over here
//register route
router.post( "/v1/users/register", validator, register, );

//login route
router.post ( "/v1/users/login", login );

//get user route
router.get ( "/v1/users/getUser/:id", getUser );

//update user route
router.put ( "/v1/users/updateUser/:id", updateUser );

//delete user route
router.delete ( "/v1/users/deleteUser/:id", deleteUser );

module.exports = router;

