import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    // take the token
    const token = req.cookies.jwt;

    // if there is no token, nobody logged in, it will say Unauthorized
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // if user exists, find the user to follow from the database
    // and get the user's ID, we do not need password so we delete password
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    // we pass the user object
    req.user = user;

    // call next function : followUnfollow function
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in protectRoute ", err.message);
  }
};

export default protectRoute;
