import express from "express";
import { addShow, listShows, singleShow } from "../controllers/showController.js";
import upload from '../middleware/multer.js';


const showRouter = express.Router();

// 路由設置
showRouter.post("/add", upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
]), addShow); // 添加演出
showRouter.get("/list", listShows); // 列出所有演出
showRouter.get("/:id", singleShow); // 獲取單個演出

export default showRouter;
