import express from "express";
import {
  sendLoginPasscode, // Import the function to send the passcode
  verifyPasscode, // Import the function for verifying the passcode
  resendLoginPasscode, // Import the function to resend the passcode
  adminLogin,
} from "../controllers/userController.js";

const userRouter = express.Router();

// Remove the registration route since it's no longer needed
// userRouter.post('/register', registerUser); // Comment or remove this line

// New route to send the passcode
userRouter.post("/send-passcode", sendLoginPasscode); // This handles sending the passcode via email

// New route to verify the passcode
userRouter.post("/verify-passcode", verifyPasscode); // This handles verifying the passcode

// New route to resend the passcode
userRouter.post("/resend-passcode", resendLoginPasscode); // This handles resending the passcode

// Route for admin login
userRouter.post("/admin", adminLogin);

export default userRouter;
