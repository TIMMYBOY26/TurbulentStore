import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text2={"CART TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {getCartAmount()}
          </p>
        </div>
        <hr />

        <div className="flex justify-between mt-2">
          <b>Total</b>
          <b>
            {currency}
            {getCartAmount() === 0 ? 0 : getCartAmount()}
            {/* {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee} */}
          </b>
        </div>
        <div className="flex justify-between mt-2">
          <p>+ 運費 (現金交收免運費)</p>
          <p>
            {/* {currency} {delivery_fee} */}
          </p>
        </div>


      </div>
    </div>
  );
};

export default CartTotal;
