import { createUser, loginUser, updatePassword, updateProfile, googleLogin, sendOTP, resetPassword, getAllUsers } from "../controllers/userController.js";
import express from 'express'
import { getUser } from "../controllers/userController.js";
const userRouter = express.Router()

userRouter.post('/', createUser)
userRouter.post('/login', loginUser)
userRouter.post('/google-login', googleLogin)
userRouter.get('/', getUser)
userRouter.get('/all',getAllUsers)
userRouter.get('/me', getUser)
userRouter.put('/',updateProfile)
userRouter.post("/password",updatePassword)
userRouter.post("/otp",sendOTP)
userRouter.post("/reset-password", resetPassword)

export default userRouter