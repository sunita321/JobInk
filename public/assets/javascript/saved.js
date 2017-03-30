$(document).ready(function()
{	

		$('.tooltipped').tooltip({delay: 50});//materialize tooltip
		$(".button-collapse").sideNav();//materialize mobile view nav

		//Scroll to top JS
	    $(window).scroll(function()
	    { 
	    	if ($(this).scrollTop() > 100) 
	    	{ 
	        	$('#scroll').fadeIn(); 
	    	} 
	    	else { 
	        $('#scroll').fadeOut(); 
	    
	    	} 
		}); 

		$('#scroll').click(function()
		{ 
		    $("html, body").animate({ scrollTop: 0 }, 600); 
		    return false; 
		}); 

		var jobContainer = $(".job-container");

		$(document).on("click", ".btn.delete", handleJobDelete);
		$(document).on("click", ".btn.notes", handleJobNotes);
		$(document).on("click", ".btn.save", handleNoteSave);
		$(document).on("click", ".btn.note-delete", handleNoteDelete);
		$(document).on("click", '.btn.note-edit', handleNoteEdit);
		$(document).on("change",".checkBoxClass", handleAppliedBox);




		// define the modal
	    $('#noteModal').modal({
	    });

		initPage();

		//function to edit note text








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

						"<div class='headerBox left-align'>",		
							"<h5>",
							"<a href='",
							job.url,
							"'target='_blank'>",
							job.jobtitle,
							"</a>",
							"</h5>",
						"</div>",

				"<div class='appliedBox right-align'>",

				"<input class='checkBoxClass' type='checkbox' id='appliedBox_"+job._id+"'/>",
      			"<label for='appliedBox_"+job._id+"'>Applied</label>",
      			"</div>",
				



				
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
				"<a class='btn btn-floating waves-effect waves-light blue notes tooltipped' data-position='bottom' data-delay='50' data-tooltip='Add a note'>",
				"<i class='material-icons'>note_add</i>",
				"</a>",
				"<div class='deletebutton right-align'>",
				"<a class='btn btn-floating waves-effect waves-light red delete'>",
				"<i class='material-icons'>delete_forever</i>",
				"</a>",
				"</div>",
				"</div>",



				"</div>",
				"<div class='col s12 spacer'></div>",
				"</div>"

			].join(""));

		panel.data("job", job);

		panel.find('.checkBoxClass').prop('checked', job.applied);
		//console.log(panel.children('.checkBoxClass'));

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
					"<div class='divider'></div>",
					"<div class='col s12 spacer'></div>",

					"<li class='list-group-item note'>",

					"<div class='noteText'>",
					data.notes[i].noteText,
					"</div>",

					"<div class='noteDate right-align'>",
					moment(data.notes[i].date).format("ddd, MMMM Do, YYYY, hh:mm A"),
					"</div>",

					"<div class='editbutton left-align'>",
					"<button class='btn btn-floating note-edit orange'><i class='material-icons'>mode_edit</i></button></div>",

					"<div class='deletebutton right-align'>",
					"<button class='btn btn-floating note-delete red'><i class='material-icons'>delete</i></button></div>",
					"</li>",
					
					"<div class='col s12 spacer'></div>"

					
					
				].join(""));

				currentNote.children(".deletebutton").children("button").data("_id", data.notes[i]._id);
				currentNote.children(".editbutton").children("button").data("_id", data.notes[i]._id);



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


	function handleNoteSave(event)
	{

		//console.log("Save me!");
		var noteData;
		var newNote = $("#noteText").val().trim();

		event.preventDefault();

		if (newNote)
		{
			noteData = {
				_jobkeyID: $(this).data("job")._id,
				noteText: newNote
			};

			//console.log("Save me2!");
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
					$("#noteText").val('');
				});
			});
		}
	}





	function handleNoteDelete()
	{
		var noteToDelete = $(this).data();
		var getSavedBtnData = $(this).parents("#noteModal").children(".modal-footer").children('#noteForm').children(".btn.save").data();

		//console.log(getSavedBtnData);

		//console.log(noteToDelete._id);

		$.ajax({
			method: "DELETE",
			url: "/api/notes/" + noteToDelete._id
		}).then(function(data)
		{
			//console.log(data);
			if (data.ok)
			{
				
				//initPage();
				$.get("/api/notes/" + getSavedBtnData.job._id).then(function(data)
				{
					//console.log(noteToDelete);
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
			//console.log(data);
			$('#notesTitle').html("<h5>Notes for: " + currentJob.job.jobtitle + "</h5>");
			var modalText = [
			"<div class='container-fluid text-center' id='notesdiv'>",
			"<hr />",
			"<div class='text-left'>",
			"<ul class='list-group note-container'>",
			//"<li>"+data[0].noteText+"</li>",
			"</ul></div>",
			"<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
			"<button class='btn btn-success save'>Save Note</button>",
			"</div>"
			].join("");

				// open the modal
	        $('#noteModal').modal('open');


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

	function handleNoteEdit()
	{
		var editbuttonElement = $(this);
		var replaceWith = $('<input name="temp" type="text" />');
     
        var elem = $(this).parent("div").parent(".note").children(".noteText");

        var elemOldText = elem.text();
        //console.log(elemOldText);
        replaceWith.val(elemOldText);
        //console.log($(this).data());

        

        //console.log(elem);

        elem.hide();
        elem.after(replaceWith);
        replaceWith.focus();

        replaceWith.blur(function() 
        {

            if ($(this).val() != "") 
            {
                //connectWith.val($(this).val()).change();
                //elem.text($(this).val());
                var noteToEdit = editbuttonElement.data();
                var newNoteText = $(this).val();
				//var getSavedBtnData = $(this).parents("#noteModal").children(".modal-footer").children('#noteForm').children(".btn.save").data();

				//console.log(getSavedBtnData);

				//console.log(noteToEdit);
				noteData = {
					_id:noteToEdit._id,
					noteText: newNoteText
				};

				$.post("/api/notes", noteData).then(function()
				{
					elem.text(newNoteText);
				});
		    }

            $(this).remove();
            elem.show();
        });
	}

	
	function handleAppliedBox()

	{
		var currentJob = $(this).parents(".panel").data();
		//console.log(currentJob.job._id);
		var state = $(this).is(':checked');
		//console.log(state);
		currentJob.job.applied = state;
		$.ajax({
			method: "PATCH",
			url: "/api/indeed",
			data: currentJob.job
		})
		.then(function(data)
		{
			if(data.ok)
			{
				//show only unsaved articles
				//initPage();
			}
		});
	}


});