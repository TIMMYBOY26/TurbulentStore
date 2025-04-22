import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Field to store first name
    email: { type: String, required: true, unique: true }, // Email field for authentication
    cartData: { type: Object, default: {} }, // Optional, keep if needed for your application
    passcode: { type: String }, // Field to store the generated passcode
    passcodeExpires: { type: Date }, // Field to store the expiration time of the passcode
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
