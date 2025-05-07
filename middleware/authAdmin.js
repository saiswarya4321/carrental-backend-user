const jwt=require("jsonwebtoken")

const authAdmin=(req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            return res.status(401).json({error:"jwt not found"})
        }
        const verifiedToken=jwt.verify(token,process.env.JWT_SECRET)
        if(!verifiedToken){
            return res.status(401).json({error:"admin not authorized"})
        }
        if(verifiedToken.role !== "admin"){
            return res.status(401).json({error:"Access denied"})
        
        }
        req.admin = verifiedToken.id
        next()
    } catch (error) {
        res.status(error.status || 401).json({error:error.message || "admin authentication failed!"})
    }
}
module.exports=authAdmin