import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
// Import Google Icon from Flat Color set
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { token, setToken, navigate, backendUrl, getUserCart } = useContext(ShopContext);

  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isPasscodeSent, setIsPasscodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // --- Google Login Initiation ---
  const loginWithGoogle = () => {
    // Redirects browser to backend initiation route
    window.location.href = `${backendUrl}/api/user/google`;
  };

  // --- Token Capture from Redirect ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      setToken(urlToken);
      getUserCart(urlToken);

      // Clean the URL to remove the token from the address bar
      window.history.replaceState({}, document.title, window.location.pathname);

      toast.success("Login successful via Google!");
      navigate("/");
    }
  }, [setToken, navigate, getUserCart]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (isPasscodeSent) {
        // Step 2: Verify the passcode
        const response = await axios.post(backendUrl + "/api/user/verify-passcode", { email, passcode });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          await getUserCart(response.data.token);
          toast.success("Login successful!");
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Step 1: Request the passcode
        const response = await axios.post(backendUrl + "/api/user/send-passcode", { email });
        if (response.data.success) {
          setIsPasscodeSent(true);
          toast.success("Passcode sent to your email.");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resendPasscodeHandler = async () => {
    if (cooldown) return;
    try {
      const response = await axios.post(backendUrl + "/api/user/resend-passcode", { email });
      if (response.data.success) {
        toast.success("New passcode sent!");
        setCooldown(true);
        setCountdown(30);
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setCooldown(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      toast.error("Error resending passcode.");
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div
      className="w-full px-4 py-20 min-h-[85vh] flex items-center justify-center"
      style={{
        backgroundImage: `url(${assets.loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-full max-w-[420px] gap-4 text-gray-900 bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white/20"
      >
        <div className="text-center mb-2">
          <p className="text-3xl font-bold tracking-tight text-black">
            {isPasscodeSent ? "Check your Inbox" : "Welcome Back"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {isPasscodeSent ? "We've sent a code to your email." : "Sign in to access your account."}
          </p>
        </div>

        {!isPasscodeSent && (
          <>
            {/* PROMINENT GOOGLE BUTTON */}
            <button
              type="button"
              onClick={loginWithGoogle}
              className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 py-3 rounded-xl font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md hover:border-gray-400 active:scale-[0.98] transition-all duration-200"
            >
              <FcGoogle className="text-2xl" />
              Continue with Google
            </button>

            {/* MODERN DIVIDER */}
            <div className="flex items-center w-full gap-3 text-gray-400 text-xs font-bold uppercase my-2">
              <hr className="flex-1 border-gray-200" />
              <span className="px-2">or</span>
              <hr className="flex-1 border-gray-200" />
            </div>
          </>
        )}

        {/* INPUT FIELDS */}
        <div className="w-full flex flex-col gap-3">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
            placeholder="Email address"
            disabled={isPasscodeSent}
            required
          />

          {isPasscodeSent && (
            <input
              onChange={(e) => setPasscode(e.target.value)}
              value={passcode}
              type="text"
              maxLength="6"
              className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all text-center text-2xl font-bold tracking-widest bg-gray-50"
              placeholder="000000"
              required
              autoFocus
            />
          )}
        </div>

        {/* PASSCODE HELPER TEXT */}
        {isPasscodeSent && (
          <div className="w-full text-center space-y-3">
            <p className="text-xs text-gray-500">Didn't see it? Check your <b>Spam</b> or Junk folder.</p>
            <button
              type="button"
              className={`text-sm font-bold underline transition-colors ${cooldown ? "text-gray-300 cursor-not-allowed" : "text-black hover:text-blue-600"}`}
              onClick={resendPasscodeHandler}
              disabled={cooldown}
            >
              {cooldown ? `Resend code in ${countdown}s` : "Resend Passcode"}
            </button>
          </div>
        )}

        {/* MAIN SUBMIT ACTION */}
        <button
          className="bg-black text-white w-full py-3.5 rounded-xl font-bold hover:bg-gray-800 active:scale-[0.99] transition-all shadow-lg mt-2"
        >
          {isPasscodeSent ? "Verify Code" : "Login with Email"}
        </button>

        {/* BACK ACTION */}
        {isPasscodeSent && (
          <button
            type="button"
            onClick={() => setIsPasscodeSent(false)}
            className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-1"
          >
            ← Change email address
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
