import express from "express";
import {
  placeOrder,
  placeOrderPayme,
  placeOrderFps,
  tradeInPersonPlaceOrderPayme,
  tradeInPersonPlaceOrderFps,
  updateOrderReceipt,
  allOrders,
  userOrders,
  updateStatus,
  updateOrderAmount,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const orderRouter = express.Router();

// --- 管理員功能 (Admin Features) ---
// 這裡使用 adminAuth 驗證管理員身份
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.post("/update-amount", adminAuth, updateOrderAmount);

// --- 用戶下單功能 (Payment Features) ---

// 1. 現金支付 (COD) - 不涉及檔案上傳，維持原樣
orderRouter.post("/place", upload.none(), authUser, placeOrder);

// 2. 在線支付 (PayMe / FPS) 
// 🟢 順序關鍵：先 upload 解析 FormData，再 authUser 注入 userId
orderRouter.post(
  "/payme",
  upload.single('image'),
  authUser,
  placeOrderPayme
);

orderRouter.post(
  "/fps",
  upload.single('image'),
  authUser,
  placeOrderFps
);

// 3. 當面交收支付 (Trade in Person)
orderRouter.post(
  "/tradeInPersonPlaceOrderPayme",
  upload.single('image'),
  authUser,
  tradeInPersonPlaceOrderPayme
);

orderRouter.post(
  "/tradeInPersonPlaceOrderFps",
  upload.single('image'),
  authUser,
  tradeInPersonPlaceOrderFps
);

// --- 用戶個人功能 (User Features) ---

// 獲取該用戶的所有訂單
orderRouter.post("/userorders", authUser, userOrders);

// 🟢 補交/更新訂單截圖
// 同樣需要先由 upload 解析檔案，否則後續中間件拿不到資料
orderRouter.post(
  "/update-receipt",
  upload.single('image'),
  authUser,
  updateOrderReceipt
);

export default orderRouter;