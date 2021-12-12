const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    resName: { type: String, required: true },
    resPlace: { type: String, required: true },
    resDishes: { type: Array, required: true },
  }
);

module.exports = mongoose.model("RestaurantData", restaurantSchema);
