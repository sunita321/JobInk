//Bring in API script and make date script

var getjobs = require("../scripts/getjobs");

var makeDate = require("../scripts/date");

var getReviews = require("../scripts/glassdoorapi");

var getCommute = require("../scripts/commute");

//Birng in Indeed and Notes models

var Indeed = require("../models/Indeed");

//Bring in User Address setting Model
var Settings = require("../models/Settings");

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
			//console.log(jobs);

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

	//Glassdoor rating query
	update: function(query, userid, cb)
	{ //console.log(query);
		Settings.findOne({userid:userid}, function(errorAddress, foundAddress)
		{ console.log(foundAddress);
			if (!foundAddress || !foundAddress.toObject().hasOwnProperty('address'))
			{
				console.log("2nd" + Object.getOwnPropertyNames(foundAddress).join(";"));
				foundAddress ={};
				foundAddress.address = "";
				
			}

			Indeed.findOne({_id:query._id, userid:userid}, function(error, found)
			{
				getReviews(found.company, found.location, function(data)
				{
					//Call for commute time from Google API
					getCommute(foundAddress.address, found.company, found.location, null, function(dataCommute)
					{
						var commuteTime ="Not Available";
						var glassurl ="";
						var rating ="";
						//console.log(dataCommute.rows[0].elements[0]);
						if (dataCommute && dataCommute.rows.length>0 && dataCommute.rows[0].elements.length>0 && 
							dataCommute.rows[0].elements[0].hasOwnProperty('duration'))
						{
							commuteTime = dataCommute.rows[0].elements[0].duration.text;
							console.log(dataCommute.rows[0].elements[0]);
						}

						if (data && data.response.totalRecordCount>0)
						{
							//console.log("Glassdoor: " + data);
							glassurl = data.response.attributionURL;
							rating = data.response.employers[0].overallRating;
						}

						//update database with api result
						Indeed.update({_id: query._id, userid:userid}, {
						$set: query,
						glassurl: glassurl,
						rating: rating,
						commutetime: commuteTime

						}, {}, cb);

					});




					
				});
			});

		});


		//console.log(query);
		//get glassdoor reviews


	}
}