import userModel from "../models/userModel";
import bcrypt from "bcrypt"
import validator from "validator"

//Route for user login
const loginUser = async (req,res) => {

}

//Route for user register
const registerUser = async (req,res) => {

    try{
        const {name, email, password} = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({email});

        if (exists) {
            return res.json({success:false, message:"User already exists"})
            
        }

        //validating email fomat & strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"Please enter a valid email"})
        }
        if (!validator.length < 8) {
            return res.json({success:false, message:"Please enter a Strong password"})
        }
        
        //hashing user password`
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

         


    } catch (error) {

    }

}

//Route for admin login
const adminLogin = async (req,res) => {

}

export {loginUser, registerUser, adminLogin}