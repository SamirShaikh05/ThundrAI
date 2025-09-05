import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/user", userRoutes);
app.use("/api/chats", conversationRoutes);

// Error handling for payload too large
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: "Payload too large. Please upload smaller files (max 50MB)." });
  }
  res.status(500).json({ error: "An unexpected error occurred" });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`);
});