//Notes controller

var Notes = require("../models/Notes");
var makeDate = require("../scripts/date");

module.exports = {
	get: function(data, userid, cb) 
	{
		Notes.find({
			_jobkeyID: data._jobkeyID,
			userid:userid
		}, cb);
	},
	save: function(data, userid, cb)
	{
		var newNote = {
			_jobkeyID: data._jobkeyID,
			userid:userid,
			date: makeDate(),
			noteText: data.noteText
		};

		Notes.create(newNote, function(err, doc)
		{
			if (err) 
			{
				console.log(err);
			}
			else{
				console.log(doc);
				cb(doc);
			}
		});
	},
	delete: function(data, userid, cb)
	{
		Notes.remove({
			_id: data._id,
			userid:userid
		}, cb);
	}
};