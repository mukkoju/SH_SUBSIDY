$(document).ready(function () {
  var el = null;
  var api = $('body').data('api');
  var info = $('#admin, #cvr-img').data('info');
//  $('#cvr-img').css('height', ($(document).height() - 48) + 'px');
//  $('#news-bar, #live-blog').css('min-height', ($(window).height() - 48) + 'px');

  /* auto focusing on custom url in admin page */
  if ($("#cstm-url").length)
    $("#cstm-url").focus();

  /* Load tiles into space */
  if (!$('#admin').length)
  {
    $('#news-bar').loadNews({
      "spcId": info.id,
      "isSpc": ($('body').data('bunme') == info.ownr ? 2 : 1),
      "usr": info.crnt_usr,
      "tp" : "all"
    });
  }
  
  /* on click event for wishberry static tile in repeal section 377*/
  $(document).on("click","#wb2b8bdbf4920d4569fb3935628a4bdd3 .auth-bx", function(e){
     e.preventDefault();
     var x = window.open("https://www.wishberry.in/", '_blank');
     x.focus();
  });
  
  /* add news on scroll */
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if ($(document).height() <= ($(window).height() + scroll * 1.5) && $('#news-bar').length)
    {
      $('#news-bar').addNews({
        "spcId": info.id,
        "isSpc": ($('body').data('bunme') == info.ownr ? 2 : 1),
        "usr": info.crnt_usr
      });
    }
  });

  /* Follow/Unfollow a space */
  $('#flw-spc:not(.lgn-btn)').on('click', function () {
    var $this = $(this);
    $this.attr('disabled', 'disabled');
    var info = $('#cvr-img').data('info');
    $.ajax({
      url: api + '/sf',
      async: true,
      data: {
        "usr": $this.getLoggedInUsr(),
        "auth": $this.getShIntr(),
        "id": info['id']
      },
      type: 'post',
      success: function (d) {
        d = JSON.parse(d);
        if (d.success == 1)
        {
          if ($this.hasClass('flwing')){
            $this.html('<i class="icon-plus-circle"></i> Follow');
            $this.removeClass("flwing"); 
          }
          else{
            $this.html('<i class="icon-ok-circle"></i> Following');
            $this.addClass("flwing"); 
         }
        }
      },
      complete: function () {
        $this.removeAttr('disabled');
      }
    });
  });
  /* Customized url */
  $('#cstm-url-sve').click(function () {
    var url = $("#cstm-url").text();
    url = (url[url.length - 1] == "-") ? url.substr(0, url.length - 1) : url;
    $("#cstm-url").text(url);
    if (url == '')
      return false;
    else
    {
      $.ajax({
        url: 'URL_HERE',
        type: 'post',
        data: {
          'url': url
        },
        success: function (d) {
          d = JSON.parse(d);
          if (d.success == 0)
            $('#sts-msg').showStatus(d['msg'], 'err');
          else
            $('#sts-msg').showStatus(d['msg'], 'scs');
        }
      });
    }
    return false;
  });

