import express from "express";
import { createProduct,getProducts,deleteProduct,updateProduct,getproductById  } from "../controllers/productController.js";

 const productRouter = express.Router();

 productRouter.post("/products", createProduct )
 productRouter.get("/products", getProducts)
 
 //parameterized routes enter last
 productRouter.put("/products/:productId", updateProduct)
 productRouter.get("/products/:productId", getproductById)
 productRouter.delete("/products/:productId", deleteProduct)

 export default productRouter;