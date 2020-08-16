const express = require("express");
const router = express.Router({ mergeParams: true });
const Topics = require("../models/topics");
const Articles = require("../models/articles");
const { authenticateToken, CheckPremium } = require("../tokens");

//topics/:topicId/articles
router.get("/", (req, res) => {
  Topics.findById(req.params.topicid)
    .populate("articles")
    .exec(function (err, foundTopic) {
      if (err) {
        console.log(err);
      } else {
        //console.log(foundTopic);
        res.render("./articles/showAllarticles", { foundTopic: foundTopic });
      }
    });
});
router.post("/", authenticateToken, (req, res) => {
  var article = {
    title: req.body.title,
    image: req.body.image,
    content: req.body.content,
    featured: req.body.featured,
  };
  Topics.findById(req.params.topicid, (err, topic) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(topic);
      Articles.create(article, (err, articleData) => {
        if (err) {
          console.log(err);
        } else {
          //console.log(articleData);
          topic.articles.push(articleData._id);
          topic.save();
          //console.log(topic);
          res.redirect(`/topics/${req.params.topicid}/articles`);
        }
      });
    }
  });
});

router.get("/new", authenticateToken, (req, res) => {
  res.render("./articles/newarticle", { id: req.params.topicid });
});

router.get("/:articleid/show", CheckPremium, (req, res) => {
  Articles.findById(req.params.articleid, function (err, article) {
    if (err) {
      console.log(err);
    } else {
      console.log(req.loggedIn, article.featured);
      if (article.featured === "true" && req.loggedIn === "false") {
        req.flash("error", "You need to login for this..");
        res.redirect("/login");
      } else {
        res.render("./articles/showOnearticle", {
          article: article,
          topicId: req.params.topicid,
        });
      }
    }
  });
});

router.get("/:articleid/edit", authenticateToken, (req, res) => {
  Articles.findById(req.params.articleid, (err, article) => {
    if (err) {
      console.log(err);
    } else {
      res.render("./articles/editarticle", {
        article: article,
        id: req.params.topicid,
      });
    }
  });
});

router.put("/:articleid", authenticateToken, (req, res) => {
  var article = {
    title: req.body.title,
    image: req.body.image,
    content: req.body.content,
    featured: req.body.featured,
  };
  Articles.findByIdAndUpdate(req.params.articleid, article, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(article);
      res.redirect(
        `/topics/${req.params.topicid}/articles/${req.params.articleid}/show`
      );
    }
  });
});

module.exports = router;
