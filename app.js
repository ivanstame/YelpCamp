// GLOBAL VARIABLES
const express               = require('express'),
      app                   = express(),
      bodyParser            = require('body-parser'),
      mongoose              = require('mongoose'),
      flash                 = require('connect-flash'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      methodOverride        = require('method-override'),
      Campground            = require('./models/campgrounds'),
      Comment               = require('./models/comments'),
      User                  = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds'),
      commentRoutes    = require('./routes/comments'),
      authRoutes      = require('./routes/index');

// CONNECT TO DATABASE
mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true});

// APP SETUP
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());

// ADD COOKIE SESSION FUNCTIONALITY
app.use(require('express-session')({
    secret: 'your mom',
    resave: false,
    saveUninitialized: false
}))

// PASSPORT INITIALIZATIONS (2)
app.use(passport.initialize());
app.use(passport.session());

// SERIALIZERS & AUTHENTICATION STRATEGIES (3)
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// HAVE APP USE LOGGED IN USER INFORMATION.  This creates a local variable that is available upon rendering when the page is requested.  This code removes the requirement to send a {user:user} object to the page being rendered in order to utilize the information contained in the {user:user} object.  This local variable available for use by the client is called currentUser in this case.
app.use((req, res, next) => {
    // {thing for use in html} = {thing for use in javascript}
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    //the following, at least in terms of flashing a successful login message directly after a successful login, is required as per the PassportJS documentation in order for the successFlash: <key> in the login authentication middle object to work - however you are constrained to having to call it "success"
    res.locals.success = req.flash("success");
    next();
 });

// Since these piece of shit fucking routes are utilizing so many moving parts from app.js, they have to fucking go at the bottom of app.js or necessary shit like fucking passport.initialize() will run before they are "used" by app.js and will throw a fucking error.
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(authRoutes);

app.listen(3000, () => console.log('server running on port 3000'));