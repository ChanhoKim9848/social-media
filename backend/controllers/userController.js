import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

// signup function
const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    // user checks
    const user = await User.findOne({ $or: [{ email }, { username }] });
    // if user exists
    if (user) {
      return res.status(400).json({ message: "User already exists" });
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
      });

      // Sign Up Fail
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
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
      return res.status(400).json({ message: "Invalid username or password" });

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: err.message });
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
        .json({ message: "You cannot follow/unfollow yourself" });

    //  if user does not exist, it gets error
    if (!userToModify || !currentUser)
      return res.status(400).json({ message: "User not found" });

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
  } catch (error) {
    res.status(500).json({ message: err.message });
    console.log("Error in followAndUnFollow ", err.message);
  }
};

const updateUser = async (req, res) => {};

export { signupUser, loginUser, logoutUser, followUnFollowUser, updateUser };
