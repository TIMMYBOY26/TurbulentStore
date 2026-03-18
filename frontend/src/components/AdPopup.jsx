import React from "react";
import { X } from "lucide-react";

const AdPopup = ({ onClose, image, buttonText, link }) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
      {/* 背景遮罩 - 深色磨砂感 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[380px] animate-in fade-in zoom-in duration-500">
        {/* 右上角關閉按鈕 - 懸浮在圖片外 */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors p-2"
        >
          <X size={26} strokeWidth={1.5} />
        </button>

        {/* 圖片容器 - 移除下方白色背景 */}
        <div className="relative flex flex-col items-center">
          <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src={image}
              alt="Promotion"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Apple 風格懸浮按鈕 - 放在圖片正下方微間距 */}
          <div className="mt-6 w-full flex justify-center">
            <a
              href={link}
              className="group relative px-10 py-4 
                         bg-white/10 backdrop-blur-2xl border border-white/20 
                         rounded-full text-white text-[11px] font-bold tracking-[0.2em] uppercase 
                         shadow-[0_20px_50px_rgba(0,0,0,0.3)] 
                         transition-all duration-300 
                         hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              {/* 按鈕微光效果 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent opacity-50" />
              <span className="relative z-10">{buttonText}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPopup;
