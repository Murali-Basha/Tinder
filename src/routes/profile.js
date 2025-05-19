const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authMiddleWare } = require("../middlewares/auth");
const { validateProfileEdit } = require("../utils/validation");
const bcrypt = require("bcrypt");
const ConnectionRequest = require("../models/connectionRequest");

// Profile View API - GET/profile/view
router.get("/profile/view", authMiddleWare, async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      const { password, ...safeUser } = user.toObject();
      res.status(200).json({
        message: `${safeUser.firstName} View Your Profile`,
        data: safeUser,
      });
    } else {
      return res.status(404).send("user not found");
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: "Something Went Wrong!", error: err.message });
  }
});

// Profile Update API - Patch/profile/edit
router.patch("/profile/edit", authMiddleWare, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!validateProfileEdit(req.body)) {
      return res.status(400).json({
        error: "Invalid fields in profile update",
      });
    }
    // Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    // Update the loggedInUser document with the validated fields
    loggedInUser.set(req.body);
    await loggedInUser.save();
    const { password, ...updatedUser } = loggedInUser.toObject();
    res.json({
      message: `${updatedUser.firstName} your profile updated!`,
      data: updatedUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something Went Wrong!", error: err.message });
  }
});

// Password Update API --Patch/profile/passwordUpdate
router.patch("/profile/passwordUpdate", authMiddleWare, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const isPasswordMatched = await user.validatePassword(currentPassword);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid current password!" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something Went Wrong!", error: err.message });
  }
});

// To get all connection Requests API
router.get(
  "/profile/getAll/connectionRequests/:status",
  authMiddleWare,
  async (req, res) => {
    try {
      const userId = req.user._id.toString();
      const status = req.params.status.toLowerCase();
      const allRequests = await ConnectionRequest.find({
        toUserId: userId,
        status: status,
      });
      if (allRequests && allRequests.length > 0) {
        const fromUserIds = allRequests.map(
          (fromUsers) => fromUsers.fromUserId
        );
        const connectionSentUsers = await User.find({
          _id: { $in: fromUserIds },
        });
        if (connectionSentUsers.length === 0) {
          return res.status(404).json({ message: "No connections!" });
        }
        const filteredUsers = connectionSentUsers.map((user) => ({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          status: status,
        }));
        res.status(200).json({ data: filteredUsers });
      } else {
        return res.status(409).json({ message: "No available requests" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "Something Went Wrong!", error: err.message });
    }
  }
);
module.exports = router;
