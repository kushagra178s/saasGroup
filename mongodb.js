const mongoose = require("mongoose");
// Connect to MongoDB (replace 'yourDatabaseName' with your desired database name)
mongoose.connect("mongodb://localhost:27017/tifdatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;


