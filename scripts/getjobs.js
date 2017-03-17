//Indeed API script

var request = require("request");

var jobsReturn = function (cb) 
{
	
	var APIKey = "348469475547672";

	var jobTitle = "tester";

	var jobLocation = "orlando"

	// Here we are building the URL we need to query the database
	var queryURL = "http://api.indeed.com/ads/apisearch?publisher=" + APIKey + "&q=" + jobTitle + "&l=" + jobLocation + "&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2&format=json";

	//http://api.indeed.com/ads/apisearch?publisher=348469475547672&q=java&l=austin%2C+tx&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2

	// Here we run our request to Indeed API
	request(queryURL, function(error, response, body)
	{
		if (!error && response.statusCode === 200)
		{
			var jobResults = JSON.parse(body);
			 console.log(queryURL);
			 console.log(jobResults);
			 cb(jobResults);
		}
		else {
	    console.log("Got an error: ", error, ", status code: ", response.statusCode);
	     cb(null);
	  	}
	});



}


module.exports = jobsReturn;