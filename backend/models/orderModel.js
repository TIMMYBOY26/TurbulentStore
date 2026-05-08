import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },

    // 優化 1: 將預設狀態改為 'Payment Processing' 
    // 這樣可以與你 Controller 的邏輯統一，代表「等待付款/上傳收據」
    status: {
        type: String,
        required: true,
        default: 'Payment Processing'
    },

    paymentMethod: { type: String, required: true },

    // payment 代表管理員是否確認收到錢
    payment: { type: Boolean, required: true, default: false },

    date: { type: Number, required: true },

    // 優化 2: 訂單編號建議設為 String
    // 雖然現在是 Number，但未來如果你想加入日期前綴 (如 20260508001) 
    // String 會比 Number 更有彈性，且能避免大數字精度問題
    orderNumber: { type: String, required: true, unique: true },

    // 儲存 Cloudinary 的收據圖片連結
    receiptImage: { type: String, default: "" }
}, { minimize: false }); // 優化 3: 加入 minimize: false 確保空物件也會存入 DB

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;