import express from "express";
import {
  sendLoginPasscode,
  verifyPasscode,
  resendLoginPasscode,
  adminLogin,
  allUsers,
  googleAuth,
  googleCallback,
  getUserProfile,
} from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

// 1. INITIALIZE ROUTER FIRST
const userRouter = express.Router();

// 2. Profile Route (Uses user authentication middleware)
userRouter.post("/profile", authUser, getUserProfile);

// --- User Auth Routes ---
userRouter.post("/send-passcode", sendLoginPasscode);
userRouter.post("/verify-passcode", verifyPasscode);
userRouter.post("/resend-passcode", resendLoginPasscode);

// --- Google OAuth Routes ---
userRouter.get("/google", googleAuth);
userRouter.get("/google-callback", googleCallback);

// --- Admin Routes ---
userRouter.post("/admin", adminLogin);
userRouter.get("/list", adminAuth, allUsers);

export default userRouter;
