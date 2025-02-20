// import userModel from "../models/userModel"

// add products to user cart 
const addToCart = async (res,req) => {
    try {
        const { userId, itmeId, size } = req.body

        const userData = await userModel.findById(userId)

        let cartData = await userData.cartData;

        if (cartData[itmeId]) {
            if (cartData[itmeId][size]) {
                cartData[itmeId][size] += 1         
            }
            else {
                cartData[itmeId][size] = 1
            }
        }else {
            cartData[itmeId] = {}
            cartData[itmeId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({success: true, message: "Added to Cart"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})

        
    }
}

// Update user cart 
const UpdateCart = async (res,req) => {
    
}

//get user cart data
const getUserCart = async (res,req) => {
    
}

export {addToCart, UpdateCart, getUserCart}