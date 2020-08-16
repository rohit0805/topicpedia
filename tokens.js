const jwt = require("jsonwebtoken");
const Users = require("./models/user");

const createAccessToken = async (userId) => {
  return await jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "300000",
  });
};

async function CheckPremium(req, res, next) {
  console.log(req.session.authToken);
  const token = req.session.authToken && req.session.authToken.token;
  req.loggedIn = "true";
  if (!token) {
    req.loggedIn = "false";
    return next();
  }

  //We have valid token now we need to verify that token
  await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //we know you have token but its expired
    if (err) {
      const sessionData = req.session;
      if (sessionData) {
        sessionData.authToken = {};
        //console.log(user,'asdf');
        req.loggedIn = "false";
        req.flash("error", "Session has expired");
        res.redirect("/login");
      }
    } else {
      next();
    }
  });
}

async function authenticateToken(req, res, next) {
  //Get the Token that they send us
  //We are going to get the Token from the header in the form
  //Bearer <Token>
  const token = req.session.authToken && req.session.authToken.token;
  if (!token) {
    req.flash("error", "You need to login first");
    return res.redirect("/login");
  }

  //We have valid token now we need to verify that token
  await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //we know you have token but its expired
    if (err) {
      const sessionData = req.session;
      if (sessionData) {
        sessionData.authToken = {};
        req.flash("error", "Session has expired");
        res.redirect("/login");
      }
    } else {
      req.user = user;
      console.log(user);
      Users.findById(user.userId, async (err, userdata) => {
        if (err) {
          console.log(err);
        } else {
          if (userdata.admin === "true") {
            next();
          } else {
            res.json({
              msg: "For Admin User only",
              contact: "For Getting AdminId Contact Us",
            });
          }
        }
      });
    }
  });
}

module.exports = {
  createAccessToken,
  authenticateToken,
  CheckPremium,
};
