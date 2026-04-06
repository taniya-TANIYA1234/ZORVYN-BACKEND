const express = require('express'); 
const router = express.Router();
const { schema } = require('../schema');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');


router.get('/', (req, res) => {
    res.render('login.ejs');
});

router.post('/',passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(async (req, res, next) => {
if (req.user.role === 'Admin') {
    req.flash('success', `Welcome ${req.user.username}!`);

        return res.redirect('/records'); 
    } else if (req.user.role === 'Viewer') {
req.flash('success', `Welcome ${req.user.username}!`);

        return res.redirect(`/users/${req.user._id}`); 
    } else if (req.user.role === 'Analyst') {
req.flash('success', `Welcome ${req.user.username}!`);

        return res.redirect(`/records`); 
    }

}));

router.post('/logout', (req, res) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success', 'Logged out successfully!');
        res.redirect('/login');
    });
});

module.exports = router;