import User from "../models/userModel.js";

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
    const hashedPassword = await bcrypt(password, salt);

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

export { signupUser };
