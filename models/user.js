let mongoose              = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});


// Add passportLocalMongoose plugin to Schema
userSchema.plugin(passportLocalMongoose);

// Export the completed Schema as a model
module.exports = mongoose.model('User', userSchema);