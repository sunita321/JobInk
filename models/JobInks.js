var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var jobinksSchema = new Schema({

		username:{
			type: String,
			required: true,
			unique: true
	},
		name:{
			type: String,
			required: true,
	},
		email:{
			type: String,
			required: true,
			unique: true
	},
		password:{
			type: String,
			required: true,
	},
		savedjobs:{
			type: String
	},
		savednotes:{
			type: String
	}
    
});


var JobInks = mongoose.model("JobInks", jobinksSchema);

module.exports = JobInks;