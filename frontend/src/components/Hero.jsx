import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 滑動偵測狀態
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const heroBackground = assets.herowhiteground;

  const slides = [
    {
      id: 1,
      image: assets.Taiwan_hero,
      titleLine1: "Upcoming Tour",
      showMobileText: false, // <--- 設置為 true text會變為not show in mobile
      hideOrderBtn: false, // <--- 設置為 true 會變為灰色不可點擊
      canvasColor: "bg-white",
      textColor: "sm:text-black",
      btnBorder: "sm:border-black",
      btnBg: "sm:bg-black",
      btnText: "sm:text-white",
      orderBtnText: "TICKETS",
      streamBtnText: "TOUR INFO",
      orderLink:
        "https://www.offgrid.day/clubs/19/214?stage=compilation-detail&compilationId=8",
      streamUrl: "/shows/69876c55266afcf9ab41b2ae",
      heroLink: "/shows/69876c55266afcf9ab41b2ae",
    },
    {
      id: 2,
      image: assets.Monologue_hero,
      titleLine1: "The New Album《MONOLOGUE》",
      titleLine2: "Out Now",
      showMobileText: false,
      hideOrderBtn: false,
      canvasColor: "bg-white",
      textColor: "sm:text-black",
      btnBorder: "sm:border-black",
      btnBg: "sm:bg-black",
      btnText: "sm:text-white",
      orderBtnText: "ORDER",
      streamBtnText: "STREAM",
      orderLink: "/product/6979cafd223a9477d223e7c6",
      streamUrl: "https://orcd.co/monologue_turbulent",
      heroLink: "/shows/6973054cc4bb617639eacce5",
    },
  ];

  const handleLink = (path) => {
    if (path.startsWith("http")) {
      window.open(path, "_blank");
    } else {
      navigate(path);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div
      className="relative w-full aspect-square sm:aspect-video sm:max-h-[75vh] overflow-hidden bg-white touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="hidden sm:block absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {slides.map((slide, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out cursor-pointer ${
              isActive
                ? "translate-x-0 z-10"
                : index > currentIndex
                  ? "translate-x-full z-0"
                  : "-translate-x-full z-0"
            } ${slide.canvasColor} sm:bg-transparent`}
          >
            <div className="w-full h-full flex flex-col sm:flex-row relative z-10">
              <div
                className="group w-full h-full sm:w-[55%] relative flex items-center justify-center overflow-hidden sm:p-12 lg:p-20"
                onClick={() => handleLink(slide.heroLink)}
              >
                <div
                  className="absolute inset-0 sm:inset-12 lg:inset-20 transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 sm:drop-shadow-2xl"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-all duration-700 pointer-events-none" />
              </div>

              <div className="absolute bottom-[6%] sm:static sm:w-[45%] sm:flex sm:flex-col sm:items-start sm:justify-center sm:pl-12 z-20 left-0 w-full flex flex-col items-center">
                <div
                  className={`flex flex-col items-center sm:items-start mb-3 sm:mb-8 leading-tight 
                  ${slide.showMobileText ? "flex" : "hidden sm:flex"}`}
                >
                  <h2
                    className={`text-white ${slide.textColor} text-[9px] sm:text-[32px] lg:text-[40px] font-black uppercase tracking-[0.2em] sm:tracking-tight drop-shadow-md sm:drop-shadow-none`}
                  >
                    {slide.titleLine1}
                  </h2>
                  <h2
                    className={`text-white ${slide.textColor} text-[9px] sm:text-[32px] lg:text-[40px] font-black uppercase tracking-[0.2em] sm:tracking-tight drop-shadow-md sm:drop-shadow-none`}
                  >
                    {slide.titleLine2}
                  </h2>
                </div>

                <div className="flex justify-center sm:justify-start gap-2 sm:gap-4 mb-6 sm:mb-12">
                  {/* TICKETS / ORDER Button Logic */}
                  {slide.hideOrderBtn ? (
                    <div className="px-3.5 py-1.5 sm:px-10 sm:py-3.5 border-[1px] border-gray-300 bg-gray-200 text-gray-400 rounded-sm font-medium sm:font-bold uppercase tracking-widest text-[8.5px] sm:text-[14px] cursor-not-allowed">
                      Coming
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLink(slide.orderLink);
                      }}
                      className={`px-3.5 py-1.5 sm:px-10 sm:py-3.5 border-[1px] border-white ${slide.btnBorder} ${slide.btnBg} text-white ${slide.btnText} rounded-sm font-medium sm:font-bold uppercase tracking-widest text-[8.5px] sm:text-[14px] transition-all duration-300 hover:opacity-80 active:scale-95`}
                    >
                      {slide.orderBtnText}
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLink(slide.streamUrl);
                    }}
                    className={`px-3.5 py-1.5 sm:px-10 sm:py-3.5 border-[1px] border-white ${slide.btnBorder} text-white ${slide.textColor} bg-transparent rounded-sm font-medium sm:font-bold uppercase tracking-widest text-[8.5px] sm:text-[14px] transition-all duration-300 hover:bg-white hover:text-black active:scale-95`}
                  >
                    {slide.streamBtnText}
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-6">
                  {slides.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(dotIndex);
                      }}
                      className="group/dot flex items-center gap-3 focus:outline-none"
                    >
                      <span
                        className={`text-[12px] font-bold ${dotIndex === currentIndex ? "text-black" : "text-black/30"}`}
                      >
                        {String(dotIndex + 1).padStart(2, "0")}
                      </span>
                      <div
                        className={`h-[2px] transition-all duration-500 ${dotIndex === currentIndex ? "w-12 bg-black" : "w-4 bg-black/10"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Hero;
