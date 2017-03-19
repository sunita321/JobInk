//Display Jobs on Homepage

$(document).ready(function() 
{
	// Set div where jobs will go
	// Add event listener to any "Save Job"
	// Import new jobs
	var jobContainer = $(".job-container");
	$(document).on("click", ".btn.save", handleJobSave);
	$(document).on("click", ".search-new", handleJobSearch);

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
				"<div class='panel panel-default'>",
				"<div class='panel-heading'>",
				"<h3>",
				job.jobtitle,
				"<a class='btn btn-success save'>",
				"Save Job",
				"</a>",
				"</h3>",
				"</div>",
				"<div class='panel-body'>",
				job.snippet,
				"</div>",
				"</div>"


			].join(""));

		panel.data("_id", job._id);

		return panel;
	}


	function renderEmpty()
	{
		var emptyAlert = $(
			[
				"<div class='alert alert-warning text-center'>",
				"<h4>Sorry, no new jobs to display.</h4>",
				"</div>",
				"<div class='panel panel-default'>",
				"<div class='panel-heading text-center'>",
				"<h4>What would you like to do?</h4>",
				"</div>",
				"<div class='panel-body text-center'>",
				"<h4><a class='search-new'> Try Searching for New Jobs</a></h4>",
				"<h4><a href='/saved'>Go to your Saved Jobs</a></h4>",
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

	function handleJobSearch()
	{
		var title = $('#jobterm').val().trim();
		var location = $('#locationterm').val().trim();

		$.get({url:"api/fetch",
				data: {jobTitle: title,
					jobLocation: location

				}})
		.then(function(data)
		{
			initPage();
			bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
		});
	}



});

