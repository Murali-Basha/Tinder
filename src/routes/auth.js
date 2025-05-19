const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { signUpValidation, loginValidation } = require("../utils/validation");
const bcrypt = require("bcrypt");

// create a user API
router.post("/signUp", async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    // Step 1: Validate input
    try {
      signUpValidation(req.body);
    } catch (validationError) {
      return res.status(400).json({
        message: "Validation Failed",
        error: validationError.message,
      });
    }
    let { firstName, lastName, email, password, age, gender, skills } =
      req.body;
    email = email.trim().toLowerCase();
    firstName = firstName.trim();
    lastName = lastName.trim();
    password = password.trim();
    const isExistingUser = await User.findOne({ email: email });
    if (isExistingUser) {
      return res.status(409).send(`User already exists with this ${email}`);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      age,
      gender,
      skills,
    });
    // Hash the password and replace in body
    // req.body.password = hashPassword;
    // Create new user instance with remaining body data
    // const newUser = new User(req.body);
    // Save user to database
    await newUser.save();
    res.status(201).send(`User created successfully!`);
  } catch (err) {
    console.log(err);
    res.status(400).send("ERROR : " + err.message);
  }
});

// login API
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    loginValidation(req);
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).send(`Invalid Credentails`);
    }
    const isValidPassword = await user.validatePassword(password.trim());
    console.log("isValidPassword", isValidPassword);
    if (isValidPassword) {
      const token = await user.getJWT();
      console.log("Token being set:", token);
      if (!token || typeof token !== "string") {
        return res.status(500).send("Token generation failed.");
      }
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      });
      res.status(200).send(`User login Successfully!`);
    } else {
      return res.status(401).send(`Invalid Credentails`);
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//logout API
router.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(new Date()),
    })
    .send("Logout successfully!");
});

module.exports = router;
