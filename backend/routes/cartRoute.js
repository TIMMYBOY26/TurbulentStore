import express from 'express'
import {
    addToCart,
    getUserCart,
    updateCart,
    clearProductFromAllCarts,
    clearUserCartAdmin,
    getSpecificUserCartDetails // 1. Add this import
} from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'

const cartRouter = express.Router()

// --- USER ROUTES (Requires authUser) ---
cartRouter.post('/get', authUser, getUserCart)
cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/update', authUser, updateCart)

// --- ADMIN ROUTES (Requires adminAuth) ---

/**
 * Fetch detailed product info for a specific user's cart (Name, Price, Image)
 * Fixes the 404 error in ListUser.jsx
 */
cartRouter.post('/details', adminAuth, getSpecificUserCartDetails) // 2. Add this route

/**
 * Cleanup specific product from ALL users' carts (used when deleting a product)
 */
cartRouter.post('/cleanup', adminAuth, clearProductFromAllCarts)

/**
 * One-click clear for a specific user's cart
 */
cartRouter.post('/clear-user-cart', adminAuth, clearUserCartAdmin)

export default cartRouter
