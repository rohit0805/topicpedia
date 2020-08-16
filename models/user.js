const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  admin: {
    type: String,
    default: "false",
  },
});

var Users = mongoose.model("Users", UserSchema);

module.exports = Users;
