const Campground = require('../models/campgrounds');
const Comment = require('../models/comments.js');

const middleware = {};

middleware.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middleware.checkCampgroundAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back")
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middleware.checkCommentAuth = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                req.flash("error", "Comment not found");
                res.redirect("back")
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}



module.exports = middleware;