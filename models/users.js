const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
    description: "password must be at least 8 characters long, and is required",
  },
  createdAt: {
    type: Date,
  },
  apiKeyInfo: [
    {
      email: String,
      userId: String,
      createdAt: Date,
      apiKey: { type: String, default: uuidv4 },
      defaultCredits: { type: Number, default: 50 },
      credits_used: { type: Number, default: 0 },
      credits_left: { type: Number, default: 50 },
      resetDate: { type: Date, default: Date.now() + 1 * 60 * 1000 }, // 1 minutes
    },
  ],
  //   defaultCredits : { type: Number, default: 50 },
  //   credits_used :{type: Number , default: 0},
  //   credits_left: { type: Number,default:50},
  //   resetDate: { type: Date, default: Date.now() + 1 * 60 * 1000 },  // 1 minutes
});

const User = mongoose.model("users", userSchema);
module.exports = User;

// 1 minutes :  1 * 60 * 1000
// 1 month : 30 * 24 * 60 * 60 * 1000
