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
				"<div class='panel panel-default'>",
				"<div class='panel-heading'>",
				"<h3>",
				job.jobtitle,
				"<a class='btn btn-danger delete'>",
				"Delete Job",
				"</a>",
				"<a class='btn btn-info notes'>Job Notes</a>",
				"</h3>",
				"</div>",
				"<div class='panel-body'>",
				job.snippet,
				"</div>",
				"</div>"

			].join(""));

		panel.data("job", job);

		return panel;
	}

	function renderEmpty()
	{
		var emptyAlert = $(
			[
				"<div class='alert alert-warning text-center'>",
				"<h4>You don't have any jobs saved.</h4>",
				"</div>",
				"<div class='panel panel-default'>",
				"<div class='panel-heading text-center'>",
				"<h4>Would you like to see available jobs?</h4>",
				"</div>",
				"<div class='panel-body text-center'>",
				"<h4><a href='/'>View Jobs</a></h4>",
				"</div>",
				"</div>"

			].join(""));

		jobContainer.append(emptyAlert);
	}

	function renderNotesList(data)
	{
				
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
					"<button class='btn btn-danger note-delete'>X</button>",
					"</li>"
				].join(""));

				currentNote.children("button").data("_id", data.notes[i]._id);

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
				bootbox.hideAll();
			});
		}
	}





	function handleNoteDelete()
	{
		var noteToDelete = $(this).data();

		console.log(noteToDelete);

		$.ajax({
			method: "DELETE",
			url: "/api/notes/" + noteToDelete._id
		}).then(function(data)
		{
			console.log("DD1");
			if (data.ok)
			{
				console.log("DD2");
				initPage();
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
			"<div class='container-fluid text-center'>",
			"<h4>Notes for Job: ",
			currentJob.job.jobtitle,
			"</h4>",
			"<hr />",
			"<ul class='list-group note-container'>",
			//"<li>"+data[0].noteText+"</li>",
			"</ul>",
			"<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
			"<button class='btn btn-success save'>Save Note</button>",
			"</div>"
			].join("");


			bootbox.dialog({
				message: modalText,
				closeButton: true
			});

			var noteData = {
				_id: currentJob.job._id,
				notes: data || []
			};

			$(".btn.save").data("job", noteData);

			renderNotesList(noteData);
		});

	}

});