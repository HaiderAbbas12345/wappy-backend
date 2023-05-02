const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: { type: String, require: [true, "email is required"] },
    phoneNumber: { type: String },
    password: { type: String, require: [true, "password is required"] },
    userRole: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
