var getjobs = require("../scripts/getjobs");

var indeedController = require("../controllers/indeed");
var notesController = require("../controllers/notes");



module.exports = function(router)
{
	router.get("/", function(req, res)
	{
		res.render("home");
	});

	router.get("/saved", function(req, res)
	{
		res.render("saved");
	});

	router.get("/api/fetch", function(req, res)
	{
		indeedController.fetch(function(err, docs)
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
			query._id = req.params.indeed_id;
		}

		notesController.get(query, function(err, data)
		{
			res.json(data);
		});
	});

	//Route to Delete Notes
	router.delete("/api/notes/:id", function(req, res)
	{
		var query = {};
		query._id = req.params.id;
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


}