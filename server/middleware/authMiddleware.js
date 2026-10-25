import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next)=>{
    const token = req.header.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"Authentication Required"
        });
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message:"Invalid or expired token"
        })
    }
}

export default authMiddleware;