// To use Google API Key
require("dotenv").config();
// Node Packages
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  User = require("./models/user");
methodOverride = require("method-override");

// Requiring Routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");

// Package Initializations
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB() // Seed the database

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "idontknow",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

// Local Variables
app.locals.moment = require("moment");
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.danger = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Routes
// Home Route
app.get("/", function(req, res) {
  res.render("landing");
});

app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Server Listen
app.listen(process.env.PORT, process.env.IP, function(err) {
  if (err) {
    console.log(err);
  }
  console.log("I am at your service");
});
