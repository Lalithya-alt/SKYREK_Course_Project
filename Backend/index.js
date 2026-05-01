import express from 'express'
import mongoose from 'mongoose'
import Student from './models/Students.js'
import studentRouter from './routers/studentRouter.js'
import userRouter from './routers/userRouter.js'
import productRouter from './routers/productRouter.js'
import authenticate from './middleware/authenticate.js'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()   // ✅ MUST be first

const mongodbURL = process.env.mongodbURL

// Middleware
app.use(cors())
app.use(express.json())
app.use(authenticate)

// Routes
app.use('/students', studentRouter)
app.use('/users', userRouter)
app.use('/products', productRouter)

// MongoDB connection
mongoose.connect(mongodbURL).then(() => {
    console.log('Connected to MongoDB')
})

// Server
app.listen(3000, () => {
    console.log('Server running on port 3000')
})