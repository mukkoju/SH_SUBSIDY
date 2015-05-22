$(document).ready(function () {
    var api = $('body').data('api');
    var auth = $('body').data('auth');
    
    // schdule vaigation functionality removed
    $('#ipl-stats-mn-blc .ipl_schdl').find('a').click(function () {
        var top = $('#ipl-stats-mn-blc .ipl_schdl').find('.ipl_schdl_lst').css('margin-top');
        top = parseInt(top)
        if ($(this).parents().hasClass('top')) {
//            if (top < 0) {
//                top = top + 500;
//                $('#ipl-stats-mn-blc .ipl_schdl').find('.ipl_schdl_lst').css({'margin-top': top});
//                }
            $('.ipl_schdl_lst').animate({ scrollTop: "-500px" }, 1000);
            $('.ipl_schdl_lst').scrollBy(0, -100);
            }else if ($(this).parents().hasClass('btm')) {
//            if (top > -1000) {
//                top = top - 500;
//                $('#ipl-stats-mn-blc .ipl_schdl').find('.ipl_schdl_lst').css({'margin-top': top});
//                }
//                window.scrollBy(0, 100);
//                $('.ipl_schdl_lst').scrollTo(0,100);
//                $('.ipl_schdl_lst').scrollTop(300);
                $('.ipl_schdl_lst').animate({ scrollTop: "500px" }, 1000);
            }
    });
    $('#ipl-stats-mn-blc #ipl_scrl_dwn').click(function (e) {
        e.preventDefault();
        var target = this.hash;
        $('html, body').animate({
            'scrollTop': $(target).offset().top - 80
        }, 500, 'swing', function () {
            window.location.hash = target;
        });
    });

    $('#ipl-stats-mn-blc').on('click', '.stories-nav-itm', function (e) {
        e.preventDefault();
        var index = $(this).index();
        $(this).addClass('actv').siblings().removeClass('actv');
        $("#ipl-stats-mn-blc .ipl_storis").find('.ipl_stris_sec .ipl_story_itm.actv').removeClass('actv');
        $("#ipl-stats-mn-blc .ipl_storis").find('.ipl_stris_sec .ipl_story_itm').eq(index).addClass('actv');
    });
    
    $('#ipl-stats-mn-blc .ipl_pts').find('.ipl_pts_hdr button').click(function(){
        if($(this).data('id') == 'ipl_pts_hme'){
            $('#ipl_plyof_hme').css({'display': 'none'});
            $('#ipl_pts_hme').css({'display': 'inline-block'});
            $(this).addClass('actv').siblings().removeClass('actv');
        }else if($(this).data('id') == 'ipl_plyof_hme'){
            $('#ipl_pts_hme').css({'display': 'none'});
            $('#ipl_plyof_hme').css({'display': 'inline-block'});
            $(this).addClass('actv').siblings().removeClass('actv');
        }
    });
    
//    stats view page
$('#ipl-stats-mn-blc .listNav').mouseenter(function(){
  $(this).parents('.hover').children('.efct').css({'-webkit-transform': 'scale(1.6) rotate(-45deg) translateZ(0)', 'transform': 'scale(1.6) rotate(-45deg) translateZ(0)', '-webkit-transition-duration': '1s', 'transition-duration': '1s'});
  }); 
  $('#ipl-stats-mn-blc .listNav').mouseleave(function(){
      $(this).parents('.hover').children('.efct').css({'-webkit-transform': 'scale(2) translateX(-100%) translateY(-100%) translateZ(0) rotate(-45deg)', 'transform': 'scale(2) translateX(-100%) translateY(-100%) translateZ(0) rotate(-45deg)', '-webkit-transition-duration': '1s', 'transition-duration': '1s', '-webkit-transition': '3s -webkit-transform cubic-bezier(.23,1,.32,1)' });
  });
  
  $('#ipl-stats-mn-blc .statdata').mouseenter(function(){
      $(this).children('.efct').css({'-webkit-transform': 'scale(1.6) rotate(-45deg) translateZ(0)', 'transform': 'scale(1.6) rotate(-45deg) translateZ(0)', '-webkit-transition-duration': '1s', 'transition-duration': '1s'});
  }); 
  $('#ipl-stats-mn-blc .statdata').mouseleave(function(){
      $(this).children('.efct').css({'-webkit-transform': 'scale(2) translateX(100%) translateY(100%) translateZ(0) rotate(-45deg)', 'transform': 'scale(2) translateX(100%) translateY(100%) translateZ(0) rotate(-45deg)', '-webkit-transition-duration': '1s', 'transition-duration': '1s', '-webkit-transition': '3s -webkit-transform cubic-bezier(.23,1,.32,1)' });
  });
  
  $('#ipl-stats-mn-blc .listNavAll').find('.cwc_mbl_navbr').click(function(){
      var $this = $('#ipl-stats-mn-blc .listNavAll');
     if($this.height() > 40){
         $this.css({'height': '40'});
         $(this).find('i').removeClass('icon-chevron-up').addClass('icon-chevron-down')
     }else{
         $this.css({'height': '1280px'});
         $(this).find('i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
     }
  });
  

  if(location.pathname == '/stats/ipl' || location.pathname == '/stats/ipl/'){
  $.ajax({
     url: api +'/gts',
     type: 'post',
     data: {
            'auth': $("body").getShIntr(),
            'cnt': 4,
            'htg': 'ipl',
            'page': 1,
            'pc': 0,
            'usr': $("body").getLoggedInUsr()
           },
     success: function(res){
         res = JSON.parse(res);
         var d = res.msg;
         for(var i=0; i< 2; i++){
             var htm = '<li>';
                htm += '<a href="'+auth+'/'+d[i].P_Category+'/'+d[i].P_SubCategory+'/'+d[i].P_Title_ID+'" target="_blank"><img src="https://testing.saddahaq.com/public/Multimedia/'+d[i].P_Feature_Image+'"/></a>';
                htm += '<a href="'+auth+'/'+d[i].P_Category+'/'+d[i].P_SubCategory+'/'+d[i].P_Title_ID+'" target="_blank"><span>'+d[i].P_Title+'</span></a>';
                htm += '</li>';
            $('#ipl-stats-mn-blc .ipl_storis').find('ul').append(htm);
         }
     }   
  });
  }
  
  $('#ipl-stats-mn-blc .scor_nav_btns').find('button').click(function(){
     $(this).attr('disabled', 'disabled').siblings().removeAttr('disabled');
     if($(this).text() == 'Overview'){
         $('#scr-tbls').css('display', 'none');
     }else{
         $('#scr-tbls').css('display', 'block');
     }
     
  });
});

function startTimer()
  {
//    $('.countdown > .row-fluid:first').prepend('<a href="/' + dbid + '" class="span3 pull-left"><i class="icon-chevron-left"></i> Back</a>')
    var strtTmr = setInterval(function () {
      var currTime = new Date();
      var strt =  $('#ipl-stats-mn-blc #match_date').data('strt')*1000;
//      var endTime = (strt + durtn);
      var diff = (new Date(strt + currTime.getTimezoneOffset() * 60000).getTime() -
              new Date(currTime.getTime() + currTime.getTimezoneOffset() * 60000)) / 1000;
      
      if (diff >= 0)
      {
        var bDys = Math.floor(diff / 86400);
        if (bDys < 10)
            bDys = '0' + bDys;
        var bHrs = Math.floor((diff / 3600)%24);
        if (bHrs < 10)
          bHrs = '0' + bHrs;
        var bMin = Math.floor((diff % 3600) / 60);
        if (bMin < 10)
          bMin = '0' + bMin;
        var bSec = Math.floor(diff % 60);
        if (bSec < 10)
          bSec = '0' + bSec;
        $('#ipl-stats-mn-blc').find('#timer').html('<div>'+bDys+'<span>DD</span></div> <div>'+bHrs+'<span>HRS</span></div> <div>'+bMin+'<span>MIN</span></div> <div>'+bSec+'<span>SEC</span></div>');
        return {'days': bDys, 'mints':bMin}
      }
      else
      {
        $('#dbt .question:first').remove();
        clearInterval(strtTmr);
      }
    }, 1000);
  }
  startTimer();
