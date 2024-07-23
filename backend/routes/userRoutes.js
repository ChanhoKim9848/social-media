import express from "express";
import {
  loginUser,
  signupUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:username", getUserProfile)
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// protectRoute: middleware checks if user is not logged in, does update the profile
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.post("/update/:id", protectRoute, updateUser);

export default router;
