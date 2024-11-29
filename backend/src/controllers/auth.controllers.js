import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { generateJWT } from "../utils/utils.js";
import cloudinary from "../utils/cloudinary.js";

export const signUp = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "All Fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, fullName, password: hashedPassword });
    if (newUser) {
      generateJWT(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePicture: newUser.profilePicture,
        },
      });
    } else {
      return res.status(400).json({
        message: "Invalid User Data",
      });
    }
  } catch (error) {
    console.log("Error in sign up controller : ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "You must provide values for all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    generateJWT(user._id, res);

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.log("Error in login controller : ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller : ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.user._id;
    if (!profilePicture) {
      return res.status(400).json({ message: "Profile Picture is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
      resource_type: "auto",
    });
    // !delete previous profile picture if any
    if (req.user.profilePicture !== "") {
      const previousProfilePictureId = req.user.profilePicture
        .split("/")
        .pop()
        .split(".")[0];
      await cloudinary.uploader.destroy(previousProfilePictureId, {
        resource_type: "image",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePicture: uploadResponse.secure_url,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Updated profile picture", user: updatedUser });
  } catch (error) {
    console.log("Error in update profile controller : ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.log("Error in check auth controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
