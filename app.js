// libraries and imports
const express = require("express");
const app = express();
const admin = require("./node_modules/firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const collectionKey = "boxes";

// cloud firestore initailization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://klugheimmobile-baaa5.firebaseio.com",
});

// initialize cloud firestore
const firestore = admin.firestore();

app.use(express.json());

app.get("/", (req, res) => res.send("Welcome to Test Vera!"));

// testing the firebase data entry
app.get("/TestFireBase", async function (req, res) {
  var firebase_request_ok = 0;

  await firestore
    .collection(collectionKey)
    .doc("clem2")
    .set({'my_self' : "Key_test", 'him_self' : 'Key_Test_2'})
    .then((res) => {
      console.log("Data input successful!");
      firebase_request_ok = 1;
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

  if (firebase_request_ok == 1){
    res.send("Request Succesful!");
  } else {
    res.send("Request Unsuccesful!");
  }
});

// get request to be used by plugin
app.get("/TestVera", function (req, res) {
  const testData = {
    content: req.query.Content,
  };

  console.log("TestData : ", testData);

  res.send("Request Succesful!");
});

// post request to use on the vera box
app.post("/TestVera", async function (req, res) {

  console.log("request body : ", req.body);

  var firebase_request_ok = 0;

  await firestore
    .collection(collectionKey)
    .doc(req.body.Serial_No)
    .collection(req.body.Unixtimestamp)
    .doc(req.body.Unixtimestamp)
    .set(req.body)
    .then((res) => {
      console.log("Data input successful!");
      firebase_request_ok = 1;
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

  if (firebase_request_ok == 1)   {
    res.send("Request Succesful!");
  } else {
    res.send("Request Unsuccesful!");
  }
});

// port for the server to listen on 3000 or port from heroku
const port = app.listen(process.env.PORT || 3000);

app.listen(port, () => {
  console.log("My REST API running");
});
