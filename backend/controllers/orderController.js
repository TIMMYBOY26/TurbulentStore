import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import axios from 'axios';


const sendTelegramNotification = async (chatId, message) => {
    const token = '7804211306:AAHkJwg-ejrIB4evQ-EHQpCV8UJJB8eQaoY'; // Replace with your bot token
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        await axios.post(url, {
            chat_id: chatId,
            text: message,
        });
        console.log('Telegram message sent successfully!');
    } catch (error) {
        console.error(`Failed to send Telegram message: ${error.message}`);
    }
};


// Function to generate a unique order number
const generateOrderNumber = async () => {
    const lastOrder = await orderModel.findOne().sort({ orderNumber: -1 }).exec();
    return lastOrder ? lastOrder.orderNumber + 1 : 1; // Start from 1 if no orders exist
};

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderNumber = await generateOrderNumber(); // Generate order number

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
            orderNumber // Assign generated order number
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Send Telegram notification
        const message = `New Order Placed:\nOrder Number: ${orderNumber}\nAmount: ${amount}\nAddress: ${address}`;
        await sendTelegramNotification('769583801', message); // Replace with your chat ID

        res.json({ success: true, message: "Order Placed", orderNumber }); // Return order number
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Placing orders using PayMe Method
const placeOrderPayme = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderNumber = await generateOrderNumber(); // Generate order number

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "PayMe",
            payment: false,
            date: Date.now(),
            orderNumber // Assign generated order number
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed", orderNumber }); // Return order number
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Placing orders using FPS Method
const placeOrderFps = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderNumber = await generateOrderNumber(); // Generate order number

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "FPS",
            payment: false,
            date: Date.now(),
            orderNumber // Assign generated order number
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed", orderNumber }); // Return order number
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// All Orders data for admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// User Orders data for Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// update order status from Admin
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status Updated' })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { placeOrder, placeOrderPayme, placeOrderFps, allOrders, userOrders, updateStatus }