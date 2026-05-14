import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true }, // 存儲 {firstName, phone, address}
    status: {
      type: String,
      required: true,
      default: "Payment Processing", // 統一初始狀態
    },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true },
    orderNumber: { type: String, required: true, unique: true },
    receiptImage: { type: String, default: "" },
  },
  { minimize: false },
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
