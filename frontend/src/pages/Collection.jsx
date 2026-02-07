import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { ProductItem } from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setsortType] = useState("relevant");
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    // Initial load animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    setFilterProducts(productsCopy.reverse());
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price).reverse());
        break;

      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price).reverse());
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <>
      {/* BRANDED WAVE LOADER - BELOW NAV BAR */}
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

      {/* COLLECTION PAGE CONTENT */}
      <div
        className={`flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 transition-opacity duration-1000 ${isLoading ? "opacity-0" : "opacity-100"
          }`}
      >
        {/* Filter Options */}
        <div className="min-w-60">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
          >
            FILTERS
            <img
              className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
              src={assets.dropdown_icon}
              alt=""
            />
          </p>
          {/* Category Filter */}
          <div
            className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"
              } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"TEES"}
                  onChange={toggleCategory}
                />
                T-shirts
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"ACCESSORIES"}
                  onChange={toggleCategory}
                />
                Stickers
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"Tickets"}
                  onChange={toggleCategory}
                />
                Tickets
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"CD"}
                  onChange={toggleCategory}
                />
                CD
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text1={""} text2={"COLLECTIONS"} />
            <select
              onChange={(e) => setsortType(e.target.value)}
              className="bg-transparent text-sm px-2 outline-none cursor-pointer"
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Price low to high</option>
              <option value="high-low">Sort by: Price high to low</option>
            </select>
          </div>

          {/* Map Products */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collection;
