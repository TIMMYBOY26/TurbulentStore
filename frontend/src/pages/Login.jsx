import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { token, setToken, navigate, backendUrl, getUserCart } =
    useContext(ShopContext);

  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isPasscodeSent, setIsPasscodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isLoading, setIsLoading] = useState(true);

  // --- NEW: Premium Notification State ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Trigger custom notification
  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/");
    }, 3000);
  };

  const loginWithGoogle = () => {
    window.location.href = `${backendUrl}/api/user/google`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      setToken(urlToken);
      getUserCart(urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      triggerSuccess("Authenticated via Google"); // Replaced toast.success
    }
  }, [setToken, navigate, getUserCart]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (isPasscodeSent) {
        const response = await axios.post(
          backendUrl + "/api/user/verify-passcode",
          { email, passcode },
        );
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          await getUserCart(response.data.token);
          triggerSuccess("Welcome Back!"); // Replaced toast.success
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

  useEffect(() => {
    if (token && !showSuccess) navigate("/");
  }, [token, navigate, showSuccess]);

  return (
    <>
      {/* PREMIUM SUCCESS NOTIFICATION */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-[60] animate-toast-in">
          <div className="relative overflow-hidden min-w-[280px] sm:min-w-[340px] bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-[#003366] to-black flex items-center justify-center shadow-lg shadow-blue-900/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-black font-black text-[10px] uppercase tracking-[0.3em]">
                Success
              </p>
              <p className="text-gray-700 text-sm font-medium">{successMsg}</p>
            </div>
            {/* Progress Bar Loader */}
            <div className="absolute bottom-0 left-0 h-1 bg-black animate-progress-shrink" />
          </div>
          <style>{`
            @keyframes toast-in {
              0% { transform: translateX(100%) scale(0.9); opacity: 0; }
              70% { transform: translateX(-10px) scale(1.05); }
              100% { transform: translateX(0) scale(1); opacity: 1; }
            }
            @keyframes progress-shrink {
              from { width: 100%; }
              to { width: 0%; }
            }
            .animate-toast-in { animation: toast-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
            .animate-progress-shrink { animation: progress-shrink 3s linear forwards; }
          `}</style>
        </div>
      )}

      {/* BRANDED WAVE LOADER */}
      {isLoading && (
        <div className="fixed top-[80px] bottom-0 left-0 right-0 z-40 flex flex-col items-center justify-center bg-white">
          <div className="flex items-end gap-2 h-16">
            <div className="w-2.5 bg-[#003366] rounded-full animate-[wave_1.2s_ease-in-out_infinite] h-6"></div>
            <div className="w-2.5 bg-[#ADD8E6] rounded-full animate-[wave_1.2s_ease-in-out_0.15s_infinite] h-10"></div>
            <div className="w-2.5 bg-black rounded-full animate-[wave_1.2s_ease-in-out_0.3s_infinite] h-14"></div>
            <div className="w-2.5 bg-white border-2 border-gray-200 rounded-full animate-[wave_1.2s_ease-in-out_0.45s_infinite] h-10"></div>
            <div className="w-2.5 bg-[#003366] rounded-full animate-[wave_1.2s_ease-in-out_0.6s_infinite] h-6"></div>
          </div>
          <p className="mt-10 text-[10px] font-black tracking-[0.6em] text-black uppercase animate-pulse">
            TURBULENT
          </p>
          <style>{`
            @keyframes wave {
              0%, 100% { height: 1.5rem; transform: translateY(0); }
              50% { height: 4rem; transform: translateY(-5px); }
            }
          `}</style>
        </div>
      )}

      {/* LOGIN CONTENT */}
      <div
        className={`w-full px-4 py-12 sm:py-20 min-h-[85vh] flex items-center justify-center transition-opacity duration-1000 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `url(${assets.loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col items-center w-full max-w-[340px] sm:max-w-[420px] gap-3 sm:gap-4 text-gray-900 bg-white/95 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-2xl border border-white/20"
        >
          <div className="text-center mb-1 sm:mb-2">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
              {isPasscodeSent ? "Check your Inbox" : "Login"}
            </p>
            <p className="text-[12px] sm:text-sm text-gray-500 mt-2">
              {isPasscodeSent ? "We've sent a code to your email." : ""}
            </p>
          </div>

          {!isPasscodeSent && (
            <>
              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 py-2.5 sm:py-3 rounded-xl font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
              >
                <FcGoogle className="text-xl sm:text-2xl" />
                Continue with Google
              </button>

              <div className="flex items-center w-full gap-3 text-gray-400 text-[10px] sm:text-xs font-bold uppercase my-1 sm:my-2">
                <hr className="flex-1 border-gray-200" />
                <span className="px-2">or</span>
                <hr className="flex-1 border-gray-200" />
              </div>
            </>
          )}

          <div className="w-full flex flex-col gap-2.5 sm:gap-3">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all text-sm sm:text-base"
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
                className="w-full px-4 py-3 sm:py-4 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all text-center text-xl sm:text-2xl font-bold tracking-widest bg-gray-50"
                placeholder="000000"
                required
                autoFocus
              />
            )}
          </div>

          {isPasscodeSent && (
            <div className="w-full text-center space-y-2 sm:space-y-3">
              <p className="text-[11px] sm:text-xs text-gray-500">
                Didn't see it? Check your <b>Spam</b> folder.
              </p>
              <button
                type="button"
                className={`text-[12px] sm:text-sm font-bold underline transition-colors ${cooldown ? "text-gray-300 cursor-not-allowed" : "text-black hover:text-blue-600"}`}
                onClick={resendPasscodeHandler}
                disabled={cooldown}
              >
                {cooldown ? `Resend code in ${countdown}s` : "Resend Passcode"}
              </button>
            </div>
          )}

          <button className="bg-black text-white w-full py-3 sm:py-3.5 rounded-xl font-bold hover:bg-gray-800 active:scale-[0.99] transition-all shadow-lg mt-1 sm:mt-2 text-sm sm:text-base">
            {isPasscodeSent ? "Verify Code" : "Login with Email"}
          </button>

          {isPasscodeSent && (
            <button
              type="button"
              onClick={() => setIsPasscodeSent(false)}
              className="text-[12px] sm:text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-1 mt-1"
            >
              ← Change email address
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default Login;
