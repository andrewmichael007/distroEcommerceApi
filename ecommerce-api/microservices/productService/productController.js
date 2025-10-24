// import express from "express";
const Product = require("./Model/productModel.js");

//requiring the unique identifier
const { v4: uuidv4 } = require("uuid");

//creating products
const createProduct = async ( req, res ) => {

    //defining the request body
    const { name, description, price, inStock } = req.body;

    try {
        //creating new product
        const product = new Product ({
            id : uuidv4(),
            name,
            description,
            price,
            inStock
        });

        await product.save();

        await req.redis.del("products"); //invalidate cache

        //return response
        res.status(201).json({
            success: true,
            message: "new product created",
            data: product
        });

    } catch ( error ) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

//creation of bulk products
const bulkProducts = async ( req, res ) => {
    
    //defining the request body
    const productsArray = req.body;

    try {
        //check if products is indeed an array or bulk(plenty)
        // if no ...
        if ( !Array.isArray(productsArray) ) {
            return res.status(400).json({
                success: false,
                message: "expecting array of products"
            });
        }

        //if yes, check whether it's empty , like if products are actually in (creation should be  2 or more)
        if ( productsArray.length < 2 ){
            return res.status(400).json({
                success: false,
                message: "creation of bulk products should be 2 or more "
            });
        }

        //if all two check pass... iterate through array and store in data

        createdProducts = [];

        for ( let each = 0; each < productsArray.length; each ++ ){
            
            const productData = productsArray[each];

            //validation check of each of the data
            if( !productData.name || !productData.description || !productData.price || !productData.inStock) {
                return res.status(400).json({
                    success: false,
                    message: "fill all products details"
                });
            }

            //if check is correct, save
            const savedProducts = await Product.insertMany(productsArray);
            
            //number of created products
            const numberOfCreatedProducts = savedProducts.length;

            //log number of created products
            console.log(`Number of created products is: ${numberOfCreatedProducts} `);

            //add saved products to created products array
            createdProducts.push(savedProducts);

            //loggin out createdProducts
            console.log(createdProducts);

            //invalidate cache
            await req.redis.del("products");

            //return response
            return res.status(201).json({
                success: true,
                message: `${numberOfCreatedProducts} new products created successfully`,
                data : createdProducts

            });
        };

    } catch (error){
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: error.message
        });
    };
};

// retrieving  product
const getProduct = async ( req, res ) => {

    //using the id to get request
    const { id } = req.params;

    try{
        //finding the cached product by id
        const cachedProduct = await req.redis.get(id);

        //check if cached product is available
        if ( cachedProduct ) {

            //log something to console.
            console.log("cache hit")

            //return response
            res.status(200).json({
                success: true,
                message: "product retrieval from cache successful",
                data : JSON.parse(cachedProduct)
            });
        };

        //if product is not available
        
        //log something to console
        console.log("cache miss");

        //return response
        // return res.status(400).json({
        //     success: false,
        //     message: "cache miss"
        // });

        //retrieving product from database
        const dbproduct = await Product.findById(id);

        //check if product is available in database
        //not available ... ? yes.
        if ( !dbproduct ){
            
            //log something on console
            console.log( "product not found");

            //return response
            res.status(400).json({
                success: false, 
                message: "product not found"
            });
        }

        //no, first cache and return product
        //cache for 30 seconds
        await req.redis.setEx(id, 30, JSON.stringify(dbproduct));


        return res.status(201).json({
            success : true,
            message: "product found",
            data : dbproduct
        });

    } catch ( error ) {
        return res.status(500).json({
            success: false, 
            message: "server error",
            error: error.message
        });
    }
};

//export module
module.exports  = { createProduct, bulkProducts, getProduct };