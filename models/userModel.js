const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100,
  },
  about: {
    type: String,
    max: 500,
  },
  credits: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    required: true,
    max: 50,
  },
  dob: {
    type: String,
    max: 50,
  },
  gender: {
    type: String,
    max: 50,
  },
  relationship_status: {
    type: String,
    max: 50,
  },
  height: {
    type: String,
    max: 50,
  },
  body_type: {
    type: String,
    max: 50,
  },
  hair_color: {
    type: String,
    max: 50,
  },
  eye_color: {
    type: String,
    max: 50,
  },
  city: {
    type: String,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("user", userSchema);
