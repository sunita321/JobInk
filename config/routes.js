var getjobs = require("../scripts/getjobs");

var indeedController = require("../controllers/indeed");
var notesController = require("../controllers/notes");

var passport = require('passport');

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};



module.exports = function(router)
{
		/* GET home page. */
	router.get('/auth0', function(req, res, next) {
	  res.render('index', { title: 'Express', env: env });
	});


	router.get("/", function(req, res)
	{
		res.render("home");
	});

	router.get("/saved", function(req, res)
	{
		res.render("saved");
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
	    res.redirect(req.session.returnTo || '/user');
	  });


	router.get("/api/fetch", function(req, res)
	{
		indeedController.fetch(req.query.jobTitle, req.query.jobLocation,function(err, docs)
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

	router.get("/api/indeed", function(req, res)
	{
		var query = {};
		if (req.query.saved) 
		{
			query = req.query;
		}

		indeedController.get(query, function(data)
		{
			res.json(data);
		});
	});

	router.delete("/api/indeed/:id", function(req, res)
	{
		var query = {};
		query._id = req.params.id;
		indeedController.delete(query, function(err, data)
		{
			res.json(data);
		});
	});

	router.patch("/api/indeed", function(req, res)
	{
		indeedController.update(req.body, function(err, data)
		{
			res.json(data);
		});
	});

	//Route to get Notes
	router.get("/api/notes/:indeed_id?", function(req, res)
	{
		
		var query ={};
		if (req.params.indeed_id)
		{
			query._jobkeyID = req.params.indeed_id;
		}

		notesController.get(query, function(err, data)
		{
			res.json(data);
		});
	});

	//Route to Delete Notes
	router.delete("/api/notes/:id", function(req, res)
	{
		console.log("serverD");
		var query = {};
		query._id = req.params.id;
		console.log(query._id);
		notesController.delete(query, function(err, data)
		{
			res.json(data);
		});
	});

	//Route to Post new Notes
	router.post("/api/notes", function(req, res)
	{
		notesController.save(req.body, function(data)
		{
			res.json(data);
		});
	});

	//Route to Clear Search Results that are NOT saved

	router.delete("/api/clear", function(req, res)
	{
		console.log("serverClear");
		var query = {};
		query.saved = false;
		indeedController.delete(query, function(err, data)
		{
			res.json(data);
		});
	});


}