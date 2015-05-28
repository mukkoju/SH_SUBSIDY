$(document).ready(function ($) {
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    $('#intro').height(windowHeight);
    $('#subsdy-mnu .mbl-mnu').height(windowHeight);
    var sloganHight = $('#intro section').height() / 2
    $('#intro section').css({'padding-top': windowHeight / 2 - sloganHight + 'px'});
    $(window).scroll(function () {

//        console.log("scroll");
        if ($(window).scrollTop() > 150) {
            $('#intro section').fadeOut();
        } else {
            $('#intro section').fadeIn();
        };
        if ($(window).scrollTop() > windowHeight - 100) {
            $('.main-header').addClass('shows');
        } else {
            $('.main-header').removeClass('shows');
        };
    });
    $.ajax({
       url: '/stats',
       type: 'post',
       data: {},
       success: function(res){
           var d = JSON.parse(res);
           if(d.success){
               $('#stream .sec').find('.stat:nth-child(1) span').attr('data-to', d.msg[0].pledge);
               $('#stream .sec').find('.stat:nth-child(2) span').attr('data-to', d.msg[0].request);
               $(".number-counters").appear(function () {
        $(".number-counters [data-to]").each(function () {
            var e = $(this).attr("data-to");
            $(this).delay(6e3).countTo({
                from: 0,
                to: e,
                speed: 3e3,
                refreshInterval: 50
            })
        })
    });
           }
       }
    });
    $('body').on('click', '#scrl-dwn, .main-mnu li a', function (e) {
        e.preventDefault()
        $('html, body').animate({
            scrollTop: jQuery(this.hash).offset().top
        }, 500);
    });

    $('body').on('click', '#mbl-nav', function () {
        if ($('body').find(".mbl-mnu").hasClass('actv'))
            $('body').find(".mbl-mnu").removeClass('actv');
        else
            $('body').find(".mbl-mnu").addClass('actv');
    });
    $('#steps').on('click', '.gvup', function () {
        var states = ['Andhra Pradesh', 'Andaman and Nicobar Islands', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Lakshadweep','Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Orissa', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
        $('body').find('.step-model').removeClass('hideElement');
        $('body .step-model').find('#rqst-state, #pldgr-state').html('<option value="">Select</option>');
        for(var i=0; i<states.length; i++){
        $('body .step-model').find('#rqst-state, #pldgr-state').append('<option value="'+states[i]+'">'+states[i]+'</option>');
        }
            var width = $(window).width();
            if(width > 767)
            $('#gvup-frm .stp-frm').css({'width': width-160});
            else
            $('#gvup-frm .stp-frm').css({'width': width});
    });
    $('body').on('click', '.step-model .remove-model',function(){
       $(this).parents('.step-model').addClass('hideElement');
    });
    
   $('#pldge').on('keyup', '#pldgr-name', function(){
       $('#pldge').find('.pldg-msg span').html($(this).val());
   });
   
    $('#pldge').on('click', '#pldge-btn', function () {
        var $this = $(this);
        var elements = $('#gvup-frm #pldge').find("input[type='text'],input[type='password'],input[type='number'],input[type='email'],input[type='radio'],textarea,select");
        var reg = null;
        var flag = 0;
        var error = "Cannot be empty";
        var element = null;
        elements.each(function () {
            element = $(this).attr('id');
            switch (element) {
                case 'pldgr-name':
                    error = 'Name should contain only alphabets, numerals and space';
                    reg = /^[a-zA-Z0-9 ]+$/;
                    break;
                case 'pldgr-email':
                    error = 'Invalid email';
                    reg = /^[a-z0-9_\+-]+(\.[a-z0-9_\+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,4})$/;
                    break;
                case 'pldgr-state':
                    if ($.trim($(this).find('option:selected').val()) !== '') {
                        error = 'Please slelect your state';
                        reg = /^[a-zA-Z0-9 ]+$/;
                    }else{
                        error = 'Please slelect your state';
                        reg = /^[a-zA-Z0-9 ]+$/;
                    }
                    break;
                case 'pldgr-gas':
                    if ($.trim($(this).find('option:selected').val()) !== '') {
                        error = 'Please slelect your service provider';
                        reg = /^[a-zA-Z0-9 ]+$/;
                    }else{
                        error = 'Please slelect your service provider';
                        reg = /^[a-zA-Z0-9 ]+$/;
                    }
                    break;
                case 'pldgr-dsc':
                    error = null;
                    reg = null;
                    break
            }

            if (reg)
            {
                if (!reg.test($(this).val().toLowerCase()))
                {
                    flag = 1;
                    return false;
                }
                else
                {
                    $(this).parents('label').find('span').remove();
                }
            }
        });
        if (flag == 1)
        {
            $('#' + element).parents('label').append('<span title="' + error + '"><i class="icon-warning-sign"></i></span>');
            return false;
        }
        else
        {
        var name = $('#pldge').find('#pldgr-name').val();
        var email = $('#pldge').find('#pldgr-email').val();
        var state = $('#pldge').find('#pldgr-state').val();
        var gas = $('#pldge').find('#pldgr-gas').val();
        var dsc = $('#pldge').find('#pldgr-dsc').val();
        
        $.ajax({
           url: '/pldg',
           type: 'post',
           data: {'nme': name, 'email': email, 'state':state, 'gas': gas, 'dsc': dsc},
           success: function(res){
               var d = JSON.parse(res);
               if(d.success){
                var frmWdth = $this.parents('.stp-frm').outerWidth()+80
                $this.parents('.stp-frm').css({'margin-left': -frmWdth});
               }else
                   alert(d.msg)
           }
        });
        }
    });
    
    
    $('#reqst').on('click', '#rqst-btn', function () {
        var $this = $(this);
        var elements = $('#gvup-frm #reqst').find("input[type='text'],input[type='password'],input[type='number'],input[type='email'],input[type='radio'],textarea,select");
        var reg = null;
        var flag = 0;
        var error = "Cannot be empty";
        var element = null;
        elements.each(function () {
            element = $(this).attr('id');
            switch (element) {
                case 'rqst-state':
                    if ($.trim($(this).find('option:selected').val()) !== '') {
                        error = 'Please slelect your state';
                        reg = /^[a-zA-Z0-9 ]+$/;
                    }else{
                        error = 'Please slelect your state';
                        reg = /^[a-zA-Z0-9 ]+$/;
                    }
                    break;
                    case 'rqst-mp':
                    if ($.trim($(this).find('option:selected').val()) !== '') {
                        error = 'Slelect one MP/MLA';
                        reg = /^[a-zA-Z0-9 ]+$/;
                    }else{
                        error = 'Please slelect MP/MLA';
                        reg = /^[a-zA-Z0-9 ]+$/;
                    }
                    break;
                    case 'rqst-cntncy':
                    if ($.trim($(this).find('option:selected').val()) !== '') {
                        error = 'Select Constituency';
                        reg = /^[a-zA-Z0-9 ]+$/;
                    }else{
                        error = 'Please slelect constituency';
                        reg = /^[a-zA-Z0-9 ]+$/;
                    }
                    break;
                    case 'rqst-dtls':
                    error = null;
                    reg = null;
                    break
            }

            if (reg)
            {
                if (!reg.test($(this).val().toLowerCase()))
                {
                    flag = 1;
                    return false;
                }
                else
                {
                    $(this).parents('label').find('span').remove();
                }
            }
        });
        if (flag == 1)
        {
            $('#' + element).parents('label').append('<span title="' + error + '"><i class="icon-warning-sign"></i></span>');
            return false;
        }
        else
        {
            
        var state = $('#reqst').find('#rqst-state').val();
        var mp = $('#reqst').find('#rqst-mp').val();
        var cntncy = $('#reqst').find('#rqst-cntncy').val();
        var dtls = $('#reqst').find('#rqst-dtls').val();
        $.ajax({
           url: '/rqst',
           type: 'post',
           data: {'state':state, 'cndidt': mp, 'cntncy': cntncy, 'dtls': dtls},
           success: function(res){
               var d = JSON.parse(res);
               if(d.success)
               {
               $this.addClass('hideElement');
               $('#reqst #aftr-rqst').removeClass('hideElement');         
               }else
                   alert(d.msg)
           }
        });
        
        }
    });
    $('#reqst').on('click', '#aftr-rqst a', function () {
        var $this = $(this) 
        var frmWdth = $this.parents('.stp-frm').outerWidth()+80
        $this.parents('.stp-frm').css({'margin-left': -frmWdth});
    });
    
    $('#reqst').on('change', '#rqst-mp, #rqst-state', function(e){
        if(e.target.id == 'rqst-state'){
            if($("#rqst-mp").val() == 'Select')
                return false;
        }
        $.ajax({
           url: '/gtcntcy',
           type: 'post',
           data: {'cndidt': $('#rqst-mp').val(), 'state': $('#rqst-state').val()},
           success: function(res){
               var d = JSON.parse(res);
               if(d.success){
                   $('#reqst').find('#rqst-cntncy').html('<option value="">Select</option>')
                  for(var i=0; i<d.msg.length; i++){
                      $('#reqst').find('#rqst-cntncy').append('<option value="'+d.msg[i]['_ID_']+'">'+d.msg[i]['_Constitiuency_Name']+'</option>');
                  }
               }
           }
        });
    });
    $('#reqst').on('change', '#rqst-cntncy', function(e){
        $.ajax({
           url: '/gtcndidt',
           type: 'post',
           data: {'id': $('#rqst-cntncy option:selected').val()},
           success: function(res){
               var d = JSON.parse(res);
               if(d.success){
                      $('#reqst').find('#rqst-dtls').val(d.msg[0]['_Candidate_Name']);
                      $('#reqst').find('.pldg-msg span').html(d.msg[0]['_Candidate_Name']);
               }
           }
        });
    }); 
    
});