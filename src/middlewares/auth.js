const adminAuth = (req, res, next) => {
  const token = "xyzt";
  const validToken = token === "xyz";
  if (!validToken) {
    res.status(401).send("Invalid Token");
  } else next();
};
const userAuth = (req, res, next) => {
  const token = "xyz";
  const validToken = token === "xyz";
  if (!validToken) {
    res.status(401).send("Invalid Token");
  } else next();
};
module.exports = {
  adminAuth: adminAuth,
  userAuth: userAuth,
};
