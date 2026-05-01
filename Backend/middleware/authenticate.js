import jwt from "jsonwebtoken"
export default function authenticate(req, res, next){
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
