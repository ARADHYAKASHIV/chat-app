import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Additional fields can be added here as needed
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