//  on change customized url
  $("#cstm-url").on("keypress", function (e) {
    var code = e.which;
    var txt = $(this).text();
    var prv = txt.charAt(txt.length - 1);
    var spl_keys = [45, 13, 27, 32];

    if (!((code >= 65 && code <= 90) || (code >= 97 && code <= 122) || (code >= 48 && code <= 57) || (spl_keys.indexOf(code) >= 0)))
      e.preventDefault();
    else if (code == 32 || code == 45) {
      if (txt.length >= 1 && prv != "-")
        $(this).html(txt + "-");
      e.preventDefault();
    }
    focusAtEnd("cstm-url");
  });

  function focusAtEnd(element) {
    var doc = document
            , text = doc.getElementById(element)
            , range, selection
            ;
    if (doc.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
    } else if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(text);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  /* status of space */
  $("#spc-md-frm").on("submit", function (e) {
    e.preventDefault();
    var $this = $(this);
    $.ajax({
      url: api + "/stv",
      type: 'post',
      data: {
        "sid": info.id,
        "val": $('input[name=spc-md]:checked', '#spc-md-frm').val(),
        'auth': $().getShIntr(),
        'usr': $().getLoggedInUsr()
      },
      success: function (res) {
        var t = JSON.parse(res);
        if (t.success)
          $('#sts-msg').showStatus(t.msg, 'scs');
        else
          $('#sts-msg').showStatus(t.msg, 'err');
      }
    });
  });

  /* Drop a new note */
  $('#news-bar').on('click', '.cntrbt .opn-lv-blg', function () {
    $('html, body').animate({scrollTop: $('.wrapper').offset().top - 20}, 600, 'easeInOutCubic');
    $('#news-bar').addClass('hideElement').siblings('#live-blog').removeClass('hideElement');
  });

  /* Invite your friends */
  $('#spc-inv').on('click', function () {
    $.post(api + '/gtf', {"id": "spc-inv"}, function (d) {
      d = JSON.parse(d);
      $('#pop-prw > section').html(d['frm']).showPopup(1);
    });
  });

  $('#pop-prw').on('submit', '#spc-inv-frm', function (e) {
    e.preventDefault();
    var frm = $(this);
    if (frm.find('.input-xxlarge').val() == '')
    {
      return false;
    }
    else
    {
      var data = {};
      data['auth'] = frm.getShIntr();
      data['usr'] = frm.getLoggedInUsr();
      data['id'] = info.id;
      if (frm.find('.input-xxlarge').data('unme'))
        data['iusr'] = frm.find('.input-xxlarge').data('unme');
      else
        data['iusr'] = frm.find('.input-xxlarge').val();

      $.ajax({
        url: api + '/si',
        data: data,
        type: 'post',
        success: function (d) {
          d = JSON.parse(d);
          if (d.success == 1)
          {
            d = d['msg'];
            if (d['Failure'])
            {
              d = d['Failure'][0];
              $('#sts-msg').showStatus(d['rsn'].slice(0, -1) + ' to "' + d['id'] + '"', 'err');
            }
            else
              $('#sts-msg').showStatus('An email has been sent inviting your friends to join your space.', 'scs');
          }
          else
            $('#sts-msg').showStatus(d['msg'], 'err');
        }
      });
    }
    return false;
  });
  $('#pop-prw').on('click', '.fb-share', function () {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent($('meta[property="og:url"]').attr('content')) + '&display=popup&ref=plugin', '', 'toolbar=0,status=0,width=548,height=325');
  });

  $('#pop-prw').on('click', '.tw-tweet', function () {
    window.open('https://twitter.com/intent/tweet?original_referer=' + encodeURIComponent($('meta[property="og:url"]').attr('content')) + '&text=' + encodeURIComponent($('meta[name="twitter:title"]').attr('content')) + '&tw_p=tweetbutton&url=' + encodeURIComponent($('meta[property="og:url"]').attr('content')) + '&via=SaddaHaqMedia', '', 'toolbar=0,status=0,width=548,height=325');
  });

  $('#pop-prw').on('click', '.gp-share', function () {
    window.open('https://plus.google.com/share?url=' + encodeURIComponent($('meta[property="og:url"]').attr('content')), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
  });

  if ($('.scl-shr').length)
  {
    $.ajax('https://graph.facebook.com', {
      data: {'id': document.URL},
      type: 'GET',
      success: function (d) {
        $('.scl-shr').find('.fb-share span:not(.hidden-phone)').text(d.shares);
      }
    });

  }
  if ($('#auth-prf #twt-flw').length)
  {
    $.ajax('/ajax/gttwtfd', {
      data: {'scr_nm': 'SaddahaqMedia', 'url': document.URL.toString()},
      async: 'false',
      type: 'POST',
      success: function (d) {
        d = JSON.parse(d);
        if (d['flw'][0]['following'])
          $('#auth-prf #twt-flw').html('<i class="icon-twitter"></i> Following on Twitter');
        $('.scl-shr').find('.tw-tweet span:not(.hidden-phone)').text(d['url']['count']);
      }
    });
  }

  /* Moderator section */
  $('#mod-nme').on('keydown', function () {
    $(this).getUsrSgstns();
  });

  $('#add-mod').on('submit', function () {
    var $this = $(this).find('#mod-nme');
    if ($this.val() == '')
      $this.siblings('.err-msg').text("Enter name of a saddahaq user or email id to invite a guest");
    else
    {
      var isEml = (/^[a-z0-9_\+-]+(\.[a-z0-9_\+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,4})$/).test($this.val());
      if ($this.attr('unme') == undefined && !isEml)
        $this.siblings('.err-msg').text("Looks like '" + $this.val() + "' is a invalid email.");
      else
      {
        $.ajax({
          url: api + '/asm',
          data: {
            "id": info.id,
            "usr2": ($this.attr('unme') != undefined ? $this.attr('unme') : $this.val()),
            'auth': $this.getShIntr(),
            'usr': $this.getLoggedInUsr()
          },
          type: 'post',
          success: function (d) {
            d = JSON.parse(d);
            if (d.success == 1)
            {
              if ($this.attr('unme') != undefined)
              {
                var trgt = $this.parents('form').siblings('.mod-lst').find('li:first');
                var copy = trgt.clone();
                var img = new Image();
                img.src = '/public/Multimedia/P_Pic_' + $this.attr('unme');
                img.onload = function () {
                  copy.find('.usr-img').html('<img src="' + img.src + '" />');
                };
                img.onerror = function () {
                  copy.find('.usr-img').html('<i class="icon-profile"></i>');
                };
                copy.find('.rmv-mod').removeClass('hideElement').data('unme', $this.attr('unme'));
                copy.find('.usr-info a').attr('href', '/' + $this.attr('unme')).text($this.val());
                copy.find('.usr-info p').text('Moderator');
                trgt.after(copy);
              }
              else
                $('#sts-msg').showStatus('An email has been sent successfully inviting the user to join as moderator.', 'scs');
            }
            else
              $('#sts-msg').showStatus(d.msg, 'err');
            return false;
          }
        });
      }
    }
    return false;
  });
  $('#admin').on('click', '.rmv-mod', function () {
    el = $(this);
    $('#con-del .modal-body p').html('Are you sure you want to delete ' + $.trim(el.siblings('.user-small').text()) + ' from moderator\'s list? <br><br>Click "yes" to confirm or "no" to go back.');
  });
  /* Suspend space */
  $('#admin').on('click', '#spnd-spc', function () {
    el = $(this);
    $('#con-del .modal-body p').html('Are you sure you want to suspend this space? <br><br>Click "yes" to confirm or "no" to go back.');
  });
  $('#del-spc').on('submit', function () {
    var $this = $(this);
    $.ajax({
      url: api + '/ds',
      data: {
        "id": info.id,
        "rsn": ($this.find('textarea').val() != '' ? $this.find('textarea').val() : ''),
        'auth': $this.getShIntr(),
        'usr': $this.getLoggedInUsr()
      },
      type: 'post',
      success: function (d) {
        d = JSON.parse(d);
        if (d.success == 1) {
          window.location = '/';
          $('#sts-msg').showStatus(d.msg, 'scs');
        }
        else
          $('#sts-msg').showStatus(d.msg, 'err');
      }
    });
    return false;
  });

  /* Manage data */
  $('#lft-mnu').find('.m > a, .stngs').on('click', function () {
    var $this = $(this);
    var trgt = $('#' + $(this).data('trgt'));
    trgt.removeClass('hideElement').siblings('.admn-elm').addClass('hideElement');
    if (!$this.hasClass('stngs') && !trgt.find('.nws-tl').length)
    {
      trgt.loadNews({
        "spcId": info.id,
        "isSpc": 3,
        "tp": ($this.data('trgt') == 'sgst-nws' ? 'SS' : 'SP'),
        "usr": $this.getLoggedInUsr()
      });
    }
  });

  /* Link/unlink stories from space */
  $('#admin').on('click', '.tag-spc', function () {
    var $this = $(this);
    $.ajax({
      url: 'URL_HERE',
      data: {
        "usr": $this.getLoggedInUsr(),
        "auth": $this.getShIntr(),
        "id": $this.parents('.nws-tl').attr('id')
      },
      type: 'post',
      success: function (d) {
        d = JSON.parse(d);
        $('#sts-msg').showStatus(d['msg'], (d == 1 ? 1 : 0));
      }
    });
  });
  /* Link story via url */
  $('#lft-mnu').on('click', '#lnk-url', function () {
    $.post(api + "/gtf", {
      "id": "n-l-b"
    }, function (d) {
      d = JSON.parse(d);
      $('#pop-prw > section').html(d['frm']).showPopup(1);
    });
  });
  $('#pop-prw').on('submit', '#ftch-url', function () {
    var $this = $(this);
    var url = $this.find('.input-xxlarge');
    if (url.val() == '')
    {
      url.siblings('.err-msg').text('Add url of a story from saddahaq.com and try again.', 'err');
      return false;
    }
    else if (!(/(http|https):\/\/((.*?)\.)?(saddahaq\.com(.*?))/).test(url.val()))
    {
      url.val('').siblings('.err-msg').text('Looks like the url you included does not belong to saddahaq.com', 'err');
      return false;
    }
    else
    {
      $this.siblings('.ftch-cnfrm').removeClass('hideElement');
      $.ajax({
        url: api + '/gpcbd',
        data: {
          "url": url.val(),
          "vldt": 1,
          "sid": info.id
        },
        type: 'post',
        success: function (d) {
          d = JSON.parse(d);
          if (d.success == 1)
          {
            d = d['msg'];
            var prw = $this.siblings('.prw');
            var smry = $this.buildTxt(d['smry'], 0).split(':::');
            prw.attr('id', d['id']).data('tp', d['tp'])
                    .find('.m-hd').html($this.buildTxt(d['ttl'], 1)).siblings('.smry').text(smry.length > 1 ? smry[1] : smry);
            if(d.tp == 'D')
              prw.find('.img-bx').css('background-image', 'url("/public/images/debate5.jpg")');
            else if(d.tp == 'T')
              prw.find('.img-bx').css('background-image', 'url("/public/Multimedia/P_Pic_' + d['img'] + '")');              
            else
              prw.find('.img-bx').css('background-image', 'url("/public/Multimedia/' + d['img'] + '")');
            $this.siblings('.ftch-cnfrm').children().toggleClass('hideElement');
            prw.removeClass('hideElement');
          }
          else
            $('#sts-msg').showStatus(d['msg'], 0);
        }
      });
    }
    return false;
  });
  /* Confirm that fetched data belongs to same url added */
  $('#pop-prw').on('click', '.ftch-cnfrm .btn-success', function () {
    var par = $(this).parents('.ftch-cnfrm');
    var $this = $(this);
    par.find('.btn').attr('disabled', 'disabled');
    $.ajax({
      url: api + '/st',
      data: {
        "url": par.siblings('form').find('.input-xxlarge').val(),
        "sid": info.id,
        "id": par.siblings('.prw').attr('id'),
        "tp": par.siblings('.prw').data('tp'),
        "usr": $this.getLoggedInUsr(),
        "auth": $this.getShIntr()
      },
      type: 'post',
      success: function (d) {
        d = JSON.parse(d);
        $('#sts-msg').showStatus(d.msg, d.success == 1 ? 'scs' : 'err');
        if(d.success == 1){
          setTimeout(function(){location.reload();}, 2500);
        }
      }
    });
  });
  /* Resetting everything when obtained content doesn't belong to copied url */
  $('#pop-prw').on('click', '.ftch-cnfrm .btn-danger', function () {
    $(this).parents('.ftch-cnfrm').addClass('hideElement').children().toggleClass('hideElement');
    var frm = $(this).parents('.ftch-cnfrm').siblings('form');
    frm.siblings('.prw').addClass('hideElement');
    frm.resetForm();
    frm.find('.input-xxlarge').focus();
  });

  $('#news-bar, #admin').on('click', '.unlnk-spc', function () {
    el = $(this);
    $('#con-del .modal-body p').html('Are you sure you want to remove this story from your space? <br><br>Click "yes" to confirm or "no" to go back.');
  });

  $('#con-del #yes').on('click', function () {
    var $this = $(this);
    $('#con-del').modal('hide');
    if (el.hasClass('rmv-mod'))
    {
      $.ajax({
        url: api + '/dsm',
        type: 'post',
        data: {
          "id": info.id,
          "usr2": el.data('unme'),
          'auth': $this.getShIntr(),
          'usr': $this.getLoggedInUsr()
        },
        success: function (d) {
          d = JSON.parse(d);
          if (d.success == 1)
          {
            $('#sts-msg').showStatus(d.msg, 'scs');
            el.parents('li').remove();
          }
          else
            $('#sts-msg').showStatus(d.msg, 'err');
        }
      });
    }
    else if (el.hasClass('unlnk-spc'))
    {
      $.ajax({
        url: api + '/st',
        type: 'post',
        data: {
          "id": el.parents('.nws-tl').attr('id'),
          "tp": el.parents('.nws-tl').data('tp'),
          "sid": info.id,
          "usr": $this.getLoggedInUsr(),
          "auth": $this.getShIntr()
        },
        success: function (d) {
          d = JSON.parse(d);
          if (d.success == 1)
            $('#sts-msg').showStatus(d.msg, 'scs');
          else
            $('#sts-msg').showStatus(d.msg, 'err');
        }
      });
    }
    else
      $('#del-spc').trigger('submit');
    return false;
  });
  /* Pin stories to space */
  $('#news-bar').on('click', '.spc-pin, .stry-pin', function () {
    var $this = $(this);
    $.post(api + '/sp', {
      "id": $this.parents('.nws-tl').attr('id'),
      "tp": $this.parents('.nws-tl').data('tp'),
      "sid": info.id,
      "usr": $this.getLoggedInUsr(),
      "auth": $this.getShIntr()
    }, function (d) {
      d = JSON.parse(d);
      if(d.success == 0)
        $('#sts-msg').showStatus('Ooops!! Something went wrong and we are looking into it. Please try again.','err');
      else{
        if($this.hasClass('active'))
          $this.removeClass('active').removeClass('mrkd');
        else
          $this.addClass('active').addClass('mrkd');
      }
    });
    return false;
  });
  /* Edit space */
  $('#spc-edt').on('click', function () {
    var cvr = $('#cvr-img');
    var tag = document.createElement('script');
    if ($('#user-nav').data('isLive'))
      tag.src = 'https://saddahaq.blob.core.windows.net/' + $('body').data('vrsn') + '/gsjadd.js';
    else
      tag.src = '/public/global/space/js/add.js?v=' + Math.floor((Math.random() * 100) + 1);
    tag.async = true;
    document.getElementsByTagName('body')[0].appendChild(tag);
    cvr.find('#flw-bx, .scl-shr').addClass('hideElement')
      .siblings('.chk-lmt').attr('contenteditable', 'true');
    cvr.find('.cvr-stngs').addClass('in');
    $("#spc-crt").removeClass('hideElement');
    $("#spc-logo, #spc-logo form").removeClass('hideElement');
    $('.stt').trigger('click');
  });

  $('#cncl-spc').on('click', function () {
    var cvr = $('#cvr-img');
    cvr.find('#flw-bx, .scl-shr').removeClass('hideElement')
      .siblings('.chk-lmt').removeAttr('contenteditable');  
    cvr.find('.cvr-stngs').removeClass('in');
    $("#spc-crt").addClass('hideElement');
    $("#spc-logo, #spc-logo form").addClass('hideElement');
  });

  /* End */
  /* Setting space type */
  $('.spc-stng .btn-grp .btn').on('click', function(){
    $(this).parents('.spc-stng').find('.hlp-msg').text($(this).data('help'));
  });
  
  $('.srch-usr').on('keydown',function(){
    $(this).getUsrSgstns();
    if(!$(this).siblings('.stng-opt').hasClass('hideElement'))
      $(this).siblings('.stng-opt').addClass('hideElement');
  });
  
  $('.srch-usr').on('focus', function(){
    if($(this).data('unme'))
      $(this).siblings('.stng-opt').removeClass('hideElement');
    else
      $(this).siblings('.stng-opt').addClass('hideElement');
  });
  /* End settings */
  
  $('.scl-shr').on('click', '.tw-tweet', function () {
    window.open('https://twitter.com/intent/tweet?original_referer=' + encodeURIComponent($('meta[property="og:url"]').attr('content')) + '&text=' + encodeURIComponent($('meta[name="twitter:title"]').attr('content')) + '&tw_p=tweetbutton&url=' + encodeURIComponent($('meta[property="og:url"]').attr('content')) + '&via=SaddaHaqMedia', '', 'toolbar=0,status=0,width=548,height=325');
  });

  $('.scl-shr').on('click', '.gp-share', function () {
    window.open('https://plus.google.com/share?url=' + encodeURIComponent($('meta[property="og:url"]').attr('content')), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
  });

  /* Testing if scroll animation can be achieved */
  var atTop = 1, prvScrl = null;
  $(window).scroll(function(e){
    var scrlTp = $(window).scrollTop();
    if(atTop && !prvScrl)
    {
      $('#cvr-img').addClass('mvup');
      atTop = false;
    }
    else if(scrlTp == 0)
    {
      $('#cvr-img').removeClass('mvup');
      atTop = 1;
    }
    else
      console.log("Continue page scroll");
    prvScrl = scrlTp;
  });

    /* Settings page ajax call on tab/select change  */
    $(".spc-tab-stng").click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var dt = $this.parent().data('stngs');
        var data = {
            auth: $this.getShIntr(),
            sid: $("#admin").data('info').id,
            usr: $this.getLoggedInUsr(),
            usr2: dt.unme ? dt.unme : 0,
            val: $this.data('val') ? $this.data('val') : $this.val()
        };
        if (dt.actn == "SpaceModerator" || dt.actn == "SpaceFollower") {
            data.val = 1;
            data.role = $this.data('val') ? $this.data('val') : $this.val();
        }

        $.ajax({
            url: api + '/' + dt.actn,
            type: 'post',
            data: data,
            success: function (res) {
                res = JSON.parse(res);
                $('#sts-msg').showStatus(res['msg'], (res.success) ? 'scs' : 'err');
            }
        });
    });

    /*Ajax call for adding / removing users in settings page*/
    $("#admin").on("click", ".spc-usr-stng", function (e) {
        e.preventDefault();
        var $this = $(this);
        $this.removeClass("active");
        var role = $this.parents('.btn-grp').siblings('.btn-grp');
        var dt = role.data('stngs');
        var usr = $this.parents(".srch-usr-bx").find("input");
        if ($this.data('val') && (role.find(".active").length == 0)) {
            $("#sts-msg").showStatus("Select a role for the user before adding him/her.", "err");
            return false;
        }
        $.ajax({
            url: "/" + dt.actn,
            type: 'post',
            data: {
                auth: $this.getShIntr(),
                sid: $("#admin").data('info').id,
                usr: $this.getLoggedInUsr(),
                val: $this.data('val'),
                usr2: usr.length ? usr.data('unme') : dt.unme,
                role: role.find(".active").data('val')
            },
            success: function (res) {
                res = JSON.parse(res);
                if (res.success) {
                    if ($this.data('val')) {
                        $this.parents(".stng-opt").addClass("hideElement");
                        role.find("a").addClass(".spc-tab-stng");
                        var str = '<hr>' +
                          '<div class="spc-stng">' +
                          '<div class="stng-dsc">' +
                          '<a href="#" class="usr-img"><img src="/public/Multimedia/P_Pic_' + usr.data('unme') + '" /></a>' +
                          '<div class="usr-dsc">' +
                          '<h2 class="dft-ttl">' + usr.val() + '</h2>' +
                          '<p class="hlp-msg"><i class="icon-time"></i> Added few secs ago</p>' +
                          '</div>' +
                          '</div>' +
                          '<div class="stng-opt">' +
                          role[0].outerHTML +
                          '<div class="btn-grp">' +
                          '<a href="#" class="btn spc-usr-stng" data-val="0"><i class="icon-remove"></i></a>' +
                          '</div>' +
                          '</div>' +
                          '<div class="clearfix"></div>' +
                          '</div>';
                        $this.parents(".srch-usr-bx").after(str);
                        usr.val('');
                        usr.removeData("unme");
                    }
                    else {
                        $this.parents(".spc-stng").prev().remove();
                        $this.parents(".spc-stng").remove();
                    }
                }
                else {
                    $('#sts-msg').showStatus(res['msg'], 'err');
                }
            }
        });
    });
});