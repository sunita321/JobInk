$(document).ready(function() 
{
	$('.tooltipped').tooltip({delay: 50});//materialize tooltip

	$(".button-collapse").sideNav();//materialize mobile view nav
	//Google address autocomplete
	var autocomplete = new google.maps.places.Autocomplete($('#useraddress')[0]);

	$('#formsettings').validator().on('submit', handleSaveAddress);

	//$('#save-address').on("click", handleSaveAddress);

	function handleSaveAddress(event)
	{
		if(event.isDefaultPrevented())
		{

		}
		else 
		{

			event.preventDefault();
			var userAddress = $('#useraddress').val().trim();
			//console.log(userAddress);

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

				var displayAddress = $(
				[	"<div class='panel-body'>",
						userAddress,
						"</div>"
				].join(""));

				//console.log(userAddress);

				$('.savedAddressDisplay').html(userAddress);
					

			});
		}
	}

	$.get("/api/address")
	.then(function(data)
	{ 
		if(data != null && data.hasOwnProperty('address'))
		{

			$('.savedAddressDisplay').html(data.address);
					
		}

	});

	

});