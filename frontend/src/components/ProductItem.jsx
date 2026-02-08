import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

export const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={image[0]}
          alt={name}
        />
      </div>
      {/* 僅更新此處：產品名稱檢測 '-' 並自動換行 */}
      <p className="pt-3 pb-1 text-sm leading-tight">
        {name.split("-").map((part, index, array) => (
          <React.Fragment key={index}>
            {part.trim()}
            {index < array.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>
    </Link>
  );
};
