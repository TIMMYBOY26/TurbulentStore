import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return null;
      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const orders = response.data.orders || [];

        // 🟢 取代 .reverse()，改用時間戳排序
        const sortedOrders = orders.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        setOrderData(sortedOrders);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleReceiptUpload = async (e, orderId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('image', file);

    try {
      const response = await axios.post(backendUrl + '/api/order/update-receipt', formData, { headers: { token } });
      if (response.data.success) {
        toast.success("收據已上傳！");
        loadOrderData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className='border-t pt-16 px-4 sm:px-[5vw]'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className='mt-8'>
        {orderData.map((order, index) => (
          <div key={index} className='py-6 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
            <div className='flex items-start gap-6 text-sm'>


              <div>
                <p className='sm:text-base font-medium'>{order.items?.[0]?.name || "Unknown Product"}</p>
                <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                  <p>{currency}{order.amount}</p>
                  <p>Items: {order.items?.length || 0}</p>
                  <p>Method: <span className='uppercase'>{order.paymentMethod}</span></p>
                </div>
                <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(order.date).toDateString()}</span></p>
                <p className='mt-1 font-semibold'>Order ID: <span className='text-blue-500'>#{order.orderNumber || order._id?.slice(-6)}</span></p>
              </div>
            </div>

            <div className='md:w-1/2 flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <p className={`min-w-2 h-2 rounded-full ${order.payment ? 'bg-green-500' : 'bg-orange-500'}`}></p>
                <p className='text-sm md:text-base'>{order.status}</p>
              </div>

              <div className='flex flex-col items-end gap-3'>
                {/* 🟢 判斷是否需要顯示上傳按鈕 */}
                {(!order.payment && !order.receiptImage && order.paymentMethod !== 'COD') ? (
                  <label className='px-4 py-2 border text-xs font-bold rounded-lg bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 cursor-pointer transition-all flex items-center gap-2'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    UPLOAD RECEIPT
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleReceiptUpload(e, order._id)} />
                  </label>
                ) : order.receiptImage ? (
                  <div className='flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    RECEIPT SUBMITTED
                  </div>
                ) : null}

                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50 transition-colors'>Track Order</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders;