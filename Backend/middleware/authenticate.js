import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export default function authenticate(req, res, next){
        const header = req.header("Authorization")
        console.log("Authorization header:", header)

        // List of routes that require authentication
        const protectedRoutes = ['/api/products'];
        const isProtectedRoute = protectedRoutes.some(route => req.path.startsWith(route)) && (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE');

        if(header == null){
            if(isProtectedRoute) {
                return res.status(401).json({ message: "No token provided" })
            }
            return next()
        }

        const token = header.replace("Bearer ","")
        console.log("Token:", token)

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if(err) {
                console.log("Token verification error:", err.message)
                if (isProtectedRoute) {
                    return res.status(401).json({ message: "Invalid token" })
                }
                return next()
            }
            console.log("Decoded token:", decoded)
            req.user = decoded
            next()
        })
    }
