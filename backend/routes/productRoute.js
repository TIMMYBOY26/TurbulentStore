import express from 'express'
import { listProduct, addProduct, removeProduct, singleProduct, updateProduct } from "../controllers/productController.js"
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.fields([
    { name: 'image1', adminAuth, maxCount: 1 },
    { name: 'image2', adminAuth, maxCount: 1 },
    { name: 'image3', adminAuth, maxCount: 1 },
    { name: 'image4', adminAuth, maxCount: 1 }
]), addProduct);
productRouter.post('/remove', removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProduct);
productRouter.post('/update', updateProduct);


export default productRouter