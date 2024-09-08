import jwt from "jsonwebtoken";

const fetchUserToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
};
export { fetchUserToken };
