import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/** 
 * 1. PERSISTENT POOLED TRANSPORTER
 * Creating the transporter outside functions reuses the SMTP connection pool.
 * 'pool: true' is essential for high-performance 2026 applications.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  pool: true, // Reuses connections instead of creating new ones
  maxConnections: 5,
  maxMessages: Infinity,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use a Google App Password
  },
});

// Helper: Token Generator
const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

/**
 * 2. FIRE-AND-FORGET EMAIL HELPER
 * By not 'awaiting' the mail delivery in the controller, your API 
 * responds to the user instantly while the email sends in the background.
 */
const sendMailBackground = (options) => {
  transporter.sendMail(options).catch((err) => {
    console.error("Background Email Error:", err);
  });
};

// Function to send login passcode via email
export const sendLoginPasscode = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format." });
    }

    const passcode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPasscode = await bcrypt.hash(passcode, 10);
    const expiry = Date.now() + 10 * 60 * 1000;

    /** 
     * 3. ATOMIC DATABASE OPERATION
     * findOneAndUpdate reduces two DB calls (find + save) into one.
     */
    await userModel.findOneAndUpdate(
      { email },
      {
        $set: {
          passcode: hashedPasscode,
          passcodeExpires: expiry,
          name: name || "Guest"
        }
      },
      { upsert: true, new: true }
    );

    // Send email without 'await' for instant API response
    sendMailBackground({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login Passcode",
      text: `Your login passcode is: ${passcode}`,
    });

    res.json({ success: true, message: "Passcode sent to email." });
  } catch (error) {
    console.error("Controller Error:", error);
    res.json({ success: false, message: "Error processing request." });
  }
};

// Function to resend login passcode
export const resendLoginPasscode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format." });
    }

    const passcode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPasscode = await bcrypt.hash(passcode, 10);

    const user = await userModel.findOneAndUpdate(
      { email },
      { $set: { passcode: hashedPasscode, passcodeExpires: Date.now() + 10 * 60 * 1000 } }
    );

    if (!user) return res.json({ success: false, message: "User not found." });

    sendMailBackground({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your New Login Passcode",
      text: `Your new login passcode is: ${passcode}`,
    });

    res.json({ success: true, message: "New passcode sent." });
  } catch (error) {
    res.json({ success: false, message: "Error resending passcode." });
  }
};

// Function to verify the login passcode
export const verifyPasscode = async (req, res) => {
  try {
    const { email, passcode } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.json({ success: false, message: "User not found." });

    const isPasscodeValid = await bcrypt.compare(passcode, user.passcode);
    if (isPasscodeValid && user.passcodeExpires > Date.now()) {
      const token = createToken(user._id);
      res.json({ success: true, message: "Verified successfully.", token });
    } else {
      res.json({ success: false, message: "Invalid or expired passcode." });
    }
  } catch (error) {
    res.json({ success: false, message: "Verification error." });
  }
};

// Route for admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Function to get all users (Admin only)
export const allUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-passcode -passcodeExpires");
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Function to remove a user (Admin only)
export const removeUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "User removed successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
