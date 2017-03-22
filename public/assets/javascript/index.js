//Display Jobs on Homepage

$(document).ready(function() 
{
	$(".button-collapse").sideNav();//materialize mobile view nav

	var autocomplete = new google.maps.places.Autocomplete($('#locationterm')[0], {types: ['(regions)']});
	// Set div where jobs will go
	// Add event listener to any "Save Job"
	// Import new jobs
	var jobContainer = $(".job-container");
	$(document).on("click", ".btn.save", handleJobSave);
	//$(document).on("click", ".search-new", handleJobSearch);
	$('#formjobsearch').validator().on('submit', handleJobSearch);

	initPage();

	function initPage()
	{
		
		jobContainer.empty();
		$.get("/api/indeed?saved=false")
		 .then(function(data)
		 {
		 
		 	if (data && data.length)
		 	{
		 		console.log(data);
		 		renderJobs(data);
		 		
		 	}
		 	else {
		 		renderEmpty();
		 		console.log("I'm Empty");
		 	}
		 });
	}

	function renderJobs(jobs)
	{
		console.log("render1");
		var jobPanels = [];

		for (var i = 0; i < jobs.length; i++) 
		{
			console.log("render2:" +i);
			jobPanels.push(createPanel(jobs[i]));
		}

		jobContainer.append(jobPanels);
		console.log("render3");
	}

	function createPanel(job)
	{
		var panel = $(
			[	
				"<div class='divider'></div>",
				
				"<div class='panel panel-default'>",
				"<div class='panel-heading'>",
				"<h5>",
				"<a href='",
				job.url,
				"'target='_blank'>",
				job.jobtitle,
				"</h5>",
				"</a>",

				"<div class='panel-body'>",
				job.snippet,
				"</div>",
				"</a>",
				"<a class='btn btn-success waves-effect waves-light save savejob'>",
				"<i class='material-icons right'>thumb_up</i>",

				"Save Job",
				"</a>",

				"</div>",
				"<div class='col s12 spacer'></div>",

				"</div>",
				

			].join(""));

		panel.data("_id", job._id);

		return panel;
	}


	function renderEmpty()
	{
		var emptyAlert = $(
			[
				"<div class='row'>",
			       "<div class='col s3'></div>",
			        "<div class='col s6'>",
			          "<div class='card-panel'>",
			            "<div class='card-content blue-text center-align'>",
			              "<span class='card-title'>No search results to display.</span>",
			              "<p>Try using the search above to find new jobs.</p>",
			              "<p>Or</p>",
			              "<h5><a href='/saved'>Go to your Saved Jobs</a></h5>",
			            "</div>",
			             "<div class='card-action center-align'>",
		

				"</div>",
				"</div>"

			].join(""));

		jobContainer.append(emptyAlert);
	}

	function handleJobSave()
	{
		var jobToSave = $(this).parents(".panel").data();
		jobToSave.saved = true;

		$.ajax({
			method: "PATCH",
			url: "/api/indeed",
			data: jobToSave
		})
		.then(function(data)
		{
			if(data.ok)
			{
				//show only unsaved articles
				initPage();
			}
		});
	}


	function handleJobSearch(event)
	{
		var title = $('#jobterm').val().trim();
		var location = $('#locationterm').val().trim();
		//var autocomplete = new google.maps.places.Autocomplete(location);


		if(event.isDefaultPrevented())
		{

		}
		else 
		{

			event.preventDefault();


			$.get({url:"api/fetch",
				data: {jobTitle: title,
					jobLocation: location,

				}})
			.then(function(data)
			{
				initPage();
				Materialize.toast("<p class='text-center m-top-80'>" + data.message + "<h3>", 5000, 'rounded');

			
			
				//bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
			});

		}
	


	}



});

