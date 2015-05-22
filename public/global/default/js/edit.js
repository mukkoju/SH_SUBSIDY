$(document).ready(function(){
	$('#newArticleForm #datepicker-date').removeAttr('readonly');
	$('#new-event-btn').click(function(){
		$('#newArticleForm #datepicker-date').not(':first').remove();
		$('#newArticleForm #datepicker-time').not(':first').remove();
	});
	$('.image-holder i').positionElement({'parent':$('.image-holder')});
	$('.task:not(.more,.new)').live('click',function(){
		if($(this).hasClass('selected'))
		{
			$(this).removeClass('selected');
			$(this).find('i').css('color','#D3D3D6');
		}
		else
		{
			$(this).addClass('selected');
			$(this).find('i').css('color','#009245');
		}
	});
	/* -------------Tags--------------- */
	var tagNum = 1;
	$('#article-tags #add').click(function(){
		var lastTag = $('#article-tags').find('.tags').last();
		if(tagNum < 5)
		{	
			if(lastTag.val() != '')
			{
				tagNum++;
				var newTag = lastTag.clone().val('');
				newTag.attr('placeholder','Tag '+tagNum).css('margin-right','3px');
				$(this).before(newTag);
				if(tagNum == 5)
					$(this).remove();
			}	
		}
		else
			$(this).addClass('disabled');
	});
	$('#article-tags').submit(function(){
		var str = '';
		$(this).find('.tags').each(function(){
			if($(this).val() != '')
				str += "<li class='pull-left'><a href='#'>"+$(this).val() + "</a></li>";
		});
		if(str != '')
		{
			$("#tags").removeClass('hideElement').html(str);
			$('#edit-tags').removeClass('hideElement').css({'float':'none','margin-left':'15px'});
			$(this).addClass('hideElement');
		}
		tagNum = $(this).find("input[type='text']").length;
		return false;
	});
	$('#edit-tags').click(function(){
		$("#article-tags input[type='text']").each(function(){
			if($(this).val() == '')
				$(this).remove();
		});
		$(this).addClass('hideElement');
		$('#article-tags').removeClass('hideElement');
		$('#tags').addClass('hideElement');
	});
	/* -------------------Tags------------------------ */
	/* Image preview on selecting an image */
	$('#image-file').live('change',function(){
		$('#preview').html("<i class='icon-spinner icon-spin' style='font-size:32px;position:absolute;'></i>");
		$('.icon-spin').positionElement({'parent':$('.image-holder')});
		$('#imageUpload').css({'opacity':'0.8'});
		$('.image-holder i.icon-picture').remove();
		$('#imageUpload').ajaxForm({target : '#preview', success : loadImage }).submit();
	});
	
	/* Display popup based on the button clicked */
	var modalForm = $('#Modal #newArticleForm dl');
	$('#eventLink, #pollLink, #editLink').live('click',function(e){
		$('.alert').printError('');
		resetForm(modalForm);
		if(e.target.id == 'eventLink' || e.target.className == 'icon-edit')
			showEventForm();
		else if (e.target.id == 'pollLink')
			showPollForm();
	});
	
	$('#Modal .modal-footer .add').click(function(e){
			var category = '';
			switch($('.modal-body #category').val())
				{
					case 'Politics':
						category = 'orange';
						break;
					case 'Technology':
						category = 'yellow';
						break;
					case 'Sports':
						category = 'blue';
						break;
					case 'Entertainment':
						category = 'red';
						break;
					default:
						category = 'green';
						break;
				}
			var brk = 0;
			var elements = modalForm.find("textarea,input[type='text'],select");
			elements.each(function(){
				$(this).removeClass('error');
				if(($(this).val() == '' || $(this).val() == 0) && ($(this).css('display') != 'none' && !($(this).parent().hasClass('hideElement'))))
				{
					brk = 1;
					$('.alert').printError('None of the fields can be empty');
					$(this).addClass('error');
					return false;
				}
				else
					brk = 0;
			});
			if(e.target.id == 'add-event')
			{
				if(brk == 0)
				{
					if(!$('.modal-body').hasClass('editing'))
					{
						addNewEvent(category);
						resetForm(modalForm);
					}
					else
					{
						editDiv.attr('class',category+ " new-li");
						editDiv.find('h2').text($('.modal-body #title').val());
						editDiv.find('.loc').text($('.modal-body #location').val());
						editDiv.find('.dte').text($('.modal-body #datepicker-date').val());
						editDiv.find('.tme').text($('.modal-body #datepicker-time').val());
						editDiv.parents('.task').attr('data','{\"category\":\"'+$('.modal-body #category').val()+'\",\"subCategory\":\"'+$(" .modal-body #typeahead").val()+'\",\"description\":\"'+$(".modal-body #eventDesc").val()+'\"}');
					}
				}
				else
				{
					modalForm.effect('shake',{times:3,distance:5},300);
					return false;
				}
			}
			else if(e.target.id == 'add-poll')
			{
				var flag = 0;
				if(brk == 0)
				{
					var prevOptions = new Array();
					prevOptions[0] = modalForm.find('.pollOptions:first').val();
					modalForm.find('.pollOptions:not(:first)').each(function(){
						var optlen = prevOptions.length;
						for(var p = 0; p < optlen ; p++)
						{
							if($(this).val() == prevOptions[p])
							{
								$('.alert').printError('No two options cannot be same!');
								flag = 1;
								break;
							}
							
						}
						if(flag)
						{
							return false;
						}
						else
						{
							optlen++;
							prevOptions[optlen] = $(this).val();
						}
					});
					
					if(!flag)
					{

						if($('.modal-body').hasClass('editing'))
						{
							editDiv.find(".block").remove();
							editDiv.attr('class',category+" new-li");
							editDiv.find('h2').text(modalForm.find('#title').val());
							modalForm.find('.pollOptions').each(function(){
								var val = $(this).val();
								editDiv.find('.pl-opts').append("<span class='block'><input type='radio' name='pollopt[]' disabled='disabled' value='"+val+"' />"+val+"</span>");
								editDiv.parents('.task').attr('data','{\"category\":\"'+$('.modal-body #category').val()+'\",\"subCategory\":\"'+$(" .modal-body #typeahead").val()+'\"}');
							});
						}
						else
						{
							addNewPoll(category);
							resetForm(modalForm);
						}
					}
					else
						return false;
				}
				else
				{
					modalForm.effect('shake',{times:3,distance:5},300);
					return false;
				}
				//Reset Option numbers
				optionNum = modalForm.find('.pollOptions').length + 1;
			}
		//Close form only if there is a title for event/poll
		if(brk == 0)
		{
			$(this).attr({'data-dismiss':"modal",'aria-hidden':"true"});
			$('.modal-body').removeClass('editing');
		}
		else
			$(this).removeAttr('data-dismiss').removeAttr('aria-hidden');
		$('#main-content-box').jScrollPane({autoReinitialize:true,verticalGutter:5,showArrows:false});
		var mainContent = $('#main-content-box').data('jsp').getContentPane();
	});

	// New Poll Options
	var optionNum = (modalForm.find('.pollOptions').length) + 1;
	modalForm.find("#add-option").click(function(){
		var optnum = modalForm.find('.pollOptions').length + 1;
		if(optnum < 6)
		{
			var lastOpt = modalForm.find('.opt-div:last');
			var opt = lastOpt.find('.pollOptions');
			if(opt.val() != '')
			{
				var newOpt = lastOpt.clone().attr('opt',optnum);
				newOpt.find('.pollOptions').attr({'placeholder':'Option '+optnum,'id':"pollOption"+optnum}).val('');
				$(this).before(newOpt);
			}

		}
		if(optnum == 5)
		{
			$(this).addClass('hideElement');
		}
	});
	
	//Delete Poll Option
	$('.rmv-opt').live('click', function(){
		var par = $(this).parent();
		if(par.attr('opt') == 1 || par.attr('opt') == 2)
			par.find('.pollOptions').val('');
		else
			par.remove();
		if(modalForm.find('.opt-div').length < 5)
			modalForm.find('#add-option').removeClass('hideElement');
	});
	//Editing the newly added event/poll.
	var editDiv = '';
	$('a.edit-event,a.edit-poll').live('click',function(e){
		e.preventDefault();
		editDiv = $(this).parents('.new').find('.new-li');
		var editCategory = $.parseJSON($(this).parents('.task').attr('data'));
		$('.modal-body').addClass('editing');
		modalForm.find('#title').val(editDiv.find('h2').text());
		modalForm.find('#category').val(editCategory.category);
		modalForm.find('#typeahead').val(editCategory.subCategory);		
		if($(this).hasClass('edit-event'))
		{
			showEventForm();
			modalForm.find('#eventDesc').val(editCategory.description);
			modalForm.find('#location').val(editDiv.find('span.loc').text());
			modalForm.find('#datepicker-date').val(editDiv.find('span.dte').text());
			modalForm.find('#datepicker-time').val(editDiv.find('span.tme').text());
		}
		else
		{
			showPollForm();
			var firstOption = modalForm.find('.pollOptions:first');
			var count = 1;
			editDiv.find("input[type='radio']").each(function(){
				var val = $(this).val();
				if(count > 2)
				{
					var lastOptEdit = modalForm.find('.pollOptions:last');
					lastOptEdit.after(lastOptEdit.clone().attr({'placeholder':'Option '+count,'id':'pollOption'+count,'value':val}));
				}
				else
				{
					modalForm.find('#pollOption'+count).val(val);
				}
				count++;
			});
		}
	});
	
	$('.event-options,.edit').live('hover',function(e){
		if(e.target.className == 'edit')
		{
			if(e.type == 'mouseenter')
			{
				$(this).fadeIn(200);
			}
			else
			{
				$(this).fadeOut(200);
			}
		}
		else
		{
			if(e.type == 'mouseenter')
			{
				$(this).parent().find('ul.edit').fadeIn(200);
			}
			else
			{
				$(this).parent().find('ul.edit').fadeOut(200);
			}
		}
	});
	$('.event-delete').live('click',function(){
		$(this).parents('.new').remove();
	});
	function addNewEvent(category)
	{
		var str = "<li style='left:0px'><div class='task event selected new "+category+"' role='event' " +
				"data='{\"category\":\""+modalForm.find('#category').val()+"\",\"subCategory\":\""+modalForm.find("#typeahead").val()+
				"\",\"description\":\""+modalForm.find("#eventDesc").val()+"\"}'>" +
						"<i class='icon-ok' style='color:#009245;'></i>" +
						"<a href='#'>" +
							"<div class='new-li'>" +
								"<h2 class='h2'>"+modalForm.find('#title').val()+"</h2>"+
								"<p>" +
									"<span class='loc'>"+modalForm.find('#location').val()+"</span>"+"<br/>"+
									"<span class='dte'>"+modalForm.find('#datepicker-date').val()+"</span>"+" - "+
									"<span class='tme'>"+modalForm.find('#datepicker-time').val()+"</span>" +
								"</p>" +
							"</div>"+
						"</a>" +
						"<ul class='dropdown pst-stng'>" +
						"<a class='dropdown-toggle' data-toggle='dropdown' href='#'><i class='icon-cog'></i><b class='caret'></b></a>"+
						"<ul class='dropdown-menu pull-right'>"+
						"<li><a href='#Modal' class='edit-event link' role='button' data-toggle='modal' id='editLink'>" +
							"<i class='icon-edit'></i></a><a href='#' class='event-delete'><i class='icon-trash'></i></a>" +
						"</li>"+
						"<li>"+
						"</li>"+
						"</ul></ul>"+
					"</div></li>";
		
		if(modalForm.find('#title').val() != '')
		{
			$('#main-content-box .jspPane').find('.events-container ul.main-list').prepend(str);
		}
	}
	
	function addNewPoll(category)
	{
		var options = modalForm.find('.pollOptions');
		var optStr = '';
		options.each(function(){
			optStr += "<span class='block'><input type='radio' name='pollopt[]' disabled='disabled' value='"+$(this).val()+"'>"+$(this).val()+"</span>";
		});
		var str = "<li style='left:0px'><div class='task selected new "+category+"' role='poll'" +
				"data='{\"category\":\""+modalForm.find('#category').val()+"\",\"subCategory\":\""+modalForm.find("#typeahead").val()+"\"}'>" +
							"<i class='icon-ok' style='color:#009245;'></i>" +
							"<a href='#'><div class='new-li'><h2 class='h2'>"+modalForm.find('#title').val()+"</h2>"+
								"<p class='pl-opts'>"+optStr+"</p></div>" +
							"</a>" +
							"<ul class='dropdown pst-stng'>" +
							"<a class='dropdown-toggle' data-toggle='dropdown' href='#'><i class='icon-cog'></i><b class='caret'></b></a>"+
							"<ul class='dropdown-menu pull-right'>"+
							"<li><a href='#Modal' class='edit-poll link' role='button' data-toggle='modal' id='editLink'>" +
								"<i class='icon-edit'></i></a><a href='#' class='event-delete'><i class='icon-trash'></i></a>" +
							"</li>"+
							"<li>"+
							"</li>"+
							"</ul></ul>"+
							"<div class='clearfix'></div>"+
						"</div></li>";
		if(modalForm.find('#title').val() != '')
			$('#main-content-box .jspPane').find('.polls-container ul.main-list').prepend(str);
	}
	
	$('.modal-footer .close-modal').click(function(){
		resetForm(modalForm);
		if($('.modal-body').hasClass("editing"))
		{
			$('.modal-body').removeClass("editing");
		}
	});
	
	/* Hide image options box on carousel button click */
	$('a.carousel-control').click(function(e){
		e.preventDefault();
		var iClass = $(this).find('i').attr('class');
		if(iClass == 'icon-chevron-right')
		{
			var moveRight = ($('#copyright-box').width() - 60);
			$(this).parent().find('form').css('opacity','0.4');
			
			$('#copyright-box').animate({'right': '-'+moveRight},'fast','easeOutExpo',function(){
				$(this).find('a.carousel-control').html("<i class='icon-chevron-left'></div>");
			});
		}
		else
		{
			$(this).parent().find('form').css('opacity','1');
			$('#copyright-box').animate({'right':0},'fast','easeOutExpo',function(){
				$(this).find('a.carousel-control').html("<i class='icon-chevron-right'></i>");
			});
		}
	});
	
	/* Hide or show crName textbox based on status of checkbox */
	$('#crApplicable').click(function(){
		if($(this).is(':checked'))
			$('#crName').removeAttr('readonly');
		else
			$('#crName').attr('readonly','readonly').focus();
	});
	function loadImage()
	{
		$('#img-preview').on('load',function(){
			var img_width = $('#img-preview').width();
			if(img_width < 400)
			{
				alert("Upload an image of atleast 400 pixel width");
			}
			else
			{
				$(this).scaleImages({'dw':$(this).parents('.image-holder').width(),'dh':$(this).parents('.image-holder').height()});
				$('#copyright-box').fadeIn(300);
			}
		});
	}
	// Deleting added poll options when poll modal is closed.
	$('#Modal').on('hidden',function(){
		modalForm.find('.opt-div:not(:first)').remove();
	});
	/* Function to position div to center of the page */
	function resetForm(form)
	{
		form.find("input[type='text'],textarea").val('').removeClass('error');
		form.find('select').val(0).removeClass('error');
	}
	
	//Copyright details for header image in article
	$('#cr-details').submit(
			 function(){

				  var imgalt = $('#imgalt').val();
				  var usability = $('#usability').is(':checked');
				  var crApplicable = $('#crApplicable').is(':checked');
				  var crName = $('#crName').val();
				  var draftid = $('.image-holder').attr('draftid');
				  var editid = $('.image-holder').attr('editid');
				  
				  crApplicable = crApplicable ? 1 : 0;
				  usability = usability ? 1 : 0;
				  
				  var moveRight = ($('#copyright-box').width() - 60);
				  $('#copyright-box').animate({'right': '-'+moveRight},'fast','easeOutExpo',function(){
						$(this).find('a.carousel-control').html("<i class='icon-chevron-left'></div>");
				  });
				  
				  $.post("/Blog/Post/addcopyrightinfo", { "imgalt": imgalt, "usability": usability, 
					  									"crApplicable": crApplicable, "crName": crName, 
					  									"draftid": draftid, "editid": editid},
						  function(){
						  		if($.trim(crName).length == 0){
						  			$('#show-copyright-box').html('');
						  		}
						  		else{
						  			var copyrightcontent = '<div id="show-copyright-lightbox">&copy; '+crName+'</div>';
									$('#show-copyright-box').html(copyrightcontent);
						  		}
				  		  }
				  );
				  return false;
			 }
			 
	);
	function showEventForm()
	{
		$('#Modal .modal-header h3').html('New Event');
		$('#Modal .modal-footer .add').attr('id','add-event');
		modalForm.find('#title').attr('placeholder',"Event Name");
		modalForm.find('.opt-div, #add-option').addClass('hideElement');
		modalForm.find('#location,#eventDesc,#datepicker-date, #datepicker-time').removeClass('hideElement');
		
	}
	function showPollForm()
	{
		$('#Modal .modal-header h3').html('New Poll');
		$('#Modal .modal-footer .add').attr('id','add-poll');
		modalForm.find('#title').attr('placeholder',"Poll Question");
		modalForm.find('.opt-div,#add-option').removeClass('hideElement');
		modalForm.find('#location,#eventDesc,#datepicker-date, #datepicker-time').addClass('hideElement');
		var frstOpt = modalForm.find('.opt-div:first');
		var secOpt = frstOpt.clone().attr('opt','2');
		secOpt.find('.pollOptions').attr({'id':'pollOption2','placeholder':'Option 2'});
		frstOpt.after(secOpt.css('margin-left','2px'));
	}
	function resetLeftBar()
	{
		$('.jspPane').animate({left:0},'fast','easeOutExpo',function(){$('ul.main-list li').animateElements();});
	}
	
	//Delete article draft
	$('#delete_draft').live('click', function(){
		var draftid = $(this).attr('draftid');
		
		var check = confirm('Are you sure, want to delete?');
		
		if(check == true){
			$.post("/Blog/Post/deletedraft", { "draftid": draftid}, 
					function(url){
						window.location = url;
			});
		}
	});
});