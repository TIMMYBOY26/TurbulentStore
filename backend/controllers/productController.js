import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function for adding a product 
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, sizes, bestseller } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const image5 = req.files.image5 && req.files.image5[0];
        const image6 = req.files.image6 && req.files.image6[0];
        const image7 = req.files.image7 && req.files.image7[0];
        const image8 = req.files.image8 && req.files.image8[0];

        const images = [image1, image2, image3, image4, image5, image6, image7, image8].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );

        // Parse sizes to include size and count
        const sizesParsed = JSON.parse(sizes).map(size => ({
            size: size.size,  // e.g., "M"
            count: Number(size.count)  // e.g., 10
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
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function for listing products 
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function for updating product price
const updateProduct = async (req, res) => {
    const { id, price, sizes } = req.body;
    try {
        const updateData = { price };

        // Update sizes if provided
        if (sizes) {
            const sizesParsed = JSON.parse(sizes).map(size => ({
                size: size.size,
                count: Number(size.count)
            }));
            updateData.sizes = sizesParsed;
        }

        await productModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: 'Product updated!' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Function for removing a product 
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function for single product info
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
