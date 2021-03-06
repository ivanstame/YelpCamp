const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get("/", (req, res) => {
    res.render("home");
});

//  AUTH/REGISTRATION
router.get('/register', (req, res)=>{
    res.render('register');
});

router.post('/register', (req, res)=>{
    let     uName = req.body.username,
            pWord = req.body.password,
            newUser  = new User({username: uName});
    User.register(newUser, pWord, (err, addedUser) => {
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect('/register');
        } else{
            passport.authenticate('local')(req, res, () => {
                req.flash("success", "Welcome to YelpCamp " + newUser.username + "!");
                res.redirect('/campgrounds');
            });
        }
    })
})

//  LOGIN 
router.get("/login", (req, res) => {
    res.render('login');
})

/*Here you see that there is nothing really for the usual (req, res)=>() callback function to do.  Normally it is used as a space where conditions are run and dependending on those conditions, the proper redirection occurs.  This, however, is handled by the middleware passport.authenticate().  This function is different than how it is seen when we use it to register someone. */
router.post("/login", 
        passport.authenticate("local", 
            {
                successRedirect: "/campgrounds",
                failureRedirect: "/login",
                //the following is implemented to allow for a "login successful" message, as req.flash won't work
                successFlash: "Login Successful",
                failureFlash: true
                
            }), 
        function(req, res){
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "successfully logged out");
    res.redirect('/campgrounds');
})

module.exports = router;