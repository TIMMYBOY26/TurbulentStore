import express from 'express';
import {
    registerUser,
    sendLoginPasscode,  // Import the function to send the passcode
    verifyPasscode,      // Import the function for verifying the passcode
} from '../controllers/userController.js';

const userRouter = express.Router();

// Route for user registration
userRouter.post('/register', registerUser);

// Remove the login route since we're using email authentication
// userRouter.post('/login', loginUser); // Comment or remove this line

// New route to send the passcode
userRouter.post('/send-passcode', sendLoginPasscode); // This handles sending the passcode via email

// New route to verify the passcode
userRouter.post('/verify-passcode', verifyPasscode); // This handles verifying the passcode

export default userRouter;
