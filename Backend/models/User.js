import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {   
        email:{
            type: String,
            unique: true,
            required: true
        },
        firstName:{ 
            type:String,
            required:true    
        },
        lastName:{ 
            type:String, 
            required:true  
        },
        password:{ 
            type:String,
            required:true
        },
        isAdmin: {
            type: Boolean, 
            required: true,
            default: false
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        isEmailVerified: {
            type: Boolean,
            required: true,
            default: false
        },
        image: {
            type: String,
            required: true,
            default:"/images/default-profile.png"
        }
    }
);


const User = mongoose.model("users", UserSchema)  // manage database collection named users

export default User