import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import songRouter from "./routes/songRoute.js";
import showRouter from "./routes/showRoutes.js"; // 引入演出路由

// App Config
const app = express();
const port = process.env.PORT || 4000;

// 連接數據庫和 Cloudinary
connectDB();
connectCloudinary();

// 中間件
app.use(express.json());
app.use(cors());

// API 端點
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/song', songRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/shows', showRouter); // 添加演出路由

app.get("/", (req, res) => {
  res.send("API Working");
});

// 啟動伺服器
app.listen(port, () => console.log("Server started on PORT : " + port));
