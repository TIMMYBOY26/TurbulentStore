import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editPriceId, setEditPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [editSizeId, setEditSizeId] = useState(null);
  const [newSizeCount, setNewSizeCount] = useState("");
  const [sizeToEdit, setSizeToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product removed!");
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const updateProduct = async (id, price) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/update",
        { id, price },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product updated!");
        setEditPriceId(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const updateSizeCount = async (productId, size) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/update",
        {
          id: productId,
          sizes: JSON.stringify([{ size: size.size, count: newSizeCount }]),
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Size count updated!");
        setEditSizeId(null);
        setNewSizeCount("");
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateProduct(id, newPrice);
    }
  };

  const handleSizeKeyDown = (e, productId, size) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateSizeCount(productId, size);
    }
  };

  const openModal = (product) => {
    setCurrentProduct(product);
    setNewPrice(product.price);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setNewSizeCount("");
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <ToastContainer position="bottom-right" />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Inventory</h2>
        <p className="text-sm text-gray-500">Total Products: {list.length}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1.5fr_1.5fr_1.2fr_0.8fr] items-center py-4 px-6 bg-gray-100 border-b text-gray-600 font-semibold text-sm uppercase tracking-wider">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Stock/Sizes</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {/* Product List */}
        <div className="divide-y divide-gray-200">
          {list.map((item) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1.5fr_1.5fr_1.2fr_0.8fr] items-center gap-4 py-4 px-6 hover:bg-gray-50 transition-colors text-sm text-gray-700"
              key={item._id}
              onClick={() => openModal(item)} // Open modal on click
            >
              {/* Product Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden border bg-gray-200">
                <img className="w-full h-full object-cover" src={item.image[0]} alt={item.name} />
              </div>

              {/* Name */}
              <p className="font-medium text-gray-900 truncate pr-2">{item.name}</p>

              {/* Category */}
              <p className="hidden md:block text-gray-500">{item.category}</p>

              {/* Sizes/Stock */}
              <div className="hidden md:block">
                {item.sizes && item.sizes.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {item.sizes.map((size) => (
                      <div key={size.size}>
                        <p className="text-gray-400 font-bold">{size.size}:</p>
                        <span className="font-medium">{size.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No sizes</span>
                )}
              </div>

              {/* Price */}
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {currency}{item.price}
                </p>
              </div>

              {/* Delete Action */}
              <div className="flex justify-end md:justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent modal from opening
                    removeProduct(item._id);
                  }}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-all group"
                  title="Remove Product"
                >
                  <svg xmlns="http://www.w3.org" className="h-5 w-5 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Editing Product */}
      {isModalOpen && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 sm:w-1/3">
            <h3 className="text-xl font-bold mb-4">{currentProduct.name}</h3> {/* Show full product name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-full outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Size Stock</label>
              {currentProduct.sizes.map((size) => (
                <div key={size.size} className="flex items-center mb-2">
                  <span className="text-gray-500">{size.size}:</span>
                  <input
                    type="number"
                    value={sizeToEdit === size.size ? newSizeCount : size.count}
                    onChange={(e) => {
                      setSizeToEdit(size.size);
                      setNewSizeCount(e.target.value);
                    }}
                    className="border border-gray-300 rounded px-2 py-1 w-16 ml-2 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  updateProduct(currentProduct._id, newPrice);
                  currentProduct.sizes.forEach((size) => {
                    if (size.size === sizeToEdit) {
                      updateSizeCount(currentProduct._id, size);
                    }
                  });
                  closeModal();
                }}
                className="bg-blue-600 text-white rounded px-4 py-2"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="ml-2 bg-gray-300 text-gray-700 rounded px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
