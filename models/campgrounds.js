var mongoose = require('mongoose');

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// acts as a tether between the app and the database collection based on the corresponding Schema above
module.exports = mongoose.model("Campground", campgroundSchema);

