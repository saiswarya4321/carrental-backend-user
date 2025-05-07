const jwt = require("jsonwebtoken")
require('dotenv').config()
const authUser = (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: "jwt not found" })
        }
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!verifiedToken) {
            return res.status(401).json({ error: "User not authorized" })
        }
        if (verifiedToken.role !== "user") {
            return res.status(401).json({ error: "Access denied" })

        }
        req.user = verifiedToken.id
        next()
    } catch (error) {
        res.status(error.status || 401).json({ error: error.message || "User authentication failed!" })
    }
}
module.exports = authUser