require("dotenv").config();
const express = require("express");
const dbConnection = require("./config/db");
const cookieParser = require("cookie-parser");

//Routes Dependencies
const user = require("./routes/user");
const auth = require("./routes/auth");
const profile = require("./routes/profile");
const requestConnection = require("./routes/request");

//middleware
const app = express();
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api", user);
app.use("/api", auth);
app.use("/api", profile);
app.use("/api", requestConnection);

// // Feed API - GET/feed --to get all the users
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     if (users.length > 0) {
//       console.log(users);
//       res.json({ "User Data": users });
//     } else {
//       res.status(404).send("User not found");
//     }
//   } catch (err) {
//     res.status(500).send({ message: "Something Went Wrong!", error: err });
//   }
// });

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
