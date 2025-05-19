require("dotenv").config();
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      maxLenght: 12,
      validate: [
        validator.isStrongPassword,
        "Password must conatain'Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase, a number, and a special character.'",
      ],
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      trim: true,
    },
    about: { type: String },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URl format:" + value);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
userSchema.index({ firstName: 1 });
userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const hashPassword = user.password;
  const isValidPassword = await bcrypt.compare(userInputPassword, hashPassword);
  return isValidPassword;
};
userSchema.methods.getJWT = async function () {
  const user = this;
  if (!process.env.JWT_SECRET_KEY || !process.env.JWT_EXPIRY) {
    throw new Error("Missing JWT environment variables");
  }
  const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

module.exports = mongoose.model("User", userSchema);
