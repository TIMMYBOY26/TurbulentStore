import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

// Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 sm:w-96">
        <h2 className="text-xl font-bold mb-4">Confirm Your Order</h2>
        <p>*Please ensure you have sent payment capture</p>
        <br />
        <p>Are you sure you want to place this order?</p>
        <div className="flex justify-end mt-6">
          <button
            className="bg-gray-300 text-black px-3 py-1 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-black text-white px-3 py-1 rounded"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFreeDeliveryOpen, setIsFreeDeliveryOpen] = useState(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setIsModalOpen(true); // Open the confirmation modal
  };

  const handleConfirmOrder = async () => {
    setIsModalOpen(false); // Close the modal

    try {
      let orderItems = [];

      // Iterate over cartItems to build orderItems
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === itemId)
            );
            if (itemInfo) {
              orderItems.push({
                name: itemInfo.name,
                productId: itemInfo._id,
                size: size,
                quantity: cartItems[itemId][size],
              });
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      let response;
      switch (method) {
        case "cod":
          response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          break;
        case "payme":
          response = await axios.post(
            backendUrl + "/api/order/payme",
            orderData,
            { headers: { token } }
          );
          break;
        case "fps":
          response = await axios.post(
            backendUrl + "/api/order/fps",
            orderData,
            { headers: { token } }
          );
          break;
        case "paymeTradeIn":
          response = await axios.post(
            backendUrl + "/api/order/tradeInPersonPlaceOrderPayme",
            orderData,
            { headers: { token } }
          );
          break;
        case "fpsTradeIn":
          response = await axios.post(
            backendUrl + "/api/order/tradeInPersonPlaceOrderFps",
            orderData,
            { headers: { token } }
          );
          break;
        default:
          throw new Error("Invalid payment method selected.");
      }

      if (response.data.success) {
        setCartItems({});
        navigate("/orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred."
      );
    }
  };

  const handlePaymentMethodChange = (selectedMethod) => {
    setMethod(selectedMethod);
  };

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      >
        {/* Left Side */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"STEP 1: "} text2={" FILL INFORMATION"} />
          </div>
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="First Name"
            />
          </div>
          <input
            required
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Phone"
          />
        </div>
        {/* Right Side */}
        <div className="mt-8">
          <div className="mt-12">
            <div className="text-xl sm:text-2xl my-3">
              <Title text1={"STEP 2: "} text2={" SELECT PAYMENT METHOD"} />
            </div>

            {/* Grouped Button for Free Delivery by 順豐速運 */}
            <div className="border border-gray-300 rounded-lg p-4 mb-4">
              <button
                type="button"
                className="text-lg font-semibold mb-2 w-full text-left cursor-pointer"
                onClick={() => setIsFreeDeliveryOpen(!isFreeDeliveryOpen)}
              >
                Delivery by 順豐速運
                <h5>*Free delivery within Hong Kong area</h5>
                <h5>WhatsApp確認地址後預計兩星期到貨</h5>
              </button>
              {isFreeDeliveryOpen && (
                <div className="flex flex-col gap-3">
                  <div
                    onClick={() => handlePaymentMethodChange("payme")}
                    className="flex flex-col items-start border p-2 px-3 cursor-pointer w-full"
                  >
                    <p
                      className={`min-w-3.5 h-3.5 border rounded-full ${method === "payme" ? "bg-green-400" : ""
                        }`}
                    ></p>
                    <p className="text-gray-500 text-sm font-medium mx-4">
                      Delivery (By PayMe)
                    </p>
                    {method === "payme" && (
                      <ol className="list-decimal list-inside mt-2">
                        <li>
                          <a
                            href="https://payme.hsbc/69b506a1e1ac40f0a3ef436a57b245af"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Click me to PayMe
                          </a>
                          <br />
                          (If you using PC) scan QR code to PayMe
                          <img
                            className="h-40 w-40 mx-4"
                            src={assets.paymeCode}
                            alt="PayMe Code"
                          />
                        </li>
                        <li>
                          <a
                            href="https://wa.me/85293442688"
                            className="mt-3 text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Upload payment completed capture & delivery address
                            to us
                          </a>
                        </li>
                        <li>
                          <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 text-sm rounded w-full mt-2"
                          >
                            PLACE ORDER
                          </button>
                        </li>
                      </ol>
                    )}
                  </div>
                  <div
                    onClick={() => handlePaymentMethodChange("fps")}
                    className="flex flex-col items-start border p-2 px-3 cursor-pointer w-full"
                  >
                    <p
                      className={`min-w-3.5 h-3.5 border rounded-full ${method === "fps" ? "bg-green-400" : ""
                        }`}
                    ></p>
                    <p className="text-gray-500 text-sm font-medium mx-4">
                      Delivery (By FPS)
                    </p>
                    {method === "fps" && (
                      <ol className="list-decimal list-inside mt-2">
                        <li>FPS識別碼: 2394658</li>
                        <li>
                          <a
                            href="https://wa.me/85293442688"
                            className="mt-3 text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Send payment completed capture
                          </a>
                          (If you using PC) scan QR code to FPS
                          <img
                            className="h-40 w-40 mx-4"
                            src={assets.fpsCode}
                            alt="PayMe Code"
                          />
                        </li>
                        <li>
                          <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 text-sm rounded w-full mt-2"
                          >
                            PLACE ORDER
                          </button>
                        </li>
                      </ol>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Grouped Button for Trade in Person */}
            <div className="border border-gray-300 rounded-lg p-4 mb-4">
              <button
                type="button"
                className="text-lg font-semibold mb-2 w-full text-left cursor-pointer"
                onClick={() => setIsTradeInOpen(!isTradeInOpen)}
              >
                Trade in person
              </button>
              {isTradeInOpen && (
                <div>
                  <div
                    onClick={() => handlePaymentMethodChange("cod")}
                    className="flex flex-col items-start border p-2 px-3 cursor-pointer w-full mb-3"
                  >
                    <p
                      className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""
                        }`}
                    ></p>
                    <p className="text-gray-500 text-sm font-medium mx-4">
                      Trade in person (By cash)
                    </p>
                    {method === "cod" && (
                      <ol className="list-decimal list-inside mt-2">
                        <li>
                          <a
                            href="https://wa.me/85293442688"
                            className="mt-3 text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Arrange meet up with Whatsapp
                          </a>
                        </li>
                        <li>
                          <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 text-sm rounded w-full mt-2"
                          >
                            PLACE ORDER
                          </button>
                        </li>
                      </ol>
                    )}
                  </div>

                  <div
                    onClick={() => handlePaymentMethodChange("paymeTradeIn")}
                    className="flex flex-col items-start border p-2 px-3 cursor-pointer w-full mb-3"
                  >
                    <p
                      className={`min-w-3.5 h-3.5 border rounded-full ${method === "paymeTradeIn" ? "bg-green-400" : ""
                        }`}
                    ></p>
                    <p className="text-gray-500 text-sm font-medium mx-4">
                      Trade in person (By PayMe)
                    </p>
                    {method === "paymeTradeIn" && (
                      <ol className="list-decimal list-inside mt-2">
                        <li>
                          <a
                            href="https://payme.hsbc/69b506a1e1ac40f0a3ef436a57b245af"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Click me to PayMe
                          </a>
                          <br />
                          (If you using PC) scan QR code to PayMe
                          <img
                            className="h-40 w-40 mx-4"
                            src={assets.paymeCode}
                            alt="PayMe Code"
                          />
                        </li>
                        <li>
                          <a
                            href="https://wa.me/85293442688"
                            className="mt-3 text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Send payment completed capture
                          </a>
                        </li>
                        <li>
                          <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 text-sm rounded w-full mt-2"
                          >
                            PLACE ORDER
                          </button>
                        </li>
                      </ol>
                    )}
                  </div>

                  <div
                    onClick={() => handlePaymentMethodChange("fpsTradeIn")}
                    className="flex flex-col items-start border p-2 px-3 cursor-pointer w-full"
                  >
                    <p
                      className={`min-w-3.5 h-3.5 border rounded-full ${method === "fpsTradeIn" ? "bg-green-400" : ""
                        }`}
                    ></p>
                    <p className="text-gray-500 text-sm font-medium mx-4">
                      Trade in person (By FPS)
                    </p>
                    {method === "fpsTradeIn" && (
                      <ol className="list-decimal list-inside mt-2">
                        <li>FPS識別碼: 2394658</li>
                        <li>
                          <a
                            href="https://wa.me/85293442688"
                            className="mt-3 text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Send payment completed capture
                          </a>
                          (If you using PC) scan QR code to FPS
                          <img
                            className="h-40 w-40 mx-4"
                            src={assets.fpsCode}
                            alt="PayMe Code"
                          />
                        </li>
                        <li>
                          <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 text-sm rounded w-full mt-2"
                          >
                            PLACE ORDER
                          </button>
                        </li>
                      </ol>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CartTotal section */}
          <div className="mt-7 min-w-80">
            <CartTotal step="3" />
          </div>

          <div className="w-full flex justify-between mt-8">
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="bg-gray-300 text-black px-4 py-2 text-sm rounded flex items-center"
            >
              <span className="mr-2">←</span> {/* Left arrow */}
              BACK TO CART
            </button>
          </div>
        </div>
      </form>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmOrder}
      />
    </>
  );
};

export default PlaceOrder;
