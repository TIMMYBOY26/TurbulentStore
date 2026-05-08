import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary"; // 確保你有引入 cloudinary

// --- 輔助函式：發送 Telegram ---
const sendTelegramNotification = async (chatId, message) => {
  const token = "7804211306:AAHkJwg-ejrIB4evQ-EHQpCV8UJJB8eQaoY";
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    await axios.post(url, { chat_id: chatId, text: message });
  } catch (error) {
    console.error(`Telegram Error: ${error.message}`);
  }
};

// --- 輔助函式：生成訂單號 ---
const generateOrderNumber = async () => {
  const lastOrder = await orderModel.findOne().sort({ orderNumber: -1 }).exec();
  return lastOrder ? lastOrder.orderNumber + 1 : 1;
};

// --- 輔助函式：扣減庫存 ---
const reduceProductSizeCount = async (items, session) => {
  for (const item of items) {
    const { productId, size, quantity, name } = item;
    const result = await productModel.findOneAndUpdate(
      { _id: productId, "sizes.size": size },
      { $inc: { "sizes.$.count": -quantity } },
      { session, new: true }
    );
    if (result) {
      const updatedSize = result.sizes.find((s) => s.size === size);
      if (updatedSize.count === 0) {
        await sendTelegramNotification("-1002324020435", `❌ 售罄通知:\n產品: ${name}\n尺寸: ${size}`);
      } else if (updatedSize.count <= 10) {
        await sendTelegramNotification("-1002324020435", `⚠️ 低庫存警報:\n產品: ${name}\n尺寸: ${size}\n剩餘: ${updatedSize.count}`);
      }
    }
  }
};

/**
 * 通用處理下單邏輯
 */
const processOrder = async (req, res, methodLabel, isCOD = false) => {
  const session = await orderModel.startSession();
  session.startTransaction();
  try {
    const { userId, amount } = req.body;

    // 🟢 因為前端用 FormData，這裡必須解析 JSON 字串
    const items = JSON.parse(req.body.items);
    const address = JSON.parse(req.body.address);

    const orderNumber = await generateOrderNumber();

    // 🟢 處理圖片上傳 (Cloudinary)
    let receiptUrl = "";
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        folder: "Payment_record",
      });
      receiptUrl = imageUpload.secure_url;
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: methodLabel,
      payment: false,
      date: Date.now(),
      orderNumber,
      receiptImage: receiptUrl, // 儲存截圖 URL (選填)
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save({ session });

    await reduceProductSizeCount(items, session);

    // 更新用戶名稱及清空購物車
    await userModel.findByIdAndUpdate(userId, { name: address.firstName, cartData: {} }, { session });

    // 發送 Telegram
    const statusText = receiptUrl ? "✅ 已附上截圖" : "⚠️ 待補交截圖";
    const message = `🔔 收到新訂單 (#${orderNumber})\n金額: $${amount}\n付款方式: ${methodLabel}\n截圖狀態: ${isCOD ? "N/A" : statusText}`;
    await sendTelegramNotification("-1002324020435", message);

    await session.commitTransaction();
    res.json({ success: true, message: "Order Placed", orderNumber });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// --- 各種付款方式路由處理 ---
const placeOrder = (req, res) => processOrder(req, res, "COD", true);
const placeOrderPayme = (req, res) => processOrder(req, res, "PayMe");
const placeOrderFps = (req, res) => processOrder(req, res, "FPS");
const tradeInPersonPlaceOrderPayme = (req, res) => processOrder(req, res, "paymeTradeIn");
const tradeInPersonPlaceOrderFps = (req, res) => processOrder(req, res, "fpsTradeIn");

/**
 * 🟢 新功能：使用者在訂單列表補傳截圖
 */
const updateOrderReceipt = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!req.file) {
      return res.json({ success: false, message: "請選擇圖片上傳" });
    }

    const imageUpload = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: "Payment_record",
    });

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { receiptImage: imageUpload.secure_url },
      { new: true }
    );

    // 補傳截圖後發送通知給 Admin
    const message = `📸 訂單補交截圖 (#${updatedOrder.orderNumber})\n客戶: ${updatedOrder.address.firstName}\n金額: $${updatedOrder.amount}`;
    await sendTelegramNotification("-1002324020435", message);

    res.json({ success: true, message: "收據已成功更新", receiptImage: imageUpload.secure_url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// --- 其他管理功能 ---
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate('userId', 'email');
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateOrderAmount = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { amount }, { new: true });
    if (!updatedOrder) return res.json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Order amount updated", order: updatedOrder });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderPayme,
  placeOrderFps,
  tradeInPersonPlaceOrderPayme,
  tradeInPersonPlaceOrderFps,
  updateOrderReceipt, // 🟢 匯出新功能
  allOrders,
  userOrders,
  updateStatus,
  updateOrderAmount,
};