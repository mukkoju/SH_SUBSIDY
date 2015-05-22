$(document).ready(function () {
  //invLoaded is to mark that invite.js is loaded successfully
  var invLoaded = 0;
  //API url
  var api = $('body').data('api');
  // Adjust height of left menu 
  $('#lft-mnu, #lft-mnu-bx').css('height', ($(window).height() - 48) + 'px');
  /*
   * This is to avoid hashes from appearing in urls whenever a url has a href as #
   */

  /* Shows login popup for non logged in user(when user redirected from mail) */
  var path = location.pathname.split("/");
  if (path.length > 1 && path[1] == "mailer")
    $().chkVrfd();

  $(document).on('click', 'a', function (e) {
    if ($(this).attr('href') == '#')
      e.preventDefault();
  });
  if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement("style");
    msViewportStyle.appendChild(
            document.createTextNode(
                    "@-ms-viewport{width:auto!important}"
                    )
            );
    document.getElementsByTagName("head")[0].
            appendChild(msViewportStyle);
  }

  $('#navigation-bar #c-b').addClass('in');
  $('#c-b select').on('change', function () {
    if ($(this).val())
      window.location = '/' + $(this).val();
  });
//  /* Personalization popup code */
//  if (($('#user-nav .usrname').data('prz') && window.location == $("body").data("rd") + "/") || $('#user-nav .usrname').data('prz') && $('#user-nav').chkVrfd())
//  {
//    $.ajax({
//      url: api + '/gtf',
//      type: 'post',
//      data: {
//        'id': 'pref'
//      },
//      success: function (data) {
//        data = JSON.parse(data);
//        $('#pop-prw > section').html(data['frm']).showPopup(1);
//      }
//    });
//    $('#pop-prw').on('click', '.clps-ul li', function (e) {
//      if (!($(e.target).hasClass('.sub-clps-ul') || $(e.target).parents('.sub-clps-ul').length))
//      {
//        var $this = $(this);
//        $this.siblings('li.open').removeClass('open')
//                .find('.ct-nm i').toggleClass('icon-chevron-down icon-chevron-up');
//        $this.toggleClass('open');
//        $this.find('.ct-nm i').toggleClass('icon-chevron-down icon-chevron-up');
//      }
//    });
//    $('#pop-prw, .wrapper').on('click', '.scts li, .sub-clps-ul li', function () {
//      var $this = $(this);
//      var arr = [];
//      var trgt = $this.parents('.scts').parent();
//      if ($this.hasClass('slctd'))
//      {
//        arr = trgt.data('slctd');
//        arr.splice($.trim($this.find('.sct-nm').text().replace(/ /g, '_')), 1);
//        trgt.data('slctd', arr);
//      }
//      else
//      {
//        if (trgt.data('slctd'))
//          arr = trgt.data('slctd');
//        arr.push($.trim($this.find('.sct-nm').text()).replace(/ /g, '_'));
//        trgt.data('slctd', arr);
//      }
//      $this.toggleClass('slctd');
//      $this.find('.presentation i').toggleClass('icon-plus-strong icon-ok-circle');
//      var slctd = $this.parent().find('.slctd').length;
//      if (slctd)
//      {
//        $this.parents('.scts').siblings('.ct-nm').find('i').addClass('hideElement')
//                .siblings('.badge').removeClass('hideElement').data('num', slctd).text(slctd);
//      }
//      else
//      {
//        $this.parents('.scts').siblings('.ct-nm').find('i').removeClass('hideElement')
//                .siblings('.badge').addClass('hideElement');
//      }
//    });
//    $('#pop-prw').on('click', '#sv-prsn', function () {
//      var json = [];
//      $(this).siblings('.prsn-ctgy').find('ul.ctgy > li').each(function () {
//        if ($(this).data('slctd'))
//          json.push({
//            "ct": $.trim($(this).find('.ct-nm > .nm').text()),
//            "sct": $(this).data('slctd')
//          });
//      });
//      if (json.length)
//      {
//        $.post('/ajax/prz', {
//          "slctd": json
//        }, function (d) {
//          if (d == 1)
//          {
//            $('#pop-prw').removeClass('view');
//            $('#sts-msg').showStatus('Your preferences have been saved successfully.', 'scs');
//          }
//          else
//            $('#pop-prw').find('.err-msg').text('Error processing the request. Please try again!');
//        });
//      }
//      else
//        $('#pop-prw').find('.err-msg').text("Please choose some topics you like to follow");
//    });
//    $('#pop-prw').on('click', '#skip-prsn', function () {
//      $('#pop-prw').removeClass('in');
//      $.post('/ajax/prz', {
//        "askltr": 1
//      }, function () {
//        $('#sts-msg').showStatus('To add personalisation settings in future, go to settings page', 'scs', function () {
//          closePopPrw();
//        });
//      });
//    });
//  }
  /* Intialize tooltips */
  $('#left-bar .lc').tooltip();
  /* Checking if user verified his account before writing anything */
  $('#util ul').on('click', 'a', function (e) {
    if (!$(this).chkVrfd())
      return false;
  });
  $('.sts-bx').height($(document).height());
  //                $('#aux-content-box .task').on('click',function(e){
  //                        $('#left-bar').find('.jspPane').css('left','0px');
  //                });
  /*
   * Add margin to divs inside main-content-box to increase readability
   */
  var backBtn = $('#aux-content-box').find('#back');
  backBtn.siblings('div:first').css('margin-top', backBtn.outerHeight(true) + 16);

  /* Scrolling page back to top on clicking "scroll to top" button */
  $(document).on('click', '.stt', function (e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: 0
    }, 600, 'easeInOutCubic', function () {
      $('#goTop').fadeOut(500);
    });
    return false;
  });
  /*appending unfold list to left and right bar content */
  $('.happening p').not($('.response p,.voted p,.posted p')).append("<ul class='unfold'><li class='unfold-ul'><i class='icon-arrow-down'></i>unfold</li></ul><div class='clearfix'></div>");

  $(document).on('hover', '.yes,.no', function (e) {
    $(this).formatButton({
      'btn': $(this),
      'event': e
    });
  });

  /* Focusing into quick post input field on clicking react button */
  $('.react, .rt').on('click', function (e) {
    e.preventDefault();
    var $this = $(this), responseHolder = $this.parents('li.list').find('.response');
    if (!responseHolder.hasClass('unfolded') && responseHolder.chkVrfd())
    {
      responseHolder.slideDown(400, function () {
        responseHolder.addClass('unfolded');
        if (responseHolder.parents('ul').hasClass('comments'))
        {
          responseHolder.find('.rxn-box .add-rxn').animate({
            //   height: 56
          }, 'slow', 'easeOutExpo', function () {
            $(this).focus().removeClass('emty');
          });
        }
        else
        {
          responseHolder.find('.rxn textarea').animate({
            height: 90
          }, 'slow', 'easeOutExpo', function () {
            $(this).focus();
          });
        }
        $this.html('<i class="icon-remove-circle"></i> Cancel');
      });
    }
    else
    {
      responseHolder.slideUp(100, function () {
        responseHolder.removeClass('unfolded').find('.rxn-box .add-rxn').text('').addClass('emty');
        $this.html('<i class="icon-reply"></i> Reply');
      });
    }
  });
  /*Expand textbox on click*/
  $('.quickpost,.add-comment, #notification-msg, .reaction, .add-rxn').on('click', function (e) {
    var $this = $(this);
    if ($this.hasClass('emty'))
      $this.removeClass('emty');
    if (($this.hasClass('add-comment') || $this.hasClass('add-rxn')) && !($this.hasClass('expanded')))
    {
      $this.addClass('expanded'); //.css('height', '64px')
      $this.siblings('.btn').addClass('in');
    }
    else if (!(($this.hasClass('add-comment')) && $this.hasClass('expanded')))
      $this.css('height', '90px').addClass('expanded');
  });

  $('.edt_qp, .edt_cmt').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    if (!$this.hasClass('expanded'))
    {
      if ($this.hasClass('edt_qp'))
        $this.addClass('expanded').parent().animate({
          'height': 90
        }, 'slow', 'easeOutExpo');
      else
        $this.addClass('expanded').parent().animate({
          // 'height': 56
        }, 'slow', 'easeOutExpo').addClass('expanded');
    }
  });

  $('.edt_qp').on('blur', function () {
    var $this = $(this);
    if ($this.hasClass('expanded'))
      $this.removeClass('expanded').parent().animate({
        'height': 32
      }, 'slow', 'easeOutExpo');
  });
  /*
   * Quickpost vote up button
   */
  $('.qp_rating').on('click', function () {
    var $this = $(this);
    $.post('/ajax/rateqp', {
      'qpid': $(this).attr('qpostid')
    },
    function (d) {
      $this.parent().siblings(".number").text(d);
      return false;
    });
  });
  /* resize textbox on blur */
  $('.quickpost,.add-comment, #notification-msg, .reaction, .add-rxn, .edt_qp').on('blur', function (e) {
    var $this = $(this);
    if ($.trim($this.text()) == '')
    {
      $this.addClass('emty');
      if ($this.attr('id') == 'notification-msg')
        $this.css('height', '48px');
      else
      {
        $this.css('height', '32px');
        $this.siblings('.btn').removeClass('in');
      }
      $this.parents('li.list').animate({
        'margin': '0'
      }, 'slow', 'easeOutExpo');
      $this.removeClass('expanded');
    }
  });

  /* keyup event handler on quickpost and reaction and submitting it on pressing enter */
