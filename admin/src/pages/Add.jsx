import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = ({ token }) => {
  const [images, setImages] = useState(Array(9).fill(null));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("TEES");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [sizeCount, setSizeCount] = useState({});

  // --- Ticket 專屬 State ---
  const [ticketType, setTicketType] = useState("external"); // 'external' (外部) 或 'internal' (內購)
  const [isTicketAvailable, setIsTicketAvailable] = useState(false);
  const [externalLink, setExternalLink] = useState("");

  // 當分類切換到 Tickets 時，自動幫使用者勾選 "TICKETS" 尺寸
  useEffect(() => {
    if (category === "Tickets") {
      if (!sizes.includes("TICKETS")) {
        setSizes((prev) => [...prev, "TICKETS"]);
      }
    }
  }, [category]);

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const handleSizeCountChange = (size, count) => {
    setSizeCount((prev) => ({
      ...prev,
      [size]: count,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // --- 自動格式化 Description：確保每一行開頭都有 '-' ---
    const formattedDescription = description
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed === "") return ""; // 保留空行
        return trimmed.startsWith("-") ? trimmed : `-${trimmed}`;
      })
      .join("\n");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", formattedDescription);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("bestseller", bestseller);
      formData.append(
        "sizes",
        JSON.stringify(
          sizes.map((size) => ({ size, count: Number(sizeCount[size]) || 0 })),
        ),
      );
      formData.append("date", Date.now());

      // --- Ticket 欄位發送 ---
      if (category === "Tickets") {
        formData.append("ticketType", ticketType);
        formData.append("isTicketAvailable", isTicketAvailable);
        formData.append(
          "externalLink",
          ticketType === "external" ? externalLink : "",
        );
      } else {
        formData.append("ticketType", "none");
        formData.append("isTicketAvailable", false);
        formData.append("externalLink", "");
      }

      images.forEach((img, index) => {
        if (img) formData.append(`image${index + 1}`, img);
      });

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success("Product added successfully!");
        // 重置表單
        setName("");
        setDescription("");
        setPrice("");
        setImages(Array(9).fill(null));
        setSizes([]);
        setSizeCount({});
        setExternalLink("");
        setIsTicketAvailable(false);
        setTicketType("external");
        setCategory("TEES");
      } else {
        toast.error(response.data.message || "Failed to add product.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 uppercase tracking-tight">
          Add New Product
        </h1>
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col w-full items-start gap-6 bg-white p-6 rounded-xl shadow-sm border"
        >
          {/* 1. 圖片上傳 */}
          <div>
            <p className="mb-3 font-semibold text-gray-700 uppercase text-[10px] tracking-widest">
              Upload Images (Max 9)
            </p>
            <div className="flex flex-wrap gap-3">
              {images.map((image, index) => (
                <label
                  key={index}
                  htmlFor={`image${index}`}
                  className="group relative"
                >
                  <div className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center overflow-hidden hover:border-black transition-all cursor-pointer bg-gray-50">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        !image ? assets.upload_area : URL.createObjectURL(image)
                      }
                      alt=""
                    />
                  </div>
                  <input
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                </label>
              ))}
            </div>
          </div>

          {/* 2. 基本資訊 */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="mb-2 font-medium text-xs uppercase text-gray-400 tracking-wider">
                Product Name
              </p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
                type="text"
                placeholder="Ex: Summer Festival 2024"
                required
              />
            </div>
            <div className="col-span-2">
              <p className="mb-2 font-medium text-xs uppercase text-gray-400 tracking-wider">
                Description
              </p>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none min-h-[120px] transition-all"
                placeholder="Lines will automatically start with '-'"
                required
              />
            </div>
          </div>

          {/* 3. 分類與價格 */}
          <div className="flex flex-wrap gap-6 w-full border-b pb-6">
            <div className="flex-1 min-w-[200px]">
              <p className="mb-2 font-medium text-xs uppercase text-gray-400 tracking-wider">
                Category
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-black transition-all"
              >
                <option value="TEES">TEES</option>
                <option value="ACCESSORIES">ACCESSORIES</option>
                <option value="MUSIC">MUSIC</option>
                <option value="CD">CD</option>
                <option value="Tickets">Tickets</option>
                <option value="KEYCHAIN">KEYCHAIN</option>
                <option value="TOWEL">TOWEL</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <p className="mb-2 font-medium text-xs uppercase text-gray-400 tracking-wider">
                Price
              </p>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
                type="number"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* 4. Ticket 專屬設定區塊 */}
          {category === "Tickets" && (
            <div className="w-full p-5 bg-gray-50 border border-gray-200 rounded-xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b pb-3">
                <p className="font-black text-xs uppercase tracking-widest text-black">
                  🎫 Ticket Settings
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    className="w-4 h-4 accent-black"
                    checked={isTicketAvailable}
                    onChange={() => setIsTicketAvailable(!isTicketAvailable)}
                  />
                  <label
                    htmlFor="isAvailable"
                    className="text-sm font-bold cursor-pointer"
                  >
                    Active for Sale
                  </label>
                </div>
              </div>

              {/* 選擇內部或外部售票 */}
              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="ticketType"
                    value="external"
                    checked={ticketType === "external"}
                    onChange={(e) => setTicketType(e.target.value)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-xs font-bold uppercase group-hover:text-black transition-colors">
                    External Link
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="ticketType"
                    value="internal"
                    checked={ticketType === "internal"}
                    onChange={(e) => setTicketType(e.target.value)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-xs font-bold uppercase group-hover:text-black transition-colors">
                    Internal Booking (On-site)
                  </span>
                </label>
              </div>

              {ticketType === "external" ? (
                <div className="w-full">
                  <p className="mb-2 text-xs font-bold text-gray-500 uppercase">
                    Ticket Link (Redirect URL)
                  </p>
                  <input
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://eventbrite.com"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
                    required={isTicketAvailable && ticketType === "external"}
                  />
                  <p className="mt-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">
                    * Users will be redirected to this link.
                  </p>
                </div>
              ) : (
                <div className="w-full p-3 bg-black/5 border border-black/10 rounded-lg">
                  <p className="text-[10px] text-black font-bold uppercase tracking-widest leading-relaxed">
                    ℹ️ Internal Mode: Ticket will be processed through the
                    website's native checkout system. Make sure inventory is set
                    below.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 5. 尺寸與庫存 */}
          <div className="w-full pt-2">
            <p className="mb-3 font-semibold text-gray-700 uppercase text-[10px] tracking-widest">
              Inventory Management
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                "S",
                "M",
                "L",
                "XL",
                "XXL",
                "STICKER",
                "MUSIC",
                "CD",
                "TICKETS",
                "KEYCHAIN",
                "TOWEL",
              ].map((size) => (
                <div
                  key={size}
                  className={`flex flex-col items-center border p-3 rounded-xl transition-all duration-300 ${sizes.includes(size) ? "border-black bg-white shadow-sm" : "border-gray-100"}`}
                >
                  <p
                    onClick={() =>
                      setSizes((prev) =>
                        prev.includes(size)
                          ? prev.filter((item) => item !== size)
                          : [...prev, size],
                      )
                    }
                    className={`${sizes.includes(size) ? "bg-black text-white" : "bg-gray-100 text-gray-400"} px-4 py-1.5 cursor-pointer rounded-lg font-bold text-[10px] uppercase transition-all`}
                  >
                    {size}
                  </p>
                  {sizes.includes(size) && (
                    <div className="mt-3 flex flex-col items-center">
                      <span className="text-[9px] text-gray-400 uppercase font-black mb-1 tracking-tighter">
                        Stock Count
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={sizeCount[size] || ""}
                        onChange={(e) =>
                          handleSizeCountChange(size, e.target.value)
                        }
                        className="w-16 border rounded text-center text-xs py-1 focus:ring-1 focus:ring-black outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 6. 其他設定 */}
          <div className="flex items-center gap-2 py-2">
            <input
              className="w-4 h-4 accent-black"
              onChange={() => setBestseller((prev) => !prev)}
              checked={bestseller}
              type="checkbox"
              id="bestseller"
            />
            <label
              className="cursor-pointer text-sm font-medium uppercase tracking-wider text-gray-600"
              htmlFor="bestseller"
            >
              Add to bestseller
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-black text-white font-black tracking-[0.3em] uppercase text-xs rounded-lg hover:bg-gray-900 transition-all active:scale-[0.98] shadow-xl"
          >
            Publish Product
          </button>
        </form>
      </div>
    </>
  );
};

export default Add;
