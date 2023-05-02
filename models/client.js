const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  clientId: { type: String, required: true },
  session: { type: Object, required: true },
});

const client = mongoose.model("clients", clientSchema);
module.exports = client;
