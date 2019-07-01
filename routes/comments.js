var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// =================================
// Comments Route
// =================================

router.get("/new", middleware.isLoggedIn, function(req, res) {
  // find campground by id
  Campground.findById(req.params.id, function(err, campground) {
    if (err || !campground) {
      req.flash("error", "Campground not found.");
      res.redirect("back");
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err || !campground) {
      req.flash("error", "Campground not found.");
      res.redirect("back");
    } else {
      Comment.create(req.body.comment, function(err, newComment) {
        if (err) {
          console.log(err);
          res.redirect("/campgrounds");
        } else {
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          newComment.save();
          campground.comments.push(newComment);
          campground.save();
          req.flash("success", "Successfully added the comment");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// Edit the comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err || !campground) {
      req.flash("error", "Campground not found.");
      res.redirect("back");
    } else {
      Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
          res.redirect("back");
        } else {
          res.render("comments/edit", {
            campground_id: req.params.id,
            comment: foundComment
          });
        }
      });
    }
  });
});

// Update Comments
router.put("/:comment_id", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err || !campground) {
      req.flash("error", "Campground not found.");
      res.redirect("back");
    } else {
      Comment.findByIdAndUpdate(
        req.params.comment_id,
        req.body.comment,
        function(err, updatedComment) {
          if (err) {
            res.redirect("back");
          } else {
            req.flash("success", "Your Comment has been updated");
            res.redirect("/campgrounds/" + req.params.id);
          }
        }
      );
    }
  });
});

// Delete Comments
router.delete("/:comment_id", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err || !campground) {
      req.flash("error", "Campground not found.");
      res.redirect("back");
    } else {
      Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
          res.redirect("back");
        } else {
          req.flash("error", "Your Comment has been deleted");
          res.redirect("/campgrounds/" + req.params.id);
        }
      });
    }
  });
});

module.exports = router;
