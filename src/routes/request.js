const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { authMiddleWare } = require("../middlewares/auth");
router.post(
  "/request/send/:status/:touserId",
  authMiddleWare,
  async (req, res) => {
    try {
      console.log(req.user);
      const fromUserId = req.user._id.toString();
      const toUserId = req.params.touserId;
      console.log("toUserId", toUserId);
      const status = req.params.status.toLowerCase();
      if (fromUserId === toUserId) {
        return res.status(403).json({
          message: "You cannot send a connection request to your own account!",
        });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res
          .status(404)
          .json({ message: "User not found to send a connection request!" });
      }
      const allowedSConnection = ["interested", "ignored"];
      if (!allowedSConnection.includes(status)) {
        return res.status(400).json({
          message: `${status} is not a valid request status.`,
        });
      }
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(409).json({
          status: `Request already sent to ${toUser.firstName}`,
          data: existingRequest,
        });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      if (status == "interested") {
        res.status(200).json({
          message: `${req.user.firstName} ${status} in ${toUser.firstName} profile`,
        });
      } else {
        res.status(200).json({
          message: `${req.user.firstName} ${status} ${toUser.firstName} profile`,
        });
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "Something Went Wrong!", error: err.message });
    }
  }
);
module.exports = router;
