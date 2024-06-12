import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

// generating token
const createJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// login logic
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email!",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exists!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials!" });
    }
    // creating jwt token
    const token = createJwtToken(user._id);
    res.json({ success: true, message: "Logged in!", token, role: user.role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong!" });
  }
};

// register logic
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    // checking if user with same email already exists
    if (exists) {
      return res.json({ success: false, message: "User already exists!" });
    }
    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email!",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password!",
      });
    }
    // hashing user passwor
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const user = new userModel({
      name,
      email,
      password: hashedPass,
    });

    const createdUser = await user.save();
    // creating jwt token
    const token = createJwtToken(createdUser._id);
    res.json({ success: true, message: "Account created!", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export { loginUser, registerUser };
