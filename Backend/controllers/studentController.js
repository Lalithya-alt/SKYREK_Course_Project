 import Student from '../models/Students.js'                 

 export function getAllStudents(req, res) {
  Student.find().then(
        (students) => {
            res.json(students)
        }
    )
 }

 //await can be used in only async functions
  export async function getAllStudentsnew(req, res) {
    try {
        const student = await Student.find().then(
        (students) => {
            res.json(students)
        }
    )
    } catch (error) {
        console.log(error)
    }
  
 }

export function addStudent(req, res) {
     //add data to Student collection 
    const student = new Student(req.body)  

    student.save().then(
        () => {
            res.json({ 
                message: "Student added successfully" 
            })
        }
    )
}

