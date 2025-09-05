
import express from "express";
import Signup from "../models/user.js";

const router = express.Router();


router.post("/SignUP", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await Signup.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Account already exists" });
    }
    // Create new user
    const newUser = new Signup({ username, email, password });
    await newUser.save();
    res.status(201).json({
      message: "Signup successful",
      user: { _id: newUser._id, username, email }
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const User = await Signup.findOne({ email });
    if (!User) {
      return res.status(401).json({ error: "User Not Found!" })
    }
    if (User.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }
    console.log("login successful");

    return res.status(200).json({
      message: "Login successful",
      user: { _id: User._id, username: User.username, email: User.email }
    });
  }
  catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
});

export default router;