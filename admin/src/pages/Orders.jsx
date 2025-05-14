import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [isIncomeVisible, setIsIncomeVisible] = useState(true);
  const [isStatusVisible, setIsStatusVisible] = useState(true);

  // State to manage the new amount for each order
  const [newAmounts, setNewAmounts] = useState({});
  const [editingOrderId, setEditingOrderId] = useState(null);

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

  // Function to handle updating the order amount
  const updateOrderAmount = async (orderId) => {
    const amount = newAmounts[orderId];
    if (amount == null || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/update-amount",
        { orderId, amount },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order amount updated successfully.");
        await fetchAllOrders(); // Refresh the order list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleAmountChange = (orderId, value) => {
    setNewAmounts({
      ...newAmounts,
      [orderId]: value,
    });
  };

  const handleAmountBlur = (orderId) => {
    setEditingOrderId(null);
    updateOrderAmount(orderId);
  };

  const handleKeyPress = (event, orderId) => {
    if (event.key === "Enter") {
      handleAmountBlur(orderId);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Sort orders in descending order based on the order date
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Calculate total income and order count by month
  const incomeByMonth = sortedOrders.reduce((acc, order) => {
    const month = new Date(order.date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // Initialize the month entry if it doesn't exist
    if (!acc[month]) {
      acc[month] = { totalIncome: 0, orderCount: 0 };
    }

    // Update total income and order count
    acc[month].totalIncome += order.amount;
    acc[month].orderCount += 1;

    return acc;
  }, {});

  // Calculate order status counts
  const statusCounts = sortedOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  // List of all possible statuses
  const allStatuses = [
    "Payment Processing",
    "Delivery in Progress",
    "Goods Arrangement in Progress",
    "Shipped",
    "Order Completed",
    "Cancelled", // Add any other statuses you want to track
  ];

  return (
    <div>
      {/* Income Table Section */}
      <div className="my-4">
        <button
          onClick={() => setIsIncomeVisible(!isIncomeVisible)}
          className="text-lg font-semibold mb-2"
        >
          {isIncomeVisible ? "Hide" : "Show"} Total Income by Month
        </button>
        {isIncomeVisible && (
          <table className="min-w-full max-w-lg mx-auto border border-gray-300 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 p-1">Month</th>
                <th className="border border-gray-300 p-1">Total Income</th>
                <th className="border border-gray-300 p-1">Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(incomeByMonth).map(
                ([month, { totalIncome, orderCount }], index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-1">{month}</td>
                    <td className="border border-gray-300 p-1">
                      {currency}
                      {totalIncome.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-1">{orderCount}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Status Count Table Section */}
      <div className="my-4">
        <button
          onClick={() => setIsStatusVisible(!isStatusVisible)}
          className="text-lg font-semibold mb-2"
        >
          {isStatusVisible ? "Hide" : "Show"} Order Status Counts
        </button>
        {isStatusVisible && (
          <table className="min-w-full max-w-lg mx-auto border border-gray-300 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 p-1">Status</th>
                <th className="border border-gray-300 p-1">Count</th>
              </tr>
            </thead>
            <tbody>
              {allStatuses.map((status, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-1">{status}</td>
                  <td className="border border-gray-300 p-1">
                    {statusCounts[status] || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <h3>Orders</h3>

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
                <p>{order.address.street + ""}</p>
                <p>
                  {order.address.city +
                    "" +
                    order.address.state +
                    "" +
                    order.address.country +
                    "" +
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
                    ? "Payme, Delivery by SF Express"
                    : order.paymentMethod === "FPS"
                    ? "FPS, Delivery by SF Express"
                    : order.paymentMethod}
                </span>
              </p>
              <p>Payment : {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>

            {/* Editable Amount Field */}
            {editingOrderId === order._id ? (
              <input
                type="number"
                value={newAmounts[order._id] || order.amount}
                onChange={(e) => handleAmountChange(order._id, e.target.value)}
                onBlur={() => handleAmountBlur(order._id)}
                onKeyPress={(e) => handleKeyPress(e, order._id)}
                className="text-sm sm:text-[20px] border p-1 rounded"
              />
            ) : (
              <p
                className="text-sm sm:text-[20px] cursor-pointer"
                onClick={() => {
                  setEditingOrderId(order._id);
                  setNewAmounts({ ...newAmounts, [order._id]: order.amount });
                }}
              >
                {currency}
                {order.amount}
              </p>
            )}

            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold"
            >
              <option value="Payment Processing">Payment Processing</option>
              <option value="Delivery in Progress">Delivery in Progress</option>
              <option value="Goods Arrangement in Progress">
                Goods Arrangement in Progress
              </option>
              <option value="Shipped">Shipped</option>
              <option value="Order Completed">Order Completed</option>
              <option value="Cancelled">Cancelled</option>{" "}
              {/* Add options for all statuses */}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