//  $('.quickpost, .reaction').on('keyup', function (e) {
//    quickpost = $(this);
//    var commentid = '';
//    var psttxt = $.trim(quickpost.html().replace(/(&nbsp;)+/g, "").replace(/\s+/g, ' '));
//    var user = $.trim($('#user-nav .usrname').text());
//    if ((e.which == 50))
//    {
//      if (quickpost.hasClass('ui-autocomplete-input'))
//        quickpost.autocomplete('destroy');
//      quickpost.getUsrSgstns();
//    }
//    else if (e.which == 51)
//    {
//      quickpost.getHstgSgstns();
//    }
//    else if (e.which == 13)
//    {
//      if (quickpost.hasClass('ui-autocomplete-input'))
//      {
//        quickpost.autocomplete('destroy');
//        return false;
//      }
//      else if (psttxt != '')
//      {
//        if (quickpost.parent().hasClass('context'))
//        {
//          var ctxt = psttxt.split(' ');
//          var tmp = ctxt.shift();
//          if (ctxt == '')
//          {
//            quickpost.html(tmp + '&nbsp;');
//            return false;
//          }
//        }
//        if (quickpost.hasClass('quickpost') && !(quickpost.hasClass('blgtxt')))
//        {
//          var refTags = quickpost.updateRefTag(quickpost);
//          $.post('/ajax/addqp', {
//            "text": quickpost.trimText(psttxt),
//            "ref": refTags.refd,
//            "tag": refTags.tagd
//          }, function (qpid) {
//            //$('.qptext').html(qpost);
//            commentid = qpid;
//            quickpost.blur();
//          });
//        }
//        else if (quickpost.hasClass('blgtxt'))
//        {
//          var pid = quickpost.attr("pid");
//          $.post('/ajax/lbaddpost', {
//            "text": txt,
//            "pid": pid
//          }, function (qpost) {
//            if (qpost)
//            {
//              quickpost.animate({
//                height: 32
//              }, 'slow', 'easeOutExpo');
//              quickpost.blur();
//            }
//          });
//        }
//        var tmp = psttxt.split(' ');
//        var tmpstr = '';
//        var isBlgtxt = quickpost.hasClass('blgtxt');
//        var isRxn = quickpost.hasClass('reaction');
//        for (var t = 0; t < tmp.length; t++)
//        {
//          if ((tmp[t]).search('@') != -1)
//            tmpstr += "<a class='u-tag' href='/" + (tmp[t].substr(1)) + "'>" + tmp[t] + "</a>" + " ";
//          else
//            tmpstr += tmp[t] + " ";
//        }
//        var qp = "<li class='list' qpid='" + commentid + "'><div class='";
//        if (isRxn)
//          qp += "span16";
//        else
//          qp += "happening posted";
//        qp += "'  style='left:0px'>" +
//                "<ul class='dropdown pst-stng'><a class='dropdown-toggle' data-toggle='dropdown' href='#'><i class='icon-pencil'></i></a>" +
//                "<ul class='dropdown-menu pull-right'>" +
//                "<li><a href='#' class='edit_qp' qpid='" + commentid + "' qpuser=''>Delete</a></li>" +
//                "<li><a href='#con-del' role='btn' data-toggle='modal' class='delete_quickpost'>Delete</a></li>" +
//                "</ul>" +
//                "</ul>" +
//                "<div class='span16'><span class='tmsp italicText";
//        if (isBlgtxt)
//          qp += "pull-right span2";
//        qp += "'>A few sec ago</span></div><div class='clearfix'></div><p class='span16'><span class='";
//        if (isBlgtxt)
//          qp += "thumb-holder span1";
//        else
//          qp += "thumb-holder span3";
//        qp += "'><span class='block'><a href='#' class='qpost_rating' qpostid='' qpnum='0'><i class='icon-chevron-sign-up'></i></a></span>" +
//                "<span class='block number'>0</span><span class='block txt'>votes</span>";
//        qp += "</span><span class='content ";
//        if (isBlgtxt)
//          qp += "span15 offset1";
//        else
//          qp += "span12";
//        qp += "'><a class='user-small' href='/" + user + "'>" + user + "</a><br/>" +
//                "<span class='italicText block'>posted</span>" +
//                "<span class='content'>" + $.trim(tmpstr) + "</span>" +
//                "</span></p><div class='clearfix'></div>";
//        if (isBlgtxt && !isRxn)
//        {
//          qp += "<div class='response span16'>" +
//                  "<div class='response-holder'><ul>" +
//                  "<li><textarea rows='1' class='reaction span14 offset1 blgtxt' placeholder='Reply to " + user + "\'s post'></textarea></li>" +
//                  "</ul></div></div><div class='clearfix'></div></li>";
//        }
//        qp += "</div>";
//        if (isRxn)
//          qp += "<div class='clearfix'></div>";
//        quickpost.parents('li:first').after(qp);
//        e.preventDefault();
//        quickpost.html('').blur();
//        quickpost.removeAttr('disabled');
//        $('.tab-pane .frame').sly('reload');
//      }
//      else
//        $(this).html('');
//    }
//  });
//
//  var is140q = false;
//  $('.quickpost').on('keydown', function (e) {
//    var allowdKeys = [8, 9, 35, 36, 37, 38, 39, 40, 46];
//    if (e.keyCode == 13 && !e.shiftKey)
//      e.preventDefault();
//    else
//    {
//      var $this = $(this);
//      var text = $this.text();
//      if (text.length > 140)
//      {
//        $this.siblings('.txt-lmt').html('0/140');
//        is140q = true;
//      }
//      else
//      {
//        $this.siblings('.txt-lmt').html((140 - text.length) + '/140');
//        is140q = false;
//      }
//      if (is140q && $.inArray(e.which, allowdKeys) == -1)
//      {
//        e.preventDefault();
//        return false;
//      }
//    }
//  });

  /*
   * Edit quickpost and comments
   */
  $('.edit_qp').on('click', function () {
    var $this = $(this);
    $this.parents('.list').find('.response').addClass('no-unfold');
    var org_txt = $this.parents('.comment,.happening').find('> p');
    org_txt.siblings('.cmt-bns, .unfold').slideUp(400);
    org_txt.slideUp(300, function () {
      org_txt.after($("<div>").attr({
        "class": "edt_qp_bx"
      }).append($("<div>").attr({
        "class": "edt_qp span16 " + $this.attr('tp'),
        "contenteditable": "true"
      })
              .html($.trim(org_txt.find('.cmt').html())).focus()).append('<div class="txt-lmt">' + (140 - org_txt.find('.cmt').text().length) +
              '/140</div><a href="#" class="edt_cls"><i class="icon-remove"></i></a>'));
    });
  });
  /*
   * Delete a quickpost, comment, event , article
   */
  var delpost = null;
  $(document).on('click', '.delete_quickpost, .delete_comment, .del_art, .lv-blg', function () {
    if ($(this).hasClass('del_art') && !$('#con-del .modal-body').find('textarea').length)
    {
      delpost = $(this).parents('#lft-mnu').parent().find('#article,#ptn,#event');
      if (delpost.attr("id") == "article")
        $('#con-del').find('.modal-body').find('p').text('Are you sure you want to delete this story? Add your reason and click "yes" to continue.').after('<textarea rows="6" columns="70" id="del_rsn" placeholder="We would like to know why do you want to delete this."></textarea>');
      else if (delpost.attr("id") == "ptn")
        $('#con-del').find('.modal-body').find('p').text('Are you sure you want to delete this petition? Add your reason and click "yes" to continue.').after('<textarea rows="6" columns="70" id="del_rsn" placeholder="We would like to know why do you want to delete this."></textarea>');
      else if (delpost.attr("id") == "event")
        $('#con-del').find('.modal-body').find('p').text('Are you sure you want to delete this event? Add your reason and click "yes" to continue.').after('<textarea rows="6" columns="70" id="del_rsn" placeholder="We would like to know why do you want to delete this."></textarea>');
    }
    else if ($(this).hasClass('lv-blg'))
    {
      if (!$(this).data('lvBlg'))
        $('#con-del').find('.modal-body p').html('We need your confirmation to <span class="ref italicText">ENABLE</span> live blogging here. Do you want to continue?');
      else
        $('#con-del').find('.modal-body p').html('We need your confirmation to <span class="ref italicText">DISABLE</span> live blogging here. Do you want to continue?');
      $('#con-del #yes').addClass('enbl-lv-blg');
    }
    else
    {
      $('#con-del').find('.modal-body textarea').remove();
      delpost = $(this).parents('.list');
    }
    return false;
  });

  $('#con-del #yes').on('click', function () {
    if (delpost != null)
    {
      if (delpost.find('.happening').length)
      {
        var qpid = delpost.attr('id');
        var qpuser = delpost.find('.user-small').attr('href').slice(1);
        $.post('/ajax/deleteqp', {
          'qpid': qpid,
          'qpusr': qpuser
        }, function () {
          delpost.slideUp(400, function () {
            delpost.remove();
          });
        });
      }
      else if (delpost.attr('id') == 'article' || delpost.attr('id') == 'ptn' || delpost.attr('id') == 'event')
      {
        var adt = delpost.data('desc');
        var url = null, msg = null, tp = null;
        if (delpost.attr('id') == 'article')
        {
          url = '/ajax/dlpst';
          msg = 'We would like to know why you want to delete this story';
        }
        else if (delpost.attr('id') == 'ptn')
        {
          url = '/ajax/dlptn';
          msg = 'We would like to know why you want to delete this petition';
        }
        else
        {
          url = '/ajax/delev';
          msg = 'We would like to know why you want to delete this event';
        }
        var del_rsn = $('#con-del').find('#del_rsn');
        if ($.trim(del_rsn.val()) == '') {
          del_rsn.addClass('error').attr('placeholder', msg).val('');
          return false;
        }
        else
        {
          $.ajax({
            url: url,
            data: {
              "rsn": del_rsn.val(),
              "id": adt.id
            },
            type: 'post',
            success: function (d) {
            },
            complete: function (res, sts) {
              var d = res.responseText;
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
                  window.location = '/';
                }, 1500);
              }
            }
          });
        }
      }
      else
      {
        var adt = $('.edtr').data('desc');
        var prU = '';
        var type = 'P';
        if (delpost.hasClass('a'))
          type = 'A';
        else if (delpost.hasClass('e')) {
          type = 'E';
          prU = '/events';
        }
        delpost.slideUp(500, function () {
          $.post(api + '/dcmnt', {
            'cid': delpost.find('.comment').attr('id'),
            'tp': type,
            'auth': delpost.getShIntr(),
            'usr': delpost.getLoggedInUsr()
          },
          function (d) {
            t = JSON.parse(d);
            if (t.success == 0) {
              delpost.parents('.list').remove();
            }
          });
        });
      }
    }
  });
  $('#con-del').on('hidden', function () {
    if ($('#con-del .modal-body').find('textarea').length)
      $('#con-del .modal-body').find('textarea').remove();
  });
  /* Temporarily commented as 140 character limit is not checked while making any comments 
   $('.quickpost, .add-rxn, .edt_qp,.edt_cmt').on('paste',function(){
   var $this = $(this);
   setTimeout(function(){
   if($this.text().length > 140)
   $('#sts-msg').showStatus('Text more than 140 characters is not allowed','err');
   $this.text($.trim($this.text().substr(0,140)));
   $this.siblings('.txt-lmt').html((140-$this.text().length)+"/140");
   },20);
   });
   */
  // Cancel editing a comment/quickpost
  $('#right-bar,#comments-box').on('click', '.edt_cls', function (e) {
    e.preventDefault();
    closeEdit($(this).parent(), 0);
  });

  /* Scaling images */
  $('#article .tile-image').each(function () {
    var img = $(this);
    setTimeout(function () {
      img.scaleImages({
        'dw': img.parents('div.image-holder').width(),
        'dh': img.parents('div.image-holder').height()
      });
    }, 300);
  });

  /* Thumbnails scaling and adjustment */
  $('.thumb-holder img').load(function () {
    var thumb_width = $(this).width();
    var thumb_height = $(this).width();
    var scale = 1;
    if (thumb_width > thumb_height)
      scale = thumb_width / 48;
    else if (thumb_width < thumb_height)
      scale = thumb_height / 48;
    $(this).css({
      'width': thumb_width / scale,
      'height': thumb_height / scale
    });
    $(this).fadeIn(200);
  });

  /* Functions to run on loading window
   $(window).load(function(){
   positionPopOver();
   });
   */

  $('.container-fluid').on('click', '.rdltr', function () {
    var btn = $(this);
    $.ajax({
      url: api + '/arl',
      data: {
        'id': btn.parents('.nws-tl').attr('id'),
        'auth': btn.getShIntr(),
        'usr': btn.getLoggedInUsr()
      },
      type: 'POST',
      beforeSend: function () {
        btn.attr('disabled', 'disabled');
      },
      success: function (d) {
        var t = JSON.parse(d);
        if (t.success == 1) {
          btn.toggleClass('mrkd');
        }
        else {
          $('#sts-msg').showStatus(t.msg, 'err');
        }
      },
      complete: function () {
        btn.removeAttr('disabled');
      }
    });
  });

  /* Story Voteup functionality */
  var inPrcs = false;
  $('.container-fluid').on("click", ".sh-vote", function () {
    if ($(this).attr("id") == "voteup")
      return false;
    var $this = $(this);
    if (!inPrcs && $this.chkVrfd())
    {
      $.ajax({
        url: api + '/ar',
        data: {
          "id": $this.parents('.nws-tl').attr('id'),
          "auth": $this.getShIntr(),
          "usr": $this.getLoggedInUsr()
        },
        dataType: 'text',
        type: 'post',
        beforeSend: function () {
          if (!inPrcs)
            inPrcs = true;
          else
            return false;
        },
        success: function (d) {
          var t = JSON.parse(d);
          if (t.success == 1) {
            $this.toggleClass("mrkd");
            $this.find("span:not(.hidden-phone)").text(t.msg);
          }
          else {
            $('#sts-msg').showStatus(t.msg, 'err');
          }
        },
        complete: function () {
          setTimeout(function () {
            inPrcs = false;
          }, 500);
        }
      });
    }
  });

  /* Pin stories to space   */
  $('.tab-pane').on('click', '.nws-tl .pin-opts .btn-success', function () {
    var $this = $(this);
    var pin_opts = $this.siblings(".pin-chk-bxs").find("input:checkbox:checked").map(function () {
      return $(this).val();
    }).get();

    $.post(api + '/pn', {
      "id": $this.parents('.nws-tl').attr('id'),
      "pnd": pin_opts,
      "tp": $this.parents('.nws-tl').data('tp'),
      'auth': $this.getShIntr(),
      'usr': $this.getLoggedInUsr()
    }, function (d) {
      d = JSON.parse(d);
      if (d.success == 1) {
        $this.addClass('mrkd');
        $('#sts-msg').showStatus(d.msg, 'scs');
      }
      else
        $('#sts-msg').showStatus(d.msg, 'err');
    });
    return false;
  });
  $('.tab-pane').on('click', '.nws-tl .pin-opts .btn-danger', function () {
    $(this).parents(".pin-opts").siblings(".stry-pin").removeClass('mrkd');
    $(this).parents(".pin-opts").remove();
  });

  $('.tab-pane').on('click', '.nws-tl .stry-pin', function () {
    var $this = $(this);
    $.post(api + '/gtf', {
      "id": "pinopts",
      "tp": $this.parents('.nws-tl').data('tp'),
      "tpid": $this.parents('.nws-tl').attr('id'),
      'auth': $this.getShIntr(),
      'usr': $this.getLoggedInUsr(),
      'ref': window.location.href
    }, function (d) {
      d = JSON.parse(d);
      if (!$this.siblings(".pin-opts").length) {
        $this.addClass('mrkd');
        $this.after(d.frm);
      }
      else {
        $this.removeClass('mrkd');
        $this.siblings(".pin-opts").remove();
      }
    });
  });

  /*
   * Load data into active tab
   */
  if ($('#right-bar').length && !($('#right-bar').hasClass('prw-pg')))
  {
    var frame = null;
    if ($('#happening-now a[href="#context"]').hasClass('disabled'))
    {
      if ($('#cvr-img').data('usr') != undefined)
      {
        var usr = $('#cvr-img').data('usr');
        $('#right-bar').find('h2:first').html('<a href="/' + usr['unme'].toLowerCase() + '">' + usr['nme'] +
                '</a>').addClass('shw');
        frame = $('#posts > .frame');
        frame.enableSlider();
        frame.loadData({
          'tab': 'context',
          'usr': usr['unme']
        });
      }
      else
      {
        $('#right-bar').find('h2:first').addClass('shw');
        frame = $('#stream > .frame');
        frame.enableSlider();
        var dt = {};
        if ($('#cvr-img').data('info') != undefined)
          dt = {
            'tp': 'S',
            'id': $('#cvr-img').data('info')['id']
          };
        else
          dt = {'tab': 'stream'};
        frame.loadData(dt);
      }
    }
    else
    {
      var htg = $('.edtr').data('desc');
      var url = (document.URL).toLowerCase().split('/');
      if (htg)
      {
        if (htg['sct'] != '')
        {
          htg = htg['sct'].split(',')[0];
          $('#right-bar').find('h2:first').html('Trending on <a href="/hashtag/' + htg.toLowerCase() + '">#' + htg + '</a>');
        }
        $('#right-bar').find('h2:first').css({'opacity': '1', 'left': '0px'});
      }
      else
      {
        $('#right-bar').find('h2:first').html('<a href="/hashtag/' + url[url.length - 1] + '">#' + url[url.length - 1] + '</a>').css({
          'opacity': '1',
          'left': '0px'
        });
      }
      frame = $('#context > .frame');
      frame.enableSlider();
      // For loading right pane in user profile pages
      if ($('#main-content-box').find('#usr-prf').length)
      {
        frame.loadData({
          'tab': 'context',
          'usr': $('#usr-prf .ref-name a').attr('href').slice(1),
          'htg': htg
        });
      }
      else if ((htg !== '' && htg !== undefined) || $.inArray('hashtag', url) !== -1)
      {
        var data = {
          'tab': 'context',
          'tp': 'H',
          'htg': htg
        };
        if (htg !== undefined)
        {
          if ($('#article').length)
            data.tp = 'A';
          else if ($('#event').length)
            data.tp = 'E';
          else if ($('#ptn').length)
            data.tp = 'P';
          var desc = $('.edtr').data('desc');
          if (desc)
            data.id = desc.id;
        }
        else
        {
          data.htg = url[url.length - 1];
        }
        if (url[3] == "articledraft")
          data.tab = "stream";
        frame.loadData(data);
      }
      else
      {
        $('#right-bar').find('h2:first').css({
          'opacity': '1',
          'left': '0px'
        });
        frame.loadData({
          'tab': 'stream'
        });
      }
    }
  }
  /* Change content in the right bar on clicking the tab links */
  $("#happening-now a").click(function (e) {
    e.preventDefault();
    if (!$(this).hasClass('disabled'))
    {
      $(this).tab('show');
      $('.tab-content').find('.active .happening').animateElements();
      var actTab = ($(this).attr('href')).substr(1);
      $('#' + actTab).jScrollPane({
        autoReinitialize: true,
        verticalGutter: 5,
        showArrows: false,
        hideFocus: true
      });
      $("#tab-content-holder .active").hideScroller();
      $(this).parent().siblings('li').find('i.icon-caret-up').addClass('hideElement');
      $(this).find('i').removeClass('hideElement');

      // Loading content into active tabs based on the corresponding anchor click
      if ($('#' + actTab).find('ul.right-comments li').length <= 1)
        $('#' + actTab).loadData({
          'tab': actTab
        });
    }
  });
  /* Change color of anchor tag on hover iff it is not disabled */
  $('#happening-now a').on('hover', function (e) {
    if (!$(this).hasClass('disabled'))
      $(this).css('color', '#65727C !important');
  });


  /* Search Bar animation */
  var inWdth = $('#srch-hdr').width();
  var toLft = $('#menubar').width();
  $('#srch-cls').css({
    'left': (toLft + 15) + 'px'
  });
  $('#srch-br').css({
    'left': inWdth + 'px'
  });
  /*Show search bar */
  $('#user-nav .search').click(function (e) {
    e.preventDefault();
    window.location = $("body").data("auth") + "/search?q=" + encodeURIComponent($('#user-nav').find(".search-query").val().trim());
  });

  // loading register.js file to show registration popup when no session exists
  if (!$('#user-nav .usrname').length)
  {
    var tag = document.createElement('script');
    if ($('#user-nav').data('isLive'))
      tag.src = 'https://saddahaq.blob.core.windows.net/' + $('body').data('vrsn') + '/gujregister.js';
    else
      tag.src = '/public/global/user/js/register.js';
    tag.async = true;
    document.getElementsByTagName('body')[0].appendChild(tag);
  }
  /*
   * Loading first 7 news items based on the corresponding page
   */
  var lc = ((window.location).toString()).split('/');
  if ($('#user-nav').length && $('#featured').length)
    $('#featured').loadNews(fetchTileParams());
  if (lc[3].toLowerCase() == 'hashtag')
  {
    $('#news-bar').loadNews({"htg": lc[4]});
  }
