//THIS IS THE ROUTE

//requiring necessary modules express
const express = require("express");

const router = express.Router();

//the functions created in the controller
const  { createProduct }  = require("../productController.js");
const  { bulkProducts }  = require("../productController.js");
const  { getProduct }  = require("../productController.js");

//making a creation of product route
router.post( "/product", createProduct);

//making a creation of bulk product route
router.post( "/products", bulkProducts);

//making a get product 
router.get( "/product/:id", getProduct);

module.exports  = router;