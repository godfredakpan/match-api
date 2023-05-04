const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 50,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  about: {
    type: String,
    default: "",
  },
  age: {
    type: Number,
    default: 0,
  },
  relationship: {
    type: String,
    default: "",
  },
  body_type: {
    type: String,
    default: "",
  },
  avatarImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("moderators", userSchema);
