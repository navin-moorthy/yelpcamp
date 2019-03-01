var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// ====================================================
// AUTH ROUTES
// ====================================================

// show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login", {page: "login"});
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        successFlash: "Welcome Back to Yelpcamp",
        failureFlash: true
    }), function(req, res){
        res.send("Post accepted");
});

// logout the user
router.get("/logout", function(req, res){
    req.logout();
    req.flash("error", "See you soon!!")
    res.redirect("/campgrounds");
});

module.exports = router;