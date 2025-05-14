import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js"; // Import your product model
import axios from "axios";

// Function to send Telegram notifications
const sendTelegramNotification = async (chatId, message) => {
  const token = "7804211306:AAHkJwg-ejrIB4evQ-EHQpCV8UJJB8eQaoY"; // Replace with your bot token
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
    });
    console.log("Telegram message sent successfully!");
  } catch (error) {
    console.error(`Failed to send Telegram message: ${error.message}`);
  }
};

// Function to generate a unique order number
const generateOrderNumber = async () => {
  const lastOrder = await orderModel.findOne().sort({ orderNumber: -1 }).exec();
  return lastOrder ? lastOrder.orderNumber + 1 : 1; // Start from 1 if no orders exist
};

// Function to reduce the size count of ordered products within a transaction
const reduceProductSizeCount = async (items, session) => {
  for (const item of items) {
    const { productId, size, quantity, name } = item;

    try {
      console.log(
        `Updating productId: ${productId}, name: ${name}, size: ${size}, quantity: ${quantity}`
      );

      const result = await productModel.findOneAndUpdate(
        { _id: productId, "sizes.size": size },
        { $inc: { "sizes.$.count": -quantity } },
        { session, new: true }
      );

      if (!result) {
        console.error(
          `Failed to update size for productId: ${productId}, size: ${size}`
        );
      } else {
        const updatedSize = result.sizes.find((s) => s.size === size);
        console.log(
          `Updated productId: ${productId}, size: ${size}, new count: ${updatedSize.count}`
        );

        // Check if the new count is zero and send a notification
        if (updatedSize.count === 0) {
          const message = `Product out of stock:\nProduct Name: ${name}\nSize: ${size}`;
          await sendTelegramNotification("-1002324020435", message);
        }

        // Check if the new count is less than 5 and send a notification
        if (updatedSize.count <= 10 && updatedSize.count > 0) {
          const message = `Product running low:\nProduct: ${name}\nSize: ${size} \nStock: ${updatedSize.count}`;
          await sendTelegramNotification("-1002324020435", message);
        }
      }
    } catch (error) {
      console.error(
        `Error updating productId: ${productId}, size: ${size}`,
        error
      );
    }
  }
};

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  const session = await orderModel.startSession();
  session.startTransaction();

  try {
    console.log("Placing order:", req.body);
    const { userId, items, amount, address } = req.body; // Ensure items contain productId
    const orderNumber = await generateOrderNumber();

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      orderNumber,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save({ session });

    console.log("Reducing product size counts...");
    await reduceProductSizeCount(items, session);

    // Update user's name in userModel with firstName
    await userModel.findByIdAndUpdate(
      userId,
      {
        name: address.firstName, // Assuming firstName is in the address object
      },
      { session }
    );

    await userModel.findByIdAndUpdate(userId, { cartData: {} }, { session });

    const message = `收到新訂單:\n訂單號碼 : ${orderNumber}\n金額: $${amount}\n付款方式 : 現金交收`;
    await sendTelegramNotification("-1002324020435", message);

    await session.commitTransaction();
    res.json({ success: true, message: "Order Placed", orderNumber });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// Placing orders using PayMe Method
const placeOrderPayme = async (req, res) => {
  const session = await orderModel.startSession();
  session.startTransaction();

  try {
    console.log("Placing PayMe order:", req.body);
    const { userId, items, amount, address } = req.body; // Ensure items contain productId
    const orderNumber = await generateOrderNumber();

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "PayMe",
      payment: false,
      date: Date.now(),
      orderNumber,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save({ session });

    // Reduce product size counts
    await reduceProductSizeCount(items, session);

    // Update user's name in userModel with firstName
    await userModel.findByIdAndUpdate(
      userId,
      {
        name: address.firstName, // Assuming firstName is in the address object
      },
      { session }
    );

    await userModel.findByIdAndUpdate(userId, { cartData: {} }, { session });

    // Send Telegram notification
    const message = `收到新訂單:\n訂單號碼 : ${orderNumber}\n金額: $${amount}\n付款方式 : PayMe`;
    await sendTelegramNotification("-1002324020435", message);

    await session.commitTransaction();
    res.json({ success: true, message: "Order Placed", orderNumber });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// Placing orders using FPS Method
const placeOrderFps = async (req, res) => {
  const session = await orderModel.startSession();
  session.startTransaction();

  try {
    console.log("Placing FPS order:", req.body);
    const { userId, items, amount, address } = req.body; // Ensure items contain productId
    const orderNumber = await generateOrderNumber();

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "FPS",
      payment: false,
      date: Date.now(),
      orderNumber,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save({ session });

    // Reduce product size counts
    await reduceProductSizeCount(items, session);

    // Update user's name in userModel with firstName
    await userModel.findByIdAndUpdate(
      userId,
      {
        name: address.firstName, // Assuming firstName is in the address object
      },
      { session }
    );

    await userModel.findByIdAndUpdate(userId, { cartData: {} }, { session });

    // Send Telegram notification
    const message = `收到新訂單:\n訂單號碼 : ${orderNumber}\n金額: $${amount}\n付款方式 : FPS`;
    await sendTelegramNotification("-1002324020435", message);

    await session.commitTransaction();
    res.json({ success: true, message: "Order Placed", orderNumber });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// Placing orders using Trade in person by PayMe Method
const tradeInPersonPlaceOrderPayme = async (req, res) => {
  const session = await orderModel.startSession();
  session.startTransaction();

  try {
    const { userId, items, amount, address } = req.body; // Ensure items contain productId
    const orderNumber = await generateOrderNumber();

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "paymeTradeIn",
      payment: false,
      date: Date.now(),
      orderNumber,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save({ session });

    // Reduce product size counts
    await reduceProductSizeCount(items, session);

    // Update user's name in userModel with firstName
    await userModel.findByIdAndUpdate(
      userId,
      {
        name: address.firstName, // Assuming firstName is in the address object
      },
      { session }
    );

    await userModel.findByIdAndUpdate(userId, { cartData: {} }, { session });

    // Send Telegram notification
    const message = `收到新訂單:\n訂單號碼 : ${orderNumber}\n金額: $${amount}\n付款方式 : Trade in person by PayMe`;
    await sendTelegramNotification("-1002324020435", message);

    await session.commitTransaction();
    res.json({ success: true, message: "Order Placed", orderNumber });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// Placing orders using Trade in person by FPS Method
const tradeInPersonPlaceOrderFps = async (req, res) => {
  const session = await orderModel.startSession();
  session.startTransaction();

  try {
    const { userId, items, amount, address } = req.body; // Ensure items contain productId
    const orderNumber = await generateOrderNumber();

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "fpsTradeIn",
      payment: false,
      date: Date.now(),
      orderNumber,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save({ session });

    // Reduce product size counts
    await reduceProductSizeCount(items, session);

    // Update user's name in userModel with firstName
    await userModel.findByIdAndUpdate(
      userId,
      {
        name: address.firstName, // Assuming firstName is in the address object
      },
      { session }
    );

    await userModel.findByIdAndUpdate(userId, { cartData: {} }, { session });

    // Send Telegram notification
    const message = `收到新訂單:\n訂單號碼 : ${orderNumber}\n金額: $${amount}\n付款方式 : Trade in person by FPS`;
    await sendTelegramNotification("-1002324020435", message);

    await session.commitTransaction();
    res.json({ success: true, message: "Order Placed", orderNumber });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// All Orders data for admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Orders data for Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status from Admin
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order amount
const updateOrderAmount = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    // Validate input
    if (!orderId || amount == null) {
      return res.json({ success: false, message: "Invalid input" });
    }

    // Update the order amount
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { amount },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order amount updated", order: updatedOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Export functions
export {
  placeOrder,
  placeOrderPayme,
  placeOrderFps,
  tradeInPersonPlaceOrderPayme,
  tradeInPersonPlaceOrderFps,
  allOrders,
  userOrders,
  updateStatus,
  updateOrderAmount, // Add this line to export the new function
};
