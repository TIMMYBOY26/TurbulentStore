import React, { useState, useEffect } from "react";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import LatestSong from "../components/LatestSong";
import AdPopup from "../components/AdPopup";
import { assets } from "../assets/assets";

const Home = ({ hasSeenAd, setHasSeenAd }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAd, setShowAd] = useState(false);

  // 1. 當 Loading 或 廣告顯示時，防止背景頁面捲動 (Scroll Lock)
  useEffect(() => {
    if (isLoading || showAd) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // 組件卸載時恢復捲動，避免影響其他頁面
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading, showAd]);

  // 2. 頁面加載偵測與廣告跳出邏輯
  useEffect(() => {
    const handleLoad = () => {
      // 設定 1 秒的加載動畫時間
      setTimeout(() => {
        setIsLoading(false);

        /**
         * 核心邏輯：
         * 只有在 App 層級的 hasSeenAd 為 false 時才顯示廣告。
         * - 分頁切換時：hasSeenAd 已被設為 true，所以不會顯示。
         * - 重新整理 (F5)：App 狀態重置為 false，廣告會再次顯示。
         */
        if (!hasSeenAd) {
          setTimeout(() => {
            setShowAd(true);
          }, 800); // 頁面內容浮現完畢後 0.8 秒彈出廣告
        }
      }, 1000);
    };

    // 檢查瀏覽器是否已完成資源加載
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [hasSeenAd]);

  // 3. 處理廣告關閉
  const handleCloseAd = () => {
    setShowAd(false);
    // 更新 App.jsx 中的狀態，這樣分頁切換就不會再看到
    setHasSeenAd(true);
  };

  return (
    <>
      {/* --- 1. FULL-SCREEN WAVE LOADER --- */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
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

      {/* --- 2. AD POPUP (極簡 Apple 風格) --- */}
      {!isLoading && showAd && (
        <AdPopup
          onClose={handleCloseAd}
          image={assets.Monologue_hkhero}
          buttonText="Get Tickets Now"
          link="https://www.offgrid.day/clubs/19/219?stage=show-detail"
        />
      )}

      {/* --- 3. PAGE CONTENT (帶有向上浮現動畫) --- */}
      <div
        className={`transition-all duration-1000 ease-out ${
          isLoading ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
        }`}
      >
        <LatestSong />
        <LatestCollection />
        <BestSeller />
      </div>
    </>
  );
};

export default Home;
