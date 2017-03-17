var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var notesSchema = new Schema({
	_jobkeyID:{
		type: Schema.Types.ObjectId,
		ref: "Indeed"
	},
	
	jobtitle: {
		type: String,
		required: true
	},

	company:{
		type: String,
		required: true
	},

	location:{
		type: String,
		required: true
	},

	url:{
		type: String,
		required: true
	},

	date: String,
	noteText: String
});


var Notes = mongoose.model("Notes", notesSchema);

module.exports = Notes;