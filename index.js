const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
app.use(bodyParser());

// Connect to MongoDB (replace 'yourDatabaseName' with your desired database name)
mongoose.connect("mongodb://localhost:27017/tifdatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const v1Route = require("./routes/v1/v1Route");

app.use("/v1", v1Route);

// Create models
// const User = require('./models/usersModel');
const Community = require('./models/communityModel');
const Role = require('./models/roleModel');
const Member = require('./models/memberModel');

//restapi
app.get("/v1/role", (req, res) => {
  return res.status(200).json("hello");
  // res.send("hello")
});


//server
app.listen(3001, function (req, res) {
  console.log("server started at port 3001.");
});
