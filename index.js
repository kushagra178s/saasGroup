const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser());

const PORT = process.env.PORT || 3001;

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
app.listen(PORT, function (req, res) {
  console.log("server started at port 3001.");
});
