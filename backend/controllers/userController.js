import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

// 1. Google OAuth Client
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// 2. Persistent Pooled Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  pool: true,
  maxConnections: 5,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: Token Generator
const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

// Helper: Background Email
const sendMailBackground = (options) => {
  transporter.sendMail(options).catch((err) => console.error("Email Error:", err));
};

// --- GOOGLE OAUTH CONTROLLERS ---

export const googleAuth = async (req, res) => {
  const url = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    prompt: "select_account",
  });
  res.redirect(url);
};

export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await googleClient.getToken(code);
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    const user = await userModel.findOneAndUpdate(
      { email },
      { $set: { name } },
      { upsert: true, new: true }
    );

    const token = createToken(user._id);
    // Redirect to frontend (Frontend must handle the ?token param)
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

// --- EMAIL PASSCODE CONTROLLERS ---

export const sendLoginPasscode = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" });

    const passcode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPasscode = await bcrypt.hash(passcode, 10);

    await userModel.findOneAndUpdate(
      { email },
      { $set: { passcode: hashedPasscode, passcodeExpires: Date.now() + 10 * 60 * 1000, name: name || "Guest" } },
      { upsert: true }
    );

    sendMailBackground({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login Passcode",
      text: `Your passcode is: ${passcode}`,
    });

    res.json({ success: true, message: "Passcode sent." });
  } catch (error) {
    res.json({ success: false, message: "Error processing request." });
  }
};

export const verifyPasscode = async (req, res) => {
  try {
    const { email, passcode } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isValid = await bcrypt.compare(passcode, user.passcode);
    if (isValid && user.passcodeExpires > Date.now()) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid or expired passcode" });
    }
  } catch (error) {
    res.json({ success: false, message: "Verification error" });
  }
};

export const resendLoginPasscode = async (req, res) => {
  try {
    const { email } = req.body;
    const passcode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPasscode = await bcrypt.hash(passcode, 10);

    await userModel.findOneAndUpdate(
      { email },
      { $set: { passcode: hashedPasscode, passcodeExpires: Date.now() + 10 * 60 * 1000 } }
    );

    sendMailBackground({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "New Passcode",
      text: `Your new passcode is: ${passcode}`,
    });

    res.json({ success: true, message: "New passcode sent." });
  } catch (error) {
    res.json({ success: false, message: "Error resending." });
  }
};

// --- ADMIN CONTROLLERS ---

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

export const allUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-passcode -passcodeExpires");
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "User removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
