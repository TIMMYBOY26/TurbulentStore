import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Modal 內部暫存狀態
  const [editPrice, setEditPrice] = useState("");
  const [editSizes, setEditSizes] = useState([]);
  const [editIsTicketAvailable, setEditIsTicketAvailable] = useState(false);
  const [editExternalLink, setEditExternalLink] = useState(""); // 新增：外部連結狀態

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("無法獲取產品列表");
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("確定要刪除此產品嗎？")) return;
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("產品已刪除");
        await fetchList();
      }
    } catch (error) {
      toast.error("刪除失敗");
    }
  };

  const openModal = (product) => {
    setCurrentProduct(product);
    setEditPrice(product.price);
    setEditIsTicketAvailable(product.isTicketAvailable || false);
    setEditExternalLink(product.externalLink || ""); // 初始化連結
    setEditSizes(JSON.parse(JSON.stringify(product.sizes || [])));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleSizeChange = (index, value) => {
    const updatedSizes = [...editSizes];
    updatedSizes[index].count = Number(value);
    setEditSizes(updatedSizes);
  };

  const handleSave = async () => {
    try {
      const payload = {
        id: currentProduct._id,
        price: Number(editPrice),
      };

      if (currentProduct.category === "Tickets") {
        payload.isTicketAvailable = editIsTicketAvailable;
        payload.externalLink = editExternalLink; // 傳送連結
      } else {
        payload.sizes = JSON.stringify(editSizes);
      }

      const response = await axios.post(
        backendUrl + "/api/product/update",
        payload,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("更新成功");
        closeModal();
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("更新失敗");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <ToastContainer position="bottom-right" />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Inventory Management</h2>
        <p className="text-xs font-bold text-gray-400 bg-white px-4 py-2 rounded-full border shadow-sm">
          TOTAL: {list.length} PRODUCTS
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* 表格標頭 */}
        <div className="hidden md:grid grid-cols-[1fr_3.5fr_1.5fr_1.5fr_1.2fr_0.8fr] items-center py-5 px-8 bg-gray-50/50 border-b text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
          <span>Preview</span>
          <span>Product Details</span>
          <span>Category</span>
          <span>Stock Status</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {/* 產品列表 */}
        <div className="divide-y divide-gray-50">
          {list.map((item) => (
            <div
              key={item._id}
              onClick={() => openModal(item)}
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3.5fr_1.5fr_1.5fr_1.2fr_0.8fr] items-center gap-4 py-6 px-8 hover:bg-gray-50 transition-all cursor-pointer text-sm group"
            >
              <img className="w-16 h-20 rounded-xl object-cover border bg-white shadow-sm group-hover:scale-105 transition-transform" src={item.image[0]} alt="" />
              <div>
                <p className="font-bold text-gray-900 text-base">{item.name}</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{item.subCategory}</p>
              </div>
              <p className="hidden md:block text-gray-500 font-medium">{item.category}</p>
              
              <div className="hidden md:block">
                {item.category === "Tickets" ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-gray-300 uppercase italic tracking-tighter">External System</span>
                    <span className="text-xs font-bold text-gray-400">N/A</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {item.sizes?.map(s => (
                      <span key={s.size} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold text-gray-500">
                        {s.size}: {s.count}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="font-black text-gray-900 text-base">{currency}{item.price}</p>

              <div className="flex justify-end md:justify-center">
                <button
                  onClick={(e) => { e.stopPropagation(); removeProduct(item._id); }}
                  className="p-3 hover:bg-red-50 text-red-300 hover:text-red-500 rounded-2xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 編輯彈窗 (MODAL) */}
      {isModalOpen && currentProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4 shadow-2xl">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight uppercase tracking-tighter">{currentProduct.name}</h3>
                  <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-[0.3em]">Configure Product</p>
                </div>
                <button onClick={closeModal} className="text-gray-300 hover:text-black transition-colors text-xl">✕</button>
              </div>

              {/* 價格編輯 */}
              <div className="mb-8">
                <label className="block text-[10px] font-black uppercase text-gray-300 mb-2 tracking-widest">Base Price ({currency})</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black transition-all font-black text-xl shadow-inner"
                />
              </div>

              {/* 條件渲染：Ticket 編輯區 vs 普通產品尺寸編輯區 */}
              {currentProduct.category === "Tickets" ? (
                <div className="space-y-6 mb-10">
                  {/* 外部連結編輯 */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-300 mb-2 tracking-widest">Ticket Provider URL</label>
                    <input
                      type="text"
                      placeholder="https://external-ticket.com..."
                      value={editExternalLink}
                      onChange={(e) => setEditExternalLink(e.target.value)}
                      className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black transition-all font-bold text-sm shadow-inner"
                    />
                  </div>

                  {/* 供應狀態開關 */}
                  <div className="p-6 bg-gray-50 rounded-[2rem] flex items-center justify-between shadow-inner">
                    <div>
                      <p className="text-sm font-black text-gray-800 uppercase tracking-tighter">Availability</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{editIsTicketAvailable ? "Live & Active" : "Sold Out / Hidden"}</p>
                    </div>
                    <button
                      onClick={() => setEditIsTicketAvailable(!editIsTicketAvailable)}
                      className={`w-16 h-9 flex items-center rounded-full p-1.5 transition-colors duration-500 ${editIsTicketAvailable ? "bg-black" : "bg-gray-200"}`}
                    >
                      <div className={`bg-white w-6 h-6 rounded-full shadow-lg transform transition-transform duration-300 ${editIsTicketAvailable ? "translate-x-7" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-10">
                  <label className="block text-[10px] font-black uppercase text-gray-300 mb-4 tracking-widest">Inventory Levels</label>
                  <div className="grid grid-cols-2 gap-4">
                    {editSizes.map((size, index) => (
                      <div key={size.size} className="flex items-center justify-between bg-gray-50 p-5 rounded-[1.5rem] shadow-inner border border-transparent hover:border-gray-200 transition-all">
                        <span className="font-black text-gray-900 uppercase text-xs">{size.size}</span>
                        <input
                          type="number"
                          value={size.count}
                          onChange={(e) => handleSizeChange(index, e.target.value)}
                          className="w-14 bg-white border border-gray-100 rounded-xl px-2 py-2 text-center outline-none focus:ring-2 focus:ring-black transition-all font-black text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 操作按鈕 */}
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex-[2] bg-black text-white text-[10px] font-black tracking-[0.3em] py-5 rounded-[1.5rem] hover:bg-gray-800 transition-all active:scale-[0.98] uppercase shadow-xl shadow-black/20"
                >
                  Save Changes
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 text-gray-400 text-[10px] font-black tracking-[0.2em] py-5 rounded-[1.5rem] hover:bg-gray-200 transition-all uppercase"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
