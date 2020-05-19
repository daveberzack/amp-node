const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  startDate: { type: String, required: true },
  cumulativeScore: { type: Number, required: false },
  weightedScore: { type: Number, required: false },
  level: { type: Number, required: false },
  boosts: { type: Number, required: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
