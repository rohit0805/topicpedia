const mongoose = require("mongoose");

var ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/600x400.png/333/ccc",
  },
  content: {
    type: String,
  },
  featured: {
    type: String,
  },
  date: {
    type: String,
    default: Date.now,
  },
});

var Articles = mongoose.model("Articles", ArticleSchema);

module.exports = Articles;
