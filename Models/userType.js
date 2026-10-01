const mongoose = require("mongoose");

const userTypeSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "UserType",
  userTypeSchema,
  "userType"
);