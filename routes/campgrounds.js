const express    = require('express');
const router     = express.Router();
const Campground = require('../models/campgrounds');
const Comment = require('../models/comments.js');

// MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkAuthentication (req, res, next) {
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground) => {
			if(err){
				res.redirect("back")
			} else {
				if(foundCampground.author.id.equals(req.user._id)){
					next()
				} else {
					res.redirect("back")
				}
			}
		})		
	} else {
		res.redirect("back");
	}
}

//all campgrounds index page
router.get("/", (req, res) => {
	//get all campgrounds from mongodb database
	Campground.find({}, function(error, allCampgrounds) {
		if (error) {
			console.log(error);
		} else {
			res.render("campgrounds/campgrounds", {
				allCampgrounds: allCampgrounds
			});
		}
	})
});

// new campground form
router.get("/new", isLoggedIn,(req, res) => {
	res.render("campgrounds/new");
})

// post new campground
router.post("/", isLoggedIn, (req, res) => {
	let name = req.body.name;
	let image = req.body.image;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newCampground = {
		name: name,
		image: image,
		description: desc,
		author: author
	};
	Campground.create(newCampground, (createErr, createdCampground) => {
		if (createErr) {
			console.log(createErr);
		} else {
			console.log("you just added a new campground!");
		}
	})
	res.redirect("/campgrounds");
});

// show specific campground
router.get("/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {
				campground: foundCampground
			});
		}
	})
});

// edit existing campground
router.get("/:id/edit", checkAuthentication, (req, res) => {
	Campground.findById(req.params.id, (findErr, foundCampground) => {
			res.render("campgrounds/edit", {campground: foundCampground});
	})
});

// put route for finalizing edit of existing campground
router.put("/:id", checkAuthentication, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (findErr, foundCampground) => {
		if(findErr){
			res.redirect("/campgrounds")
		} else{
			res.redirect("/campgrounds/" + req.params.id)
		}
	} )
});

router.delete("/:id", checkAuthentication, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (findErr, foundCampground) => {
		if(findErr){
			console.log(findErr);
			res.redirect("/campgrounds");
		} else {
			Comment.deleteMany({_id: {$in: foundCampground.comments}}, err => {
				if(err){
					console.log(err)
					} else {
						res.redirect("/campgrounds");
					}
			});
		}
	});
})

module.exports = router;



