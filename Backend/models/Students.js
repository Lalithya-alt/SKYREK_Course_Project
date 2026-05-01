import mongoose from "mongoose";    

const StudentSchema = new mongoose.Schema(
    {
        name: String,
        age: Number,
        city: String
    }
);

const Student = mongoose.model("students", StudentSchema)  // manage database collection named students

export default Student