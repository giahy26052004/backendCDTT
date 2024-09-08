import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Product } from "../model/productModel.js";
const addUser = async (req, res) => {
  try {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
      return res
        .status(400)
        .json({ success: false, errors: "User already exists" });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log("hashedPassword", hashedPassword);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      cartData: cart,
    });
    await user.save();
    const data = {
      user: {
        _id: user._id,
      },
    };
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error adding user:", error); // Log the error for debugging
    res.status(500).json({ message: "Error adding user", error: error });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("user", user);
    if (!user) {
      return res.status(400).json({ success: false, errors: "User not found" });
    }
    const PasswordCompare = await bcrypt.compare(password, user.password);
    if (!PasswordCompare) {
      return res
        .status(400)
        .json({ success: false, errors: "Password not match" });
    }
    const data = {
      user: {
        id: user._id,
      },
    };
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ success: true, token: token });
  } catch (error) {
    console.error("Error login user:", error); // Log the error for debugging
    res.status(500).json({ message: "Error login user", error: error });
  }
};

export { addUser, loginUser };
