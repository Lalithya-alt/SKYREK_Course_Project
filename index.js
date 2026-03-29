import express from 'express'
import mongoose from 'mongoose'     
import Student from './models/Students.js'  // import Student model to manage students collection in MongoDB
import studentRouter from './routers/studentRouter.js'
import userRouter from './routers/userRouter.js'
import jwt from "jsonwebtoken"
import productRouter from './routers/productRouter.js'  
import authenticate from './middleware/authenticate.js'  // import authentication middleware
import dotenv from 'dotenv'

dotenv.config()  // Load environment variables from .env file

const mongodbURL = process.env.mongodbURL  // Get MongoDB URL from environment variable 

const app=express()
app.use(express.json())  // to parse JSON data in request body

app.use(authenticate)

mongoose.connect(mongodbURL).then(
    () => 
        {
            console.log('Connected to MongoDB')
        }
)

// Use studentRouter for routes starting with /students
app.use('/students', studentRouter)
app.use('/users', userRouter)
app.use('/products', productRouter)


app.listen(3000, () => {
    console.log("Server running on port 3000");
});