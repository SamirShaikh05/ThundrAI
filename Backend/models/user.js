import mongoose from "mongoose";

const SignupSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: [3, "Username must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [3, "Password must be at least 3 characters long"],
  },
});

const Signup = mongoose.model("Signup", SignupSchema);
export default Signup;

