var getjobs = require("../scripts/getjobs");

var indeedController = require("../controllers/indeed");
var notesController = require("../controllers/notes");
var settingsController = require("../controllers/setting");

var passport = require('passport');//Passport JS
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

var getCommute = require("../scripts/commute");
var Indeed = require("../models/Indeed");

module.exports = function(router)
{
		/* GET home page. */

	router.get("/", ensureLoggedIn, function(req, res)
	{
		res.render("home");
		//console.log(req.user);
	});

	router.get("/saved", ensureLoggedIn, function(req, res)
	{
		res.render("saved");
	});

	//Route to user settings
	router.get("/settings", ensureLoggedIn, function(req, res)
	{
		res.render("settings");
	});

	router.get('/login',
	  function(req, res){
	    res.render('login', { env: env });
	  });

	router.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

	router.get('/callback',
	  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
	  function(req, res) {
	    res.redirect(req.session.returnTo || '/');
	  });


	router.get("/api/fetch", ensureLoggedIn, function(req, res)
	{
		indeedController.fetch(req.query.jobTitle, req.query.jobLocation, req.user.id, function(err, docs)
		{
			if (!docs || docs.insertedCount === 0)
			{
				res.json({ 
					message: "No new jobs today. Check back tomorrow!"
				});

			}
			else{
				res.json({
					message: "Added " + docs.insertedCount +  " new jobs!"
				});
			}
		});
	});

	router.get("/api/indeed", ensureLoggedIn, function(req, res)
	{
		var query = {};
		if (req.query.saved) // If we only want saved jobs
		{
			query = req.query;
		}

		indeedController.get(query, req.user.id, function(data)
		{
			res.json(data);
		});
	});

	//Route to Delete Saved Job
	router.delete("/api/indeed/:id", ensureLoggedIn, function(req, res)
	{
		var query = {};
		query._id = req.params.id;
		indeedController.delete(query, req.user.id, function(err, data)
		{
			res.json(data);
		});
	});

	//Route to Save job
	router.patch("/api/indeed", ensureLoggedIn, function(req, res)
	{
		indeedController.update(req.body, req.user.id, function(err, data)
		{
			res.json(data);
		});
	});

	//Route to get Notes
	router.get("/api/notes/:indeed_id?", ensureLoggedIn, function(req, res)
	{
		
		var query ={};
		if (req.params.indeed_id)
		{
			query._jobkeyID = req.params.indeed_id;
		}

		notesController.get(query, req.user.id, function(err, data)
		{
			res.json(data);
		});
	});

	//Route to Delete Notes
	router.delete("/api/notes/:id", ensureLoggedIn, function(req, res)
	{
		//console.log("serverD");
		var query = {};
		query._id = req.params.id;
		//console.log(query._id);
		notesController.delete(query, req.user.id, function(err, data)
		{
			res.json(data);
		});
	});

	//Route to Post new Notes
	router.post("/api/notes", ensureLoggedIn, function(req, res)
	{
		if(req.body._id)
		{
			notesController.update(req.body, req.user.id, function(data)//updates notes
			{
				res.json(data);
			});

		}

		else{
			notesController.save(req.body, req.user.id, function(data)
			{
			res.json(data);
			});
		}

	});

	//Route to Clear Search Results that are NOT saved

	router.delete("/api/clear", ensureLoggedIn, function(req, res)
	{
		
		var query = {};
		query.saved = false;
		indeedController.delete(query, req.user.id, function(err, data)
		{
			res.json(data);
		});
	});


	//API Routes for user settings
	router.get("/api/address", ensureLoggedIn, function(req, res)
	{
		settingsController.get(req.user.id, function(data)
		{
			res.json(data);
			
		});

	});

	router.post("/api/addressPost", ensureLoggedIn, function(req, res)
	{

		settingsController.update(req.body.address, req.user.id, function(data)
		{

			res.json(data);
			//console.log("I got post here");

		});

		var savedQuery = {saved:true};


		indeedController.get(savedQuery, req.user.id, function(data)
		{
			var job;
			for (var i = 0; i < data.length; i++) 
			{
				job = data[i];
				//setTimeout(function()
				//{
					//console.log("data1" + data[i].jobtitle);
					getCommute(req.body.address, job.company, job.location, job, function(dataCommute, tag)
					{

						var commuteTime ="Not Available";

						if (dataCommute && dataCommute.rows.length>0 && dataCommute.rows[0].elements.length>0 && 
							dataCommute.rows[0].elements[0].hasOwnProperty('duration'))
						{
							commuteTime = dataCommute.rows[0].elements[0].duration.text;
							//console.log(dataCommute.rows[0].elements[0]);
							//console.log(commuteTime);
						}

						Indeed.update({_id: tag._id, userid:req.user.id}, {
						commutetime: commuteTime

						}, {}, function(){
							//console.log(tag.jobtitle);
						});


					});
				//}, (100*i));
				

				//console.log("dataI" + data[i].jobtitle);
			}
		});
	});


}