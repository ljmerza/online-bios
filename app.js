'use strict'

let bodyParser = require("body-parser"),
	cookieParser = require("cookie-parser"),
	express = require("express"),
	flash = require("connect-flash"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	path = require("path"),
	session = require("express-session")

let setUpPassport = require("./passport")
let routes = require("./routes")

let app = express()
mongoose.connect("mongodb://localhost:27017/learnAboutMe")
setUpPassport()

app.set("port", process.env.PORT || 3000)

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

app.use(express.static(path.join(__dirname, "public")))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(session({
  secret: "SD$4TRdg345gfFGET$GH4YJG466thfFYJ%Ydg",
  resave: true,
  saveUninitialized: true
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(routes)

app.listen(app.get("port"), function() {
  console.log("Server started on port:" + app.get("port"))
})
