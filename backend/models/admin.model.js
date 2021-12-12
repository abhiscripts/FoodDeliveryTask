const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    adminname: { type: String, required: true, min: 3, max: 15 },
    adminemail: { type: String, required: true, min: 5, max: 40 },
    adminpassword: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function (next) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.adminpassword, salt);
      this.adminpassword = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });

module.exports = mongoose.model("AdminData", adminSchema);