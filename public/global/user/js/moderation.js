$(document).ready(function () {
  /* Moderation related functions */
  var url = (window.location.toString()).split('/');
  var adt = $('.edtr').data('desc');
  // Show popup for changes
// ('.change,.approve,.reject,.delete,.feature,.dismiss')
  $('#lft-mnu').on('click', 'li.s a', function () {
    var $this = $(this);
    var dt = {};
    if ($this.hasClass('feature'))
      dt = {"id": "ftr", "tp": $this.data('sts')};
    else if ($this.hasClass('approve'))
      dt = {"id": "aprv"};
    else if ($this.hasClass('change'))
      dt = {"id": "sgst"};
    else if ($this.hasClass('reject'))
      dt = {"id": 'rjct'};
    else if ($this.hasClass('dismiss'))
      dt = {"id": 'dsms'};
    else if ($this.hasClass('headline'))
      dt = {"id": 'hdln', "tp": $this.data('sts')};
    else if ($this.hasClass('send-note'))
      dt = {"id": 'snd-nte'};
    if (dt.id != undefined)
    {
      $.ajax({
        url: $('body').data('api') + '/gtf',
        type: 'post',
        data: dt,
        success: function (data) {
          data = JSON.parse(data);
          $('#pop-prw > section').html(data['frm']).showPopup(0);
        }
      });
    }
  });
  // Close popup
  $('#prw-close, #prw #cancel').on('click', function () {
    var par = $(this).parents('#art-prw');
    $('.sts-bx').fadeOut(300, function () {
      par.removeClass('in').css('top', '-100%');
    });
    par.find('.modal-body textarea').val('');
    par.find('.modal-body i').removeClass('active');
  });
  // Rating for article
  $('.aprv i').on('click', function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active').parent().find('i:gt(' + $(this).index() + ')').addClass('active');
  });
  // Approve
  $('#pop-prw').on('click', '#aprv-art', function () {
    var $this = $(this);
    if ($this.siblings('#snd-eml').find('input[type="radio"]:checked').val() == undefined)
      $this.siblings('.dsc').addClass('err');
    else
    {
      $(this).attr('disabled', 'disabled');
      $.ajax({
        url: '/ajax/aprv',
        async: true,
        type: 'post',
        data: {'id': adt.id, 'tp': $('#comments-box').data('tp'), 'sndEml': $('#snd-eml').find('input[type="radio"]:checked').val()},
        dataType: 'text',
        success: function (d) {
          processRedirect(d, $('#comments-box').data('tp'));
        }
      });
    }
  });

//Reject 
  $('#art-prw').on('click', '#rjct-art', function () {
    var rejrsn = $('#art-prw .txtarea textarea').val();
    if ($.trim(rejrsn) == '') {
      $('.rjct #rejrsns').addClass('error').attr('placeholder', 'Place some reason - it should not be empty').val('');
      return false;
    }
    $('#art-prw').removeClass('in').css('top', '-100%');
    $(this).attr('disabled', 'disabled');
    $.ajax({
      url: '/ajax/rjct',
      async: true,
      type: 'post',
      data: {'rejrsn': $('.rjct #rejrsns').val(), 'id': adt.id, 'tp': $('#comments-box').data('tp')},
      dataType: 'text',
      success: function (d) {
        dspStatus(d, $('#comments-box').data('tp'), 'r');
      }
    });
  });
  //Featured 
  $('#pop-prw').on('click', '#fetr-art', function () {
    $(this).attr('disabled', 'disabled');
    $.ajax({
      url: '/ajax/ftr',
      async: true,
      type: 'post',
      data: {'id': adt.id, 'tp': $('#comments-box').data('tp')},
      dataType: 'text',
      success: function (d) {
        processRedirect(d, $('#comments-box').data('tp'));
      }
    });
  });
  //Headline
  $('#pop-prw').on('click', '#hdln-art', function () {
    $(this).attr('disabled', 'disabled');
    $.ajax({
      url: '/ajax/hdlne',
      async: true,
      type: 'post',
      data: {'id': adt.id, 'tp': $('#comments-box').data('tp')},
      dataType: 'text',
      success: function (d) {
        processRedirect(d, $('#comments-box').data('tp'));
      }
    });
  });

  //Dismiss | Remove From Moderation
  $('#pop-prw').on('click', '#dism-art', function () {
    $(this).attr('disabled', 'disabled');
    $.ajax({
      url: '/ajax/dsms',
      async: true,
      type: 'post',
      data: {'tid': adt.tid, 'tp': $('#comments-box').data('tp')},
      dataType: 'text',
      success: function (d) {
        $('#pop-prw').removeClass('view');
        dspStatus(d, $('#comments-box').data('tp'), 'd');
      }
    });
  });
  //Delete 
  $('#del-art').on('click', function () {
    var delrsns = $('.del #delrsns').val();
    if ($.trim(delrsns) == '') {
      $('.del #delrsns').addClass('error').attr('placeholder', 'We would like to know why you want to delete this petition').val('');
      return false;
    }
    $('#art-prw').removeClass('in').css('top', '-100%');
    $(this).attr('disabled', 'disabled');
    if (url[4] == 'article') {
      $.post('/ajax/dlpst', {
        'delrsn': $('.del #delrsns').val(),
        'pid': $('#delete_article').attr('postid'),
        'tp': $('#delete_article').attr('tp')
      }, function (d) {
        d = d.responseText;
        if (d == -1 || d == "-1") {
          $('#sts-msg').showStatus("Oh dear! You don't have enough privilege to delete this!!", 'err');
        }
        else if (d == -2 || d == "-2") {
          $('#sts-msg').showStatus("Oopss! You're trying to delete an invalid item", 'err');
        }
        else if (d == 1 || d == "1") {
          $('#sts-msg').showStatus("Content deleted Successfully!!", 'scs');
          del_rsn.val('').removeClass('error');
          setTimeout(function () {
            window.location = '/moderator/articles';
          }, 1500);
        }
      });
    } else if (url[4] == 'event') {
      $.post('/ajax/delev', {
        'rsn': $('.del #delrsns').val(),
        'eventid': $('#delete_event').attr('eventid'),
        'tp': $('#delete_event').attr('tp')
      }, function (d) {
        if (d == -1) {
          $('#sts-msg').showStatus("Something went wrong. Please try again!!", 'scs');
        }
        if (d == -2) {
          $('#sts-msg').showStatus("You dont've have enough privilege to delete this event!!", 'scs');
        }
        if (d == -3) {
          $('#sts-msg').showStatus("You're trying to delete an invalid event!! Please wait while we redirect you to homepage...", 'scs');
          setTimeout(function () {
            window.location = '/';
          }, 1500);
        }
        else {
          $('#sts-msg').showStatus("Event has been Deleted Successfully!!", 'scs');
          setTimeout(function () {
            window.location = '/moderator/events';
          }, 1500);
        }
      });
    } else {
      $.post('/ajax/dlptn', {
        'rsn': $('.del #delrsns').val(),
        'pid': $('#delete_petition').attr('ptid'),
        'tp': $('#delete_petition').attr('tp')
      }, function (d) {
        if (d == -1) {
          $('#sts-msg').showStatus("Something went wrong. Please try again!!", 'err');
        }
        if (d == -2) {
          $('#sts-msg').showStatus("Oops! You dont've have enough privilege to delete this petition", 'err');
        }
        if (d == -3) {
          $('#sts-msg').showStatus("You're trying to delete an invalid petition!! Please wait while we redirect you to homepage...", 'scs');
          setTimeout(function () {
            window.location = '/';
          }, 1500);
        }
        else {
          $('#sts-msg').showStatus("Petition has been Deleted Successfully!!", 'scs');
          setTimeout(function () {
            window.location = '/moderator/petitions';
          }, 1500);
        }
      });
    }

  });
  // Suggestions
  $('#art-prw,#pop-prw').on('click', '#send-sgstns', function () {
    var sgstns = $(this).parents('#art-prw, #pop-prw').find('.txtarea, textarea');
    if (sgstns.val() == '')
    {
      $(this).siblings(".err-msg").text('Suggestions box cannot be empty!');
      return false;
      sgstns.addClass('error');
    }
    else
    {
      $(this).attr('disabled', 'disabled');
      sgstns.removeClass('error');
      $.post('/ajax/sgstedtsmdrtr', {
        'sgstn': sgstns.val(),
        'tid': adt.tid,
        'tp': $('#comments-box').data('tp')
      }, function (d) {
        $('#pop-prw').removeClass('view');
        dspStatus(d, $('#comments-box').data('tp'), 's');
      });
    }
  });
  function processRedirect(d, tp) {
    $('#pop-prw').removeClass('view');
    var url = '';
    if (tp == 'A')
      url = '/moderator/articles';
    else if (tp == 'E')
      url = '/moderator/events';
    else if (tp == 'P')
      url = '/moderator/petitions';
    $('#art-prw').removeClass('in').css('top', '-100%');
    var tmp = JSON.parse(d);
    if (tmp.success == 1 || tmp.success == -2) {
      $('#sts-msg').showStatus(tmp.msg, 'scs');
      setTimeout(function () {
        window.location = url;
      }, 2000);
    }
    else {
      $('#sts-msg').showStatus(tmp.msg, 'err');
    }
  }

  function dspStatus(d, u, t) {
    var type = '';
    if (u == 'A')
    {
      type = 'Story';
      url = '/moderator/articles';
    }
    else if (u == 'E')
    {
      type = 'Event';
      url = '/moderator/events';
    }
    else
    {
      type = 'Petition';
      url = '/moderator/petitions';
    }
    if (d == 1) {
      if (t == 's') {
        $('#sts-msg').showStatus('Suggestions sent successfully!! Please wait while we redirect you to moderation page...', 'scs');
      }
      else if (t == 'd') {
        $('#sts-msg').showStatus('Story has been successfully removed from moderation.Please wait while we redirect you to moderation page...', 'scs');
      }
      else {
        $('#sts-msg').showStatus(type + ' rejected successfully!! Please wait while we redirect you to moderation page...', 'scs');
      }
      setTimeout(function () {
        window.location = url;
      }, 3000);
    }
    else if (d == -1) {
      $('#sts-msg').showStatus('Something went wrong. Please try again!!', 'scs');
    }
    else {
      $('#sts-msg').showStatus('You\'re trying to moderate an invalid ' + u + '. Please wait while we redirect you to moderation page...', 'scs');
      setTimeout(function () {
        window.location = url;
      }, 1500);
    }
  }

// Functions to assign article to another moderator
  $('#chng-asgn').on('click', function () {
    var asgn = $('#assigned').attr("prvmod");
    if (!asgn || asgn == $('.usrname').text())
    {
      $(this).addClass('hideElement').siblings('a').removeClass('hideElement');
      $(this).parents('.well').find('#assigned').removeClass('no-brdr').removeAttr('disabled').val('').focus();
    }
    else
    {
      alert("Article Assigned to  " + asgn + ", you can not assign");
    }
  });
  $('#cnl-asgn').on('click', function () {
    closeAssgn();
  });
  $('#assigned').on('keydown', function () {
    var $this = $(this);
    $this.getUsrSgstns(1);
  });
  $('#sve-asgn').on('click', function () {
    if ($('#assigned').val() == '')
    {
      $('#sts-msg').showStatus('No moderator selected', 'err');
      return false;
    }
    else if (url[4] == 'article')
    {
      $.post('/ajax/assgnmdrtr', {
        'tid': adt.tid,
        'tp': 'A',
        'mdrtr': $('#assigned').attr('unme')
      },
      function (d) {
        if (d == '')
          $('#assigned').attr({
            'disabled': 'disabled',
            'prvMod': $('#assigned').val()
          }).addClass('no-brdr');
        else
        {
          d = d.split(':');
          $('#sts-msg').showStatus(d[1], 'err');
          return false;
        }
      });
    }
    else if (url[4] == 'event')
    {
      $.post('/ajax/assgnmdrtr', {
        'tid': adt.tid,
        'tp': 'E',
        'mdrtr': $('#assigned').attr('unme')
      },
      function (d) {
        if (d == '')
          $('#assigned').attr({
            'disabled': 'disabled',
            'prvMod': $('#assigned').val()
          }).addClass('no-brdr');
        else
        {
          d = d.split(':');
          $('#sts-msg').showStatus(d[1], 'err');
          return false;
        }
      });
    }
    else
    {
      $.post('/ajax/assgnmdrtr', {
        'tid': adt.tid,
        'tp': 'P',
        'mdrtr': $('#assigned').attr('unme')
      },
      function (d) {
        if (d == '')
          $('#assigned').attr({
            'disabled': 'disabled',
            'prvMod': $('#assigned').val()
          }).addClass('no-brdr');
        else
        {
          d = d.split(':');
          $('#sts-msg').showStatus(d[1], 'err');
          return false;
        }
      });
    }

  });
  function closeAssgn()
  {
    $('#sve-asgn,#cnl-asgn').addClass('hideElement');
    $('#chng-asgn').removeClass('hideElement');
    var elem = $('#assigned');
    elem.addClass('no-brdr').attr('disabled', 'disabled').val(elem.attr('prvMod'));
  }

  $("#pop-prw").on('click', '#snd-nte', function () {
    var nte = $(this).parents('#pop-prw').find('.txtarea, textarea');
    if (nte.val() == '')
    {
      $(this).siblings(".err-msg").text('You cannot send empty note.');
      return false;
      nte.addClass('error');
    }
    else
    {
      $(this).attr('disabled', 'disabled');
      nte.removeClass('error');
      if ($("#article").length) {
        var tp = 'A';
        var id = $("#article").data("desc").id;
      }
      else if ($("#event").length) {
        var tp = 'E';
        var id = $("#event").data("desc").id;
      }
      else if ($("#petition").length) {
        var tp = 'P';
        var id = $("#petition").data("desc").id;
      }
      $.ajax('/ajax/nte', {
        data: {
          'msg': nte.val(),
          'id': id,
          'tp': tp
        },
        type: 'POST',
        success: function (d) {
          d = JSON.parse(d);
          $('#pop-prw').removeClass('view');
          if (d.success)
            $('#sts-msg').showStatus(d.msg, 'scs');
          else
            $('#sts-msg').showStatus(d.msg, 'scs');
        }
      });
    }
  });

});