const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  email: {
    type: String,
    required: true,
    max: 50,
  },
  user_id: {
    type: String,
    required: true,
    min: 8,
  },
  id: {
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

module.exports = mongoose.model("favorites", favoriteSchema);
