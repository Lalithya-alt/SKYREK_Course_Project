import { createUser,loginUser, updatePassword, updateProfile } from "../controllers/userController.js";
import express from 'express'
import { getUser } from "../controllers/userController.js";
const userRouter = express.Router()

userRouter.post('/', createUser)
userRouter.post('/login', loginUser)
userRouter.get('/', getUser)
userRouter.get('/me', getUser)
userRouter.put('/',updateProfile)
userRouter.post("/password",updatePassword)

export default userRouter