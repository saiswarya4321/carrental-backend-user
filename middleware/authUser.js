const jwt = require("jsonwebtoken");
require("dotenv").config();

const authUser = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Token not found" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (verified.role !== "user") {
      return res.status(403).json({ error: "Access denied: not a user" });
    }

    req.user = verified.id;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = authUser;
