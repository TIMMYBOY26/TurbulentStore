import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    // 使用 ObjectId 並關聯到 user model
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },

    // 狀態建議：預設改為 Order Placed
    status: { type: String, required: true, default: 'Order Placed' },

    paymentMethod: { type: String, required: true },

    // payment 代表管理員是否確認收到錢
    payment: { type: Boolean, required: true, default: false },

    date: { type: Number, required: true },

    // 訂單編號，設為唯一的數字以便對帳
    orderNumber: { type: Number, required: true, unique: true },

    // 🟢 新增：儲存 Cloudinary 的收據圖片連結
    // 設為 String 類型，預設為空字串，方便前端判斷是否有圖
    receiptImage: { type: String, default: "" }
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;