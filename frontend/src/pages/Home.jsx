import React, { useState, useEffect } from "react";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import LatestSong from "../components/LatestSong";
import AdPopup from "../components/AdPopup";
import { assets } from "../assets/assets";

const Home = ({ hasSeenAd, setHasSeenAd }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAd, setShowAd] = useState(false);

  /**
   * 💡 廣告活動開關 (Ad Campaign Toggle)
   * 巡演結束時設為 false；未來有新活動需要彈窗時，只需改回 true。
   */
  const isAdCampaignActive = false;

  // 1. 處理頁面捲動鎖定 (Scroll Lock)
  useEffect(() => {
    // 只有在 Loading 中，或者「活動開啟且廣告顯示時」才鎖定捲動
    if (isLoading || (isAdCampaignActive && showAd)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading, showAd, isAdCampaignActive]);

  // 2. 頁面加載偵測與廣告跳出邏輯
  useEffect(() => {
    const handleLoad = () => {
      // 設定 1 秒的品牌加載動畫時間
      setTimeout(() => {
        setIsLoading(false);

        /**
         * 廣告彈出邏輯：
         * 只有在 isAdCampaignActive 為 true，且 App 層級 hasSeenAd 為 false 時才執行。
         */
        if (isAdCampaignActive && !hasSeenAd) {
          setTimeout(() => {
            setShowAd(true);
          }, 800);
        }
      }, 1000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [hasSeenAd, isAdCampaignActive]);

  // 3. 處理廣告關閉
  const handleCloseAd = () => {
    setShowAd(false);
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

      {/* --- 2. AD POPUP (受開關控制) --- */}
      {isAdCampaignActive && !isLoading && showAd && (
        <AdPopup
          onClose={handleCloseAd}
          image={assets.Monologue_hkhero}
          buttonText="Get Tickets Now"
          link="https://www.offgrid.day/clubs/19/219?stage=show-detail"
        />
      )}

      {/* --- 3. PAGE CONTENT --- */}
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
