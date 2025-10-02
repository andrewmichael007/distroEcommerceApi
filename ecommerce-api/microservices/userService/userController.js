
//requiring the necessary modules
const User = require("./userModel.js");
const bcrypt = require("bcrypt");
const jwt  = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

//requiring the unique identifier
const { v4: uuidv4 } = require("uuid");

//validator
const validator = [
    body('name').trim().notEmpty().isLength({ min: 5 }).withMessage("name is required"),
    body('email').isEmail().withMessage("invalid email"),
    body('username').trim().notEmpty().withMessage("message is required"),
    body('password').notEmpty().isLength({ min: 6 }).withMessage("password is required and must be at least 6 characters")
];

//registration logic / controller
const register =  async ( req, res ) => {

    const errors =  validationResult(req);

    //checking if errors are not empty, send validation failed.
    if( !errors.isEmpty() ) {
        return res.status(400).json({
            success: false,
            message: "validation failed",
            errors: errors.array()
        });
    }

    //defining the request body
    const { name, email, username, password } = req.body;

    try {
        //checking if user already exists using the username or email
        const existingUser = await User.findOne({
            $or:  [ { email } , { username } ]
        });

        if ( existingUser ) {
            return res.status(400).json({
                success: false,
                message: " user already exist ",
                // data: existingUser
            });
        }

        //hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //debug
        console.log(
            "password: " , password ,
            "hashedPassword: " , hashedPassword
        );

        //create new user
        const user = new User({
            id : uuidv4(),
            name,
            email,
            username,
            password : hashedPassword
        });

        //logging out data been created
        console.log( "user created: " , user );

        //save
        await user.save();

        //return response
        res.status(200).json({
            success: true,
            message: "user registered successfully",
            data : user
        });
    } catch (error){
        console.log(error);
        res.status(400).json({
            success: false,
            message : "error registering user"
        });
    };

};

//login logic / controller
const login = async ( req, res) => {

    try {
        //define the request body
        const { username , password, email } = req.body;

        //checking if username exists
        const existingUser = await User.findOne({ email });

        // if existing user is false, thus empty, meaning user does not exist
        if ( !existingUser ) {
            return res.status(400).json({
                success: false ,
                message: " user does not exist "
            });
        };

        //comparing password
        const passwordMatch = await bcrypt.compare( password, existingUser.password );

        //check if password is false
        if ( !passwordMatch ) {
            return res.status(400).json({
                success : false,
                message : " password does not match "
            });
        };

        //debug
        console.log(
            "password entered by user : " , password,
            "password in database: " , existingUser.password
        )

        //if all two checks pass ... create and return a jwt for user authentication
        //payload - the data to store the token
        // secret
        // options
        const token = jwt.sign (
            { id : existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn : "1h"}
        );

        console.log (token);

        res.status(200).json({
            success: true,
            message: "login successful",
            token,
            data: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                username: existingUser.username
            }
        });
    } catch (error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "internal server error"
        });
    };

};

//getting user logic / controller
const getUser = async ( req , res ) =>  {

    //extracts id from request body by destructuring
    const { id } = req.params;

    try{
        //check if user exists by id
        const existingUser = await User.findById( id );

        //if user doesn't exist
        if ( !existingUser ){
            res.status(400).json({
                success : false, 
                message : "user does not exist"
            });
            //log output to the console
            console.log("user doesnt not exist")
        }

        //send a response if user exists
        res.status(200).json({
            success: true,
            message: "user found",
            data : existingUser
        });

        //log response to the console
        console.log("user exists : ", existingUser);
    
        //catch any error in the course of the process
    } catch(error) {
        res.status(500).json({
            success: false,
            message : "internal server error"
        });
        console.log(error)

        //log error to the console
        console.log("process failed")
    };
};

//updating the user logic / controller 
const updateUser = async ( req , res ) => {
    
    //finding the user to update by id
    const { id } = req.params;

    //defining the request body
    const { name, email, username, password } = req.body;

    try {
        //check if user exists 
        const existingUser = await User.findById(id);

        if ( !existingUser ) { 
            res.status(400).json({
                success : false, 
                message : "user doesn't exist"
            });  
        };

        //if user exists, update
        existingUser.name = name;
        existingUser.email = email;
        existingUser.username = username;
        existingUser.password = password;

        //save
        const updatedUser = await existingUser.save();

        res.status(200).json({
            success : true,
            message : "user updated successfully",
            data : updatedUser
        });

        //log the updated user
        console.log("updated user : ", updatedUser);

    //any error during the whole process ? log it out.
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "updating user failed"
        });
    };
};

//delete logic /controller
const deleteUser = async ( req , res ) => {

    //debug: log the parameters
    // console.log(req.params.id);

    //destructuring the id
    const { id }  = req.params;

    try {
        //check whether exists
        const existingUser = await User.findById( id );

        if ( !existingUser ) {
            return res.status(404).json({
                success : false,
                message : " user does not exist "
            });
        };

        //debug
        // console.log("user exists");

        //deleting user
        const deletedUser = await existingUser.deleteOne({ _id: id });

        res.status(200).json({
            success: true, 
            message: " user deleted "
        });

        //log the output to the console
        console.log ( " deletedUser : " , deletedUser );

        //catch error or any occurs
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: " deleting user failed "
        });
    };
};

//export module
module.exports = { register, validator, login, getUser, updateUser, deleteUser };