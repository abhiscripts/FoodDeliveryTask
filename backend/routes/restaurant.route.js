const router = require("express").Router();
const jwt = require("jsonwebtoken");
//const bcrypt = require("bcrypt");
let AdminData = require("../models/admin.model");
let RestaurantData = require("../models/restaurant.model");
//const auth = require("../middleware/auth");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

router.route("/addResData").post(async (req, resp) => {
  const { resName, resPlace, resDishes } = req.body;
  // Simple validation
  if (!resName || !resPlace || !resDishes.length) {
    return resp.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const res = await RestaurantData.findOne({ resName });
    if (res) throw Error("Restaurant already added");
    const newRes = new RestaurantData({ resName, resPlace, resDishes });
    const savedRes = await newRes.save();
    if (!savedRes)
      throw Error("Something went wrong saving the restaurant data");

    resp.status(200).json({
      res: {
        id: savedRes._id,
        resName: savedRes.resName,
      },
      status: "ok",
    });
  } catch (e) {
    resp.status(400).json({ status: "fail", error: e.message });
  }
});

module.exports = router;
