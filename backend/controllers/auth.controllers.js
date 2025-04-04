import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existinguser = await User.findOne({ username });

    if (existinguser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingemail = await User.findOne({ email });

    if (existingemail) {
      return res.status(400).json({ message: "email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      fullname,
      email,
      password: hashedpassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileimg: newUser.profileimg,
        coverimg: newUser.coverimg,
        bio: newUser.bio,
        link: newUser.link,
      });
    } else {
      res.status(400).json({ message: "Invalid UserData" });
    }
  } catch (error) {
    console.log(`error : ${error.message}`);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileimg: user.profileimg,
      coverimg: user.coverimg,
      bio: user.bio,
      link: user.link,
    });
  } catch (error) {
    console.log(`error : ${error.message}`);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(`error : ${error.message}`);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
