import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [isIncomeVisible, setIsIncomeVisible] = useState(true);
  const [isStatusVisible, setIsStatusVisible] = useState(true);

  const [newAmounts, setNewAmounts] = useState({});
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // 用於放大查看收據的狀態
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const fetchAllOrders = async () => {
    if (!token) return null;
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
      console.log("Error fetching data");
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
      toast.error(error.message);
    }
  };

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
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAmountChange = (orderId, value) => {
    setNewAmounts({ ...newAmounts, [orderId]: value });
  };

  const handleAmountBlur = (orderId) => {
    setEditingOrderId(null);
    updateOrderAmount(orderId);
  };

  const handleKeyPress = (event, orderId) => {
    if (event.key === "Enter") handleAmountBlur(orderId);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // 排序與過濾
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredOrders = sortedOrders.filter((order) => {
    const searchTermLower = searchTerm.toLowerCase();
    const orderNumberMatch = String(order.orderNumber).toLowerCase().includes(searchTermLower);
    const emailMatch = (order.userId?.email || order.userEmail || "").toLowerCase().includes(searchTermLower);
    return orderNumberMatch || emailMatch;
  });

  const finalFilteredOrders = selectedStatus === "All"
    ? filteredOrders
    : filteredOrders.filter((order) => order.status === selectedStatus);

  // 計算統計數據
  const incomeByMonth = finalFilteredOrders.reduce((acc, order) => {
    if (order.status === "Cancelled") return acc;
    const month = new Date(order.date).toLocaleString("default", { month: "long", year: "numeric" });
    if (!acc[month]) acc[month] = { totalIncome: 0, orderCount: 0, totalItems: 0 };
    acc[month].totalIncome += order.amount;
    acc[month].orderCount += 1;
    acc[month].totalItems += order.items.reduce((sum, item) => sum + item.quantity, 0);
    return acc;
  }, {});

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const allStatuses = ["Payment Processing", "Goods Arrangement in Progress", "Delivery in Progress", "Shipped", "Order Completed", "Cancelled"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Completed": return "bg-green-500";
      case "Delivery in Progress": return "bg-yellow-500";
      case "Shipped": return "bg-blue-500";
      case "Payment Processing": return "bg-orange-500";
      case "Cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* 圖片放大 Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-all"
          onClick={() => setShowModal(false)}
        >
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <button className="absolute -top-12 right-0 text-white text-3xl font-light hover:rotate-90 transition-transform">✕</button>
            <img
              src={modalImage}
              alt="Receipt Full"
              className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl shadow-blue-500/20"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="mt-4 text-gray-400 text-sm tracking-widest uppercase">Click anywhere to close</p>
          </div>
        </div>
      )}

      {/* 營收統計 */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <button onClick={() => setIsIncomeVisible(!isIncomeVisible)} className="text-lg font-bold text-gray-800 flex items-center gap-2">
          {isIncomeVisible ? "▼" : "▶"} Total Income by Month
        </button>
        {isIncomeVisible && (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-left text-xs uppercase tracking-wider">
                  <th className="p-3 border-b">Month</th>
                  <th className="p-3 border-b">Income</th>
                  <th className="p-3 border-b">Orders</th>
                  <th className="p-3 border-b">Items</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {Object.entries(incomeByMonth).map(([month, data], index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 border-b font-medium">{month}</td>
                    <td className="p-3 border-b text-blue-600 font-bold">{currency}{data.totalIncome.toFixed(2)}</td>
                    <td className="p-3 border-b">{data.orderCount}</td>
                    <td className="p-3 border-b text-gray-500">{data.totalItems}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 搜尋與過濾器 */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h3 className="text-2xl font-black text-gray-800">ORDERS</h3>
        <div className="flex w-full md:w-auto gap-2">
          <input
            type="text"
            placeholder="Search Order # or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg text-sm bg-white"
          >
            <option value="All">All Status</option>
            {allStatuses.map((status, index) => <option key={index} value={status}>{status}</option>)}
          </select>
        </div>
      </div>

      {/* 訂單列表 */}
      <div className="space-y-4">
        {finalFilteredOrders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[100px_2fr_1fr_1fr_1fr_1fr] gap-4 items-start border border-gray-200 bg-white p-6 rounded-xl hover:border-blue-300 transition-colors shadow-sm"
            key={index}
          >
            {/* 1. 收據預覽 */}
            <div className="flex flex-col items-center gap-2">
              <img className="w-8 opacity-20" alt="" />
              {order.receiptImage ? (
                <div
                  className="relative cursor-pointer group"
                  onClick={() => { setModalImage(order.receiptImage); setShowModal(true); }}
                >
                  <img
                    src={order.receiptImage}
                    alt="Receipt"
                    className="w-20 h-20 object-cover rounded-lg border-2 border-blue-100 group-hover:border-blue-500 transition-all shadow-sm"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity">
                    <span className="text-[10px] text-white font-bold bg-blue-600 px-2 py-0.5 rounded">VIEW</span>
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-300">
                  <span className="text-xl">✕</span>
                  <span className="text-[9px] font-bold">NO RECEIPT</span>
                </div>
              )}
            </div>

            {/* 2. 訂單內容 */}
            <div className="text-sm">
              <p className="font-bold text-gray-900 mb-2">Order: {order.orderNumber}</p>
              <div className="space-y-1 text-gray-600">
                {order.items.map((item, i) => (
                  <p key={i} className="text-xs">
                    • {item.name} x {item.quantity} <span className="text-blue-500">[{item.size}]</span>
                  </p>
                ))}
              </div>
              <div className="mt-4 pt-2 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Login Account</p>
                <p className="text-xs text-blue-600 font-medium truncate">{order.userId?.email || order.userEmail || "Guest User"}</p>
              </div>
            </div>

            {/* 3. 收件資訊 */}
            <div className="text-xs text-gray-600">
              <p className="font-bold text-gray-800 mb-1">{order.address.firstName} {order.address.lastName}</p>
              <p>{order.address.phone}</p>
              <p className="mt-1 text-gray-400">{order.address.street}</p>
              <p className="text-gray-400">{order.address.city}, {order.address.state}</p>
            </div>

            {/* 4. 付款方式 */}
            <div className="text-xs">
              <p className="font-bold text-gray-800 mb-1">Payment</p>
              <p className="text-gray-500 italic lowercase">{order.paymentMethod}</p>
              <p className={`mt-2 font-black ${order.payment ? 'text-green-600' : 'text-orange-500'}`}>
                {order.payment ? "PAID" : "PENDING"}
              </p>
              <p className="text-gray-400 text-[10px] mt-1">{new Date(order.date).toLocaleDateString()}</p>
            </div>

            {/* 5. 金額修改 */}
            <div className="text-right">
              {editingOrderId === order._id ? (
                <input
                  type="number"
                  autoFocus
                  value={newAmounts[order._id] || order.amount}
                  onChange={(e) => handleAmountChange(order._id, e.target.value)}
                  onBlur={() => handleAmountBlur(order._id)}
                  onKeyPress={(e) => handleKeyPress(e, order._id)}
                  className="w-20 text-right border-b-2 border-blue-500 outline-none font-bold text-lg bg-transparent"
                />
              ) : (
                <p
                  className="text-lg font-black text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => {
                    setEditingOrderId(order._id);
                    setNewAmounts({ ...newAmounts, [order._id]: order.amount });
                  }}
                >
                  {currency}{order.amount}
                </p>
              )}
            </div>

            {/* 6. 狀態管理 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
              </div>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg font-bold outline-none focus:border-blue-500"
              >
                {allStatuses.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;