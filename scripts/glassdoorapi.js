//Glassdoor API script

var request = require("request");

var companyReturn = function (company, companyLocation, cb) 
{
	


	// Here we are building the URL we need to query the database
	var queryURL = "http://api.glassdoor.com/api/api.htm?t.p=132074&t.k=ikPJt9loXZo&userip=0.0.0.0&useragent=&format=json&v=1&action=employers&q=" + company + "&l=" + companyLocation;

	//http://api.glassdoor.com/api/api.htm?t.p=132074&t.k=ikPJt9loXZo&userip=0.0.0.0&useragent=&format=json&v=1&action=employers&q=harris+corporation&l=malabar
	
	request(queryURL, function(error, response, body)
	{
		if (!error && response.statusCode === 200)
		{
			var companyResults = JSON.parse(body);
			 //console.log(queryURL);
			 console.log(companyResults);
			 cb(companyResults);
		}
		else {
	    console.log("Got an error: ", error, ", status code: ", response.statusCode);
	     cb(null);
	  	}
	});



}


module.exports = companyReturn;