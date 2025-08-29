import { v2 as cloudinary } from "cloudinary";
import showModel from "../models/showModel.js";

// 添加演出
const addShow = async (req, res) => {
    try {
        const { name, description, date, location, ticketLink, status } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];

        const images = [image1, image2, image3].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        const showData = {
            name,
            description,
            date,
            location,
            ticketLink,
            image: imagesUrl,
            status,
        };

        console.log(showData);
        const show = new showModel(showData);
        await show.save();

        res.json({ success: true, message: "Show Added" });

    } catch (error) {
        console.error("Error adding show:", error); // 日誌記錄
        res.json({ success: false, message: error.message });
    }
};


// 列出所有演出
const listShows = async (req, res) => {
    try {
        const shows = await showModel.find({});
        res.json({ success: true, shows });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 獲取單個演出信息
const singleShow = async (req, res) => {
    try {
        const { id } = req.params;
        const show = await showModel.findById(id);
        if (!show) {
            return res.status(404).json({ success: false, message: "Show not found" });
        }
        res.json({ success: true, show });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 根據狀態過濾演出（即將舉行或過去的演出）
const filterShowsByStatus = async (req, res) => {
    try {
        const { status } = req.params; // 從路由參數中獲取狀態
        const shows = await showModel.find({ status }); // 根據狀態查詢演出
        res.json({ success: true, shows });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addShow, listShows, singleShow, filterShowsByStatus };
