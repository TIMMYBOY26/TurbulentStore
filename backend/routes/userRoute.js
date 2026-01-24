import express from "express";
import {
  sendLoginPasscode,
  verifyPasscode,
  resendLoginPasscode,
  adminLogin,
  allUsers,
  googleAuth,     // 1. Import Google Auth functions
  googleCallback  // from your controller
} from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

// --- Existing User Auth Routes ---
userRouter.post("/send-passcode", sendLoginPasscode);
userRouter.post("/verify-passcode", verifyPasscode);
userRouter.post("/resend-passcode", resendLoginPasscode);

// --- NEW: Google OAuth Routes ---
// This initiates the redirect to Google
userRouter.get("/google", googleAuth);

// This is the URL Google will call back to (must match your .env and Google Console)
userRouter.get("/google-callback", googleCallback);

// --- Admin Routes ---
userRouter.post("/admin", adminLogin);
userRouter.get("/list", adminAuth, allUsers);

export default userRouter;
