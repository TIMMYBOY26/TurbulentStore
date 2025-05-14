import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify components
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editPriceId, setEditPriceId] = useState(null); // State to track the product price being edited
  const [newPrice, setNewPrice] = useState(""); // State to track the new price
  const [editSizeId, setEditSizeId] = useState(null); // State to track the size being edited
  const [newSizeCount, setNewSizeCount] = useState(""); // State to track the new size count
  const [sizeToEdit, setSizeToEdit] = useState(null); // State to track which size is being edited

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
        toast.success("Product removed!"); // Success toast for removal
        await fetchList(); // Refresh the list after removal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message); // Error toast for catch block
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
        toast.success("Product updated!"); // Success toast for update
        setEditPriceId(null); // Exit price editing mode
        await fetchList(); // Refresh the list after update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message); // Error toast for catch block
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
        toast.success("Size count updated!"); // Success toast for size count update
        setEditSizeId(null); // Exit size editing mode
        setNewSizeCount(""); // Clear new size count
        await fetchList(); // Refresh the list after update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message); // Error toast for catch block
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

  useEffect(() => {
    fetchList(); // Fetch the product list on component mount
  }, []);

  return (
    <>
      <ToastContainer /> {/* Add ToastContainer here */}
      <p className="mb-2">All Product List</p>
      <div className="flex flex-col gap-2">
        {/* List table title  */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Sizes</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* product list */}
        {list.map((item) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={item._id}
          >
            <img className="w-12" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <div>
              {/* Display sizes and counts */}
              {item.sizes && item.sizes.length > 0 ? (
                <div className="flex flex-col">
                  {item.sizes.map((size) => (
                    <div key={size.size} className="flex items-center">
                      {editSizeId === size.size && sizeToEdit === item._id ? (
                        <input
                          type="text"
                          value={newSizeCount}
                          onChange={(e) => setNewSizeCount(e.target.value)}
                          onBlur={() => updateSizeCount(item._id, size)} // Update size on input blur
                          onKeyDown={(e) =>
                            handleSizeKeyDown(e, item._id, size)
                          } // Handle Enter key
                          className="border p-1 w-16"
                          autoFocus
                        />
                      ) : (
                        <p
                          onClick={() => {
                            setEditSizeId(size.size);
                            setSizeToEdit(item._id);
                            setNewSizeCount(size.count);
                          }}
                          className="cursor-pointer"
                        >
                          {size.size}: {size.count}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No sizes available</p>
              )}
            </div>
            {editPriceId === item._id ? (
              <input
                type="text"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                onBlur={() => updateProduct(item._id, newPrice)} // Update product on input blur
                onKeyDown={(e) => handleKeyDown(e, item._id)}
                className="border p-1"
                autoFocus
              />
            ) : (
              <p
                onClick={() => {
                  setEditPriceId(item._id);
                  setNewPrice(item.price);
                }}
                className="cursor-pointer"
              >
                {currency}
                {item.price}
              </p>
            )}
            <p
              onClick={() => removeProduct(item._id)}
              className="text-right md:text-center cursor-pointer text-lg"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
