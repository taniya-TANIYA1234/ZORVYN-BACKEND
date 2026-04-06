// DB with express
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// local files
const ExpressError = require('./utils/ExpressError');
const {records} = require('./routes/records');
const users = require('./routes/user');
const login = require('./routes/login');
const user = require('./models/user');

// set view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));




const sessionOptions = {
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/records', records);
app.use('/users', users);
app.use('/login', login);


// connect to MongoDB
main().then(()=>{
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect('mongodb://localhost:27017/fianance-zorvyn');
}

//all route except specified
app.use((req, res, next) => {
    const err = new ExpressError('Page Not Found', 404);
    next(err);
});

// error handler middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render('error.ejs', { message });
});


// start the server 
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});