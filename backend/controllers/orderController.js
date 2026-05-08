import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

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

// --- 輔助函式：生成訂單號 (修正 196 + 1 = 1961 的問題) ---
const generateOrderNumber = async () => {
  const lastOrder = await orderModel.findOne().sort({ orderNumber: -1 }).exec();
  if (lastOrder) {
    // 使用 parseInt 確保是數字相加，避免字串連接導致 1961
    return parseInt(lastOrder.orderNumber, 10) + 1;
  }
  return 1;
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

    // 前端 FormData 傳來的 JSON 字串解析
    const items = JSON.parse(req.body.items);
    const address = JSON.parse(req.body.address);

    const orderNumber = await generateOrderNumber();

    // 1. 處理圖片上傳
    let receiptUrl = "";
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        folder: "Payment_record",
      });
      receiptUrl = imageUpload.secure_url;
    }

    // 2. 核心邏輯：狀態自動分流
    // 如果有收據 -> 備貨中 (Goods Arrangement in Progress)
    // 如果沒收據 -> 待付款 (Payment Processing)
    const currentStatus = receiptUrl ? "Goods Arrangement in Progress" : "Payment Processing";

    const orderData = {
      userId,
      items,
      address,
      amount: Number(amount),
      paymentMethod: methodLabel,
      payment: false,
      date: Date.now(),
      orderNumber,
      receiptImage: receiptUrl,
      status: currentStatus, // 自動設定狀態
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save({ session });

    // 扣減庫存
    await reduceProductSizeCount(items, session);

    // 更新用戶名與清空購物車
    await userModel.findByIdAndUpdate(userId, { name: address.firstName, cartData: {} }, { session });

    // 發送 Telegram
    const statusText = receiptUrl ? "✅ 已附上截圖 (備貨中)" : "⚠️ 待補交截圖 (待處理)";
    const message = `🔔 收到新訂單 (#${orderNumber})\n金額: $${amount}\n付款方式: ${methodLabel}\n狀態: ${currentStatus}\n${statusText}`;
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

// --- 付款方式分流 ---
const placeOrder = (req, res) => processOrder(req, res, "COD", true);
const placeOrderPayme = (req, res) => processOrder(req, res, "PayMe");
const placeOrderFps = (req, res) => processOrder(req, res, "FPS");
const tradeInPersonPlaceOrderPayme = (req, res) => processOrder(req, res, "paymeTradeIn");
const tradeInPersonPlaceOrderFps = (req, res) => processOrder(req, res, "fpsTradeIn");

/**
 * 補傳截圖功能：自動更新狀態
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

    // 補傳截圖後，將狀態從 Payment Processing 改為 Goods Arrangement in Progress
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        receiptImage: imageUpload.secure_url,
        status: "Goods Arrangement in Progress"
      },
      { new: true }
    );

    const message = `📸 訂單補交截圖 (#${updatedOrder.orderNumber})\n狀態已更新為: Goods Arrangement in Progress\n客戶: ${updatedOrder.address.firstName}`;
    await sendTelegramNotification("-1002324020435", message);

    res.json({ success: true, message: "收據已更新，訂單進入備貨流程", receiptImage: imageUpload.secure_url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// --- 管理功能 ---
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate('userId', 'email').sort({ orderNumber: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
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
  updateOrderReceipt,
  allOrders,
  userOrders,
  updateStatus,
  updateOrderAmount,
};