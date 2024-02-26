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

//global error
app.use((req, res) => {
  return res.status(200).json("error in the route");
});

//server
app.listen(3001, function (req, res) {
  console.log("server started at port 3001.");
});
