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
  // 開啟資料庫事務流程 (Transaction)
  const session = await orderModel.startSession();
  session.startTransaction();
  try {
    const { userId, amount } = req.body;
    const items = JSON.parse(req.body.items);
    const address = JSON.parse(req.body.address);

    // 【步驟 1】初步安全防護：預先巡檢所有商品的尺寸庫存是否足夠
    for (const item of items) {
      const dbProduct = await productModel.findById(item._id).session(session);

      if (!dbProduct) {
        throw new Error(
          `找不到該項商品，可能已被下架: ${item.name || item._id}`,
        );
      }

      const sizeObj = dbProduct.sizes.find((s) => s.size === item.size);

      if (!sizeObj || sizeObj.count < item.quantity) {
        throw new Error(
          `商品「${dbProduct.name}」的尺寸 [${item.size}] 庫存不足！目前僅剩 ${sizeObj ? sizeObj.count : 0} 件，無法完成下單。`,
        );
      }
    }

    // 【步驟 2】生成流水訂單號 (基於資料庫現有最大訂單數 + 1)
    const lastOrder = await orderModel
      .findOne()
      .sort({ orderNumber: -1 })
      .session(session);
    const orderNumber = lastOrder
      ? String(parseInt(lastOrder.orderNumber) + 1)
      : "1";

    // 【步驟 3】處理付款截圖/收據圖片上傳至 Cloudinary
    let receiptUrl = "";
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "Payment_record",
      });
      receiptUrl = upload.secure_url;
    }

    // 【步驟 4】根據有無收據定義訂單初始狀態
    const currentStatus = receiptUrl
      ? "Goods Arrangement in Progress"
      : "Payment Processing";

    // 【步驟 5】寫入訂單至資料庫
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

    // 【步驟 6】🔒 核心修正：原子操作扣減庫存 + 樂觀鎖防禦
    for (const item of items) {
      const updateResult = await productModel.updateOne(
        {
          _id: item._id,
          // 關鍵防線：查詢條件必須限制該尺寸的庫存 count 必須大於或等於當前要買的數量
          sizes: {
            $elemMatch: {
              size: item.size,
              count: { $gte: Number(item.quantity) },
            },
          },
        },
        {
          $inc: { "sizes.$[elem].count": -Number(item.quantity) },
        },
        {
          arrayFilters: [{ "elem.size": item.size }],
          session,
        },
      );

      // 如果 modifiedCount 為 0，說明在步驟 1 到步驟 6 之間的毫秒級時間差內，庫存已經被別人扣走了
      if (updateResult.modifiedCount === 0) {
        throw new Error(
          `商品 ID [${item._id}] 尺寸 [${item.size}] 在下單時被搶購一空，庫存不足！`,
        );
      }
    }

    // 【步驟 7】清空用戶購物車並同步更新用戶名稱為收件人姓名
    await userModel.findByIdAndUpdate(
      userId,
      { name: address.firstName, cartData: {} },
      { session },
    );

    // 【步驟 8】發送 Telegram 實時業績通知
    const statusIcon = receiptUrl ? "✅ 已附收據" : "⚠️ 待補交";
    await sendTelegramNotification(
      `🔔 新訂單 #${orderNumber}\n金額: $${amount}\n客戶: ${address.firstName}\n地址: ${address.address}\n方式: ${methodLabel}\n狀態: ${currentStatus} ${statusIcon}`,
    );

    // 提交事務：確認上方所有資料庫操作無誤後，一次性同步寫入資料庫
    await session.commitTransaction();
    res.json({ success: true, message: "Order Placed", orderNumber });
  } catch (error) {
    // 異常攔截：若過程中發生任何錯誤（包括搶單失敗），自動撤銷以上所有變更（Rollback）
    await session.abortTransaction();
    res.json({ success: false, message: error.message });
  } finally {
    // 關閉資料庫連線會話
    session.endSession();
  }
};

// --- 匯出功能 (Exported Methods) ---

// 用戶前端下單分流路由
export const placeOrder = (req, res) => processOrder(req, res, "COD");
export const placeOrderPayme = (req, res) => processOrder(req, res, "PayMe");
export const placeOrderFps = (req, res) => processOrder(req, res, "FPS");
export const tradeInPersonPlaceOrderPayme = (req, res) =>
  processOrder(req, res, "PayMe (Trade in Person)");
export const tradeInPersonPlaceOrderFps = (req, res) =>
  processOrder(req, res, "FPS (Trade in Person)");

// 獲取所有訂單 (管理員後台)
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 獲取指定用戶訂單 (前端用戶中心)
export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 更新訂單配送狀態 (管理員面板)
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 修改訂單金額 (管理員面板調整價格使用)
export const updateOrderAmount = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { amount: Number(amount) });
    res.json({ success: true, message: "Amount Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 用戶後續補傳付款截圖/收據
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
