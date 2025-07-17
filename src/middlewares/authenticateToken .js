import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

function authenticateToken (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({ message: "Token tidak ditemukan" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if (err){
            return res.status(403).json({ message: "token tidak valid atau expired" });
        }
        req.user = user;
        next();
    });
}

export default authenticateToken;