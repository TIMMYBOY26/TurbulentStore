import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { assets } from "../assets/assets";

const Order = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const groupedOrders = {};

        response.data.orders.forEach((order) => {
          const orderNumber = order.orderNumber;
          if (!groupedOrders[orderNumber]) {
            groupedOrders[orderNumber] = {
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              amount: order.amount,
              items: [],
            };
          }
          order.items.forEach((item) => {
            groupedOrders[orderNumber].items.push({
              ...item,
              orderNumber,
            });
          });
        });

        const allOrdersItem = Object.values(groupedOrders);
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Error loading order data:", error);
    }
  };

  useEffect(() => {
    loadOrderData();
    window.scrollTo(0, 0);
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text2={"MY ORDER"} />
      </div>

      <p className="mt-4 text-gray-600">
        If you have any problems with your order, please click{" "}
        <a href="/contact" className="text-blue-600 underline">
          here
        </a>{" "}
        to contact us.
      </p>

      <div>
        {orderData.map((order, index) => (
          <div
            key={index}
            className="py-4 border-b text-gray-700 flex flex-col gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <div className="w-16 sm:w-20 bg-gray-200 flex items-center justify-center">
                <img src={assets.parcel_icon} alt="" />
              </div>

              <div>
                <p className="text-gray-500">
                  Order Number: {order.items[0].orderNumber}
                </p>
                <p className="sm:text-base font-medium">Items:</p>
                {order.items.map((item, itemIndex) => (
                  <p key={itemIndex} className="text-gray-600">
                    {item.name} - Size: {item.size} - Quantity: {item.quantity}
                  </p>
                ))}
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p>
                    Total: {currency}
                    {order.amount}
                  </p>
                  <p>
                    Quantity:{" "}
                    {order.items.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </p>
                </div>
                <p className="mt-1">
                  Order Date:{" "}
                  <span className="text-gray-600">
                    {new Date(order.date).toDateString()}
                  </span>
                </p>
                <p className="mt-1">
                  Payment:{" "}
                  <span className="text-gray-600">
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
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{order.status}</p>
              </div>
              {/* <button
                onClick={loadOrderData}
                className="border px-4 py-2 text-sm font-medium rounded-sm"
              >
                Track Order
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
