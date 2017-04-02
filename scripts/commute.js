//Google Maps API scripts
var request = require("request");

var commuteReturn = function (userAddress, company, companyLocation, tag, cb) 
{
	//Google Maps API URL
	var queryURL = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + 
	               userAddress + "&destinations=" + company + companyLocation + 
	               "&mode=driving&&key=AIzaSyCKSs6cdRZCtA5rEqltKxivrnEQA7VeDOY";

	if (userAddress === "")
	{
		cb(null, tag);
	}
	else {
		request(queryURL, function(error, response, body)
		{
			if (!error && response.statusCode === 200)
			{
				var commuteResults = JSON.parse(body);
				//console.log(commuteResults);
				cb(commuteResults, tag);
			}
			else{
				console.log("Got an error: ", error, ", status code: ", response.statusCode);
				cb(null, tag);
			}
		});

	}


}

module.exports = commuteReturn;