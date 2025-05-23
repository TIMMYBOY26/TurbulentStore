import express from "express";
import {
  placeOrder,
  placeOrderPayme,
  placeOrderFps,
  tradeInPersonPlaceOrderPayme,
  tradeInPersonPlaceOrderFps,
  allOrders,
  userOrders,
  updateStatus,
  updateOrderAmount, // Import the new function
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment Features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/payme", authUser, placeOrderPayme);
orderRouter.post("/fps", authUser, placeOrderFps);

// Trade in Person Payment Features
orderRouter.post(
  "/tradeInPersonPlaceOrderPayme",
  authUser,
  tradeInPersonPlaceOrderPayme
);
orderRouter.post(
  "/tradeInPersonPlaceOrderFps",
  authUser,
  tradeInPersonPlaceOrderFps
);

// User Feature
orderRouter.post("/userorders", authUser, userOrders);

// New route for updating order amount
orderRouter.post("/update-amount", adminAuth, updateOrderAmount); // Add this line

export default orderRouter;
