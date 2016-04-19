'use strict'

let passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

let User = require("./models/user")

function passportFunct() {
  // standard serialize and deserialize functions for passport
  passport.serializeUser(function(user, done) {
    done(null, user._id)
  })
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
      done(err, user)
    })
  })

  passport.use("login", new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err) } // if server error
      // if user doesnt exist flash message
      if (!user) {
        return done(null, false, { message: "Username does not exist!" })
      }
      // check the password to see if it is correct
      user.checkPassword(password, function(err, isMatch) {
        if (err) { return done(err) } // if server error
        // if there is a password match continue otherwise flash error
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, { message: "Invalid password!" });
        }
      }) // checkpassword function
    }) // findOne function
  })) // passport use
}

module.exports = passportFunct