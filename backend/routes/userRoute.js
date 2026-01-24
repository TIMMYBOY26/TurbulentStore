import express from "express";
import {
  sendLoginPasscode,
  verifyPasscode,
  resendLoginPasscode,
  adminLogin,
  allUsers, // 1. Import the new controller function
} from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js"; // 2. Import admin authentication middleware

const userRouter = express.Router();

// Existing User Auth Routes
userRouter.post("/send-passcode", sendLoginPasscode);
userRouter.post("/verify-passcode", verifyPasscode);
userRouter.post("/resend-passcode", resendLoginPasscode);

// Route for admin login
userRouter.post("/admin", adminLogin);

// 3. NEW: Route to get all users (Admin only)
// This matches the call made in your ListUser.jsx (backendUrl + "/api/user/list")
userRouter.get("/list", adminAuth, allUsers);

export default userRouter;
