//Bring in API script and make date script

var getjobs = require("../scripts/getjobs");

var makeDate = require("../scripts/date");

//Birng in Indeed and Notes models

var Indeed = require("../models/Indeed");

module.exports = {
	fetch: function (jobTitle, jobLocation, cb) 
	{
		getjobs(jobTitle, jobLocation, function(data)
		{
			var jobs = [];
			for (var i=0; i < data.results.length; i++)
			{
				var job = {};
				job.jobkey = data.results[i].jobkey;
				job.jobtitle = data.results[i].jobtitle;
				job.snippet = data.results[i].snippet;
				job.company = data.results[i].company;
				job.location = data.results[i].location;
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
	delete: function(query, cb)
	{
		Indeed.remove(query, cb);
	},
	get: function(query, cb)
	{
		Indeed.find(query)
		.sort({
			_id: -1
		})
		.exec(function(err, doc)
		{
			cb(doc);
		});
	},
	update: function(query, cb)
	{
		Indeed.update({_id: query._id}, {
			$set: query

		}, {}, cb);
	}
}