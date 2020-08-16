const express = require("express");
const router = express.Router();
const Users = require("../models/user");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createAccessToken, authenticateToken } = require("../tokens");

router.get("/register", (req, res) => {
  res.render("./auth/register");
});

router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const userData = {
    username: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  };
  //1.Check if the user already exist
  Users.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (user) {
        req.flash("error", "User already exist");
        res.redirect("/login");
      }
      //If it does not exist save it
      else {
        req.flash("success", "Successfully Registered");
        Users.create(userData, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/login");
          }
        });
      }
    }
  });
});

router.get("/login", (req, res) => {
  res.render("./auth/login");
});
router.post("/login", (req, res) => {
  //1.Check if the User is registered
  Users.findOne({ email: req.body.email }, async (err, user) => {
    try {
      if (err) {
        console.log(err);
      } else {
        if (!user) {
          req.flash("error", "Email or Password is incorrect");
          res.redirect("/login");
        } else {
          //2.If it exist check the Password
          const valid = await bcrypt.compare(req.body.password, user.password);
          if (!valid) {
            res.redirect("/login");
          }
          //3.if valid create a json toker and store the user email in the session
          const accessToken = await createAccessToken(user._id);

          //session storing
          const sessionData = req.session;
          sessionData.authToken = {};
          //console.log(accessToken);
          sessionData.authToken.token = accessToken;
          sessionData.authToken.username = user.username;
          sessionData.authToken.admin = user.admin;

          res.redirect("/topics");
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
});

router.delete("/logout", (req, res) => {
  const sessionData = req.session;
  sessionData.destroy(function (err) {
    if (err) {
      return res.json("Error destroying session");
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
