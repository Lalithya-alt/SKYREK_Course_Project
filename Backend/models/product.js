import mongoose, { model } from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productId: { 
            type: String, 
            unique: true,
            required: true 
        },
        name:{
            type: String,
            required: true
        },
        altNAmes:{
            type: [String],
           default: [],
           required: true
        },
        description:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        labelledprice:{
            type:Number,
            required: true
        },
        Images:{
            type: [String],
            default: ["/default-product1.jpg"],
            required: true
        },
        isavailable:{
            type: Boolean,
            default: true,
            required: true
        },
        category:{
            type: String,
            required: false
        },
        stock:{
            type: Number,
            required: true,
            default: 0,
        },
        brand:{
            type: String,
            required: false
        },
        model:{
            type: String,
            required: false
        }
        
    }
)
const Product = mongoose.model("Product", productSchema);
export default Product;