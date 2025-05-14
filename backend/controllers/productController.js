import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function for adding a product 
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, sizes, bestseller } = req.body;
        const images = [];
        for (let i = 1; i <= 8; i++) {
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

// Function for updating product price and sizes
const updateProduct = async (req, res) => {
    const { id, price, sizes } = req.body;
    try {
        const updateData = {};

        // Update price if provided
        if (price) {
            updateData.price = Number(price);
        }

        // Update sizes if provided
        if (sizes) {
            const sizesParsed = JSON.parse(sizes).map(size => ({
                size: size.size,
                count: Number(size.count)
            }));

            // Find the product and update sizes
            const product = await productModel.findById(id);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found.' });
            }

            // Update the sizes in the product
            sizesParsed.forEach(newSize => {
                const existingSize = product.sizes.find(size => size.size === newSize.size);
                if (existingSize) {
                    // If the size exists, update its count
                    existingSize.count = newSize.count;
                } else {
                    // If the size doesn't exist, add it
                    product.sizes.push(newSize);
                }
            });

            // Save the updated product
            await product.save();
            return res.json({ success: true, message: 'Product updated!' });
        }

        // If only price is updated
        await productModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: 'Product price updated!' });

    } catch (error) {
        console.log(error);
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
