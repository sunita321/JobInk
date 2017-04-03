var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var settingsSchema = new Schema({


	userid:{
		type: String,
		required: true,
		unique: true
		
	},
		address:{
			type: String
			
	}
    
});


var Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;