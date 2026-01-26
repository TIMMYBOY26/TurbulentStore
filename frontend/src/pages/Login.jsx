import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { FcGoogle } from "react-icons/fc";

const Login = ({ triggerGlobalSuccess }) => {
  const { token, setToken, navigate, backendUrl, getUserCart } =
    useContext(ShopContext);

  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isPasscodeSent, setIsPasscodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isLoading, setIsLoading] = useState(true);

  // Initial loader effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // FIXED: Trigger global notification and navigate INSTANTLY
  const triggerSuccess = (msg) => {
    if (triggerGlobalSuccess) {
      triggerGlobalSuccess(msg); // Calls function in App.jsx
    }
    navigate("/"); // Instant redirect
  };

  const loginWithGoogle = () => {
    window.location.href = `${backendUrl}/api/user/google`;
  };

  // Handle Google Redirect Token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      setToken(urlToken);
      getUserCart(urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      triggerSuccess("Authenticated via Google");
    }
  }, [setToken, getUserCart]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (isPasscodeSent) {
        const response = await axios.post(
          backendUrl + "/api/user/verify-passcode",
          { email, passcode },
        );
        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          setToken(response.data.token);
          await getUserCart(response.data.token);
          triggerSuccess("Welcome Back!");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(
          backendUrl + "/api/user/send-passcode",
          { email },
        );
        if (response.data.success) {
          setIsPasscodeSent(true);
          toast.info("Passcode sent to your email.");
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
      const response = await axios.post(
        backendUrl + "/api/user/resend-passcode",
        { email },
      );
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

  return (
    <>
      {/* BRANDED WAVE LOADER */}
      {isLoading && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-40 flex flex-col items-center justify-center bg-white">
          <div className="flex items-end gap-2 h-16">
            <div className="w-2.5 bg-[#003366] rounded-full animate-[wave_1.2s_ease-in-out_infinite] h-6"></div>
            <div className="w-2.5 bg-[#ADD8E6] rounded-full animate-[wave_1.2s_ease-in-out_0.15s_infinite] h-10"></div>
            <div className="w-2.5 bg-black rounded-full animate-[wave_1.2s_ease-in-out_0.3s_infinite] h-14"></div>
            <div className="w-2.5 bg-white border-2 border-gray-200 rounded-full animate-[wave_1.2s_ease-in-out_0.45s_infinite] h-10"></div>
            <div className="w-2.5 bg-[#003366] rounded-full animate-[wave_1.2s_ease-in-out_0.6s_infinite] h-6"></div>
          </div>
          <p className="mt-10 text-[10px] font-black tracking-[0.6em] text-black uppercase">
            TURBULENT
          </p>
          <style>{`@keyframes wave { 0%, 100% { height: 1.5rem; } 50% { height: 4rem; } }`}</style>
        </div>
      )}

      <div
        className={`w-full px-4 py-12 sm:py-20 min-h-[85vh] flex items-center justify-center transition-opacity duration-1000 ${isLoading ? "opacity-0" : "opacity-100"}`}
        style={{
          backgroundImage: `url(${assets.loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col items-center w-full max-w-[340px] sm:max-w-[420px] gap-4 text-gray-900 bg-white/95 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-2xl border border-white/20"
        >
          <div className="text-center mb-2">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
              {isPasscodeSent ? "Check your Inbox" : "Login"}
            </p>
          </div>

          {!isPasscodeSent && (
            <>
              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all text-sm sm:text-base"
              >
                <FcGoogle className="text-xl sm:text-2xl" /> Continue with
                Google
              </button>
              <div className="flex items-center w-full gap-3 text-gray-400 text-[10px] font-bold uppercase my-2">
                <hr className="flex-1 border-gray-200" />
                <span className="px-2">or</span>
                <hr className="flex-1 border-gray-200" />
              </div>
            </>
          )}

          <div className="w-full flex flex-col gap-3">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
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
                className="w-full px-4 py-4 rounded-xl border border-gray-200 text-center text-2xl font-bold tracking-widest bg-gray-50"
                placeholder="000000"
                required
                autoFocus
              />
            )}
          </div>

          {isPasscodeSent && (
            <div className="w-full text-center space-y-3">
              <button
                type="button"
                className={`text-sm font-bold underline ${cooldown ? "text-gray-300" : "text-black"}`}
                onClick={resendPasscodeHandler}
                disabled={cooldown}
              >
                {cooldown ? `Resend code in ${countdown}s` : "Resend Passcode"}
              </button>
            </div>
          )}

          <button className="bg-black text-white w-full py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg text-sm sm:text-base">
            {isPasscodeSent ? "Verify Code" : "Login with Email"}
          </button>

          {isPasscodeSent && (
            <button
              type="button"
              onClick={() => setIsPasscodeSent(false)}
              className="text-sm font-medium text-gray-500 hover:text-black mt-1"
            >
              ← Change email
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default Login;
