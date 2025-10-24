
// this is a the user service  model file. it's basically the blue print of the data to be stored

// the user should have an id , name , username , email, password.

// require mongoose
const mongoose = require("mongoose");

// unique id
const { v4: uuidv4 } = require("uuid");

// a blueprint to represent how mongodb should expect and represent the bug
const productSchema = new mongoose.Schema({
    id:{
        type: String,
        unique: true,
        required: true,
        default: uuidv4
    },

    name:{
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    inStock: {
        type: Boolean,
        required: true
    },

    createdAt:{
        type: Date,
        default: Date.now
    },

    updatedAt:{
        type: Date,
        default: Date.now
    }
});

// export module with the name of the file and name of the schema formed
module.exports = mongoose.model(/*filename*/ "productModel",  productSchema /*function*/);


