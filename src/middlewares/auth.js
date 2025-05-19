const jwt = require("jsonwebtoken");
const User = require("../models/user");
const adminAuth = (req, res, next) => {
  const token = "xyzt";
  const validToken = token === "xyz";
  if (!validToken) {
    res.status(401).send("Invalid Token");
  } else next();
};
const authMiddleWare = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decode._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(decode);
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res
      .status(401)
      .send({ message: "Unauthorized: Invalid token", error: err.message });
  }
};
module.exports = {
  adminAuth: adminAuth,
  authMiddleWare: authMiddleWare,
};
