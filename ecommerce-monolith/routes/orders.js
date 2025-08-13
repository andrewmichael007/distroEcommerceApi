const express = require("express");

const router = express.Router();

// we put whatever we want to do (functions) in the controller here.
// for the mean time, we want to just get orders and make orders
// ... so we put get orders and make orders in the bracket
// .... and require the logic from the orders controller
const { placeOrder } = require("../controllers/ordersController");

//then come and make a route for them over here
router.post('/order', placeOrder );

// router.post('/', getOrders);


module.exports = router;











