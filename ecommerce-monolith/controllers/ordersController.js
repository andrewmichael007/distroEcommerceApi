
//THIS IS THE CONTROLLING LOGIC FOR THE ORDER ROUTE


//creating an array of empty orders
let allOrders = [];

const placeOrder = (req, res) => {

  //we defining the request body
  const { userId, productId, quantity } = req.body;

  //checking if fields are all filled
  if (!userId || !productId || !quantity) {
    res.status(400).json({ message: "Fill in order details" });
  } else {

    //we create the order
    const order = {
      id: Date.now(),
      userId,
      productId,
      quantity,
      status: "placed",
      createdAt: new Date(),
    };
  }

  //adding the created order to the empty array of orders created above
  allOrders.push(order);

  //tell the user order is placed
  res.status(201).json({ message: "Order placed", order });

};


//getting of orders
const getOrders = (req, res) => {
  res.json({ orders: mockers });
};

