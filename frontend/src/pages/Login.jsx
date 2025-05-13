import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets"; // Import assets

const Login = () => {
  const { token, setToken, navigate, backendUrl, getUserCart } =
    useContext(ShopContext);

  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isPasscodeSent, setIsPasscodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(false); // Cooldown state
  const [countdown, setCountdown] = useState(30); // Countdown state

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (isPasscodeSent) {
        // Verify passcode
        const response = await axios.post(
          backendUrl + "/api/user/verify-passcode",
          {
            email,
            passcode,
          }
        );
        if (response.data.success) {
          setToken(response.data.token); // Set the token in context
          localStorage.setItem("token", response.data.token); // Store token in local storage
          await getUserCart(response.data.token); // Ensure cart is fetched
          toast.success("Login successful!");
          window.location.reload(); // Refresh the page
          navigate("/"); // Navigate to home after login
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Send passcode
        const response = await axios.post(
          backendUrl + "/api/user/send-passcode",
          {
            email,
          }
        );
        if (response.data.success) {
          setIsPasscodeSent(true);
          toast.success("Passcode sent to your email.");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const resendPasscodeHandler = async () => {
    if (cooldown) return; // Prevent action if cooldown is active

    try {
      const response = await axios.post(
        backendUrl + "/api/user/resend-passcode",
        {
          email,
        }
      );
      if (response.data.success) {
        toast.success("New passcode sent to your email.");
        setCooldown(true); // Activate cooldown
        setCountdown(30); // Set countdown to 30 seconds

        // Start cooldown timer
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval); // Clear interval when countdown reaches 0
              setCooldown(false); // Reset cooldown
              return 0; // Stop countdown
            }
            return prev - 1; // Decrease countdown
          });
        }, 1000); // Update every second
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error resending passcode.");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/"); // Redirect if already logged in
    }
  }, [token, navigate]);

  return (
    <div
      className="w-full px-30 py-40 pt-20 border"
      style={{
        backgroundImage: `url(${assets.loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={onSubmitHandler}
        className="form-container flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-900"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="text-3xl">
            {isPasscodeSent ? "Verify Passcode" : "Login"}
          </p>
        </div>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Email"
          required
        />
        {isPasscodeSent && (
          <input
            onChange={(e) => setPasscode(e.target.value)}
            value={passcode}
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Enter Passcode"
            required
          />
        )}
        {isPasscodeSent && ( // Only show this when verifying passcode
          <div className="w-full flex flex-col items-start text-sm mt-[-8px]">
            <p className="text-red-600 mb-2">
              *Please also check your spam or junk folder
            </p>
            <p
              className={`cursor-pointer ${
                cooldown ? "text-gray-800" : "text-blue-600"
              }`}
              onClick={resendPasscodeHandler}
              style={{ pointerEvents: cooldown ? "none" : "auto" }} // Disable interaction if cooldown is active
            >
              {cooldown
                ? `Please wait ${countdown}s to resend passcode`
                : "Resend email passcode"}
            </p>
          </div>
        )}
        <button className="bg-black text-white font-light px-8 py-2 mt-4 hover:bg-gray-800 hover:text-blue-300 transition duration-300 ease-in-out">
          {isPasscodeSent ? "Verify Passcode" : "Send Passcode"}
        </button>
      </form>
    </div>
  );
};

export default Login;
