//Bring in API script and make date script
var getCommute = require("../scripts/commute");


//Bring in Models
var Settings = require("../models/Settings");

module.exports = {
	get: function (userid, cb)
	{
		Settings.findOne({userid:userid}, function(error, found)
		{
			if(found != null)
			{
				cb(found);
			}
			else{
				cb("Please add address in Settings");
			}
		});
	},

	update: function(userAddress, userid, cb)
	{
		var settingsEntry = {
			userid: userid,
			address: userAddress
		};

		Settings.findOneAndUpdate({userid:userid}, settingsEntry, {upsert: true}, cb);
	}
};