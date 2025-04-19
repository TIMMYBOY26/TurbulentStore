import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-xl sm:text-2xl my-3 text-left">
        <Title text1={"STEP 2: "} text2={"CART TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          {/* Uncomment these lines if you want to show subtotal
          <p>Subtotal</p>
          <p>
            {currency} {getCartAmount()}
          </p> */}
        </div>
        <hr />

        <div className="flex justify-between mt-2">
          <b>Total</b>
          <b>
            {currency}
            {getCartAmount() === 0 ? 0 : getCartAmount()}
            {/* Uncomment this line if you want to include delivery fee
            {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee} */}
          </b>
        </div>
        <div className="flex justify-between mt-2">
          <p></p>
          <p>
            {/* Uncomment this line if you want to show delivery fee
          {currency} {delivery_fee} */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
