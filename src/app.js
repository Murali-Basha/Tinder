require("dotenv").config();
const express = require("express");
const dbConnection = require("./config/db");
const User = require("./models/user");

const app = express();
app.use(express.json());

app.post("/signUp", async (req, res) => {
  try {
    console.log("req.body", req.body);
    const userObject = req.body;
    await User(userObject).save();
    res.send("User Addded!");
  } catch (err) {
    res.status(400).send("Error saving the user ");
  }
});

// User API - GET/getsuer -- to get a user by email
app.get("/getUser", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.find({ email: email });
    if (user.length > 0) {
      console.log(user);
      res.json({ "User Data": user });
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});
// Feed API - GET/feed --to get all the users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length > 0) {
      console.log(user);
      res.json({ "User Data": users });
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send({ message: "Something Went Wrong!", error: err });
  }
});

// Delete API - Delete/user -- to delete the user
app.delete("/user", async (req, res) => {
  const userId = req.body.Id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.send("user not found");
    } else {
      res.send("User deleted!");
    }
  } catch (err) {
    res.status(500).send("Something Went wrong!");
  }
});

// Update API - Patch/user -- to update the user
app.patch("/user", async (req, res) => {
  const userId = req.body.Id;
  const data = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after", // it will return the updated document if we want we can get the updated before document
    });
    if (!updatedUser) {
      res.send("User not found");
    } else res.send({ message: "User updated!", data: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

const startServer = async () => {
  try {
    await dbConnection();
    console.log("Connected to DB!");
  } catch (err) {
    console.error("Failed to connect DB!", err);
    process.exit(1); // Exit if DB connection fails
  }
  try {
    app.listen(3000, () => {
      console.log(`Server is listening on port 3000`);
    });
  } catch (err) {
    console.error("Failed to server!", err);
    process.exit(1);
  }
};
startServer();
