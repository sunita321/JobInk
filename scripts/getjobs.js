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

	// Here we run our AJAX call to Indeed API
	$.ajax({url: queryURL, method: 'GET', dataType: "jsonp"})


	// We store all of the retrieved data inside of an object called "response"
	.done(function(jobResults) 
	{
	  // Log the queryURL
	  console.log(queryURL);

	  // Log the resulting object
	  console.log(jobResults);

	  

	      //for (var i = 0; i < jobResults.results.length; i++) 
	      //{
	      	// Transfer content to HTML
	      //$('#joblist').append("<tr><td><pre>" + JSON.stringify(jobResults.results[i], null, 2) + "</pre></td></tr>");
	      //}

	    cb(jobResults);

	});	


}





module.exports = jobsReturn;