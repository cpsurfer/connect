import user from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized : No Token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized : Invalid Token" });
    }

    const user = await user.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Unauthorized : User not found" });
    }
    req.user = user; // Attach user to request object for further use
    next();
  } catch (error) {
    console.log(`error : ${error.message}`);
    res.status(500).json({ message: "Internal Server error" });
  }
};
