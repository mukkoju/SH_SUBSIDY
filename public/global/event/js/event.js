$(document).ready(function () {
  // Setting context tab as the default active tab
  $('#context').setActiveTab();
  $('#happening-now a[href="#context"]').removeAttr('class');

  $('.clps-scl-drpbx').on('click', function () {
    if ($(this).chkVrfd())
      $(this).parents('.sclbar').find('#scl-drpbx').toggleClass('no-hgt in');
  });
  //API url
  var api = $('body').data('api');
  //Show invite and notify options if user is author or attending event
  var shownotify = $('#evt-notify').attr('value');
  if (shownotify == 1) {
    $("#evt-notify").show();
  }
  //Getting event details
  var edt = $('.edtr').data('desc');
  
  /* Loading suggestions when none is selected by user */
  if ($('#rltd-lst').find(' > li').length < 4)
    $('#rltd-lst').ldMreSgstns('E', edt.id);
  /*
   *  Building Event content from event json string
   */
  $(window).load(function () {
    $('#lc-holder').initMap();
    if ($('#lc-holder').data('lc') != "To Be Announced..")
      $('#lc-holder').mapLocation();
    $('#event-content .stry').loadArt($('.evt-data').val());
    $('#event-content').removeAttr('evt-dt');
    // Setting hashtag in context textarea
    $('.right-container').find('#context').data('htg', edt.sct);
    if ($('.atch-container ul.atch-list').data('atchd') != null)
      $(this).listDoc($('.atch-container ul.atch-list').data('atchd'), 0);
  });

  // Function to add user to event waiting list
  $('#adwtlst').on('click', function () {
    var $this = $(this);
    $.post('/ajax/evntwtlst', {
      'eid': edt.id
    }, function (cb) {
      if (cb)
      {
        $('#sts-msg').showStatus('Successfully enrolled into the waiting list', 'scs');
        $this.slideUp(300).parent().text('You are enrolled into the waiting list. You will be notified once RSVP is available.');
      }
      else
        $('#sts-msg').showStatus('An error occured! Please try later.', 'err');
    });
  });
  
  //Function to toggle attend status on clicking change-status button 
  $('#pop-prw').on('click','#tgl-atnd input[type="checkbox"]',function (e) {
    var $this = $(this);
    if ($this.chkVrfd())
    {
      var username = $this.getLoggedInUsr();
      var type = '';
      if (!$this.parents('#tgl-atnd').hasClass('atnd'))
        type = 'Yes';
      else
        type = 'No';
      $.post(api + '/ea', {
        'id': edt.id,
        'tp': type,
        'toggle': 'Yes',
        'auth': $this.getShIntr(),
        'usr': username
      }, function (d) {
        var t = JSON.parse(d);
        if (t.success == 1) {
          $this.parent().toggleClass('atnd');
        }
        toggleAttendingStatus(username, type);
      });
    }
  });
  function toggleAttendingStatus(username, status)
  {
    var actlst = $('#atnd-lst ul');
    var atnd_dt = (actlst.data('atnd') != '') ? actlst.data('atnd') : [];
    if (status == 'Yes')
    {
      actlst.prepend("<li><a href='/" + username[0] + "'><span class='img-bx'><img src='/public/Multimedia/P_Pic_" + username[0] + "' align='abs-middle'/></span><span class='nme'>" + username[1] + "</span></a></li>");
      atnd_dt.unshift({"AU_FName": username[1].split(' ')[0], "AU_LName": username[1].split(' ')[1], "AU_UName": username[0]});
      actlst.data('atnd', atnd_dt);
      if (actlst.find('li').length > 6)
        actlst.find('li:eq(6)').addClass('hideElement');
      var cnt = parseInt(actlst.data('cnt')) + 1;
      actlst.data('cnt', cnt).siblings('.s-h').find('span').text(cnt);
      if (cnt >= 7)
        actlst.find('.vw-btn').removeClass('hideElement');
      var list = $('#inv-lst ul');
      list.find('li').each(function () {
        if ($(this).find('a').attr('href').substr(1) == username[0])
        {
          $(this).remove();
          list.find('li.hideElement').not('.vw-btn').removeClass('hideElement');
          var cnt = parseInt(list.data('cnt'));
          list.siblings('.s-h').find('span').text((cnt > 1) ? cnt - 1 : 0);
          return false;
        }
      });
      var invDt = list.data('invtd');
      for (var i = 0; i < invDt.length; i++)
      {
        if (invDt[i]['MJU_UName'] == username[0])
        {
          invDt.splice(i, 1);
          break;
        }
      }
      list.data('invtd', invDt);
      actlst.parents('.sclbar').find('#scl-drpbx').removeClass('no-hgt').addClass('in');
    }
    else if (status == 'No')
    {
      var usrDel = false;
      actlst.find('li').each(function () {
        if ($(this).find('a').attr('href').substr(1) == username[0])
        {
          $(this).remove();
          usrDel = true;
          return false;
        }
      });
      if (usrDel)
      {
        actlst.find('li.hideElement:first').removeClass('hideElement');
        for (var a = 0; a < atnd_dt.length; a++)
        {
          if (atnd_dt[a]['AU_UName'] == username[0])
            atnd_dt.splice(a, 1);
        }
      }
      var actcnt = parseInt(actlst.data('cnt')) - 1;
      actcnt = (actcnt >= 0) ? actcnt : 0;
      actlst.data('cnt', actcnt).siblings('.s-h').find('span').text(actcnt);
      if (actcnt <= 6)
        actlst.find('.vw-btn').addClass('hideElement');
    }
  }
  // Validations for invited user lists
  $('#invite-form').on('blur', '.invitee', function () {
    var reg = /^([a-zA-Z0-9\ ]{1,})$/;
    if (!reg.test($(this).val()))
      $(this).addClass('error');
    else
      $(this).removeClass('error');
  });
  // Animating left bar to allow user to send invitations 
  $('#invite').click(function () {
    $('#aux-attending-data').css('display', 'none');
    var margin = $('#left-bar').width();
    $('#aux-invited-data, #invite-box').css('display', 'block');
    $('#aux-content-box').slideLeftBar({
      'direction': 'left',
      'margin': margin
    });
    $('#aux-content-box ul.main-list > li').animateAuxContent();
  });
  /*
   * Suggestions for inviting users
   */
  $('#sh-inv-txt').on('focus', function () {
    if ($(this).chkVrfd())
      $(this).getUsrSgstns();
  });

  $('#sh-inv-txt').on('blur', function () {
    var $this = $(this);
    var val = $this.attr('unme');
    var flag = false;
    if (val != undefined)
    {
      if ($('#user-nav .usrname').attr('href').substr(1) == val)
      {
        $('#sts-msg').showStatus('Invite someone else to this event', 'err');
        flag = true;
      }
      else if ($this.attr('unme') == $('#lft-mnu .usr-dtls').find('a:first').attr('href').substr(1))
      {
        $('#sts-msg').showStatus($('#lft-mnu .usr-dtls').find('a:first').text() + ' is already involved in this event', 'err');
        flag = true;
      }
      else {
        var atndLst = $('#atnd-lst').find('ul').data('atnd');
        if (atndLst)
        {
          atndLst.forEach(function (atndng, i) {
            if (atndng['AU_UName'] == val)
            {
              $('#sts-msg').showStatus($this.val() + ' is already involved in the event', 'err');
              flag = true;
              return false;
            }
          });
        }
      }
      if (flag)
      {
        $this.removeAttr('unme').val('').focus();
        return false;
      }
    }
  });

  $('#sh-inv-txt').on('keyup', function (e) {
    var $this = $(this);
    if (e.which == 13 && !e.shiftKey && $this.val() != '')
    {
      // Disable submission of text if the user is choosing a suggestion
      if ($this.hasClass('ui-autocomplete-input'))
      {
        $this.autocomplete('destroy');
        return false;
      }
      else
      {
        var ct = edt.ct.split(',');
        var sct = edt.sct.split(',');
        $.post('/ajax/userinvite', {
          'eventid': edt.id,
          'invitees': [$this.attr('unme')],
          'auth': edt.auth.toLowerCase(),
          "url": '/events/' + ct[0] + '/' + sct[0] + '/' + edt.tid,
          "ttl": edt.ttl,
          "loc": edt.loc,
          "tm": edt.tm
        },
        function (data) {
          var status = $.parseJSON(data);
          if (status.success == "-10")
            $('#sts-msg').showStatus(status.msg, 'err');
          else if (!status.err && status.suc != '') {
            var invlst = $('#inv-lst ul');
            var invDt = invlst.data('invtd');

            invlst.prepend(updateLists($this.attr('unme'), $this.val()));
            invlst.data('cnt', invlst.data('cnt') + 1).siblings('.s-h').find('span').text(invlst.data('cnt'));

            if (invlst.data('cnt') > 5)
              invlst.find('li:eq(5)').addClass('hideElement').siblings('.vw-btn').removeClass('hideElement');
            $this.removeAttr('unme').val('');
            $this.getUsrSgstns();
          }
          else
          {
            if (status.err == '')
              $('#sts-msg').showStatus("Looks like you are trying to invite a user who is not on saddahaq", 'err');
            else
            {
              var err = status.err.split(':');
              if (err[1] == 0)
                $('#sts-msg').showStatus($this.val() + " is an invalid user", 'err');
              else
                $('#sts-msg').showStatus($this.val() + " is already involved in the event", 'err');
            }
            $this.val('').removeAttr('unme').focus();
            return false;
          }
        });
      }
    }
  });

  $('.vw-all').on('click', function () {
    var dt = $(this).parents('ul').data('')
  });

  $('.vw-all').on('click', function () {
    var dt = $(this).parents('ul').data('atnd');
    var tp = 'a';
    if (dt == undefined)
    {
      dt = $(this).parents('ul').data('invtd');
      tp = 'i';
    }
    var popup = $('#pop-prw');
    popup.html('<div class="modal-header"><h3 class="s-h"></h3><a href="#" id="prw-close" title="Close"><i class="icon-remove-circle"></i></a></div><div class="modal-body span6"><ul class="vw-al-lst no-lst"></ul></div>');
    var trgt = popup.find('ul');
    for (var e = 0; e < dt.length; e++)
    {
      if (tp == 'a')
      {
        popup.find('.s-h').text("Attending");
        trgt.append(updateLists(dt[e]['AU_UName'], dt[e]['AU_FName'] + ' ' + dt[e]['AU_LName']));
      }
      else
      {
        popup.find('.s-h').text("Invited");
        trgt.append(updateLists(dt[e]['MJU_UName'], dt[e]['MJU_FName'] + ' ' + dt[e]['MJU_LName']));
      }
    }
    popup.css('margin-left', -(popup.outerWidth() / 2) + 'px');
    $('.sts-bx').fadeIn(400, function () {
      popup.addClass('in');
    });
  });

  function updateLists(unme, name)
  {
    var img = new Image();
    img.src = '/public/Multimedia/P_Pic_' + unme;
    var listelem = "<li>" +
            "<a href='/" + unme + "'><span class='img-bx'>";
    if (img.width)
      listelem += "<img src='/public/Multimedia/P_Pic_" + unme + "' />";
    else
      listelem += "<i class='icon-profile'></i>";
    listelem += "</span>" +
            "<span class='nme'>" + name + "</span>" +
            "</a>" +
            "</li>";
    return listelem;
  }
  //Notifications to event attending people
  $('#notification-msg').on('keydown', function (e) {
    if (e.which == 13 && !e.shftKey)
      e.preventDefault();
  });
  $('#notification-msg').on('keyup', function (e) {
    if (e.which == 13)
    {
      if ($(this).hasClass('ui-autocomplete-input'))
      {
        $(this).autocomplete('destroy');
        return false;
      }
      else
      {
        var msg = $.trim($('#notification-msg').text());
        if (msg == '' || msg == null)
          return false;
        else
        {
          var eventid = $('#invite-form').attr('eventid');
          $.post("/ajax/evtntfy", {
            "eid": eventid,
            "msg": msg
          },
          function (d) {
            if (d) {
              $('#sts-msg').showStatus('Notification sent successfully', 'scs');
              $('#notification-msg').text('');
            }
          }
          );
          return false;
        }
      }
    }
    else if (e.which == 50 && e.shiftKey)
    {
      $(this).getUsrSgstns();
    }
    else
      $(this).lmtTxt(e, this)
    return false;
  });

//  // Show popup for changes
//  $('#delete_event').on('click', function() {
//    var prw = $('#art-prw');
//    prw.find('h3.s-h').text('Need your confirmation');
//    prw.find('.del').removeClass('hideElement');
//    
//    $('.sts-bx').fadeIn(300,function(){
//      $('#art-prw').css('top','10%').addClass('in');
//    });
//  });
//
//  // Close popup
//  $('#prw-close, #prw #cancel').on('click', function() {
//    $('#art-prw,.sts-bx').fadeOut(300);
//    $('#art-prw').find('.modal-body textarea').val('');
//    $('#art-prw').find('.modal-body i').removeClass('icon-star');
//  });
//
//  //Delete Event
//  $('#del-evt').on('click', function() {
//    var delrsns = $('.del #delrsns').val();
//    if ($.trim(delrsns) == '') {
//      $('.del #delrsns').addClass('error').attr('placeholder', 'Tell us why you are deleting this event').val('');
//      return false;
//    }
//    $('#art-prw').fadeOut(300);
//    $(this).attr('disabled', 'disabled');
//    $.post('/ajax/delev', {
//      'rsn': $('.del #delrsns').val(),
//      'eventid': $('#delete_event').attr('eventid'),
//      'tp': 1
//    }, function(d) {
//      if (d == -1) {
//        $('#sts-msg').showStatus("Oops! Something went wrong. Please try again.", 'err');
//      }
//      else if (d == -2) {
//        $('#sts-msg').showStatus("Oh dear! You don't have enough privilege to delete this event.", 'err');
//      }
//      else if (d == -3) {
//        $('#sts-msg').showStatus("Oopss! You're trying to delete an invalid event.", 'err');
//      }
//      else {
//        $('#sts-msg').showStatus("Event has been Deleted Successfully!", 'scs');
//      }
//      setTimeout(function() {
//        window.location = '/'
//      }, 1500);
//    });
//  });

  // //Delete event
  // $('#delete_event').click(
  //  function(){
  //   var msg = confirm("Are you sure, want to delete?");
  //
  //   if(msg){
  //    eventid = $(this).attr('eventid');
  //    pid = $(this).attr('pid');
  //
  //    $.post('/ajax/delev', {
  //     "eventid": eventid, 
  //     "pid": pid
  //    },
  //    function(url){
  //     window.location = url;
  //    }
  //    );
  //   }
  //  }
  //  );

  /* social invite */
  $("#pop-prw").on('click', '.fb-inv', function (e) {
    /* sends msg */
    FB.ui({
      method: 'send',
      link: document.URL
    }, function () {
    });
  });
  
  $('#pop-prw').on('click', '.gp-btn',function(e){
    e.preventDefault();
    window.open(this.href,"", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600");
  })

  /* Popup to show attend event box */
  $('#atnd-evt, #inv-frnds').on('click', function () {
    var $this = $(this);
    if($('#pop-prw').find('.atnd-bx').length)
      $('#pop-prw > section').showPopup(1);
    else
    {
      $.ajax({
        url : api + '/gtf',
        data : {
          "id" : "atnd-evt",
          "isAtnd" : $this.data('atnd')
        },
        type : "post",
        success : function(d){
          d = JSON.parse(d);
          $('#pop-prw > section').html(d['frm']).showPopup(1);
          $('#pop-prw').find('.atnd-bx .gp-btn').attr('href', 'https://plus.google.com/share?url='+ document.URL);
        }
      });
    }
  });
  
  //Enable disable live blog
  $('#con-del #yes').click(function () {
    if ($(this).hasClass('enbl-lv-blg'))
    {
      $.post('/ajax/lvblgtgle', {
        "tid": edt.tid,
        "tp": "E"
      },
      function (d) {
        if (d == 1) {
          $('.sts-msg').showStatus('Live Blog enabled successfully!!', 'scs');
          location.reload();
        }
        else if (d == 2) {
          $('.sts-msg').showStatus('Live Blog disabled successfully!!', 'scs');
          location.reload();
        }
        else if (d == 0)
          $('.sts-msg').showStatus("Oh dear! You don't have enough privileges to enable/disable Live Blog", 'err');
        else if (d == -1) {
          $('.sts-msg').showStatus("Err!! You are trying to enable/disable Live Blog for an invalid event. Please wait while we redirect you to the hompage...", 'err');
          window.location = '/';
        }
        else if (d == -2)
          $('.sts-msg').showStatus("Something went wrong. Please try again later!!", 'err');
      });
    }
  });
});