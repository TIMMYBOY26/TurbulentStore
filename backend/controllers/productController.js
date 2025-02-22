import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"


// fuction for add product 
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, sizes, bestseller } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );

        const sizesParsed = JSON.parse(sizes);

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            bestseller: bestseller === "true" ? true : false,
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


// fuction for list product 
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// fuction for update product price
const updateProduct = async (req, res) => {
    const { id, price } = req.body;
    try {
        await productModel.findByIdAndUpdate(id, { price });
        res.json({ success: true, message: 'Product price updated!' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// fuction for remove product 
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, messae: "Product Removed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// fuction for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { listProduct, addProduct, removeProduct, singleProduct, updateProduct }