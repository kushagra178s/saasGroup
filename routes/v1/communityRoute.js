const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const app = express();
const { Snowflake } = require("@theinternetfolks/snowflake");
const jwt = require("jsonwebtoken");
const connection = require("../../mongodb");
const Role = require("../../models/roleModel");
const Community = require("../../models/communityModel");
const Member = require("../../models/memberModel");
const secretKey = "your-secret-key";

router.post("/", async (req, res) => {
  // res.send("community")
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // console.log(token)

    try {
      const decoded = jwt.verify(token, secretKey);
      req.data = decoded;

      // Assuming decoded contains the necessary information, replace 'decoded' with the actual user information
      const currentUser = decoded;
      console.log("token data = ", decoded.user.id);

      const newCommunity = new Community({
        id: Snowflake.generate(),
        name: req.body.name,
        slug: req.body.name,
        owner: decoded.user.id,
      });

      // // Save the new community to the database
      await newCommunity.save();

      res.status(201).json({
        message: "Community created successfully",
        community: newCommunity,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const serverData = await Community.find();
    res.json({ data: serverData });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.get("/:id/members", async (req, res) => {
  try {
    const communityId = req.params.id;
    // console.log(communityId);
    const members = await Member.find();
    const responseData = {
      status: true,
      content: {
        meta: {
          total: members.length,
          pages: 1,
          page: 1,
        },
        data: members,
      },
    };
    res.json(responseData);
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.get("/me/owner", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    const decoded = jwt.verify(token, secretKey);
    req.data = decoded;
    // console.log("jwtdata = ", decoded)
    const myId = decoded.user.id;
    const serverData = await Community.find({ owner: myId });
    const responseData = {
      status: true,
      content: {
        meta: {
          total: serverData.length,
          pages: 1,
          page: 1,
        },
        data: [serverdata],
      },
    };
    res.json(responseData);
  } catch (e) {
    res.json({ error: e.message });
  }
});
router.get("/me/member", async(req, res)=>{
  try{
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    const decoded = jwt.verify(token, secretKey);
    req.data = decoded;
    const myId = decoded.user.id;
    const serverData = await member.find({user:myId});
    const responseData = {
      status: true,
      content: {
        meta: {
          total: serverData.length,
          pages: 1,
          page: 1,
        },
        data: [serverdata],
      },
    };
    res.json(responseData);;
  }
  catch(e) {
    res.json({error:e.message});
  }
})

module.exports = router;
