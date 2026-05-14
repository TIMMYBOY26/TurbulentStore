import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [isIncomeVisible, setIsIncomeVisible] = useState(true);
  const [newAmounts, setNewAmounts] = useState({});
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // 圖片放大 Modal 狀態
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const allStatuses = [
    "Payment Processing",
    "Goods Arrangement in Progress",
    "Delivery in Progress",
    "Shipped",
    "Order Completed",
    "Cancelled",
  ];

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } },
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("狀態已更新");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateOrderAmount = async (orderId) => {
    const amount = newAmounts[orderId];
    if (amount == null || amount <= 0) {
      setEditingOrderId(null);
      return;
    }
    try {
      const response = await axios.post(
        backendUrl + "/api/order/update-amount",
        { orderId, amount },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success("金額已更新");
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // 過濾邏輯：支援 訂單號、Email、姓名、電話 搜尋
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const orderNo = String(order.orderNumber).toLowerCase().includes(term);
    const email = (order.userId?.email || "").toLowerCase().includes(term);
    const name = (order.address?.firstName || "").toLowerCase().includes(term);
    const phone = (order.address?.phone || "").includes(term);

    const matchesSearch = orderNo || email || name || phone;
    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // 營收統計計算
  const incomeByMonth = filteredOrders.reduce((acc, order) => {
    if (order.status === "Cancelled") return acc;
    const month = new Date(order.date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) acc[month] = { totalIncome: 0, orderCount: 0 };
    acc[month].totalIncome += order.amount;
    acc[month].orderCount += 1;
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Completed":
        return "bg-green-500";
      case "Delivery in Progress":
        return "bg-yellow-500";
      case "Shipped":
        return "bg-blue-500";
      case "Payment Processing":
        return "bg-orange-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 圖片放大 Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <img
            src={modalImage}
            className="max-w-full max-h-[90vh] rounded shadow-2xl"
            alt="Receipt"
          />
        </div>
      )}

      {/* 營收統計區 */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <button
          onClick={() => setIsIncomeVisible(!isIncomeVisible)}
          className="text-lg font-bold flex items-center gap-2 outline-none"
        >
          {isIncomeVisible ? "▼" : "▶"} 月營收統計 (當前過濾範圍)
        </button>
        {isIncomeVisible && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {Object.entries(incomeByMonth).map(([month, data], i) => (
              <div
                key={i}
                className="p-4 bg-blue-50 rounded-xl border border-blue-100"
              >
                <p className="text-xs text-blue-600 font-bold uppercase">
                  {month}
                </p>
                <p className="text-2xl font-black text-blue-900">
                  {currency}
                  {data.totalIncome.toFixed(2)}
                </p>
                <p className="text-xs text-blue-400">
                  {data.orderCount} 筆訂單
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 搜尋與過濾 */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h3 className="text-2xl font-black text-gray-800 tracking-tight">
          訂單管理
        </h3>
        <div className="flex w-full md:w-auto gap-2">
          <input
            type="text"
            placeholder="搜尋單號 / 姓名 / 電話"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-200 p-2.5 rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-black outline-none transition-all"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-200 p-2.5 rounded-xl text-sm bg-white font-bold outline-none"
          >
            <option value="All">全部狀態</option>
            {allStatuses.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 訂單列表 */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-1 lg:grid-cols-[120px_2fr_1.5fr_1fr_1fr_1.2fr] gap-6 items-start bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all"
          >
            {/* 1. 收據 */}
            <div className="flex flex-col items-center">
              {order.receiptImage ? (
                <div
                  className="relative cursor-pointer group"
                  onClick={() => {
                    setModalImage(order.receiptImage);
                    setShowModal(true);
                  }}
                >
                  <img
                    src={order.receiptImage}
                    className="w-24 h-24 object-cover rounded-xl border-2 border-gray-50 group-hover:border-black transition-all"
                    alt="Receipt"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 rounded-xl transition-all">
                    <span className="text-[10px] text-white font-bold bg-black px-2 py-1 rounded">
                      查看
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
                  <span className="text-xs font-bold">無收據</span>
                </div>
              )}
            </div>

            {/* 2. 訂單內容 */}
            <div className="text-sm">
              <p className="font-black text-lg mb-1">#{order.orderNumber}</p>
              <div className="space-y-1">
                {order.items.map((item, i) => (
                  <p key={i} className="text-gray-600 text-xs">
                    <span className="font-bold text-black">• {item.name}</span>{" "}
                    x {item.quantity}{" "}
                    <span className="text-blue-500 font-medium">
                      ({item.size})
                    </span>
                  </p>
                ))}
              </div>
              <p className="mt-3 text-[10px] text-gray-400 font-bold uppercase">
                登入帳號
              </p>
              <p className="text-xs text-gray-500 truncate">
                {order.userId?.email || "Guest"}
              </p>
            </div>

            {/* 3. 收件資訊 (核心修改處) */}
            <div className="text-xs bg-blue-50/40 p-4 rounded-xl border border-blue-100/50">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">
                收件人詳情
              </p>
              <p className="font-bold text-gray-900 text-sm mb-1">
                {order.address.firstName}
              </p>
              <p className="flex items-center gap-1.5 text-gray-600 font-medium">
                <span className="text-blue-400 text-sm">📞</span>{" "}
                {order.address.phone}
              </p>
              <div className="mt-2 pt-2 border-t border-blue-100">
                <p className="text-gray-700 leading-relaxed font-medium">
                  {order.address.address || "未提供詳細地址"}
                </p>
              </div>
            </div>

            {/* 4. 付款詳情 */}
            <div className="text-xs">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                付款方式
              </p>
              <p className="font-bold text-gray-700">{order.paymentMethod}</p>
              <div
                className={`mt-2 inline-block px-2 py-1 rounded-md font-black ${order.payment ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
              >
                {order.payment ? "已確認付款" : "等待確認"}
              </div>
              <p className="text-gray-400 mt-2">
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>

            {/* 5. 金額修改 */}
            <div className="text-right">
              {editingOrderId === order._id ? (
                <input
                  type="number"
                  autoFocus
                  value={newAmounts[order._id] ?? order.amount}
                  onChange={(e) =>
                    setNewAmounts({
                      ...newAmounts,
                      [order._id]: e.target.value,
                    })
                  }
                  onBlur={() => {
                    setEditingOrderId(null);
                    updateOrderAmount(order._id);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                  className="w-20 text-right border-b-2 border-black outline-none font-black text-xl bg-transparent"
                />
              ) : (
                <p
                  className="text-xl font-black text-gray-900 cursor-pointer hover:text-blue-600 transition-all"
                  onClick={() => {
                    setEditingOrderId(order._id);
                    setNewAmounts({ ...newAmounts, [order._id]: order.amount });
                  }}
                >
                  {currency}
                  {order.amount}
                </p>
              )}
              <p className="text-[10px] text-gray-400 font-bold mt-1">
                點擊金額可修改
              </p>
            </div>

            {/* 6. 狀態切換 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}
                ></span>
                <span className="text-[10px] font-black text-gray-400 uppercase">
                  訂單狀態
                </span>
              </div>
              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
                className="text-xs p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-black transition-all cursor-pointer"
              >
                {allStatuses.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
