const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// User API - GET/getsuer -- to get a user by email
router.get("/getUser", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.find({ email: email });
    if (user.length > 0) {
      console.log(user);
      const { password, ...updatedPassword } = user.toObject();
      res.json({ "User Data": updatedPassword });
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something Went Wrong!", error: err.message });
  }
});

// Delete API - Delete/user -- to delete the user
router.delete("/deleteUser", async (req, res) => {
  const userId = req.body.Id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.send("user not found");
    } else {
      res.send("User deleted!");
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something Went Wrong!", error: err.message });
  }
});

// Update API - Patch/user -- to update the user
router.patch("/updateUuser/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const allowedUpdate = ["about", "photoUrl", "skills", "age", "gender"];
    const isupdatedAllowed = Object.keys(data).every((k) =>
      allowedUpdate.includes(k)
    );
    if (!isupdatedAllowed) {
      return res.status(400).send("Update not allowed on provided fields");
    }
    if (data.skills && data.skills.length > 10) {
      return res.status(400).send("Skills cannot be more than 10");
    }
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after", // it will return the updated document if we want we can get the updated before document
    });
    if (!updatedUser) {
      res.status(404).send("User not found");
    } else res.send({ message: "User updated!", data: updatedUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something Went Wrong!", error: err.message });
  }
});

// //forgotpassword API --- to reset the password through API
router.patch("/user/reset-password/:resetFlag", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const resetFlag = req.params.resetFlag?.toLowerCase();
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required." });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User not found with the email ${email}` });
    }
    if (resetFlag !== "yes") {
      return res
        .status(400)
        .json({ message: "Invalid password reset request" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password Updated Successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong!", error: err.message });
  }
});

module.exports = router;
