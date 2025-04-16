import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      // Iterate over cartItems to build orderItems
      for (const itemId in cartItems) { // Make sure itemId corresponds to product IDs
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === itemId));
            if (itemInfo) {
              // Include productId, size, and quantity in orderItems
              orderItems.push({
                name: itemInfo.name,
                productId: itemInfo._id, // Ensure productId is included
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
        amount: getCartAmount() + delivery_fee
      };

      // API call based on selected payment method
      let response;
      switch (method) {
        case 'cod':
          response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
          break;
        case 'payme':
          response = await axios.post(backendUrl + '/api/order/payme', orderData, { headers: { token } });
          break;
        case 'fps':
          response = await axios.post(backendUrl + '/api/order/fps', orderData, { headers: { token } });
          break;
        default:
          throw new Error("Invalid payment method selected.");
      }

      // Handle the response from the server
      if (response.data.success) {
        setCartItems({});
        navigate('/orders');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "An unknown error occurred.");
    }
  };


  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={""} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="firstName" value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First Name"
          />
          <input required onChange={onChangeHandler} name="lastName" value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last Name"
          />
        </div>
        {/* <input required onChange={onChangeHandler} name="email" value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email address"
        />
        <input onChange={onChangeHandler} name="street" value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input onChange={onChangeHandler} name="city" value={formData.city}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <input onChange={onChangeHandler} name="state" value={formData.state}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input onChange={onChangeHandler} name="zipcode" value={formData.zipcode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
          />
          <input onChange={onChangeHandler} name="country" value={formData.country}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div> */}
        <input required onChange={onChangeHandler} name="phone" value={formData.phone}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone"
        />
      </div>
      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={""} text2={"PAYMENT METHOD"} />
          {/* Payment method selection */}
          <div className="flex gap-3 flex-col lg:flex-row">

            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                現金交收
              </p>
            </div>

            <div
              onClick={() => setMethod("payme")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "payme" ? "bg-green-400" : ""}`}
              ></p>
              {/* Conditionally render the PayMe logo */}
              {method !== "payme" && (
                <img
                  className="h-10 w-auto mx-4"
                  src={assets.paymeLogo}
                  alt="Payment Method"
                />
              )}
              {/* Conditionally render the PayMe code image and link */}
              {method === "payme" && (
                <div className="mt-4">
                  <a
                    href="https://payme.hsbc/turbulentstore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline mt-4 ml-5"
                  >
                    按我連結至PayMe
                  </a>
                  <img
                    className="h-40 w-40 mx-4"
                    src={assets.paymeCode}
                    alt="PayMe Code"
                  />

                </div>
              )}
            </div>

            <div
              onClick={() => setMethod("fps")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "fps" ? "bg-green-400" : ""}`}
              ></p>
              <img
                className="h-10 w-10 mx-4"
                src={assets.fpsLogo}
                alt="Payment Method"
              />
              {/* Conditionally render the PayMe code image and link */}
              {method === "fps" && (
                <div className="mt-4">
                  <p>FPS識別碼: 117417618</p>
                </div>
              )}
            </div>

          </div>

          <div>
            <p className="text-left  text-red-600 px-16 py-3 text-sm">*付款後請按"確認訂單"完成下單程序</p>
            <p className="text-left   text-red-600 px-16 py-3 text-sm">*如需順豐送貨 稍後將會以whatsapp聯絡 確認運送詳情</p>
          </div>


          <div className="w-full text-end mt-8">
            <button type="submit" className="bg-black text-white px-16 py-3 text-sm">
              確認訂單
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
