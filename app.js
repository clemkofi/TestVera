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


// function to get authentication details of the box
function authentication(req, res, next) {
  var authheader = req.headers.authorization;
  console.log(req.headers);

  if (!authheader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err)
  }

  var auth = new Buffer.from(authheader.split(' ')[1],
  'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];

  if (user == "45113480" && pass == "klugheim2020!") {
    // If Authorized user
    next();
    return true;
  } else {
    var err = new Error("You are not authenticated!");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    return next(err);
  }

}

// initialize cloud firestore
const firestore = admin.firestore();

app.use(express.json());

app.get("/", (req, res) => res.send("Welcome to Test Vera!"));

// get request to be used by plugin
app.get("/TestVera", function (req, res) {
  const testData = {
    content: req.query.Content,
  };

  console.log("TestData : ", testData);

  res.send("Request Succesful!");
});

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// check the authorization here before the initiation of any post request
app.use(authentication);

// this is the part of the app that does all auth for the user 
// test for authentication function written now 

// post request to use on the vera box
app.post("/TestVera", async function (req, res) {
  console.log("request body : ", req.body);

  console.log("Serial_No: ", req.body.Serial_No);
  console.log("Unixtimestamp: ", req.body.Unixtimestamp);

  var firebase_request_ok = 0;

  let request_data = JSON.parse(JSON.stringify(req.body));

  // reformat the data for the rooms
  request_data.rooms = req.body.rooms.map((val,i)=>{ 
    var room_str = "raum";
    room_str = room_str.concat(i);
    return {
      [room_str]: [...val] 
    }
  });

  // reformat the data for the temperature sensors
  request_data.Temperatursensors = req.body.Temperatursensors.map((val,i)=>{ 
    var temp_str = "tempsensor";
    temp_str = temp_str.concat(i);
    return {
      [temp_str]: [...val] 
    }
  });

  // reformat the data for the DWS sensors
  request_data.DoorWindowsensors = req.body.DoorWindowsensors.map((val,i)=>{ 
    var DWS_str = "DWsensor";
    DWS_str = DWS_str.concat(i);
    return {
      [DWS_str]: [...val] 
    }
  });

  // reformat the data for the Motion sensors
  request_data.Motionsensors = req.body.Motionsensors.map((val,i)=>{ 
    var Motion_str = "MotionSensor";
    Motion_str = Motion_str.concat(i);
    return {
      [Motion_str]: [...val] 
    }
  });

  // reformat the data for the Humidity sensors
  request_data.Humiditisensors = req.body.Humiditisensors.map((val,i)=>{ 
    var humidity_str = "humiditySensor";
    humidity_str = humidity_str.concat(i);
    return {
      [humidity_str]: [...val] 
    }
  });

  // reformat the data for the Switches sensors
  request_data.Switches = req.body.Switches.map((val,i)=>{ 
    var switches_str = "switch";
    switches_str = switches_str.concat(i);
    return {
      [switches_str]: [...val],
    };
  });

  // reformat the data for the light sensors
  request_data.Lichtsensors = req.body.Lichtsensors.map((val,i)=>{ 
    var light_str = "lightSensor";
    light_str = light_str.concat(i);
    return {
      [light_str]: [...val] 
    }
  });

  // console.log(request_data);

  // console.log(req.body);

  // cloud firestore request
  await firestore
    .collection(collectionKey)
    .doc(req.body.Serial_No)
    .collection(req.body.Unixtimestamp.toString())
    .doc(req.body.Unixtimestamp.toString())
    .set(request_data)
    .then((res) => {
      console.log("Database input successful!");
      firebase_request_ok = 1;
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

  if (firebase_request_ok == 1) {
    res.send("Request Succesful!");
  } else {
    res.send("Request Unsuccesful!");
  }

  // res.send("Ok to go!");
});

// port for the server to listen on 3000 or port from heroku
const port = app.listen(process.env.PORT || 3000);

app.listen(port, () => {
  console.log("My REST API running");
});


// exports to be used for testing purposes
module.exports = {
  app,
  authentication
};