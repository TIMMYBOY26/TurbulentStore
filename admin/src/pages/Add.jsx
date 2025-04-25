import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify components
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);
  const [image6, setImage6] = useState(null);
  const [image7, setImage7] = useState(null);
  const [image8, setImage8] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("TEES");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [sizeCount, setSizeCount] = useState({}); // New state for size counts

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

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      image5 && formData.append("image5", image5);
      image6 && formData.append("image6", image6);
      image7 && formData.append("image7", image7);
      image8 && formData.append("image8", image8);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product added successfully!"); // Success toast
      } else {
        toast.error(response.data.message || "Failed to add product."); // Error toast
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred."); // Error toast for catch block
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
      <ToastContainer /> {/* Add ToastContainer here */}
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-3"
      >
        <div>
          <p className="mb-2">Upload Image</p>
          <div className="flex gap-2">
            <label htmlFor="image1">
              <img
                className="w-20"
                src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
                alt=""
              />
              <input
                onChange={(e) => setImage1(e.target.files[0])}
                type="file"
                id="image1"
                hidden
              />
            </label>
            <label htmlFor="image2">
              <img
                className="w-20"
                src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
                alt=""
              />
              <input
                onChange={(e) => setImage2(e.target.files[0])}
                type="file"
                id="image2"
                hidden
              />
            </label>
            <label htmlFor="image3">
              <img
                className="w-20"
                src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
                alt=""
              />
              <input
                onChange={(e) => setImage3(e.target.files[0])}
                type="file"
                id="image3"
                hidden
              />
            </label>
            <label htmlFor="image4">
              <img
                className="w-20"
                src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
                alt=""
              />
              <input
                onChange={(e) => setImage4(e.target.files[0])}
                type="file"
                id="image4"
                hidden
              />
            </label>
            <label htmlFor="image5">
              <img
                className="w-20"
                src={!image5 ? assets.upload_area : URL.createObjectURL(image5)}
                alt=""
              />
              <input
                onChange={(e) => setImage5(e.target.files[0])}
                type="file"
                id="image5"
                hidden
              />
            </label>
            <label htmlFor="image6">
              <img
                className="w-20"
                src={!image6 ? assets.upload_area : URL.createObjectURL(image6)}
                alt=""
              />
              <input
                onChange={(e) => setImage6(e.target.files[0])}
                type="file"
                id="image6"
                hidden
              />
            </label>
            <label htmlFor="image7">
              <img
                className="w-20"
                src={!image7 ? assets.upload_area : URL.createObjectURL(image7)}
                alt=""
              />
              <input
                onChange={(e) => setImage7(e.target.files[0])}
                type="file"
                id="image7"
                hidden
              />
            </label>
            <label htmlFor="image8">
              <img
                className="w-20"
                src={!image8 ? assets.upload_area : URL.createObjectURL(image8)}
                alt=""
              />
              <input
                onChange={(e) => setImage8(e.target.files[0])}
                type="file"
                id="image8"
                hidden
              />
            </label>
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2">Product name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Type here"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2">Product description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full max-w-[500px] px-3 py-2"
            placeholder="Write content here"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div>
            <p>Product category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2"
            >
              <option value="TEES">TEES</option>
              <option value="ACCESSORIES">ACCESSORIES</option>
            </select>
          </div>

          <div>
            <p className="mb-2">Product Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-3 py-2 sm:w-[120px]"
              type="number"
              placeholder="25"
              required
            />
          </div>
        </div>

        <div>
          <p className="mb-2">Product Sizes</p>
          <div className="flex gap-3">
            {["S", "M", "L", "XL", "XXL", "STICKER"].map((size) => (
              <div key={size} className="flex flex-col items-center">
                <p
                  onClick={() =>
                    setSizes((prev) =>
                      prev.includes(size)
                        ? prev.filter((item) => item !== size)
                        : [...prev, size]
                    )
                  }
                  className={`${sizes.includes(size) ? "bg-blue-300" : "bg-slate-200"
                    } px-3 py-1 cursor-pointer`}
                >
                  {size}
                </p>
                {sizes.includes(size) && (
                  <input
                    type="number"
                    min="0"
                    placeholder="Count"
                    onChange={(e) => handleSizeCountChange(size, e.target.value)}
                    className="w-16 mt-1"
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

        <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
          ADD
        </button>
      </form>
    </>
  );
};

export default Add;
