const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const app = express();
const { Snowflake } = require("@theinternetfolks/snowflake");
const jwt = require("jsonwebtoken");
const Community = require("../../models/communityModel");
const Member = require("../../models/memberModel");
const secretKey = "something";
router.post("/", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }


    const decoded = jwt.verify(token, secretKey);
    req.data = decoded;

    const currentUser = decoded.user.id;
    const postdata = req.body;
    const a = await Community.find({ id: postdata.community });
    if (a.owner === currentUser) {
      const newMember = new Member({
        id: Snowflake.generate(),
        community: postdata.community,
        user: postdata.user,
        role: "Community Member",
      });
      await newMember.save();
      res.json({ user: newMemebr });
    } else {
      res.json({ error: "NOT_ALLOWED_ACCESS" });
    }
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, secretKey);
    req.data = decoded;
    const currentUser = decoded.user.id;
    const postdata = req.body;
    const deleteId = req.params.id;

    const myRole = await Member.find({user:currentUser}) 

    const a = await Community.find({ id: postdata.community });
    if (myRole === "Community Moderator" || myRole === "Community Admin") {
      await Member.deleteOne({user:deleteId});
      res.json({message:"deleted"});
    } else {
      res.json({ error: "NOT_ALLOWED_ACCESS" });
    }
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
