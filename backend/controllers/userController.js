import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Function to create a JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Function to send login passcode via email
const sendLoginPasscode = async (req, res) => {
  try {
    const { email, name } = req.body; // Accept name as well

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format." });
    }

    // Generate a random 6-digit numeric passcode
    const passcode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the passcode before storing it
    const hashedPasscode = await bcrypt.hash(passcode, 10);

    // Check if user already exists
    let user = await userModel.findOne({ email });
    if (!user) {
      // Create a new user if not exists
      user = new userModel({
        name: name || "Guest",
        email,
        passcode: hashedPasscode,
        passcodeExpires: Date.now() + 10 * 60 * 1000,
      });
      await user.save();
    } else {
      // Update the existing user's passcode and expiration
      user.passcode = hashedPasscode;
      user.passcodeExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
      await user.save();
    }

    // Send the passcode via email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail service
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login Passcode",
      text: `Your login passcode is: ${passcode}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Passcode sent to email." });
  } catch (error) {
    console.log("Error sending passcode:", error);
    res.json({ success: false, message: "Error sending passcode." });
  }
};

// Function to resend login passcode via email
const resendLoginPasscode = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format." });
    }

    // Generate a new random 6-digit numeric passcode
    const passcode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the new passcode before storing it
    const hashedPasscode = await bcrypt.hash(passcode, 10);

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    // Update the user's passcode and expiration
    user.passcode = hashedPasscode;
    user.passcodeExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
    await user.save();

    // Send the new passcode via email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail service
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your New Login Passcode",
      text: `Your new login passcode is: ${passcode}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "New passcode sent to email." });
  } catch (error) {
    console.log("Error resending passcode:", error);
    res.json({ success: false, message: "Error resending passcode." });
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
      res.json({
        success: true,
        message: "Passcode verified successfully.",
        token,
      });
    } else {
      res.json({ success: false, message: "Invalid or expired passcode." });
    }
  } catch (error) {
    console.log("Error verifying passcode:", error);
    res.json({ success: false, message: "Error verifying passcode." });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
    console.log("Admin Email:", process.env.ADMIN_EMAIL);
    console.log("Admin Password:", process.env.ADMIN_PASSWORD);
  }
};

// Export all functions
export {
  sendLoginPasscode,
  resendLoginPasscode,
  verifyPasscode,
  createToken,
  adminLogin,
};
