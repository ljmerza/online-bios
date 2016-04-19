'use strict'

let express = require("express"),
  passport = require("passport")

let User = require("./models/user")
let router = express.Router()

// make sure user is still authenticated before changing data
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    req.flash("info", "You must be logged in to see this page.")
    res.redirect("/login")
  }
}

// collect all flash messages to response object
router.use(function(req, res, next) {
  res.locals.currentUser = req.user
  res.locals.errors = req.flash("error")
  res.locals.infos = req.flash("info")
  next()
})

// find all users in db and send page displaying all users found
router.get("/", function(req, res, next) {
  User.find()
  .sort({ createdAt: "descending" })
  .exec(function(err, users) {
    if (err) { return next(err) }
    res.render("index", { users: users })
  })
})

// get the login page
router.get("/login", function(req, res) {
  res.render("login")
})

// authenticate when submitting credentials from login age
router.post("/login", passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}))

// logout user and redirect to home page
router.get("/logout", function(req, res) {
  req.logout()
  res.redirect("/")
})

// send client sign up page
router.get("/signup", function(req, res) {
  res.render("signup");
})

// create new account once user submits sign up data
router.post("/signup", function(req, res, next) {

  var username = req.body.username
  var password = req.body.password

  // check to see if user data already exists
  User.findOne({ username: username }, function(err, user) {

    if (err) { return next(err) } // if server error
    // if user already exists then send error  
    if (user) {
      req.flash("error", "User already exists")
      return res.redirect("/signup")
    }

    // create a new user model for mongoDB
    var newUser = new User({
      username: username,
      password: password
    })
    newUser.save(next) // save new user

  })
// then use new credentials to login
}, passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/signup",
  failureFlash: true
}))

// find the requested user from the db and send data if found
router.get("/users/:username", function(req, res, next) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) { return next(err) } // if server error
    if (!user) { return next(404) } // if no user eixsts send 404 error
    res.render("profile", { user: user })
  })
})

// get the editing of a user page - ensure still authenticated first
router.get("/edit", ensureAuth, function(req, res) {
  res.render("edit")
})

// edit user data in db - ensure still authenticated first
router.post("/edit", ensureAuth, function(req, res, next) {
  req.user.displayName = req.body.displayname
  req.user.bio = req.body.bio
  req.user.save(function(err) {
    if (err) { return next(err) } // if server error
    req.flash("info", "Profile updated!")
    res.redirect("/edit")
  })
})

module.exports = router
