if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const cors = require("cors");

//setting default engine to ejs
app.set("view engine", "ejs");
app.use(cors());

//mongoose configuration
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

//middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(require("method-override")("_method"));
app.use(flash());
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 300000 },
  })
);

//global middleware
app.use(function (req, res, next) {
  res.locals.error_msg = req.flash("error");
  res.locals.success_msg = req.flash("success");
  res.locals.CurrentUser =
    req.session.authToken && req.session.authToken.username;
  res.locals.Admin = req.session.authToken && req.session.authToken.admin;
  next();
});

//Routes
const landingpage = require("./routes/landing");
const topicspage = require("./routes/topics");
const articlespage = require("./routes/articles");
const register = require("./routes/register");
//Routes middlewares
app.use("/", landingpage);
app.use("/topics", topicspage);
app.use("/topics/:topicid/articles", articlespage);
app.use("/", register);

//listening to the server
app.listen(PORT, () => {
  console.log(`The Server Started at PORT ${PORT}`);
});
