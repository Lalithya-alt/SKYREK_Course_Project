import express from "express";
import { createProduct,getProducts,deleteProduct,updateProduct,getproductById, searchProducts  } from "../controllers/productController.js";

 const productRouter = express.Router();

 productRouter.post("/", createProduct )
 productRouter.get("/", getProducts)

 //parameterized routes enter last
 productRouter.get("/search",searchProducts)
 productRouter.put("/:productId", updateProduct)
 productRouter.get("/:productId", getproductById)
 productRouter.delete("/:productId", deleteProduct)

 export default productRouter;