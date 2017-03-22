$(document).ready(function()
{

		var jobContainer = $(".job-container");

		$(document).on("click", ".btn.delete", handleJobDelete);
		$(document).on("click", ".btn.notes", handleJobNotes);
		$(document).on("click", ".btn.save", handleNoteSave);
		$(document).on("click", ".btn.note-delete", handleNoteDelete);

		initPage();



	function initPage()
	{
		jobContainer.empty();
		$.get("/api/indeed?saved=true")
		 .then(function(data)
		 {
		 	if (data && data.length)
		 	{
		 		renderJobs(data);
		 	}
		 	else {
		 		renderEmpty();
		 	}
		 });
	}

	function renderJobs(jobs)
	{
		var jobPanels = [];

		for (var i = 0; i < jobs.length; i++) 
		{
			jobPanels.push(createPanel(jobs[i]));
		}

		jobContainer.append(jobPanels);
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
				"<div class='companyText'>",
				"Company: " + job.company,
				"</div>",
				"<div class='companyRating'>",
				"<a href='",
				job.glassurl,
				"'target='_blank'>",
				"Company Rating: " + job.rating + " out of 5 stars",
				"</a>",
				"</div>",
				"<div class='locationText'>",
				job.location,
				"</div>",
				"<a class='btn btn-floating waves-effect waves-light blue notes'>",
				"<i class='material-icons'>note_add</i>",
				"</a>",
				"<a class='btn btn-floating waves-effect waves-light red delete'>",
				"<i class='material-icons'>delete</i>",
				"</a>",
				
				"</div>",



				"</div>",
				"<div class='col s12 spacer'></div>",
				"</div>"

			].join(""));

		panel.data("job", job);

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
			              "<span class='card-title'>You don't have any jobs saved.</span>",
			              "<p>Would you like to see available jobs?</p>",
			            "</div>",
			             "<div class='card-action center-align'>",
			            "<h4><a href='/'>View Jobs</a></h4>",


			      "<div class='col s3'></div>",

				"<div class='panel-body text-center'>",


				
				"</div>",
				"</div>"

			].join(""));

		jobContainer.append(emptyAlert);
	}

	function renderNotesList(data)
	{
		$(".note-container").empty();
		var notesToRender = [];
		var currentNote; 
		if (!data.notes.length)
		{
			currentNote = [
			"<li class='list-group-item'>",
			"No notes for this job yet.",
			"</li>"
			].join("");

			notesToRender.push(currentNote);
		}
		else {
			for (var i = 0; i < data.notes.length; i++) 
			{
				currentNote = $([
					"<li class='list-group-item note'>",
					data.notes[i].noteText,
					"<div class='deletebutton text-right'>",
					"<button class='btn btn-danger note-delete'>X</button></div>",
					"</li>"
				].join(""));

				currentNote.children(".deletebutton").children("button").data("_id", data.notes[i]._id);


				notesToRender.push(currentNote);

			}
		}

		$(".note-container").append(notesToRender);


	}

	function handleJobDelete()
	{
		var jobToDelete = $(this).parents(".panel").data();

		$.ajax({
			method: "DELETE",
			url: "/api/indeed/" + jobToDelete.job._id
		}).then(function(data)
		{
			if (data.ok)
			{
				initPage();
			}
		});
	}


	function handleNoteSave()
	{

		console.log("Save me!");
		var noteData;
		var newNote = $(".bootbox-body textarea").val().trim();

		if (newNote)
		{
			noteData = {
				_jobkeyID: $(this).data("job")._id,
				noteText: newNote
			};

			console.log("Save me2!");
			$.post("/api/notes", noteData).then(function()
			{
				//bootbox.hideAll();
				$.get("/api/notes/" + noteData._jobkeyID).then(function(data)
				{
					var noteList = {
						_id: noteData._jobkeyID,
						notes: data || []
					};

					renderNotesList(noteList);
					$(".bootbox-body textarea").val('');
				});
			});
		}
	}





	function handleNoteDelete()
	{
		var noteToDelete = $(this).data();
		var getSavedBtnData = $(this).parents("#notesdiv").children(".btn.save").data();

		console.log(getSavedBtnData);

		console.log(noteToDelete._id);

		$.ajax({
			method: "DELETE",
			url: "/api/notes/" + noteToDelete._id
		}).then(function(data)
		{
			console.log(data);
			if (data.ok)
			{
				
				//initPage();
				$.get("/api/notes/" + getSavedBtnData.job._id).then(function(data)
				{
					console.log(noteToDelete);
					var noteList = {
						_id: getSavedBtnData.job._id, 
						notes: data || []
					};

					renderNotesList(noteList);
				});
			}
		});
	}

	function handleJobNotes()
	{
		var currentJob = $(this).parents(".panel").data();

		$.get("/api/notes/" + currentJob.job._id).then(function(data)
		{
			console.log(data);
			var modalText = [
			"<div class='container-fluid text-center' id='notesdiv'>",
			"<h4>Notes for Job: ",
			currentJob.job.jobtitle,
			"</h4>",
			"<hr />",
			"<div class='text-left'>",
			"<ul class='list-group note-container'>",
			//"<li>"+data[0].noteText+"</li>",
			"</ul></div>",
			"<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
			"<button class='btn btn-success save'>Save Note</button>",
			"</div>"
			].join("");


			/*bootbox.dialog({
				message: modalText,
				closeButton: true
			});*/

			var noteData = {
				_id: currentJob.job._id,
				notes: data || []
			};

			$(".btn.save").data("job", noteData);

			renderNotesList(noteData);
		});

	}

});