$(document).ready(function() 
{
	//Google address autocomplete
	var autocomplete = new google.maps.places.Autocomplete($('#useraddress')[0]);

	$('#save-address').on("click", handleSaveAddress);

	function handleSaveAddress()
	{
		var userAddress = $('#useraddress').val().trim();
		console.log(userAddress);

		var addressToSave = {
			address: userAddress
		};

		$.ajax({
			method: "POST",
			url: "/api/addressPost",
			data: addressToSave
		}).then(function(data)
			{
				
				Materialize.toast("<p class='text-center m-top-80'>" + "Address saved!" + "</p>", 4000, 'rounded');

			});
	};

});