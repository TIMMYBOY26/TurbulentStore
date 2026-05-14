import React from "react";
import { X, ArrowRight } from "lucide-react";

const AdPopup = ({ onClose, image, title, buttonText, link }) => {
  // 💡 安全檢查：如果 title 沒傳入，給予預設值
  const displayTitle = title || "Latest Merch";

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 animate-in fade-in duration-500">
      {/* 背景遮罩 - 深色磨砂感 */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[380px] animate-in zoom-in-95 duration-500">

        {/* 頂部文字訊息 */}
        <div className="mb-6 text-center">

          <h2 className="text-white text-xl font-black tracking-[0.15em] uppercase">
            {displayTitle}
          </h2>
        </div>

        {/* 右上角關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/40 hover:text-white transition-colors p-2"
        >
          <X size={24} />
        </button>

        <div className="relative flex flex-col items-center">
          {/* 圖片容器 */}
          <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src={image}
              alt="Promotion"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* 懸浮按鈕 - 融合 Apple 與工業風格 */}
          <div className="mt-8 w-full flex justify-center">
            <a
              href={link}
              className="group relative flex items-center justify-center gap-3 px-10 py-4 
                         bg-white text-black rounded-full 
                         text-[11px] font-black tracking-[0.2em] uppercase 
                         shadow-[0_20px_40px_rgba(255,255,255,0.15)] 
                         transition-all duration-300 
                         hover:bg-gray-100 hover:-translate-y-1 active:scale-95"
            >
              <span>{buttonText || "Shop Now"}</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPopup;