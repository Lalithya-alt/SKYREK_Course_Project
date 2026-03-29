import express from 'express'
import mongoose from 'mongoose'     
import Student from './models/Students.js'  // import Student model to manage students collection in MongoDB
import studentRouter from './routers/studentRouter.js'
import userRouter from './routers/userRouter.js'
import jwt from "jsonwebtoken"
import productRouter from './routers/productRouter.js'  

const app=express()
app.use(express.json())  // to parse JSON data in request body

app.use(
    (req, res, next)=>{
        const header =req.header("Authorization")
        console.log(header)

        if(header == null){
             next()
        }else{
            const token = header.replace("Bearer ","")
            console.log(token)

            jwt.verify(token, "secretkey99", (err, decoded)=>{
                console.log(decoded)
            })
        }
    }
)

const mongodbURL = "mongodb+srv://admin:1234@cluster0.o8qb6yx.mongodb.net/?appName=Cluster0"
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