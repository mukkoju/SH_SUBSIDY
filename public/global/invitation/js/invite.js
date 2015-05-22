$(document).ready(function(){
	var el = null;
	var eml = null;
        var msg = $('#inv-box').attr('err');
        if(msg)
        {
          msg = msg.split(':');
          var sts = '';
          switch(msg[0])
          {
           case '1':
            $('#sts-msg').showStatus(msg[1],'scs');
            break;
           case '0':
            $('#sts-msg').showStatus(msg[1],'err');
          }
        }
        
        $('#Email').on('blur',function(){
         var reg = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
         if(!reg.test($(this).val()))
         {
          $('#sts-msg').showStatus('Looks like the email ID you entered is not a valid one','err');
          $(this).val('');
          return false;
         }
        });
        
	$('.icon-trash').on('click',function(){
		el = $(this).parents('tr');
		eml = $(this).attr('eml');
	});
	
	$('#con-del #yes').on('click', function(){

		$.post('/ajax/revinv', {eml:eml}, function(d){
			if(d == 1){
				el.fadeOut(200, function(){
					el.remove();
				});
			}
			else{
				alert('Error in processing. Please try after sometime.');
			}
		});
		
	});
});