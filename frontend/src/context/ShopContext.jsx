import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 0;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  // Fetch User Email from Profile
  const getUserProfile = async (token) => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/profile`,
        {}, // Empty body, userId is handled by auth middleware
        { headers: { token } },
      );
      if (response.data.success) {
        setUserEmail(response.data.email);
      } else {
        // If request fails but connects, clear email to stop "Loading..."
        setUserEmail("");
      }
    } catch (error) {
      console.log("Error fetching profile:", error.message);
      setUserEmail(""); // Clear on error
    }
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((totalCount, sizes) => {
      return (
        totalCount + Object.values(sizes).reduce((sum, count) => sum + count, 0)
      );
    }, 0);
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((totalAmount, [itemId, sizes]) => {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo) {
        return (
          totalAmount +
          Object.entries(sizes).reduce((sum, [size, count]) => {
            return sum + itemInfo.price * count;
          }, 0)
        );
      }
      return totalAmount;
    }, 0);
  };

  // Initial Load
  useEffect(() => {
    getProductsData();
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
      getUserProfile(storedToken);
    }
  }, []);

  // Token change listener
  useEffect(() => {
    if (token) {
      getUserCart(token);
      getUserProfile(token);
    } else {
      setUserEmail("");
      setCartItems({});
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    setCartItems,
    navigate,
    backendUrl,
    setToken,
    token,
    userEmail, // Important: using userEmail
    getUserCart,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
