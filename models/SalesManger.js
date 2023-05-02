const mongoose = require("mongoose");

const SalesManagerSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNumber: { type: String },
    timer: { type: String, require: [true, "password is required"] },
    userRole: { type: String },
  },
  { timestamps: true }
);

const SalesManager = mongoose.model("SalesManager", SalesManagerSchema);
module.exports = SalesManager;
