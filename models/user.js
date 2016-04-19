'use strict'

let bcrypt = require("bcrypt-nodejs"),
  mongoose = require("mongoose")

const SALT_FACTOR = 10

// ceate schema for documents created
const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  displayName: String,
  bio: String
})

const noop = function() {}

// before any save of data check to see if password has changed
userSchema.pre("save", function(done) {
  // if passworsd has not changed then end before saving new data
  if (!this.isModified("password")) {
    return done()
  }

  /*if password has hanged then salt the password and store it
  arrow functions are used here to preserve the context of 'this'*/
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) { return done(err) }

    bcrypt.hash(this.password, salt, noop, (err, hashedPassword) => {
      if (err) { return done(err) }
      this.password = hashedPassword
      done()
    })
  })

})

// use bcrypt's compare method to properly compare salts - this adds to Schema
userSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch)
  })
}

// add a function to the schema to display user name
userSchema.methods.name = function() {
  return this.displayName || this.username
}

// create the model and export it
let User = mongoose.model("User", userSchema)
module.exports = User
