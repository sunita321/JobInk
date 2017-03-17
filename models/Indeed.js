var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var indeedJobsSchema = new Schema({
	jobkey:{
		type: String,
		required: true,
		unique: true
	},
	
	jobtitle: {
		type: String,
		required: true
	},

	snippet:{
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
	
	saved:{
		type: Boolean,
		default: false
	}
});


var Indeed = mongoose.model("Indeed", indeedJobsSchema);

module.exports = Indeed;