import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export default function authenticate(req, res, next){
        const header = req.header("Authorization")
        console.log(`🔐 [${req.method}] ${req.path} - Authorization header:`, header ? "✅ Present" : "❌ Missing");

        // List of routes that require authentication
        const protectedRoutes = ['/api/products', '/api/orders'];
        const isProtectedRoute = protectedRoutes.some(route => req.path.startsWith(route)) && (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE');

        if(header == null){
            if(isProtectedRoute) {
                console.error(`❌ [${req.method}] ${req.path} - Protected route requires token`);
                return res.status(401).json({ message: "No token provided" })
            }
            console.log(`ℹ️ [${req.method}] ${req.path} - No auth required for this route`);
            return next()
        }

        const token = header.replace("Bearer ","")
        console.log(`🔍 Token received (length: ${token.length})`);

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if(err) {
                console.error(`❌ Token verification error:`, err.message);
                if (isProtectedRoute) {
                    return res.status(401).json({ message: "Invalid token: " + err.message })
                }
                return next()
            }
            console.log("✅ Token verified successfully");
            console.log(`   User: ${decoded.email}, Admin: ${decoded.isAdmin}`);
            req.user = decoded
            next()
        })
    }
