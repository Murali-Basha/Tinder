const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Welcome to the homepage");
});
app.use("/", (req, res) => {
  res.send("Hello from the Server!");
});
app.listen(3000, () => {
  console.log(`Server is listening on port 3000`);
});
