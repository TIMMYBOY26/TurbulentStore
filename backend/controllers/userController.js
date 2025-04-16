import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import validator from "validator";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Function for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format." });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists." });
        }

        // Create a new user
        const newUser = new userModel({ name, email });
        await newUser.save();

        res.json({ success: true, message: "User registered successfully." });
    } catch (error) {
        console.log('Error registering user:', error);
        res.json({ success: false, message: "Error registering user." });
    }
};

// Function to send login passcode via email
const sendLoginPasscode = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format." });
        }

        // Generate a random 6-digit numeric passcode
        const passcode = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the passcode before storing it
        const hashedPasscode = await bcrypt.hash(passcode, 10);

        // Find the user and update the passcode and expiration
        const user = await userModel.findOneAndUpdate(
            { email },
            { passcode: hashedPasscode, passcodeExpires: Date.now() + 10 * 60 * 1000 }, // Expires in 10 minutes
            { new: true }
        );

        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        // Send the passcode via email
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use Gmail service
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // Your Gmail app password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Login Passcode',
            text: `Your login passcode is: ${passcode}`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Passcode sent to email." });
    } catch (error) {
        console.log('Error sending passcode:', error);
        res.json({ success: false, message: "Error sending passcode." });
    }
};

// Function to verify the login passcode
const verifyPasscode = async (req, res) => {
    try {
        const { email, passcode } = req.body;

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        // Check if the passcode matches and is still valid
        const isPasscodeValid = await bcrypt.compare(passcode, user.passcode);
        if (isPasscodeValid && user.passcodeExpires > Date.now()) {
            const token = createToken(user._id); // Create a token for the user
            res.json({ success: true, message: "Passcode verified successfully.", token });
        } else {
            res.json({ success: false, message: "Invalid or expired passcode." });
        }
    } catch (error) {
        console.log('Error verifying passcode:', error);
        res.json({ success: false, message: "Error verifying passcode." });
    }
};

// Export all functions
export { registerUser, sendLoginPasscode, verifyPasscode, createToken }
