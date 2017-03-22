//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var hbs = require("express-handlebars");
var bodyParser = require("body-parser");
var Promise = require('bluebird');
mongoose.Promise = Promise;


// Set up Port
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

//Set Express Router
var router = express.Router();

//Require Routes
require("./config/routes")(router);

//Make public folder static
app.use(express.static(__dirname + "/public"));

//Connect Handlebars to Express
app.engine("handlebars", hbs({
	defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//Use bodyParser
app.use(bodyParser.urlencoded({
	extended: false
}));

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

