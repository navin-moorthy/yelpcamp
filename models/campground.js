var mongoose = require("mongoose");
const Comment = require("./comment");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: String,
  description: String,
  location: String,
  lat: Number,
  lng: Number,
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

campgroundSchema.pre("remove", async function(next) {
  await Comment.remove({
    _id: {
      $in: this.comments
    }
  });
  next();
});

module.exports = mongoose.model("Campground", campgroundSchema);
