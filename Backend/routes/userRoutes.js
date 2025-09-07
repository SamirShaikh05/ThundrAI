import express from "express";
import Signup from "../models/user.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiter
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,   
    max: 5,                    
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true,     
    legacyHeaders: false       
});

router.use(authLimiter);

// Signup Route
router.post("/SignUP", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await Signup.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Account already exists" });
        }

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

// Login Route
router.post("/Login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Signup.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "User Not Found!" });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid password" });
        }

        console.log("Login successful");

        return res.status(200).json({
            message: "Login successful",
            user: { _id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        return res.status(500).json({ error: "Login failed" });
    }
});

export default router;
