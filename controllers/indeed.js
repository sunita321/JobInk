//Bring in API script and make date script

var getjobs = require("../scripts/getjobs");

var makeDate = require("../scripts/date");

var getReviews = require("../scripts/glassdoorapi");

//Birng in Indeed and Notes models

var Indeed = require("../models/Indeed");

module.exports = {
	fetch: function (jobTitle, jobLocation, userid, cb) 
	{
		getjobs(jobTitle, jobLocation, function(data)
		{
			var jobs = [];
			for (var i=0; i < data.results.length; i++)
			{
				var job = {};

				job.jobkey = data.results[i].jobkey;
				job.userid = userid;
				job.jobtitle = data.results[i].jobtitle;
				job.snippet = data.results[i].snippet;
				job.company = data.results[i].company;
				job.location = data.results[i].formattedLocation;
				job.url = data.results[i].url;
				

				job.date = makeDate();
				job.saved = false;



				jobs.push(job);

				
			}
			console.log(jobs);

			Indeed.collection.insertMany(jobs, {ordered:false}, function(err, docs)
			{
				cb(err, docs);
			});
		});
	},

	delete: function(query, userid, cb)
	{	
		query.userid = userid;
		Indeed.remove(query, cb);
	},

	get: function(query, userid, cb)
	{
		//query.combokey = {};
		query.userid = userid;
		Indeed.find(query)
		.sort({
			_id: -1
		})
		.exec(function(err, doc)
		{
			cb(doc);
		});
	},

	//glassdoor rating query
	update: function(query, userid, cb)
	{
		Indeed.findOne({_id:query._id, userid:userid}, function(error, found)
		{
			getReviews(found.company, found.location, function(data)
			{
				var glassurl ="";
				var rating ="";
				if (data && data.response.totalRecordCount>0)
				{
					console.log("Glassdoor: " + data);
					glassurl = data.response.attributionURL;
					rating = data.response.employers[0].overallRating;
				}

				Indeed.update({_id: query._id, userid:userid}, {
				$set: query,
				glassurl: glassurl,
				rating: rating

			}, {}, cb);

				
			});
		});
		console.log(query);
		//get glassdoor reviews


	}
}