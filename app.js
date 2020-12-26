const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Welcome to Test Vera!"));

app.get("/TestVera", function (req, res) {

  const testData = {
    content: req.query.Content
  };

  console.log("TestData : ", testData);

  res.send("Request Succesful!")

});

// port for the server to listen on
const port = app.listen(process.env.PORT || 3000);

app.listen(port, () => {
  console.log("My REST API running");
});