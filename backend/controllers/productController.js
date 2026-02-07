import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function for adding a product 
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, sizes, bestseller, externalLink, isTicketAvailable } = req.body;
        
        const images = [];
        for (let i = 1; i <= 9; i++) {
            const image = req.files[`image${i}`] && req.files[`image${i}`][0];
            if (image) {
                images.push(image);
            }
        }

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );

        const sizesParsed = JSON.parse(sizes).map(size => ({
            size: size.size,
            count: Number(size.count)
        }));

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            bestseller: bestseller === "true",
            sizes: sizesParsed,
            image: imagesUrl,
            date: Date.now(),
            // --- 新增 Ticket 欄位 ---
            externalLink: externalLink || "",
            isTicketAvailable: isTicketAvailable === "true",
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function for updating product price, sizes, and ticket status
const updateProduct = async (req, res) => {
    const { id, price, sizes, externalLink, isTicketAvailable } = req.body;
    try {
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        // 1. 更新價格
        if (price !== undefined) {
            product.price = Number(price);
        }

        // 2. 更新 Ticket 相關欄位 (僅在提供時更新)
        if (externalLink !== undefined) {
            product.externalLink = externalLink;
        }
        if (isTicketAvailable !== undefined) {
            product.isTicketAvailable = isTicketAvailable === "true" || isTicketAvailable === true;
        }

        // 3. 更新尺寸與庫存
        if (sizes) {
            const sizesParsed = JSON.parse(sizes).map(size => ({
                size: size.size,
                count: Number(size.count)
            }));

            sizesParsed.forEach(newSize => {
                const existingSize = product.sizes.find(size => size.size === newSize.size);
                if (existingSize) {
                    existingSize.count = newSize.count;
                } else {
                    product.sizes.push(newSize);
                }
            });
        }

        await product.save();
        res.json({ success: true, message: 'Product updated successfully!' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// --- 其餘函數保持不變 ---

const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { listProduct, addProduct, removeProduct, singleProduct, updateProduct };
