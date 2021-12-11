const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let UserData = require("../models/user.model");
const auth = require("../middleware/auth");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

router.route("/").get((req, res) => {
  UserData.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/userInfo").get(async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const id = decoded.id;
    const user = await UserData.findById(id).select("-password");
    return res.json({ status: "ok", user: user });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

router.route("/register").post(async (req, res) => {
  const { name, email, password } = req.body;
  console.log("routes reg", email);
  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await UserData.findOne({ name });
    if (user) throw Error("User already exists");
    const newUser = new UserData({ name, email, password });
    const savedUser = await newUser.save();
    if (!savedUser) throw Error("Something went wrong saving the user");

    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET);

    res.status(200).json({
      token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
      },
      status: "ok",
    });
  } catch (e) {
    res.status(400).json({ status: "fail" , error: e.message });
  }
});

router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ status: "fail" , msg: "Please enter all fields" });
  }

  try {
    // Check for existing user
    const user = await UserData.findOne({ email });
    if (!user) throw Error("User does not exist . Please signup.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error("Invalid credentials");

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    if (!token) throw Error("Couldnt sign the token");

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (e) {
    res.status(400).json({ status: "fail" , msg: e.message });
  }
});

router.route("/authuser").get(auth, async (req, res) => {
  try {
    const user = await UserData.findById(req.user.id).select("-password");
    if (!user) throw Error("User does not exist");
    res.json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
