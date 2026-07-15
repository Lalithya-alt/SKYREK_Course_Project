import { createUser,loginUser } from "../controllers/userController.js";
import express from 'express'
import { getUser } from "../controllers/userController.js";
const userRouter = express.Router()

userRouter.post('/', createUser)
userRouter.post('/login', loginUser)
userRouter.get('/', getUser)
userRouter.get('/me', getUser)

export default userRouter