import logo from "./Turbulent Title_Black.png";
import ContinueSticker from "./ContinueSticker62cm-1.png";
import NonfictionSticker from "./TurbulentNon-Fiction.png";
import StallertalkSticker from "./StallertalkSticker-1.png";
import TheCageSticker from "./TheCageSticker-1.png";
import TurbulentShirt from "./TurbulentShirt1.png";
import TurbulentShirtBack from "./TurbulentShirtBack1.png";
import TurbulentShirtChart from "./TurbulentShirtChart.jpg";
import TurbulentShirtFrontBack from "./TurbulentShirtFrontBack.jpg";
import fpsLogo from "./fps-logo.png";

import hero_img from "./hero_img.png";
import background from "./hero_img.png";
import cart_icon from "./cart_icon.png";
import bin_icon from "./bin_icon.png";
import dropdown_icon from "./dropdown_icon.png";
import exchange_icon from "./exchange_icon.png";
import profile_icon from "./profile_icon.png";
import quality_icon from "./quality_icon.png";
import search_icon from "./search_icon.png";
import star_dull_icon from "./star_dull_icon.png";
import star_icon from "./star_icon.png";
import support_img from "./support_img.png";
import menu_icon from "./menu_icon.png";
import about_img from "./about_img.png";
import contact_img from "./contact_img.png";
import razorpay_logo from "./razorpay_logo.png";
import cross_icon from "./cross_icon.png";

export const assets = {
  logo,
  hero_img,
  TurbulentShirt,
  TurbulentShirtBack,
  TurbulentShirtChart,
  TurbulentShirtFrontBack,
  cart_icon,
  dropdown_icon,
  exchange_icon,
  profile_icon,
  quality_icon,
  search_icon,
  star_dull_icon,
  star_icon,
  bin_icon,
  support_img,
  menu_icon,
  about_img,
  contact_img,
  razorpay_logo,
  cross_icon,
  fpsLogo,
};

export const products = [
  {
    _id: "aaaaa",
    name: "TURBULENT T-SHIRT",
    description: "A heavyweight, lose-fitting and short sleeves shirt.",
    price: 250,
    image: [TurbulentShirt, TurbulentShirtBack, TurbulentShirtFrontBack, TurbulentShirtChart],
    category: "TEES",
    subCategory: "",
    sizes: ["S", "M", "L", "XL", "XXL"],
    date: 1716634345448,
    bestseller: true,
  },
  {
    _id: "aaaab",
    name: "續 STICKER",
    description: "FROM STICKER PACK vol1.",
    price: 10,
    image: [ContinueSticker],
    category: "ACCESSORIES",
    subCategory: "",
    sizes: ["N/A"],
    date: 1716621345448,
    bestseller: false,
  },
  {
    _id: "aaaac",
    name: "NON-FICTION STICKER",
    description: "FROM STICKER PACK vol1.",
    price: 10,
    image: [NonfictionSticker],
    category: "ACCESSORIES",
    subCategory: "",
    sizes: ["N/A"],
    date: 1716234545448,
    bestseller: true,
  },
  {
    _id: "aaaad",
    name: "Stella-Talk Sticker",
    description: "FROM STICKER PACK vol1.",
    price: 10,
    image: [StallertalkSticker],
    category: "ACCESSORIES",
    subCategory: "",
    sizes: ["N/A"],
    date: 1716621345448,
    bestseller: true,
  },
  {
    _id: "aaaae",
    name: "The Cage Sticker",
    description: "FROM STICKER PACK vol1.",
    price: 10,
    image: [TheCageSticker],
    category: "ACCESSORIES",
    subCategory: "",
    sizes: ["N/A"],
    date: 1716622345448,
    bestseller: true,
  },
];
