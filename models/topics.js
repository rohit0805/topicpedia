const mongoose = require("mongoose");

var TopicSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/600x400.png/333/ccc",
  },
  articles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Articles",
    },
  ],
  date: {
    type: String,
    default: Date.now,
  },
});

var Topics = mongoose.model("Topics", TopicSchema);

module.exports = Topics;