//  else if (lc[3].toLowerCase() == 'search')
//  {
//    var scat = (lc[5]) ? lc[5].charAt(0).toUpperCase() : "all";
//    $('#news-bar').loadNews({
//      "cgry": lc[3],
//      "kwd": lc[4],
//      "scat": scat
//    });
//
//  }
  /*
   * Show scroll to top button when user scrolls down to a height less than 100px of the total window height from the top 
   * Load additional tiles when the user hits the bottom of the page */
  var isFixed = false;
  var scrlHt = document.body.scrollHeight, prvScrl = $(window).scrollTop();
  $(window).scroll(function () {
    var scroll = $(window).scrollTop(), navbar = $('#navigation-bar');
    var ri8pn = $('.ri8-pn'), lftpn = $('.lft-pn');

    if (lftpn.length)
    {
      if (lftpn.offset().top <= scroll)
        ri8pn.removeClass('scrl').addClass('dock').css('height', scrlHt);
      else
        ri8pn.removeClass('dock').addClass('scrl').css('height', 'auto');
      if ($('#cvr-img').length)
      {
        if (($('#cvr-img').offset().top + $('#cvr-img').outerHeight()) <= ($(window).scrollTop() + 70))
          $('#lft-mnu').removeClass('lft');
        else
          $('#lft-mnu').addClass('lft');
      }
    }
    else
    {
      if (scroll >= 64)
        ri8pn.removeClass('scrl').addClass('fix').css('height', scrlHt);
      else
        ri8pn.removeClass('fix').addClass('scrl').css('height', 'auto');
    }
    var lc = document.URL.split('/');
    if ($(document).height() <= ($(window).height() + scroll * 1.5) && $('#news-bar').length)
    {
      if (lc[3].toLowerCase() == 'hashtag')
        $('#news-bar').addNews({"htg": lc[4]});
      else
      {
        $('#featured').addNews(fetchTileParams());
      }
    }
    if ($(window).scrollTop() > ($(window).height() - 100))
    {
      if (!($('#goTop').length))
        $('body').append('<div id="goTop"><a class="stt" href="#"><i class="icon-chevron-up"></i></a></div>');
      else
        $('#goTop').addClass('in');
    }
    else
      $('#goTop').removeClass('in');

    if (navbar.hasClass('fix'))
    {
      if (scroll == 0)
      {
        navbar.removeClass('dock fix');
        ri8pn.removeClass('dock').addClass('scrl').css('height', 'auto');
      }
      else if (prvScrl > scroll)
        navbar.addClass('dock');
      else
        navbar.removeClass('dock');
    }
    else
    {
      if ((navbar.offset().top + navbar.outerHeight()) < $(window).scrollTop())
        navbar.addClass('fix');
    }
    prvScrl = scroll;
  });

  /*
   * Loading readlater entries when user clicks the readlater button
   */

  $('#rl-ntfy').find('.hor_loading').positionElement({
    'parent': $('#rl-ntfy'),
    'top': false
  });
  var rloaded = false;
  $('#readlater').click(function () {
    var rl_lst = $('#rl-ntfy');
    var len = 5;
    if (1)
    {
      if (!rloaded) {
        $.ajax('/ajax/gtrdltr', {
          data: {},
          type: 'post',
          beforeSend: function () {
          },
          success: function (d) {
            if (d != '')
            {
              d = $.parseJSON(d);
              if (d.length < 5)
                len = d.length;
              for (var i = 0; i < len; i++)
              {
                rl_lst.append("<li class='list'>" +
                        "<div class='notify box'>" +
                        "<a href='" + d[i].Url + "'>" +
                        "<div class='thumb-holder pull-left'><img src='" + ($('#user-nav').data('isLive') ?
                                'https://saddahaq.blob.core.windows.net/multimedia/' : '/public/Multimedia/') + d[i].Thumbnail + "'>" +
                        "</div><p>" +
                        rl_lst.buildTxt(d[i].Title, 0) + "</p>" +
                        "<span class='clearfix'></span>" +
                        "</a>" +
                        "</div>" +
                        "</li>");
              }
            }
            else
              rl_lst.append('<li class="nontf">No story marked to read later</li>');
          },
          complete: function () {
            $('#rl-ntfy').find('.loading').remove();
            if (rl_lst.find('li').length)
            {
              rl_lst.find('.tmsp').each(function () {
                $(this).updateTime({
                  'ts': $(this).attr('tmsp')
                });
              });
              if (len > 5)
                $('#rl-ntfy li:last').after("<li class='vw-mr'><a href='/" + $(this).getLoggedInUsr(0) +
                        "/Dashboard?ReadLater'>view more</a><div class='clearfix'></div></li>");
            }
            rloaded = true;
          }
        });
      }
    }
    else
    {
      rl_lst.find('.hor_loading').remove();
      if (!rl_lst.find('li.nontf').length)
        rl_lst.append('<li class="nontf">No story marked to read later</li>');
    }
  });

  /*
   * Loading notifications when user clicks the notification button
   */
  var loaded = false;
  $('#notify').on('ldNtf', function () {
    var $this = $(this);
    if ($this.parents("li").hasClass("open"))
      $("#usr-ntfy").removeAttr("style");
    $(this).removeClass('bell-ntfy');
    $(this).find('.badge').remove();
    var usr = $this.getLoggedInUsr(), len = 5, trgt = null;
    $.ajax(api + '/ntfs', {
      data: {'auth': $(this).getShIntr(), 'usr': usr},
      type: 'post',
      success: function (ndata) {
        trgt = $('#popout .usr-ntfy');
        var d = JSON.parse(ndata);
        d = d.msg;
        if (!d.length)
          trgt.append('<li class="nontf">No notifications</li>');
        else
        {
          var imgsrcbase = $('#user-nav').data('isLive') ? 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' : '/public/Multimedia/P_Pic_';
          if (d.length < 5)
            len = d.length;
          for (var i = 0; i < len; i++)
          {
            var tag = '', ttl = '', href = '';
            switch (d[i].N_Type)
            {
              case 'Q':
                if (d[i].N_Tag == '@')
                  tag = 'posted';
                href = '#';
                ttl = stripHtml(d[i].N_Content);
                break;
              case 'A':
                ttl = stripHtml(d[i].N_Article_Event_Title);
                if (d[i].N_Tag == 'V')
                  tag = 'votedup a story';
                else if (d[i].N_Tag == 'CM')
                  tag = 'commented on a story';
                else if (d[i].N_Tag == '@')
                  tag = 'mentioned you in the story';
                else if (d[i].N_Tag == 'CC')
                  tag = 'replied to your comment in';
                else if (d[i].N_Tag == 'U')
                  tag = 'votedup your comment in';
                else if (d[i].N_Tag == 'D')
                  tag = 'voteddown your comment in';
                else if (d[i].N_Tag == 'P')
                  tag = 'answered a poll in';
                else if (d[i].N_Tag == 'M')
                  tag = 'assigned this story to moderate';
                else if (d[i].N_Tag == '@C')
                {
                  tag = 'mentioned you in a comment';
                }
                else if (d[i].N_Tag == 'TS')
                  tag = 'tagged an article to space';

                href = d[i].N_Link;
                break;
              case 'E':
                ttl = stripHtml(d[i].N_Article_Event_Title);
                if (d[i].N_Tag == 'A')
                  tag = 'attending an event';
                else if (d[i].N_Tag == 'CM')
                  tag = 'commented on an event';
                else if (d[i].N_Tag == 'N')
                  tag = 'sent a notification in event';
                else if (d[i].N_Tag == 'U')
                  tag = 'votedup your comment in';
                else if (d[i].N_Tag == 'D')
                  tag = 'voteddown your comment in';
                else if (d[i].N_Tag == 'I')
                  tag = 'invited you to event';
                else if (d[i].N_Tag == '@C')
                  tag = 'mentioned you in comment';
                else if (d[i].N_Tag == '@')
                  tag = 'mentioned you in event';
                else if (d[i].N_Tag == 'CC')
                  tag = 'replied to your comment in';
                else if (d[i].N_Tag == 'TS')
                  tag = 'tagged an event to space';
                href = d[i].N_Link;
                break;
              case 'P':
                ttl = stripHtml(d[i].N_Article_Event_Title);
                if (d[i].N_Tag == 'S')
                  tag = 'signed a petition';
                else if (d[i].N_Tag == 'CM')
                  tag = 'commented on a petition';
                else if (d[i].N_Tag == 'SC')
                  tag = 'reached target signatures';
                else if (d[i].N_Tag == '@')
                  tag = 'mentioned you in the petition';
                else if (d[i].N_Tag == 'CC')
                  tag = 'replied to your comment in';
                else if (d[i].N_Tag == 'U')
                  tag = 'votedup your comment in';
                else if (d[i].N_Tag == 'D')
                  tag = 'voteddown your comment in';
                else if (d[i].N_Tag == '@C')
                {
                  tag = 'mentioned you in a comment';
                }
                else if (d[i].N_Tag == 'TS')
                  tag = 'tagged a petition to space';
                href = d[i].N_Link;
                break;
              case 'U':
                ttl = $("body").data("user");
                if (d[i].N_Tag == 'F')
                  tag = 'is now following';
                href = d[i].N_Link;
                break;
              case 'S':
                ttl = stripHtml(d[i].N_Article_Event_Title);
                if (d[i].N_Tag == 'F')
                  tag = 'is following a space';
                else if (d[i].N_Tag == 'C')
                  tag = 'created a space';
                else if (d[i].N_Tag == 'A')
                  tag = 'added as admin to space';
                href = d[i].N_Link;
                break;
              case 'D' :
                ttl = stripHtml(d[i].N_Article_Event_Title);
                if (d[i].N_Tag == 'TS')
                  tag = 'tagged a debate to space';
                if ($('#user-nav').data('isLive'))
                  href = "https://debate.saddahaq.com/" + d[i].N_Link;
                else
                  href = "https://dt.saddahaq.com/" + d[i].N_Link;
                break;
              case 'T' :
                ttl = stripHtml(d[i].N_Article_Event_Title);
                if (d[i].N_Tag == 'TS')
                  tag = 'tagged a townhall to space';
                href = d[i].N_Link;
                break;
            }
            if (d[i].N_Tag == 'TS' || d[i].N_Tag == 'N' || d[i].N_Tag == 'F' || (d[i].N_Type == 'S' && (d[i].N_Tag == 'C' || d[i].N_Tag == 'A'))) {
              var usr = d[i].N_Author;
              var usrslst = $this.buildTxt(d[i].N_Author_Full_Name, 0);
            }
            else {
              var usrs = d[i].N_Refer_To.split(',');
              var numusrs = usrs.length;
              var usr = usrs[0].split(':');
              usrslst = usr[1];
              if (numusrs > 1) {
                usrslst += ' and ' + (numusrs - 1) + ' more';
              }
              else {
                usrslst = usr[1];
              }
            }
            var ttl = $(this).buildTxt(ttl, 0);
            var str = "<li class='list'>" +
                    "<div class='notify transition in " + (d[i].N_New ? "unrd" : "") + "'>" +
                    "<a href='" + href + "' class='box'>" +
                    "<img class='icn-big pull-left' src='" + imgsrcbase +
                    (usr instanceof Array ? usr[0] : usr) + "' />" +
                    "<p class='content'>" +
                    "<span class='user-small'>" + usrslst + "</span>" +
                    "<span class='tagd'>" + tag + "</span>" +
                    "<span class='ttl'>" + (ttl.length > 80 ? ttl.substr(0, 77) + '...' : ttl) + "</span>" +
                    "<span class='tmsp block' tmsp='" + d[i].N_Timestamp + "'></span>" +
                    "</p>" +
                    "<div class='clearfix'></div>" +
                    "</a>" +
                    "</div>" +
                    "</li>";

            trgt.append(str);
          }
        }
      },
      complete: function () {
        trgt.find('.loading').remove();
        if (trgt.find('li').length)
        {
          var usrPicElms = trgt.find(".usr-img");
          usrPicElms.each(function () {
            $(this).find("img").findPrfPic();
          });
          //$(this).updateTime({'ts': $(this).attr('tmsp')})
          trgt.find('.tmsp').each(function () {
            $(this).updateTime({
              'ts': $(this).attr('tmsp')
            });
          });
          $('#usr-ntfy li:last')
                  .after("<li class='vw-mr'><a href='/" + usr + "/Dashboard?Notifications'>view more</a><div class='clearfix'></div></li>");
        }
      }
    });
  });
  /* Animate notification button */
  $(window).load(function () {
    var flag = 1;
    $("notify").click(function () {
      $(".icon-bell-alt").css('color', '#65727C');
      flag = 0;
    });
    /*
     * Fixing position of rightbar
     */
//    if (!$('#cvr-img').length && !$('#right-bar').hasClass('prw-pg'))
//      $('.ri8-pn').removeClass('scrl').addClass('fix');
//    else if ($('#cvr-img').length && $(window).scrollTop() - 50 >= ($('#cvr-img').outerHeight() + $('#cvr-img').offset().top))
//    {
//      $('#lft-mnu').removeClass('lft');
//      $('.ri8-pn').removeClass('scrl').addClass('dock').css('height', document.body.scrollHeight);
//    }
  });

  /*
   * Update timestamp every minute
   */
  $('.tmsp').each(function () {
    $(this).updateTime({
      'ts': $(this).attr('tmsp')
    });
  });
  setInterval(function () {
    $('.tmsp').each(function () {
      $(this).updateTime({
        'ts': $(this).attr('tmsp')
      });
    });
  }, 60000);
  /*Main top Dropdown Sub Category hide on mouse/window scroll*/
  window.onscroll = function () {
    $('.ui-autocomplete').hide();
  };
  /*Dropdown Sub Category zIndex on top */
  $('.ui-autocomplete').css('zIndex', 3000);

  function stripHtml(html)
  {
    var tmp = $('<div>');
    var txt = html.replace(/\\"/g, '"');
    tmp.html(txt);
    return $.trim(tmp.text());
  }
  // Show popup for changes
  $('#popout,.left-container, #rltd-bx .rltd-crt-bx, #lft-mnu').on('click', '.pop', function (e) {
    var $this = $(this);
    e.preventDefault();
    if ($this.chkVrfd())
    {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
      {
        $('#sts-msg').showStatus("Our tech team is working hard to bring publishing experience on mobile asap! Meanwhile you can write from a PC. Thank you!", 'err');
        return false;
      }
      if ($this.hasClass('pop'))
      {
        var data = {
          'id': $this.data('id'),
          'auth': $this.getShIntr(),
          'usr': $this.getLoggedInUsr()
        };
        if ($('#cvr-img').data('info') != undefined && $this.parents('#lft-mnu').length)
          data['spcId'] = $('#cvr-img').data('info')['t_id'];
        $('#pop-prw').removeClass('big');
        $.ajax({
          url: api + '/gtf',
          type: 'post',
          data: data,
          success: function (data) {
            data = JSON.parse(data);
            if ($this.data('id') == 'n-d-b')
              $('#pop-prw').addClass('big');
            $('#pop-prw > section').html(data['frm']).showPopup($this.data('id') == 'n-d-b' ? 1 : 0);
          },
          complete: function () {
            $('#pop-prw .tltip').tooltip({
              html: true,
              trigger: 'hover'
            });
          }
        });
      }
      else
        window.location = $this.attr('href');
    }
  });

  // Close popup
  $(document).on('click', '#prw #cancel, #prw-close', function () {
    if ($(this).parents('#art-prw').length) {
      $('#art-prw').removeClass('in').css('top', '-100%');
      $('.sts-bx').fadeOut(200);
    } else
    {
      var popprw = $('#pop-prw');
      if ($(this).hasClass('intro-vid'))
        $.post('/ajax/edvdo', {});
      popprw.removeClass('in');
      $('.sts-bx').fadeOut(300, function () {
        popprw.html('').removeClass('scrl').removeAttr('style');
      });
    }
  });

  $('.sts-bx').on('click', function () {
    $('#pop-prw, #art-prw').removeClass('in');
    // To hide editor intro video from displaying to the user after the first visit
    if ($('#pop-prw').hasClass('intro-vid'))
      $.post('/ajax/edvdo', {});
    $(this).fadeOut(300, function () {
      $('#pop-prw').html('').removeClass('scrl').removeAttr('style');
    });
    if ($('.lgn-btn').hasClass('drpd')) {
      $('#lgn-bx').css('top', '-100%').removeClass('in').find('.err-msg').text('');
      $('.lgn-btn').removeClass('drpd');
    }
  });

  /* Close alert message */
  $('#pop-prw').on('submit', '#dbt-sgst', function () {
    var $this = $(this);
    var topic = $('#deb-topic').val();
    var err = $this.find('.err-msg');
    err.text('').removeClass('scs');
    if ($.trim(topic) == '')
    {
      err.text('Suggest us a topic for the debate');
      $('#deb-topic').focus();
    }
    else
    {
      $.post(api + '/dtsg', {
        'eml': $('#eml').val(),
        'tpc': topic,
        'tp': 'D'
      }, function (d) {
        d = JSON.parse(d);
        if (d.success == 1)
          $('#sts-msg').showStatus(d.msg, 'scs');
        else
          err.text(d.msg);
      });
    }
    return false;
  });
  $('#pop-prw').on('click', 'input[name="debt-opt"]', function () {
    if ($(this).prop('checked'))
    {
      if ($(this).val() == 1)
        $(this).siblings('.input-prepend').removeClass('hideElement');
      else
        $(this).siblings('.input-prepend').addClass('hideElement');
    }
  });
  $('#pop-prw').on('submit', '#dbt-crt', function (e) {
    e.preventDefault();
    var flag = 0;
    var dbtFrm = $(this);
    var err = dbtFrm.find('p.err-msg');
    dbtFrm.find('input,textarea').not('.opt').each(function () {
      $(this).removeClass('error');
      if ($.trim($(this).val()) == '')
      {
        $(this).addClass('error');
        err.text("Highlighted field cannot be empty");
        flag = 1;
        return false;
      }
    });
    if (!flag)
    {
      var dt_regex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/;
      if (!dt_regex.test($('#deb-dt').val()))
      {
        err.text($('#deb-dt').val() + ' is not in required Date Format');
        $('#deb-dt').addClass('error').val('');
        flag = 1;
        return false;
      }
      if ($('#debt-sed').val() != '' && !dt_regex.test($('#debt-sed').val()))
      {
        err.text($('#debt-sed').val() + ' is not in required Date Format');
        $('#debt-sed').addClass('error').val('');
        flag = 1;
        return false;
      }
    }
    if (!flag)
    {
      spc = ($('#cvr-img').data('info') == undefined) ? '' : $('#cvr-img').data('info').t_id;
      var pstdt = {
        'ttl': dbtFrm.find('#debt-title').val(),
        'desc': dbtFrm.find('#debt-desc').val(),
        'strt': dbtFrm.find('#deb-dt').data('tmsp'),
        'dur': dbtFrm.find("#durMin").val(),
        'htg': dbtFrm.find('#debt-hstg').val(),
        'scrit': dbtFrm.find("#debt-scriteria").val(),
        'slctEnd': dbtFrm.find('#debt-sed').data('tmsp'),
        'auth': dbtFrm.getShIntr(),
        'usr': dbtFrm.getLoggedInUsr(),
        'spc': spc
      };
      pstdt.dbtTp = dbtFrm.find('input[name="debt-opt"]:checked').val();
      if (pstdt.dbtTp == 1)
      {
        pstdt['qtns'] = dbtFrm.find('#q-lmt').val();
        pstdt['args'] = dbtFrm.find('#a-lmt').val();
      }
      $.post(api + '/ndbt', pstdt,
              function (d) {
                d = JSON.parse(d);
                if (d.success == 0)
                  $('#sts-msg').showStatus(d.msg);
                else
                  window.location = $('body').data('dbt') + '/' + d.msg;
              });
    }
    return false;
  });

  $('#pop-prw').on('submit', '#sgst-twnhl', function () {
    var $this = $(this);
    if ($.trim($this.find('#tpc').val()) == '') {
      $('p.err-msg').text('Whom to invite cannot be empty!');
      return false;
    }
    else {
      var data = {
        'eml': $this.find('#thl-tpc').val(),
        'tpc': $this.find('#tpc').val(),
        'tp': 'T',
      };
      if ($this.data('spcId') != undefined)
        data['spc'] = $this.data('spcId');

      $.post(api + '/dtsg', data,
              function (d) {
                d = JSON.parse(d);
                if (d.success == 1) {
                  $('#sts-msg').showStatus(d.msg, 'scs');
                }
                else {
                  $('p.err-msg').text(d.msg);
                }
              });
    }
    return false;
  });
  $('#pop-prw').on('submit', '#f-p-c-f', function () {
    var $this = $(this);
    $this.attr('disabled', 'disabled');
    $('#pop-prw p.err-msg').text('Fetching data from change.org ...');
    var url = $('#ptn-url').val();
    if (url != '' && url.match(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g))
    {
      $.post('/ajax/ptnfrmchng', {
        "url": url
      },
      function (d) {
        if (d == -1) {
          $('#pop-prw p.err-msg').text('Something went wrong. Please try again!!');
          $this.removeAttr('disabled');
        }
        else if (d == -2 || d == -3) {
          $('#pop-prw p.err-msg').text('Looks like you included an invalid url');
          $this.removeAttr('disabled');
        }
        else if (d.indexOf('&&') != -1) {
          var t = d.split('&&');
          if (t[0] == -3) {
            $('#pop-prw p.err-msg').text('Someone already fetched this petition from Change.org. Hold on while we redirect you to the petition...');
            setTimeout(function () {
              window.location = '/petitions/' + t[1];
            }, 3500);
          }
          else if (t[0] == -4) {
            $('#pop-prw p.err-msg').text('Someone already fetched this petition from Change.org and is in moderation. Will get back to you once it is approved. Please wait while we redirect you to the homepage...');
            setTimeout(function () {
              window.location = '/';
            }, 4500);
          }
        }
        else {
          window.location = '/new/petition/' + d;
        }
      });
    }
    else
      $('#pop-prw p.err-msg').text("Looks like you included an invalid url");
    return false;
  });
  $('#pop-prw').on('click', '#ptn-sbmt', function () {
    $('#p-p-f').submit();
  });
  $(document).on('focus', '#deb-dt, #debt-sed,.dtpkr', function () {
    $(this).datepicker({
      minDate: new Date(),
      dateFormat: 'dd/mm/yy',
      onSelect: function () {
        var tm = '';
        switch ($(this).attr('id'))
        {
          case 'deb-dt':
            tm = $('#debatetm').val();
            break;
          case 'debt-sed':
            tm = $('#debate-set').val();
            break;
          case '#ptn-sed' :
            tm = $('#ptn-set').val();
            break;
        }
        $(this).getTmsp(tm);
      }
    });
  });

  //Time picker
  $(document).on('focus', '#debatetm, #debate-set, .tmpkr', function () {
    var $this = $(this);
    var d = new Date();
    var trgt = $($this.data('dtSrc'));
    var flag = 0;// flag will be 1 when end date and time selected first and if start time = end time.
    if ($this.attr('id') == 'debatetm')
      trgt = $('#deb-dt');
    else if ($this.attr('id') == 'debate-set')
      trgt = $('#debt-sed');
    if (trgt.val() != '' && trgt.val() != undefined)
    {
      var tmp = trgt.val().split('/');
      var slctDt = new Date(tmp[2], tmp[1] - 1, tmp[0]);
      if (slctDt.getTime() > d.getTime())
        d = slctDt;
    }
    else if (trgt.data('dt') != undefined)
    {
      var tmp = null;
      var slctDt = null;
      if (trgt.attr('id') == 'dt-mth-to' && (trgt.parents('#dt-holder').find('#dt-mth-frm').data('tmsp') != undefined && trgt.data('dt') != undefined))
      {
        var frmDt = trgt.parents('#dt-holder').find('#dt-mth-frm').data('dt').split('/');
        frmDt = new Date(frmDt[2], frmDt[1] - 1, frmDt[0]).getTime();
        var toDt = trgt.data('dt').split('/');
        toDt = new Date(toDt[2], toDt[1] - 1, toDt[0]).getTime();
        if (toDt == frmDt)
          slctDt = trgt.parents('#dt-holder').find('#dt-mth-frm').data('tmsp') * 1000;
        else if (toDt > frmDt) //  
          slctDt = trgt.parents('#dt-holder').find('#dt-mth-to').data('tmsp') * 1000;
      }
      else if (trgt.attr('id') == 'dt-mth-frm' && (trgt.parents('#dt-holder').find('#dt-mth-to').data('tmsp') != undefined && trgt.data('dt') != undefined))
      {
        var toDt = trgt.parents('#dt-holder').find('#dt-mth-to').data('dt').split('/');
        toDt = new Date(toDt[2], toDt[1] - 1, toDt[0]).getTime();

        var frmDt = trgt.data('dt').split('/');
        frmDt = new Date(frmDt[2], frmDt[1] - 1, frmDt[0]).getTime();

        if (toDt == frmDt) {
          slctDt = trgt.parents('#dt-holder').find('#dt-mth-to').data('tmsp') * 1000;
          flag = 1;
        }
        else if (toDt > frmDt) //  
          slctDt = trgt.parents('#dt-holder').find('#dt-mth-frm').data('tmsp') * 1000;
      }
      else if (trgt.data('dt') != undefined)
      {
        tmp = trgt.data('dt').split('/');
        slctDt = new Date(tmp[2], tmp[1] - 1, tmp[0]).getTime();
      }
      if (slctDt > d.getTime())
        d = slctDt;
    }
    $this.getTmSgstns(d, trgt, flag);
  });
  $(document).on('blur', '.tmpkr', function () {
    if ($(this).attr('id') == 'slider-frm' || $(this).attr('id') == 'slider-to')
      $(this).parents('.dt-tm').find('.popper.tm').text($(this).val());
    $(this).autocomplete("destroy");

    //Case when the time not selected from suggestions  
    var trgt = $($(this).data('dtSrc'));
    trgt.getTmsp($(this).val());
  });
  //Close button for progress-box
  $(document).on('click', '.pop-cls', function (e) {
    e.preventDefault();
    var $this = $(this);
    if ($('#progress-bar').hasClass('view'))
    {
      var pb = $('#progress-bar');
      pb.removeClass('view embd');
      $this = pb.find('div.messages');
      $this.find('.sts:first').text('');
      $this.find('.sts').not(':first').remove();
      $this.siblings('progress').attr('value', '0');
    }
    else if ($('#slde-shw-pop').hasClass('view')) {
      $('#slde-shw-pop').removeClass('view');
      $('#slde-shw-pop').find(".slde.in").removeClass("in");
      $(".container-fluid").removeClass("blurr");
    }
    else
    {
      alert("hi");
      $('#pop-prw').removeClass('view');
    }
    $('.sts-msg-bx').removeClass('scs err img-ovrly');
  });

  /* Resend verification email */
  $('#sts-msg').on('click', '.rsnd-eml', function () {
    var $this = $(this);
    var par = $this.parent();
    if ($this.hasClass('rsnd-eml'))
    {
      par.find('a').addClass('hideElement');
      $this.parent().text('Sending..');
      //   $this.text('Sending...').removeClass('.rsnd-eml');
      $.post(api + '/rve', {"usr": $this.getLoggedInUsr(), "auth": $this.getShIntr()}, function (d) {
        d = JSON.parse(d);
        if (d.success == 1)
          par.addClass('scs').text(d.msg);
        else
        {
          par.addClass('err').prepend(d.msg);
          par.find('a').removeClass('hideElement');
        }
        $this.addClass('rsnd-eml');
      });
    }
  });
  /*
   * Event handler to enable hashtag suggestions whenever user starts typing in a box with class name htg-bx
   */
  $(document).on('keydown', '.htg-bx', function (e) {
    if (e.which == 32)
      e.preventDefault();
    else
      $(this).getHstgSgstns();
  });
  /* Custom designed dropdown functionality */
  $(document).on('click', '.dd', function (e) {
    if ($(e.target).hasClass('dd') || e.target.nodeName == 'I')
    {
      $(this).find('i').toggleClass('icon-chevron-down icon-chevron-up');
      $(this).toggleClass('shw').find('section').toggleClass('in');
    }
  });

  $(document).on('click', '.dd section li', function () {
    var chkbx = $(this).find('input[type="checkbox"]');
    chkbx.prop('checked', !chkbx.prop('checked'));
  });
  /* Functionality to save user email id if it is not received from the source logged in */
  $('#c-b, #usr-bar').on('click', '#eml-id', function () {
    var $this = $(this);
    if ($this.attr('placeholder') == $.trim($this.text()))
      $this.text('');
    $this.siblings('a').removeClass('hideElement');
  });

  $('#c-b, #usr-bar').on('blur', '#eml-id', function () {
    var $this = $(this);
    if ($.trim($this.text()) == '')
    {
      $this.text($this.attr('placeholder'));
      $this.siblings('a').addClass('hideElement');
    }
  });

  $('#c-b #get-eml, #usr-bar #get-eml').on('mousedown', 'a', function () {
    var eml = $.trim($(this).siblings('#eml-id').text());
    if ((/^[a-z0-9_\+-]+(\.[a-z0-9_\+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,4})$/).test(eml))
    {
      $.post('/ajax/ueml', {"eml": eml}, function (d) {
        t = JSON.parse(d);
        st = (t.success == 1) ? 'scs' : 'err';
        $('#sts-msg').showStatus(t.msg, st);
      });
    }
    else
      $('#sts-msg').showStatus('Looks like the email id you entered is invalid. If it is a valid one, please try again', 'err');
  });
  //Collapse menu on click navicon in top navigation bar
  var hvrTmr = null, shwTmr = null;
  $('.nav-menu, #glb-mnu').on('hover', function (e) {
    if (e.type == 'mouseenter')
    {
      if (hvrTmr != null)
        clearTimeout(hvrTmr);
      setTimeout(function () {
        $('#glb-mnu').addClass('in');
      }, 150);
    }
    else if (e.type == 'mouseleave')
    {
      clearTimeout(shwTmr);
      hvrTmr = setTimeout(function () {
        $('#glb-mnu').removeClass('in');
      }, 200);
    }
  });

  $('.nav-menu').on('touchend', function () {
    alert("hello");
    $('#glb-mnu').toggleClass('in');
  });

  $('#lft-mnu').on('click', '.drp-dwn', function () {
    var $this = $(this);
    if ($this.hasClass('open'))
    {
      $('#lft-mnu').find('.' + $this.data('trgt')).addClass('no-hgt');
      $this.removeClass('open').find('i:last').removeClass('rt');
    }
    else
    {
      $('#lft-mnu').find('.' + $this.data('trgt')).removeClass('no-hgt');
      $this.addClass('open').find('i:last').addClass('rt');
    }
  });

  $('#lft-mnu > ul').on('hover', function (e) {
    if (e.type == 'mouseleave')
    {
      $('#lft-mnu').find('.sub-mnu').addClass('no-hgt');
      $('#lft-mnu').find('.rt').removeClass('rt');
    }
  });

  $('#lft-mnu > ul  a, #lft-mnu .drp-dwn').on('hover', function (e) {
    if (e.type == 'mouseenter')
    {
      $('#lft-mnu').addClass('hover');
      if (!$(this).hasClass('nav-menu'))
        $('#lft-mnu-bx').addClass('in');
    }
    else if (e.type == 'mouseleave')
    {
      $('#lft-mnu').removeClass('hover');
      $('#lft-mnu-bx').removeClass('in');
    }
  });
  /* Popout functionality */
  $(document).on('click', '.popper', function () {
    var $this = $(this), trgt = $('#popout');
    if ($this.hasClass('opn'))
    {
      clsPopout(trgt);
      $this.removeClass('opn');
    }
    else
    {
      $('.popper').not($this).removeClass('opn');
      trgt.removeAttr('class').html('').append("<div class='arrow'></div>" + $this.siblings('.popout').html()).addClass($this.siblings('.popout').data('dir'));
      if ($this.data('trgr'))
        $this.trigger($this.data('trgr'));
      setPopPosition($this, trgt);
      $this.addClass('opn');
      trgt.addClass('in');
      if ($this.data('newCls'))
        trgt.addClass($this.data('newCls'));
      
      //To enable any sly slider if present inside popout
      trgt.find('.frame').enableSlider();
    }
  });

  $(document).on('click', '.rdo', function () {
    $(this).addClass('actv');
    $('.rdo[data-actn="' + $(this).data('actn') + '"]').not($(this)).removeClass('actv');
  });

  $(document).click(function (e) {
    var $this = $(e.target);
    if (!($this.attr('id') == 'popout' || ($this.parents('#popout').length)) && !($this.hasClass('popper') || $this.parents('.popper').length))
      clsPopout($('#popout'));
  });

  var tltpTmr = null;
  $(document).on('hover', '.tooltip', function (e) {
    var trgt = $('#tooltip'), $this = $(this);
    if (e.type == 'mouseenter')
    {
      clearTimeout(tltpTmr);
      trgt.removeAttr('class').addClass($this.data('dir')).find('p').html($this.data('tpDsc'));
      setPopPosition($this, trgt);
      trgt.addClass('in');
    }
    else if (e.type == 'mouseleave')
    {
      tltpTmr = setTimeout(function () {
        trgt.removeAttr('class').find('p').html('');
      }, 500);
    }
  });

  // $this -> trigger, trgt -> #popout
  function setPopPosition($this, trgt)
  {
    if (trgt.hasClass('top') || trgt.hasClass('btm'))
    {
      if (trgt.hasClass('top'))
        trgt.css({'top': ($this.offset().top - trgt.outerHeight() - 11 - $(window).scrollTop()) + 'px'});
      else if (trgt.hasClass('btm'))
        trgt.css({'top': (($this.outerHeight() + $this.offset().top) - $(window).scrollTop() + 10) + 'px'});
      if (!($this.hasClass('bl') || $this.hasClass('br')))
      {
        trgt.css({'left': ($this.offset().left - ((trgt.outerWidth() - $this.outerWidth()) / 2)) + 'px', 'right': 'auto'});
        if (trgt.offset().left < 0)
          trgt.css({'left': '0', 'right': 'auto'}).find('arrow').css('left', ($this.outerWidth() / 2 - 5) + 'px');
        else if ($(window).width() <= Math.ceil(trgt.offset().left + trgt.outerWidth()))
          trgt.css({'left': 'auto', 'right': ($(window).width() - ($this.offset().left + $this.outerWidth()) - 4) + 'px'}).find('.arrow').css({'left': (trgt.outerWidth() - 4 - $this.outerWidth() / 2) + 'px'});
      }
      else
      {
        if ($this.hasClass('bl'))
          trgt.css({'left': $this.offset().left + 'px', 'right': 'auto'}).find('.arrow')
                  .css('left', ($this.outerWidth() / 2) + 'px');
        else
          trgt.css({'left': ($this.offset().left + $this.outerWidth() - trgt.outerWidth()) + 'px', 'right': 'auto'})
                  .find('.arrow').css('left', (trgt.outerWidth() - 2 - ($this.outerWidth() / 2)) + 'px');
      }
    }
    else
    {
      trgt.css('top', (($this.offset().top - $(window).scrollTop()) - (trgt.outerHeight() - $this.outerHeight()) / 2) + 'px');
      if (trgt.hasClass('right'))
        trgt.css({'left': ($this.offset().left + $this.outerWidth() + 11) + 'px'});
      else if (trgt.hasClass('left'))
        trgt.css({'left': -(trgt.outerWidth() + 11) + 'px'});

      if (trgt.offset().top < 0)
        trgt.css({'top': parseInt(trgt.css('top')) + trgt.offset().top}).find('.arrow').css('top', ($this.outerHeight() / 2 - 5) + 'px');
      else if ($(window).outerHeight() <= Math.ceil(trgt.offset().top + trgt.outerHeight() - $(window).scrollTop()))
      {
        var trgtBtm = Math.ceil(trgt.outerHeight() + trgt.offset().top - $(window).scrollTop()), arw = trgt.find('.arrow');
        trgt.css({'top': (parseInt(trgt.css('top')) - (trgtBtm - $(window).height()) - 8) + 'px'});
        arw.css('top', (parseInt(arw.css('top')) + (trgtBtm - $(window).height()) + 22) + 'px');
      }
    }
  }

  function clsPopout(trgt)
  {
    trgt.removeAttr('class').contents().not('.arrow').remove();
    $('.popper.opn').removeClass('opn');
    setTimeout(function () {
      trgt.removeAttr('style');
    }, 100);
  }
  /* Functionality to show popup with user details upon hovering over a user name */
  var usrTmr = null, waitTmr = null;
  $(document).on('hover', '.user-small, #usr-popup', function (e) {
    var $this = $(this);
    if (e.type == 'mouseenter')
    {
      if (waitTmr != null)
        clearTimeout(waitTmr);
      //  console.log(e.type, $this.hasClass('user-small'));
      if ($this.hasClass('user-small'))
      {
        usrTmr = setTimeout(function () {
          var usr = ($this.attr('href') ? $this.attr('href') : $this.data('href')).split('/');
          usr = usr[usr.length - 1];
          $.ajax({
            url: api + '/up',
            data: {
              "usr": $this.getLoggedInUsr(),
              "auth": $this.getShIntr(),
              "usr2": usr
            },
            type: 'post',
            success: function (d) {
              d = JSON.parse(d);
              if (d.success)
              {
                d = d['msg'];
                var usrbx = $('#usr-popup');
                if ($('#user-nav').data('isLive'))
                  var img_src = "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_";
                else
                  img_src = "/public/Multimedia/P_Pic_";
                if (d['UST'] == 2)
                  usrbx.find('.usr-img').addClass("vusr");
                else
                  usrbx.find('.usr-img').removeClass("vusr");
                if (usrbx.find('.usr-img img').length == 0)
                  usrbx.find('.icon-profile').replaceWith('<img width = "100" height = "100" class="block">');
                usrbx.removeAttr('class').find('.usr-img img').attr('src', img_src + d['bunme']);
                var bio = usrbx.buildTxt(d['bio'], 0);
                bio = bio.length < 100 ? bio : bio.substr(0, 98) + '..';
                usrbx.find('.usr-info .usr-nm').text(d['FN']).siblings('.usr-bio').text(bio);
                usrbx.find('.usr-sts').remove();
                usrbx.find('.usr-prphl .box:first .num').text(d['following']).parents(".box")
                        .siblings('.box').find('.num').text(d['followers']);
                usrbx.find(".follow, .unflw").data("uname", d['bunme']).removeClass("hideElement")
                        .html(d['isFollowing'] ? '<i class="icon-ok-circle"></i> Following' : '<i class="icon-plus-strong"></i> Follow');
                if (d['isFollowing'])
                  usrbx.find(".follow").addClass("unflw");
                else
                  usrbx.find(".unflw").removeClass("unflw");

                usrbx.find('.usr-img img').findPrfPic();
                var thisTop = $this.offset().top;
                var thisLft = $this.offset().left;
                if (thisTop - $(window).scrollTop() < 120)
                {
                  thisTop = thisTop + 44;
                  thisLft -= 16;
                  usrbx.removeClass('top').addClass('btm');
                }
                else
                {
                  thisTop = thisTop - usrbx.outerHeight() - 10;
                  thisLft -= 16;
                  usrbx.removeClass('btm').addClass('top');
                }
                if ($(window).outerWidth() - thisLft < 360)
                {
                  thisTop = $this.offset().top;
                  thisLft = $this.offset().left;
                  usrbx.removeClass('top btm').addClass('left');
                  thisLft -= usrbx.outerWidth() + 10;
                  thisTop -= 10;
                }
                usrbx.css({'top': thisTop + 'px', 'left': thisLft + 'px'}).find('> section').addClass('in');
              }
              if (d["bunme"] == $("body").data("bunme"))
                usrbx.find(".follow,.unflw").addClass("hideElement");
              usrbx.find('.usr-prphl .box:first a').attr("href", $("body").data("auth") + "/" + d['bunme'] + "/following").parents(".box")
                      .next().find('a').attr("href", $("body").data("auth") + "/" + d['bunme'] + "/subscribers");
            }
          });
        }, 100);
      }
    }
    else
    {
      //  console.log(e.type);
      clearTimeout(usrTmr);
      waitTmr = setTimeout(function () {
        $('#usr-popup').addClass('hideElement').find('> section').removeClass('in');
      }, 600);
    }
  });
  /* Tabs functionality */
  $(document).on('click', '.tabs a', function (e) {
    e.preventDefault();
    var $this = $(this);
    $this.addClass('active').parent().siblings('li').find('a').removeClass('active');
    if ($this.attr('href') != '#')
    {
      $($this.attr('href')).addClass('in').siblings('.tab').removeClass('in');
      history.pushState({}, "", this.href);
    }
    else
    {
      var indx = $this.parents('.tabs').find('li').index($this.parent());
      $this.parents('.tabs').siblings('.tab:eq(' + indx + ')').addClass('in').siblings('.tab').removeClass('in');
    }
  });

  if ($('.tabs').length && location.hash != '')
    $('.tabs').find('a[href=' + location.hash + ']').trigger('click');

  /* Button group functionality */
  $(document).on('click', '.btn-grp .btn', function () {
    var $this = $(this);
    if ($this.parents('.btn-grp').hasClass('checkbox'))
      $this.toggleClass('active');
    else if ($this.parents('.btn-grp').hasClass('radio'))
      $this.addClass('active').siblings('.btn').removeClass('active');
  });


  /* End */
  /* on click functionality of user verication bubble on user image 
   var usrVftmr = null;
   $(document).on('click', '.usr-img', function (e) {
   $('#usr-popup').addClass('hideElement').find('> section').removeClass('in');
   var parentOffset = $(this).parent().offset();
   var $this = $(this);
   //or $(this).offset(); if you really just want the current element's offset
   var x = e.pageX - parentOffset.left;
   var y = e.pageY - parentOffset.top;
   if ($this.parents(".prf-pic").length)
   var hy = 128, ly = 100, hx = 128, lx = 100;
   else if ($this.parents("#auth-prf").length)
   hy = 100, ly = 75, hx = 100, lx = 75;
   else
   hy = 38, ly = 24, hx = 46, lx = 30;
   if ((x >= lx && x <= hx) && (y >= ly && y <= hy))
   {
   e.preventDefault();
   if (!$(".usr-vrf-sts").hasClass("hideElement"))
   $(".usr-vrf-sts").addClass("hideElement");
   $(".usr-vrf-sts").html("<p><i class='icon-ok vusr'></i>  Indicates a Verified Celebrity or SaddaHaq Journalist. </p>\n\
   <p><i class='icon-saddahaq'></i> Indicates a regular SaddaHaq user.</p>");
   $(".usr-vrf-sts").removeClass("hideElement");
   var trgt = $(".usr-vrf-sts");
   if (!trgt.hasClass("hideElement") && usrVftmr != null)
   clearInterval(usrVftmr);
   var thisTop = $this.offset().top;
   if (320 > (thisTop - $(window).scrollTop()) || $this.parents(".prf-pic").length)
   {
   y = e.pageY + 18;
   trgt.removeClass('top').addClass('btm');
   }
   else
   {
   y = e.pageY - trgt.outerHeight() - 18;
   trgt.removeClass('btm').addClass('top');
   }
   trgt.css({top: y, left: e.pageX - 16, position: 'absolute', "z-index": 1000});
   usrVftmr = setTimeout(function () {
   trgt.addClass("hideElement");
   }, 2500);
   }
   });
   */
  function fetchTileParams()
  {
    var tl_tp = null, ctgy = null;
    if ($('#glb-mnu').find('.active').length)
      tl_tp = $('#glb-mnu').find('.active').data('type');
    else if ($('#lft-mnu').find('a.active').length)
    {
      tl_tp = $('#lft-mnu').find('.active:not(.c)').data('type');
      ctgy = $('#lft-mnu').find('.c a.active').attr('href');
      if (ctgy != undefined)
      {
        ctgy = ctgy.split('/');
        ctgy = ($.isArray(ctgy) ? ctgy[ctgy.length - 1] : 'All');
        tl_tp = '';
      }
    }
    return {"cgry": ctgy != null ? ctgy : 'All', "tl_tp": tl_tp != undefined ? tl_tp : 'AR'};
  }

  $('.container-fluid').on('click', '.actn-btn:not(.del-drft):not(.rdltr)', function () {
    var $this = $(this);
    var trgt = $this.siblings('.tl-dtls').find('.actn-bx'), isRltdBx = 0;
    if ($this.parents('#rltd-lst').length)
    {
      trgt = $this.siblings('.actn-bx');
      isRltdBx = 1;
    }
    if ($this.hasClass('open'))
    {
      trgt.removeClass('in').addClass('no-hgt');
      $this.removeClass('open').find('i').removeClass(isRltdBx ? 'icon-remove-circle' : 'icon-remove')
              .addClass(isRltdBx ? 'icon-chevron-down' : 'icon-more');
      if (isRltdBx)
        trgt.parent().removeClass('open');
    }
    else
    {
      loadInvScript();
      $this.addClass('open').find('i').removeClass(isRltdBx ? 'icon-chevron-down' : 'icon-more')
              .addClass(isRltdBx ? 'icon-remove-circle' : 'icon-remove');
      trgt.removeClass('no-hgt').addClass('in');
      if (trgt.find('.loading').length)
      {
        var curUrl = window.location.pathname;
        curUrl = curUrl.split("/");
        var flgs = $this.data('flgs');
        flgs['id'] = curUrl[1] == "moderator" ? "t-a-b-mod" : "t-a-b";
        flgs['usr'] = $this.getLoggedInUsr();
        flgs['auth'] = $this.getShIntr();
        flgs['e_id'] = $this.parents('.nws-tl, .evt, .pet').attr('id');
        flgs['ref'] = curUrl;
        flgs['sid'] = curUrl[1] == 'spaces' ? ($('#admin, #cvr-img').length ? $('#admin, #cvr-img').data('info').id : $this.parents('.nws-tl').attr('id')) : ''; // Space id
        flgs['e_etm'] = $this.siblings('.tl-dtls').find(".evt-dtls").data('etm'); // Event end time
        flgs['isMod'] = $('body').data('isMod') || ($('#cvr-img').data('usr') != undefined ? ($('#cvr-img').data('usr')['unme'] == flgs['usr']) : 0);
        $.post(api + '/gtf', flgs, function (d) {
          d = JSON.parse(d);
          if (isRltdBx)
            trgt.parents('li').addClass('open');
          trgt.html(d['frm']);
        });
      }
      else if (isRltdBx)
        trgt.parents('li').addClass('open');
    }
  });

  $(document).on('click', '.actn-bx .tabs a', function () {
    var trgt = $(this).parent();
    $(this).addClass("active");
    trgt.siblings('li').find('.active').removeClass('active');
    var trgtIndx = trgt.parent().find('li').index(trgt);
    trgt.parent().siblings('.actn-area:eq(' + trgtIndx + ')').removeClass('hideElement').addClass("in").siblings('.actn-area').addClass('hideElement');
  });

  $('.container-fluid').on('click', '.nws-tl .tgl-swtch input[type="checkbox"], .evt .tgl-swtch input[type="checkbox"]', function () {
    var $this = $(this);
    if ($this.chkVrfd()) {
      var par = $(this).parents(".nws-tl, .evt");
      $.post(api + '/ea', {
        'id': par.attr("id"),
        'tp': $this.parent().hasClass('atnd') ? 'No' : 'Yes',
        'toggle': 'Yes',
        'auth': $this.getShIntr(),
        'usr': $this.getLoggedInUsr()
      }, function (d) {
        var t = JSON.parse(d);
        if (t.success == 1) {
          $this.parent().toggleClass('atnd');
        }
        else
          $('#sts-msg').showStatus(t.msg, 'err');
      });
    }
  });
//  /* Default petition sign button functionality */
//  $(document).on('click', '.P .actn-btn', function() { //.E .actn-btn
//    var $this = $(this);
//    var tp = ($this.parents(".nws-tl").hasClass("P")) ? {'icon':'icon-petition','id':'sgn-frm'} : {'icon':'icon-signin','id':'evt-frm'};
//    var trgt = $this.siblings('.tl-dtls').find('.actn-bx');
//    if ($this.hasClass('open'))
//    {
//      trgt.removeClass('in').addClass('no-hgt');
//      $this.removeClass('open').find('i').removeClass('icon-remove').addClass(tp.icon);
//    }
//    else
//    {
//      if (trgt.find('form').length)
//      {
//        trgt.removeClass("no-hgt").addClass("in");
//        $this.addClass('open').find('i').addClass('icon-remove').removeClass(tp.icon);
//      }
//      else
//      {
//        $.ajax({
//          url: api + '/gtf',
//          type: 'post',
//          data: {
//            "id": tp.id,
//            "usr": $this.getLoggedInUsr()
//          },
//          async: true,
//          success: function(d) {
//            d = JSON.parse(d);
//            $this.addClass('open').find('i').addClass('icon-remove').removeClass(tp.icon);
//            trgt.html(d['frm']).removeClass("no-hgt").addClass("in");
//          }
//        });
//      }
//    }
//  });

  /* Sign Petition on tile */
  $(document).on('submit', '.P .sgn-ptn-frm, .pet .sgn-ptn-frm', function () {
    var $this = $(this);
    $this.find('input[type="submit"]').attr('disabled', 'disabled');
    var elem = $this.find('input[type="text"]');
    var isErr = false;
    var usr = $this.getLoggedInUsr();
    if (!usr)
    {
      $this.find('input[type="text"]').removeClass('error');
      if ($this.find('.ptn-sgn-nme').val() == '')
      {
        $this.find('.err-msg').html('We need your name to show your sign to others');
        $this.find('.ptn-sgn-nme').addClass('error');
        isErr = true;
      }
      else if ($this.find('.ptn-sgn-eml').val() == '' ||
              !(/^[a-z0-9_\+-]+(\.[a-z0-9_\+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,4})$/).test($this.find('.ptn-sgn-eml').val()))
      {
        $this.find('.err-msg').html('We need your valid email to keep you informed');
        $this.find('.ptn-sgn-eml').addClass('error');
        isErr = true;
      }
      else
        $this.find('.err-msg').html('');
    }
    if (isErr)
    {
      $this.find('input[type="submit"]').removeAttr('disabled');
      return false;
    }
    else
    {
      elem.removeClass('error');
      var data = {
        "msg": $this.trimText($this.find('textarea').val()),
        "id": $this.parents('.P, .pet').attr('id'),
        "auth": $this.getShIntr(),
        "usr": usr
      };
      if (!usr)
      {
        data['nme'] = $this.find('.ptn-sgn-nme').val();
        data['eml'] = $this.find('.ptn-sgn-eml').val();
      }
      var flag = 0;
      $.ajax({
        url: $('body').data('api') + '/sgn',
        data: data,
        type: 'post',
        success: function (d) {
          var t = JSON.parse(d);
          if (t.success == 1) {
            if (t.msg.length == 128) { //Set session if non-loggedin user signs petition
              window.location = $('body').data('auth') + '/ssst/' + t.msg + '?return=' + urlencode(document.URL);
            }
            else
            {
              var ptn = $this.parents('.P,.pet');
              var uname = ptn.find('.auth-bx > a').get(0).childNodes[1].data;
              uname = uname ? uname : ptn.find('.auth-bx > a').get(0).childNodes[2].data;
              $('#sts-msg').showStatus(uname + ' ' + t.msg, 'scs');
              ptn.find('.actn-btn').addClass('markd');
              ptn.find('.actn-bx .emty-dft-msg').text("Your Signature is saved successfully.").siblings('form').addClass('hideElement');
            }
          }
          else {
            $('#sts-msg').showStatus(t.msg, 'err');
          }
        }
      });
      if (flag)
        return true;
    }
    return false;
  });

  //on click invite firends in event tile  
//  $(document).on("click",".tl-dtls .evnt-invt",function(){
//    var str = '<div id="inv-frm"><input type="text" name="sh-inv-txt" id="sh-inv-txt" class="input-large " placeholder="Add people from saddahaq"/></div>';
//    $(this).parents(".tl-dtls").html(str);
//  });

  //on click user follow in user pop-up
  $("#usr-popup, .right-comments").on("click", ".follow", function () {
    var $this = $(this);
//    if ($this.chkVrfd())
//    {
    $.post(api + '/uf', {
      'usr2': $this.data("uname"),
      'auth': $this.getShIntr(),
      'usr': $this.getLoggedInUsr()
    },
    function (d) {
      d = JSON.parse(d);
      if (d.success == 1) {
        if ($this.hasClass('unflw'))
          $this.removeClass("unflw").html('<i class="icon-plus-strong"></i> Follow');
        else
          $this.addClass("unflw").html('<i class="icon-ok-circle"></i> Following');
      }
    });
//    }
  });

  $("#usr-popup, .right-comments").on("hover", ".unflw", function () {
    var $this = $(this);
    if ($this.text().trim() == "Following") {
      $this.text(" Unfollow");
    }
  });

  //clicked on personalised by non-logged users
  $(document).on('click', "#lft-mnu a", function (e) {
    if ($(this).data("type") == "P" && !($(this).chkVrfd()))
      e.preventDefault();
  });

  /* Invitation module */
  $('#lft-mnu').on('click', '.invt', function () {
    var $this = $(this);
    loadInvScript();
    var dt = $('.edtr').data('desc');
    $.post(api + '/gtf', {"id": "inv-frm", "pgid": (dt != undefined ? dt['id'] : $this.attr('id'))}, function (d) {
      d = JSON.parse(d);
      $('#pop-prw > section').html(d['frm']).showPopup(1);
    });
  });

  function loadInvScript()
  {
    if (!invLoaded)
    {
      var tag = document.createElement('script');
      if ($('#user-nav').data('isLive'))
        tag.src = 'https://saddahaq.blob.core.windows.net/' + $('body').data('vrsn') + '/gdjinvite.js';
      else
        tag.src = '/public/global/default/js/invite.js?v=' + Math.floor((Math.random() * 100) + 1);
      tag.async = true;
      document.getElementsByTagName('body')[0].appendChild(tag);
      invLoaded = 1;
    }
  }

  $("#usr-pg").on("click", ".tlmod-actn", function () {
    var $this = $(this);
    var url;
    var dt = {
      'id': $this.parents(".nws-tl").attr("id"),
      'tp': $this.parents(".nws-tl").data("tp")
    };
    if ($this.hasClass("dcm"))
      url = "dcm";
    else if ($this.hasClass("ftr"))
      url = "ftr";
    else if ($this.hasClass("aprv")) {
      url = "aprv";
      dt.sndEml = 1;
    }
    else if ($this.hasClass("hdln")) {
      url = "hdlne";
    }

    $.ajax({
      url: /ajax/ + url,
      type: 'post',
      data: dt,
      success: function (d) {
        d = JSON.parse(d);
        if (d.success == 1) {
          $('#sts-msg').showStatus(d.msg, 'scs');
          if ($this.hasClass("ftr") || $this.hasClass("aprv") || $this.hasClass("hdln")) {
            setTimeout(function () {
              location.reload();
            }, 2500);
          }
          else if ($this.find("span").text() == "Decommission")
            $this.find("span").text("Revert to Active state");
          else
            $this.find("span").text("Decommission");
        }
        else {
          $('#sts-msg').showStatus(d.msg, 'err');
        }
      }
    });
  });

  function closeEdit(par)
  {
    par.slideUp(300, function () {
      par.siblings('.cmt-orgnl').slideDown(300); //.find('.cmt').html(par.find('.edt_cmt').html())
      par.siblings('.cmt-bns').slideDown(300);
      par.siblings('.response').removeClass('no-unfold').siblings('.pst-stng').removeClass('hideElement');
      par.remove();
    });
  }

  /* Show and hide loading bar based on ajax call start/end */
  $(document).ajaxStart(function () {
    $('.ajx-ldng').addClass('shw');
  });

  $(document).ajaxStop(function () {
    $('.ajx-ldng').removeClass('shw');
  });
});