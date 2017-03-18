//Notes controller

var Notes = require("../models/Notes");
var makeDate = require("../scripts/date");

module.exports = {
	get: function(data, cb) 
	{
		Notes.find({
			_jobkeyID: data._jobkeyID
		}, cb);
	},
	save: function(data, cb)
	{
		var newNote = {
			_jobkeyID: data._jobkeyID,
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
	delete: function(data, cb)
	{
		Notes.remove({
			_id: data._id
		}, cb);
	}
};