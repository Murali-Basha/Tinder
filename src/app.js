const express = require("express");

const app = express();

app.post("/user", (req, res) => {
  res.send("User data saved successfully!");
});
// this will match only get api call
app.get("/user", (req, res) => {
  res.send({ firstname: "Murali", lastname: "Basha" });
});
// this will match all the http api calls to test
app.use("/test", (req, res) => {
  res.send("Welcome to the homepage");
});
app.delete("/user", (req, res) => {
  res.send("User deleted!");
});

app.listen(3000, () => {
  console.log(`Server is listening on port 3000`);
});
