const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Bu alanı doldurmak zorunludur",
  },
  image: {
    type: String,
    required: "Bu alanı doldurmak zorunludur",
  }
});

module.exports = mongoose.model("Category", categorySchema);