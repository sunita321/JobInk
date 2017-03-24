var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var indeedJobsSchema = new Schema({
	

	jobkey:
	{
		type: String,
		required: true
	},

	userid:
	{
		type: String,
		required: true
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
		default: false,
	},

	glassurl:{
		type: String
	
	},

	rating:{
		type: String
	}
});

indeedJobsSchema.index({jobkey: 1, userid: 1}, {unique: true});

var Indeed = mongoose.model("Indeed", indeedJobsSchema);

module.exports = Indeed;