const mongoose = require("mongoose");

const ContactSchema = mongoose.Schema({
  user: {
    //we create a relation between contacts and their contacts owners
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  //type of relationship between user and the contact they are adding
  type: {
    type: String,
    default: "personal",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("contact", ContactSchema);
