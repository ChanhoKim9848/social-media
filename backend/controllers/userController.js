import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

//  get user profile function
//  this function used to see other users profile page
const getUserProfile = async (req, res) => {
  // we will fetch user profile either with username or userId
  // query is either username or userId
  const { query } = req.params;

  try {
    // find user data from the database by either userId or username
    let user;

    // if query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        // get other user data without their passwords and updated date
        .select("-password")
        .select("-updatedAt");
    } else {
      // if query is username
      user = await User.findOne({ username: query })
        // get other user data without their passwords and updated date
        .select("-password")
        .select("-updatedAt");
    }
    // if user is not found, error
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUserProfile: ", err.message);
  }
};

// signup function
const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    // user checks
    const user = await User.findOne({ $or: [{ email }, { username }] });
    // if user exists
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // if user does not exist
    // password will be encrypted
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // user data
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // user data save into the db
    await newUser.save();

    if (newUser) {
      // generate json web token and get cookie
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });

      // Sign Up Fail
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser ", err.message);
  }
};

// login function
const loginUser = async (req, res) => {
  try {
    // request username and password from the database
    const { username, password } = req.body;

    // save user data into this variable
    const user = await User.findOne({ username });
    // and check username and password are correct

    // if user does not exist, we put empty string and it will print error message after
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    // if user does not exist or password is not correct
    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username or password" });

    generateTokenAndSetCookie(user._id, res);

    // user data
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in loginUser: ", error.message);
  }
};

// logout function
const logoutUser = async (req, res) => {
  try {
    // delete token in 1ms
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser ", err.message);
  }
};

// follow and unfollow function
const followUnFollowUser = async (req, res) => {
  try {
    // get the user id to follow
    const { id } = req.params;

    // get the user that will be followed and updated
    const userToModify = await User.findById(id);
    // get the user who follows
    const currentUser = await User.findById(req.user._id);

    // if user want to follow own profile, it gets error
    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });

    //  if user does not exist, it gets error
    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    // get user id to check if user is following
    const isFollowing = currentUser.following.includes(id);

    // unfollow user //
    if (isFollowing) {
      // current user modify the following user and modify by pulling
      // current user's id from following user's followers array
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

      res.status(200).json({ message: "User unfollowed successfully" });

      // follow user //
    } else {
      // current user modify the following user and modify by pushing
      // current user's id into following user's followers array
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in followAndUnFollow ", err.message);
  }
};

// update user profile
const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;

  // if user updated profile picture and app sends the file and upload on cloudinary
  let { profilePic } = req.body;

  const userId = req.user._id;
  try {
    // get user id from the database
    let user = await User.findById(userId);
    // if id does not exist
    if (!user) return res.status(400).json({ error: "User not found" });

    // user id covert id object to string
    // if we try to update other users' profile, it returns error
    if (req.params.id !== userId.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile" });
    }

    // if password exists, we encrypt it and save hashed Password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // upload updated profile picture on cloudinary
    if (profilePic) {
      // if user already has a profile picture, delete old one
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      // upload new profile picture and update profile
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    // user profile data
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    // update and save changes
    user = await user.save();

    // update username and profile picture on post, comments etc...
    // after update user profile
    await Post.updateMany(
      // find all posts that this user replied from the database and mongoose and
      // update username and user profile picture fields
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    // password should be null in response
    user.password = null;

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updateUser ", err.message);
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
};
