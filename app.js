const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Welcome to Test Vera!"));

// get request to be used by plugin
app.get("/TestVera", function (req, res) {

  const testData = {
    content: req.query.Content
  };

  console.log("TestData : ", testData);

  res.send("Request Succesful!")

});

// post request to use on the vera box
app.post("/TestVera", async function (req, res) {
    const testData = {
      content_1: req.body.Content_1,
      content_2: req.body.Content_2,
    };
  
    console.log("TestData : ", testData);

    console.log("request body : ", req.body);

    res.send("Request Succesful!");
  
  });

// port for the server to listen on 3000 or port from heroku
const port = app.listen(process.env.PORT || 3000);

app.listen(port, () => {
  console.log("My REST API running");
});