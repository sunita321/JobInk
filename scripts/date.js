var makeDate = function () 
{
	var d = new Date();
	var formattedDate = d.toISOString();

	//formattedDate += d.getFullYear()+ "_";	
	//formattedDate += (d.getMonth() + 1) + "_";
	//formattedDate += d.getDate();


	return formattedDate;
};

module.exports = makeDate;