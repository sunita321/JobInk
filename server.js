//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var hbs = require("express-handlebars");
var bodyParser = require("body-parser");
var Promise = require('bluebird');
mongoose.Promise = Promise;

var passport = require('passport');//Adding Auth0
var Auth0Strategy = require('passport-auth0');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var path = require('path');



dotenv.load();

var user = require('./config/user');

// Set up Port
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

//Set Express Router
var router = express.Router();

//Require Routes
require("./config/routes")(router);

//Make public folder static
//app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, 'public')));

//Connect Handlebars to Express
app.engine("handlebars", hbs({
defaultLayout: "main"
}));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

//Auth0 strategy
// Configure Passport to use Auth0
var strategy = new Auth0Strategy({
    domain:       process.env.AUTH0_DOMAIN,
    clientID:     process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:  process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

passport.use(strategy);


// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(logger('dev'));
app.use(bodyParser.json());
//Use bodyParser
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(session({
  secret: 'shhhhhhhhh',
  resave: true,
  saveUninitialized: true
}));






//Auth0 Config Middleware
app.use(passport.initialize());
app.use(passport.session());



app.use('/user', user);




//Mongo

app.use(router);

var MONGODB_URI = "mongodb://heroku_pjlccg96:rl5b83vfh7382t20o59bd8ovnq@ds137360.mlab.com:37360/heroku_pjlccg96";


//Mongoose database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoJobs";

//Connnect mongoose to database
mongoose.connect(db, function(error)
{
	if (error)
	{
		console.log(error);
	}
	else {
		console.log("Mongoose connection successful!");
	}
});

app.listen(PORT, function()
{
  console.log('Listening on port: ' + PORT);
});

module.exports = app;
