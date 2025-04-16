import mongoose from "mongoose"

const sizeSchema = new mongoose.Schema({
    size: { type: String, required: true }, // e.g., "S", "M", "L"
    count: { type: Number, required: true } // e.g., 10 for "M" size in stock
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    sizes: { type: [sizeSchema], required: true }, // Changed to an array of size objects
    bestseller: { type: Boolean, required: true },
    date: { type: Number, required: true },

})

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel