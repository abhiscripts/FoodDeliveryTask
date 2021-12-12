const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let AdminData = require("../models/admin.model");
const auth = require("../middleware/auth");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

router.route("/").get((req, res) => {
  AdminData.find()
    .then((admins) => res.json(admins))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/adminInfo").get(async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const id = decoded.id;
    const admin = await AdminData.findById(id).select("-adminpassword");
    return res.json({ status: "ok", admin: admin });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

router.route("/adminregister").post(async (req, res) => {
  const { adminname, adminemail, adminpassword } = req.body;
  // Simple validation
  if (!adminname || !adminemail || !adminpassword) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const admin = await AdminData.findOne({ adminname });
    if (admin) throw Error("Admin already exists");
    const newAdmin = new AdminData({ adminname, adminemail, adminpassword });
    const savedAdmin = await newAdmin.save();
    //console.log("routes saved admin", savedAdmin);
    if (!savedAdmin) throw Error("Something went wrong saving the admin");

    const token = jwt.sign({ id: savedAdmin._id }, JWT_SECRET);

    res.status(200).json({
      token,
      admin: {
        id: savedAdmin.id,
        adminname: savedAdmin.adminname,
      },
      status: "ok",
    });
  } catch (e) {
    res.status(400).json({ status: "fail", error: e.message });
  }
});

router.route("/adminlogin").post(async (req, res) => {
  const { adminemail, adminpassword } = req.body;
  // Simple validation
  if (!adminemail || !adminpassword) {
    return res
      .status(400)
      .json({ status: "fail", msg: "Please enter all fields" });
  }

  try {
    // Check for existing admin
    const admin = await AdminData.findOne({ adminemail });
    if (!admin) throw Error("Admin does not exist . Please signup.");

    const isMatch = await bcrypt.compare(adminpassword, admin.adminpassword);
    if (!isMatch) throw Error("Invalid credentials");

    const token = jwt.sign({ id: admin._id }, JWT_SECRET);
    if (!token) throw Error("Couldnt sign the token");

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        adminname: admin.adminname,
      },
    });
  } catch (e) {
    res.status(400).json({ status: "fail", msg: e.message });
  }
});

router.route("/authadmin").get(auth, async (req, res) => {
  try {
    const admin = await AdminData.findById(req.admin.id).select("-adminpassword");
    if (!admin) throw Error("Admin does not exist");
    res.json(admin);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
