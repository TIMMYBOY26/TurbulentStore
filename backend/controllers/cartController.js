import userModel from "../models/userModel.js"
import productModel from "../models/productModel.js" // Ensure you import your product model

// Add products to user cart 
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Added to Cart" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Update user cart 
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Cart Updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({ success: true, cartData })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

/**
 * NEW: Get Full Cart Details for Admin View
 * Returns product names, images, and prices instead of just IDs
 */
const getSpecificUserCartDetails = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId);
        const cartData = userData.cartData;

        const detailedCart = [];

        // Loop through itemIds in cartData
        for (const itemId in cartData) {
            const productInfo = await productModel.findById(itemId);
            if (productInfo) {
                for (const size in cartData[itemId]) {
                    if (cartData[itemId][size] > 0) {
                        detailedCart.push({
                            _id: itemId,
                            name: productInfo.name,
                            price: productInfo.price,
                            image: productInfo.image,
                            size: size,
                            quantity: cartData[itemId][size]
                        });
                    }
                }
            }
        }

        res.json({ success: true, detailedCart });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

/**
 * Clear a specific product from ALL users' carts (when deleting a product)
 */
const clearProductFromAllCarts = async (req, res) => {
    try {
        const { itemId } = req.body
        await userModel.updateMany({}, { $unset: { [`cartData.${itemId}`]: "" } })
        res.json({ success: true, message: "Product removed from all user carts" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

/**
 * Clear a specific user's entire cart
 */
const clearUserCartAdmin = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: "User's cart has been cleared" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {
    addToCart,
    updateCart,
    getUserCart,
    getSpecificUserCartDetails, // NEW Export
    clearProductFromAllCarts,
    clearUserCartAdmin
}
