import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  ticketLink: { type: String, required: true }, // 可選，鏈接到購票網站
  image: { type: [String], default: [] }, // 演出圖片
  status: {
    type: String,
    enum: ["upcoming", "past", "cancelled"], // 限制選擇
    required: true,
  },
  instagramLink: { type: String }, // New field for Instagram post link
});

const showModel = mongoose.model("Show", showSchema);
export default showModel;
