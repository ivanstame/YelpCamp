const express    = require('express');
const router     = express.Router();
const Campground = require('../models/campgrounds');

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

router.get("/new", (req, res) => {
	res.render("campgrounds/new");
})

router.post("/", (req, res) => {
	let name = req.body.name;
	let image = req.body.image;
	let desc = req.body.description;
	let newCampground = {
		name: name,
		image: image,
		description: desc
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
})



module.exports = router;