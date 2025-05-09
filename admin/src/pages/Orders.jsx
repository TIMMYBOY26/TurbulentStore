import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("no data fetched here");
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Sort orders in descending order based on the order date
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {sortedOrders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-x-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="" />
            <div>
              <p className="text-sm sm:text-[15px]">
                Order Number : {order.orderNumber}
              </p>
              <hr />
              <div>
                {order.items.map((item, itemIndex) => (
                  <p className="py-0.5" key={itemIndex}>
                    {item.name} x {item.quantity} <span>{item.size}</span>
                    {itemIndex < order.items.length - 1 && ","}
                  </p>
                ))}
              </div>
              <p className="text-sm sm:text-[17px] mt-3 mb-2 font-medium">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    "," +
                    order.address.state +
                    "," +
                    order.address.country +
                    "," +
                    order.address.zipcode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Items : {order.items.length}
              </p>
              <p className="mt-3">
                Method:{" "}
                <span>
                  {order.paymentMethod === "paymeTradeIn"
                    ? "Payme, In-person delivery"
                    : order.paymentMethod === "fpsTradeIn"
                    ? "FPS, In-person delivery"
                    : order.paymentMethod === "COD"
                    ? "Cash, In-person delivery"
                    : order.paymentMethod === "PayMe"
                    ? "Payme, delivery by SF Express"
                    : order.paymentMethod === "FPS"
                    ? "FPS, delivery by SF Express"
                    : order.paymentMethod}
                </span>
              </p>
              <p>Payment : {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[20px]">
              {currency}
              {order.amount}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold"
            >
              <option value="Payment processing">Payment processing</option>
              <option value="Delivery in Progress">Delivery in Progress</option>
              <option value="Goods Arrangement in Progress">
                Goods Arrangement in Progress
              </option>
              <option value="Shipped">Shipped</option>
              <option value="Order Completed">Order Completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
