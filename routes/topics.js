const express = require("express");
const router = express.Router({ mergeParams: true });
const Topics = require("../models/topics.js");
const { authenticateToken } = require("../tokens.js");

//get request to topics
router.get("/", (req, res) => {
  Topics.find({}, function (err, topics) {
    if (err) {
      console.log(err);
      res.redirect("/topics");
    } else {
      res.render("./topics/topics", { topics: topics });
    }
  });
});

//post request to topics
router.post("/", authenticateToken, (req, res) => {
  var topic = {
    name: req.body.name,
    image: req.body.image,
  };
  Topics.create(topic, (err, data) => {
    if (err) {
      res.redirect("/topics");
    } else {
      res.redirect("/topics");
    }
  });
});

//new route for topic form
router.get("/new", authenticateToken, (req, res) => {
  res.render("./topics/newtopic");
});

module.exports = router;
