const mongoose = require("mongoose");

// Define Community schema
const communitySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    owner: { type: String, ref: "User", required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  });
  
const Community = mongoose.model("Community", communitySchema);

module.exports = Community;