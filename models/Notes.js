var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var notesSchema = new Schema({
	_jobkeyID:{
		type: Schema.Types.ObjectId,
		ref: "Indeed",
		required:true
	},
	
	date: String,

	noteText:{
		type: String,
		required: true,
		}
});


var Notes = mongoose.model("Notes", notesSchema);

module.exports = Notes;