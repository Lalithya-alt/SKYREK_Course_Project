import express from 'express'
import { addStudent ,getAllStudents } from '../controllers/studentController.js'

const studentRouter = express.Router()

studentRouter.get('/', getAllStudents )

studentRouter.post('/',addStudent )

export default studentRouter
