   let campsites = [
       {title: "Indian Garden", image:"https://www.birdandhike.com/Hike/GRCA/Poi-Grca/IG-Camp/photos-igc/S120_11262a.jpg"},
       {title: "Mount Wilson", image:"https://www.hikespeak.com/img/la/Henninger_Flats/Henninger_Flats_Campgrounds_Altadena_Trail_Camp_4106.jpg"},
       {title: "June Lake", image:"http://www.californiasbestcamping.com/photos8/gull_lake_campground.jpg"}
   ]

// GLOBAL VARIABLES
const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose');


// APP SETUP
app.listen(3000, () => console.log('server running on port 3000'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:3000/yelp_camp', {useNewUrlParser: true});


// PATHS
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", (req, res) => {

   res.render("campgrounds", {campsites: campsites});
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
})

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = { title: name, image: image};
    campsites.push(newCampground);
    res.redirect("/campgrounds");
});

