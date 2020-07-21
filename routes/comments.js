const express = require('express');
//I cannot express how fucking important the fucking mergeParams shit below is.  Without it you will go through hell after refactoring the routes.  The req.params.id bullshit couldn't pull any info because fucking /new didn't have any url parameters.  They were fucking stuck in app.js.  HAS TO DO WITH NESTED ROUTES
const router = express.Router({mergeParams:true});
const middleware = require('../middleware');

const Campground = require('../models/campgrounds');
const Comment    = require('../models/comments');

router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (findErr, foundCampground) => {
        if(findErr){
            console.log(findErr);
        } else {
            //renders from the views folder, remember that
            console.log(req.body);
            res.render("comments/new", {campground: foundCampground});
        }
    })

})


// Ivan's attempt - successful but not as efficient 
// router.post("/campgrounds/:id/comments", (req, res) => {
//     let commentAuthor = req.body.comment.author;
//     let commentBody = req.body.comment.text;
//     let newComment = {author: commentAuthor, text: commentBody }
//     Comment.create(newComment, (createNewComErr, createdComment) => {
//         if(createNewComErr){
//             next(createNewComErr)
//         } else {
//             Campground.findById(req.params.id, (err, foundCampground) => {
//                 if(err){
//                     console.log("oops")
//                     next(err)
//                 } else {
//                     foundCampground.comments.push(createdComment);
//                     foundCampground.save();
//                     res.redirect("/campgrounds/" + req.params.id)
//                 }
//             })
//         }
//     }
//     )
// })

// Correct, Colte Version
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (findErr, foundCampground) => {
        if(findErr){
            next(findErr);
        }   else {
            Comment.create(req.body.comment, (createErr, createdComment) => {
                if(createErr){
                    next(createErr);
                }   else {
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            })
        }
    })
})

// ROUTE FOR THE UPDATE COMMENT FORM
router.get("/:comment_id/edit", middleware.checkCommentAuth, (req, res) => {

    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect("back");
        } else {
            //remember that you have to send the campground_id and comment objects to the page being  rendered since we need to display
            //information from those objects on the edit form itself as well as the action path the submit takes
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
})

router.put("/:comment_id", middleware.checkCommentAuth, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
        if(err) {
            res.redirect("back")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

router.delete("/:comment_id", middleware.checkCommentAuth, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect("/campgrounds/" + req.params.id)
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})


module.exports = router;