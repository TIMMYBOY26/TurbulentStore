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
          <p className="prata-regular text-3xl">
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

        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer">Forgot your password?</p>
        </div>

        <button className="bg-black text-white font-light px-8 py-2 mt-4 hover:bg-gray-800 hover:text-blue-300 transition duration-300 ease-in-out">
          {isPasscodeSent ? "Verify Passcode" : "Send Passcode"}
        </button>
      </form>
    </div>
  );
};

export default Login;
