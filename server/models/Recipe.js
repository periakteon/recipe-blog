const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Bu alanı doldurmak zorunludur",
  },
  description: {
    type: String,
    required: "Bu alanı doldurmak zorunludur",
  },
  email: {
    type: String,
    required: "Bu alanı doldurmak zorunludur",
  },
  ingredients: {
    type: Array,
    required: "Bu alanı doldurmak zorunludur",
  },
  category: {
    type: String,
    enum: ["Thai", "American", "Chinese", "Mexican", "Indian"],
    required: "Bu alanı doldurmak zorunludur",
  },
  image: {
    type: String,
    required: "Bu alanı doldurmak zorunludur",
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);