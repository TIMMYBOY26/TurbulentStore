import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = ({ token }) => {
  // Use an array for images to simplify state management
  const [images, setImages] = useState(Array(8).fill(null));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("TEES");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [sizeCount, setSizeCount] = useState({});

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes.map(size => ({ size, count: sizeCount[size] || 0 }))));

      // Append only existing images
      images.forEach((img, index) => {
        if (img) formData.append(`image${index + 1}`, img);
      });

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product added successfully!");
        // Reset form logic here if needed
      } else {
        toast.error(response.data.message || "Failed to add product.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred.");
    }
  };

  const handleSizeCountChange = (size, count) => {
    setSizeCount((prev) => ({
      ...prev,
      [size]: count,
    }));
  };

  return (
    <>
      <ToastContainer />
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Add Product</h1>
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col w-full items-start gap-3"
        >
          <div>
            <p className="mb-2 font-medium">Upload Image</p>
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <label key={index} htmlFor={`image${index}`} className="flex flex-col items-center">
                  <img
                    className="w-20 h-20 object-cover border cursor-pointer"
                    src={!image ? assets.upload_area : URL.createObjectURL(image)}
                    alt=""
                  />
                  <input
                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="w-full">
            <p className="mb-2 font-medium">Product name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full max-w-[500px] px-3 py-2 border rounded"
              type="text"
              placeholder="Type here"
              required
            />
          </div>

          <div className="w-full">
            <p className="mb-2 font-medium">Product description</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full max-w-[500px] px-3 py-2 border rounded"
              placeholder="Write content here"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
            <div>
              <p className="font-medium">Product category</p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="TEES">TEES</option>
                <option value="ACCESSORIES">ACCESSORIES</option>
                <option value="MUSIC">MUSIC</option>
                <option value="CD">CD</option>
              </select>
            </div>

            <div>
              <p className="mb-2 font-medium">Product Price</p>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                className="w-full px-3 py-2 sm:w-[120px] border rounded"
                type="number"
                placeholder="25"
                required
              />
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium">Product Sizes & Inventory</p>
            <div className="flex flex-wrap gap-3">
              {["S", "M", "L", "XL", "XXL", "STICKER", "MUSIC", "CD"].map((size) => (
                <div key={size} className="flex flex-col items-center border p-2 rounded">
                  <p
                    onClick={() =>
                      setSizes((prev) =>
                        prev.includes(size)
                          ? prev.filter((item) => item !== size)
                          : [...prev, size]
                      )
                    }
                    className={`${sizes.includes(size) ? "bg-blue-500 text-white" : "bg-slate-200"} px-3 py-1 cursor-pointer rounded transition-all`}
                  >
                    {size}
                  </p>
                  {sizes.includes(size) && (
                    <input
                      type="number"
                      min="0"
                      placeholder="Qty"
                      onChange={(e) => handleSizeCountChange(size, e.target.value)}
                      className="w-16 mt-2 border text-center text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <input
              onChange={() => setBestseller((prev) => !prev)}
              checked={bestseller}
              type="checkbox"
              id="bestseller"
            />
            <label className="cursor-pointer" htmlFor="bestseller">
              Add to bestseller
            </label>
          </div>

          <button type="submit" className="w-full py-3 mt-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
            ADD PRODUCT
          </button>
        </form>
      </div>
    </>
  );
};

export default Add;
