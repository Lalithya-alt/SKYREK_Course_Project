import express from "express";
import { createProduct,getProducts,deleteProduct,updateProduct,getproductById  } from "../controllers/productController.js";

 const productRouter = express.Router();

 productRouter.post("/", createProduct )
 productRouter.get("/", getProducts)
 
 //parameterized routes enter last
 productRouter.put("/:productId", updateProduct)
 productRouter.get("/:productId", getproductById)
 productRouter.delete("/:productId", deleteProduct)

 export default productRouter;