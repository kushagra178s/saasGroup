const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser());
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const secretKey = "something";

const User = require("../../models/usersModel");
const { Snowflake } = require("@theinternetfolks/snowflake");

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = new User({
      id: Snowflake.generate(),
      name: data.name,
      email: data.email,
      password: hash,
    });
    await newUser.save();
    // Create a JWT
    const token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });

    // Send the token in the response
    return res.json({ token : token });
  } catch (e) {
    return res.json({ error: e });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.json({ error: "user doesnt exist in database." });
    }
    const password = await bcrypt.compare(data.password, user.password);
    if (!password) {
      return res.json({ error: "password error", password: user.password });
    }
    //now user should be signedin
    // Create a JWT
    const token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });

    res.json({ token });
  } catch (e) {
    return res.json({ error: e });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, secretKey); 
    req.data = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

router.get("/me", verifyToken, (req, res) => {
  const { user } = req.data;
  return res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  });
});

module.exports = router;
