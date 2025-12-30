const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PhoneBan = mongoose.model("BanPhone", UserSchema, "BanPhone");
module.exports = PhoneBan;
