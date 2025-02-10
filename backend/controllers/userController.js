import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import validator from "validator";



const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

//Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt:', { email, password }); // Log the login attempt

        const user = await userModel.findOne({ email });

        if (!user) {
            console.log('User not found'); // Log if user does not exist
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            console.log('Invalid credentials'); // Log invalid credentials
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.log('Error during login:', error); // Log the error
        res.json({ success: false, message: error.message });
    }
}

//Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });

        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (!validator.isLength(password, { min: 8 })) {
            return res.json({ success: false, message: "Please enter a Strong password" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name, email, password: hashedPassword
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
        console.log('Admin Email:', process.env.ADMIN_EMAIL);
        console.log('Admin Password:', process.env.ADMIN_PASSWORD);
    }
}

export { loginUser, registerUser, adminLogin }