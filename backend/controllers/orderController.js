import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

// --- 工具：Telegram 通知 ---
const sendTelegramNotification = async (message) => {
  const token = "7804211306:AAHkJwg-ejrIB4evQ-EHQpCV8UJJB8eQaoY";
  const chatId = "-1002324020435";
  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
    });
  } catch (e) {
    console.error("Telegram Error", e.message);
  }
};

// --- 工具：通用下單邏輯 ---
const processOrder = async (req, res, methodLabel) => {
  const session = await orderModel.startSession();
  session.startTransaction();
  try {
    const { userId, amount } = req.body;
    const items = JSON.parse(req.body.items);
    const address = JSON.parse(req.body.address);

    // 1. 生成訂單號 (基於現有訂單數量 + 1)
    const lastOrder = await orderModel.findOne().sort({ orderNumber: -1 });
    const orderNumber = lastOrder
      ? String(parseInt(lastOrder.orderNumber) + 1)
      : "1";

    // 2. 處理圖片上傳 (Cloudinary)
    let receiptUrl = "";
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "Payment_record",
      });
      receiptUrl = upload.secure_url;
    }

    // 3. 判斷初始狀態
    const currentStatus = receiptUrl
      ? "Goods Arrangement in Progress"
      : "Payment Processing";

    // 4. 建立訂單資料
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
      status: currentStatus,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save({ session });

    // 5. 扣減庫存
    for (const item of items) {
      await productModel.findByIdAndUpdate(
        item.productId,
        { $inc: { "sizes.$[elem].count": -item.quantity } },
        { arrayFilters: [{ "elem.size": item.size }], session },
      );
    }

    // 6. 清空購物車並更新用戶名
    await userModel.findByIdAndUpdate(
      userId,
      { name: address.firstName, cartData: {} },
      { session },
    );

    // 7. 發送 Telegram 通知
    const statusIcon = receiptUrl ? "✅ 已附收據" : "⚠️ 待補交";
    await sendTelegramNotification(
      `🔔 新訂單 #${orderNumber}\n金額: $${amount}\n客戶: ${address.firstName}\n地址: ${address.address}\n方式: ${methodLabel}\n狀態: ${currentStatus} ${statusIcon}`,
    );

    await session.commitTransaction();
    res.json({ success: true, message: "Order Placed", orderNumber });
  } catch (error) {
    await session.abortTransaction();
    res.json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// --- 匯出功能 (Exported Methods) ---

// 用戶下單分流
export const placeOrder = (req, res) => processOrder(req, res, "COD");
export const placeOrderPayme = (req, res) => processOrder(req, res, "PayMe");
export const placeOrderFps = (req, res) => processOrder(req, res, "FPS");
export const tradeInPersonPlaceOrderPayme = (req, res) =>
  processOrder(req, res, "PayMe (Trade in Person)");
export const tradeInPersonPlaceOrderFps = (req, res) =>
  processOrder(req, res, "FPS (Trade in Person)");

// 獲取訂單 (管理員 & 用戶)
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 更新訂單 (狀態、金額、收據)
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateOrderAmount = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { amount: Number(amount) });
    res.json({ success: true, message: "Amount Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateOrderReceipt = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!req.file)
      return res.json({ success: false, message: "No image uploaded" });

    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "Payment_record",
    });
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        receiptImage: upload.secure_url,
        status: "Goods Arrangement in Progress",
      },
      { new: true },
    );

    await sendTelegramNotification(
      `📸 補交收據 (#${updatedOrder.orderNumber})\n客戶: ${updatedOrder.address.firstName}`,
    );
    res.json({
      success: true,
      message: "Receipt Updated",
      receiptImage: upload.secure_url,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
