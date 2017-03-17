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

}