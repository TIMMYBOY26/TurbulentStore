import mongoose from "mongoose"

const sizeSchema = new mongoose.Schema({
    size: { type: String, required: true }, // 例如 "S", "M", "L" 或 "TICKETS"
    count: { type: Number, required: true }  // 庫存數量
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    sizes: { type: [sizeSchema], required: true },
    bestseller: { type: Boolean, required: true },
    date: { type: Number, required: true },
    
    // --- 門票/外部連結相關欄位 ---
    // isTicketAvailable: 控制前端顯示 "GET TICKETS" 還是 "COMING SOON"
    isTicketAvailable: { 
        type: Boolean, 
        default: false 
    },
    // externalLink: 存儲外部購票平台連結 (如 Eventbrite, Klook 等)
    externalLink: { 
        type: String, 
        default: "" 
    },
    
    // --- 未來擴展保留欄位 (預留給內部門票使用) ---
    ticketType: { 
        type: String, 
        enum: ["internal", "external", "none"], 
        default: "none" 
    }
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
