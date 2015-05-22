$(document).ready(function () {
  $('#usr-pg').css('height', $(window).height() + 'px');
  var api = $("body").data("api");
  var usr = $('#cvr-img').data('usr');
  var url_path = window.location.pathname;

  //if user doesn't has prof pic, "remove prof pic" option is removed.
  if ($(".prf-pic").find("img").attr("src") == "/public/images/user.png") {
    $("#rmv-thmb").addClass("hideElement");
    $("#upld-thmb").addClass("fill");
  }


  // Set Active Tab and activate context tab
  if (url_path.search('settings') != -1)
    $('#stream').setActiveTab();
  else
    $('#posts').setActiveTab();

  var pg_flw = 0;
  var disblFlwInfScrl = false;
  $(window).scroll(function (e) {
    var target = e.currentTarget,
            scrollTop = target.scrollTop || window.pageYOffset,
            scrollHeight = target.scrollHeight || document.body.scrollHeight;
    if (scrollHeight - scrollTop === $(target).innerHeight()) {
      var tp = '';
      if ($("body").data("usr-pg") == "Following")
        tp = 'f';
      else if ($("body").data("usr-pg") == "Subscribers")
        tp = 's';
      if (!disblFlwInfScrl && tp.length) {
        $.ajax(api + '/ufl', {
          data: {
            'pg': ++pg_flw,
            'tp': tp,
            'usr2': usr['unme'],
            'auth': $(this).getShIntr(),
            'usr': $(this).getLoggedInUsr()
          },
          dataType: 'json',
          async: true,
          type: 'post',
          success: function (d) {
            if (d.success)
            {
              var prv = $("#flw-lst").find(".flw").length;
              $.each(d['msg'], function (i, d) {
                var str = "";
                if ($('#user-nav').data('isLive'))
                  var img_src = "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_";
                else
                  img_src = $("body").data("auth") + "/public/Multimedia/P_Pic_";
                str = '<li class="pull-left flw box">' +
                        '<section class="span16">' +
                        '<a href="/' + d['Users'] + '" class="span16">' +
                        '<div class="span4"><div class="usr-img">' + '<img src="' + img_src +
                        '" class="flw-img"/>' + '</div></div>' +
                        '<div class="usr-info span12">' +
                        '<p class="usr-nm">' + d['User_Full_Name'] +
                        ($("body").data("bunme") == d['Users'] ? ' (You)' : '') +
                        '</p><p class="usr-bio">' +
                        (d['Bio'] != null ? (d['Bio'].length > 120 ? d['Bio'].substr(0, 117) + '...' :
                                d['Bio']) : '') +
                        '</p>' +
                        '</div>' +
                        '</a>' +
                        '</section>' +
                        '<div class="clearfix"></div>' +
                        '<div class="usr-prphl span16" data-usr="' + d['Users'] + '">' +
                        '<p class="box">' +
                        '<a href="' + d['Users'] + '/following"><span class="num">' + d['Num_Following'] +
                        '</span> Following</a>' +
                        '</p>' +
                        '<p class="box">' +
                        '<a href="' + d['Users'] + '/subscribers"><span class="num">' + d['Num_Subscribers'] +
                        '</span> Follwers</a>' +
                        '</p>' +
                        '<p class="box">' +
                        '<a href="#" class="flw-btn' + (d['is_Following'] ? ' btn-success' : '') +
                        ($("body").data("bunme") == d['Users'] ? ' transparent' : '') + '" data-flw="' +
                        d['is_Following'] + '">' +
                        (d['is_Following'] ? 'Following' : 'Follow') + '</a>' +
                        '</p>' +
                        '</div>' +
                        '</li>';
                $("#flw-lst").append(str);
                $("#flw-lst").find(".flw:last").find(".usr-img img").findPrfPic(0);
                prv++;
              });
            }
            else
              disblFlwInfScrl = true;
          }
        });
      }
    }
  });

  /* Upload/change a cover image */
  $('#cvr-img').on('change', '.image-file', function () {
    var $this = $(this);
    if ($this.getLoggedInUsr())
    {
      var alwdExt = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      var img = this.files[0];
      var flag = 1;
      var par = $this.parents('#cvr-img');
      par.removeClass('emty');
      if ($.inArray(img['type'], alwdExt) == -1)
      {
        flag = 0;
        $('#sts-msg').showStatus("Bummer! Looks like the file you selected is not a valid image", 'err');
        return false;
      }
      if (img['size'] < 25000)
      {
        flag = 0;
        $('#sts-msg').showStatus("Try to upload an image of atleast 250kb to have a clear cover image", 'err');
        return false;
      }
      if (flag)
      {
        if (!!window.FormData && !!window.ProgressEvent)
        {
          $this.on('ajax', function () {
            var $this = $(this);
            var fd = new FormData();
            fd.append('file', img);
            fd.append('auth', $this.getShIntr());
            fd.append('usr', $this.getLoggedInUsr());
            $.ajax({
              url: api + '/uimg',
              type: 'POST',
              data: fd,
              contentType: false,
              processData: false,
              xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload)
                {
                  par.find('progress').removeClass('hideElement');
                  xhr.upload.addEventListener('progress', function (evt) {
                    if (evt.lengthComputable) {
                      var percent_done = parseInt(100 * evt.loaded / evt.total);
                      par.find('progress').attr('value', Math.ceil(percent_done));
                    }
                  }, false);
                }
                return xhr;
              },
              success: function (data) {
                $this.val('');
                data = JSON.parse(data);
                if (data.success == 1)
                {
                  var cvrbg = $('.cvr-bg');
                  cvrbg.parents('#cvr-img').removeClass('edit');
                  cvrbg.prepend('<img src="' + data.msg + '" />')
                          .find('.he-bg').removeClass('hideElement');
                  par.data('img', {'src': data.msg, 'ypos': 0}).find('progress')
                          .fadeOut().siblings('.cvr-stngs').addClass('in');

                  $('.cvr-bg').on('mousedown', '.he-bg', function (e) {
                    var trgt = $(this).siblings('img');
                    var strtY = e.clientY, imgY = parseInt(trgt.css('top'));
                    $(this).on('mousemove', function (e) {
                      var mvVal = imgY + (e.clientY - strtY);
                      if (mvVal <= 0 && ($(this).outerHeight() - trgt.height()) < mvVal)
                      {
                        trgt.css('top', mvVal + 'px');
                        var imgDt = trgt.parents('#cvr-img').data('img');
                        imgDt['ypos'] = mvVal;
                        trgt.parents('#cvr-img').data('img', imgDt);
                      }
                      else
                        return false;
                    });
                  });
                }
                else
                {
                  $('#sts-msg').showStatus('Something went wrong and we have already started to look into it. Please try again', 'err');
                }
              }
            });

            //inorder to avoid multiple ajax calls on $this, when image changes done multiple times without refreshing 
            $this.off("ajax");

          }).trigger('ajax');
        }
      }
    }
    else
      $('#sts-msg').showStatus("Ooops!! Looks like you don't have enough privileges to perform this action.", 'err');
    return false;
  });


  $('.cvr-bg').on('mouseup', '.he-bg', function () {
    $(this).off('mousemove');
  });
  /*
   * Remove Cover image and show upload button
   */
  $('#cvr-img').on('click', '.cvr-stngs .updt', function () {
    $(this).parents('#cvr-img').addClass('edit').removeData('img').find('.cvr-bg >img').remove();
    $(this).siblings().removeClass('hideElement');
  });
  /* Save Cover image */
  $('#cvr-img').on('click', '.cvr-stngs .save', function () {
    var $this = $(this).parents('#cvr-img');
    if ($this.data('img'))
    {
      var imgDt = $this.data('img');
      imgDt['auth'] = $this.getShIntr(), imgDt['usr'] = $this.getLoggedInUsr();
      $.post(api + '/cpb', imgDt, function (d) {
        d = JSON.parse(d);
        $('#sts-msg').showStatus(d.msg, (d.success == 1 ? 'scs' : 'err'));
        if (d.success == 1) {
          $("#cvr-img").removeClass('edit').find('.cvr-bg').off('mouseup mousedown');
        }
      });
    }
    else {
      $.post(api + '/cpb', {"src": '', 'auth': $this.getShIntr(), 'usr': $this.getLoggedInUsr(), 'tp': 'r'}, function (d) {
        d = JSON.parse(d);
        $('#sts-msg').showStatus(d.msg, (d.success == 1 ? 'scs' : 'err'));
        if (d.success == 1) {
          $("#cvr-img").removeClass('edit').find(".cvr-bg").off('mouseup mousedown');
        }
      });
    }
  });

  /*
   * Load articles published by user
   */
  $('#navigation-bar').removeClass('sml').find('#c-b').addClass('in');
  url_path = url_path.toLowerCase();
  url_path = url_path.split("/");
  if (url_path.indexOf("settings") < 0 && url_path.indexOf("following") < 0 && url_path.indexOf("subscribers") < 0) {
    $('#usr-pg').loadNews({
      'usr2': usr['unme'],
      'cgry': 'articles',
      'tl_tp': 'UP'
    });
  }
  /*
   else if($('#usr-art').length)
   {
   $('#usr-pg').loadNews({'usr':lc[3], 'cgry' : 'Articles'});
   }
   */
  /*
   * Load additional articles when the user scrolls down the page
   */
  $(window).scroll(function () {
    if ($('body').height() <= ($(window).height() + $(window).scrollTop()) && $('#usr-pg').length)
    {
      $('#usr-pg').addNews({
        'cgry': 'Articles',
        'usr2': usr['unme'],
        'tl_tp': 'UP'
      });
    }
  });
  //For #Tag profile page
  $('#topic-follow').click(function () {

    var type = $.trim($(this).text());

    if (type == 'Follow') {
      $.post('/QuickPost/Index/follow', {
        "tag": $('h1').text()
      },
      function (status) {
        if (status) {
          $('#topic-follow').html("Unfollow");
          var subscribers = parseInt($('#subscribers-count').text()) + 1;
          $('#subscribers-count').html(subscribers);
        }
      });
    }
    else {//UnFollow
      $.post('/QuickPost/Index/unfollow', {
        "tag": $('h1').text()
      },
      function (status) {
        if (status) {
          $('#topic-follow').html("Follow");
          var subscribers = parseInt($('#subscribers-count').text()) - 1;
          $('#subscribers-count').html(subscribers);
        }
      });
    }
  });

  //For user profile page
  $('#profile-user').click(function () {
    if ($(this).chkVrfd()) {
      var fnlTxt = ($.trim($(this).text()) == 'Follow') ? 'Following' : 'Follow';
      $.post(api + '/uf', {
        'usr2': usr['unme'],
        'auth': $(this).getShIntr(),
        'usr': $(this).getLoggedInUsr()
      },
      function (d) {
        var t = JSON.parse(d);
        if (t.success == 1) {
          $('#profile-user').text(fnlTxt);
        }
      });
    }
  });
  //Change the text of follow button on hover 
  $('#profile-user').on('hover', function (e) {
    if (e.type == 'mouseenter')
    {
      if ($.trim($(this).text()) == 'Following')
        $(this).text('Unfollow');
    }
    else
    {
      if ($.trim($(this).text()) == 'Unfollow')
        $(this).text('Following');
    }
  });
  //Change Follow button content on hover
  $('body').on('hover', '.flw-btn', function (e) {
    if (this.dataset.flw != '' && this.dataset.flw != 0)
    {
      if (e.type == 'mouseenter')
        $(this).text('Unfollow').removeClass('btn-success');
      else
        $(this).text('Following').addClass('btn-success');
    }
  });
  //For User profile page, from the list of following and subscribers
  $('body').on('click', '.flw-btn', function (e) {
    var $this = $(this);
    if ($this.chkVrfd()) {
      $.post(api + '/uf', {
        'usr2': $this.parents('.flw').data('usr'),
        'auth': $this.getShIntr(),
        'usr': $this.getLoggedInUsr()
      },
      function (d) {
        d = JSON.parse(d);
        if (d.success == 1) {
          $this.hasClass('btn-success') ? $this.removeClass('btn-success').text('Follow') : $this.addClass('btn-success').text('Following');
        }
      });
    }
  });

  $('.userprofile-topic-follow').click(function () {
    var value = $(this).attr('value');
    var parts = value.split('/');//value is username/true or false .. true means user is already following
    //false is user not following
    if (parts[1]) {
      var c = confirm('Are you sure, want to unfollow the topic?');
    }
    else {
      var c = confirm('Are you sure, want to follow the topic?');
    }

    if (c == true)
    {
      var topic = parts[0];
      if (parts[1]) {
        $.post('/QuickPost/Index/unfollow', {
          "tag": topic
        }, function (d) {
          if (d) {
            location.reload(true);
          }
        });
      }
      else {
        $.post('/QuickPost/Index/follow', {
          "tag": topic
        }, function (d) {
          if (d) {
            location.reload(true);
          }
        });
      }
    }
    else
      return false;
  });

  /* Script from settings.js */
  $('#o-p,#n-p,#c-p').on('keydown', function (e) {
    var pwd = $(this).val();
    var alrt = $(this).parent().siblings('.err-msg');
    if ($(this).hasClass('error'))
    {
      $(this).removeClass('error');
      alrt.text('');
    }
  });
  $('#chng-pwd').submit(function () {
    var flag = 0;
    var reg = /.{6,15}/;
    var alrt = $(this).find('.err-msg');
    $(this).find('input').each(function () {
      if ($(this).val() == '')
      {
        alrt.text('None of the fields can be empty');
        $(this).addClass('error');
        flag = 0;
        return false;
      }
      else if (!reg.test($(this).val()) && $(this).attr('id') != 'o-p')
      {
        alrt.text('Set a password of minimum 6 characters and a maximum of 15 characters');
        $(this).addClass('error');
        flag = 0;
        return false;
      }
      else
      {
        flag = 1;
        $(this).removeClass('error');
        alrt.text('');
      }
    });
    if (flag)
    {
      if ($('#o-p').val() == $('#n-p').val())
      {
        $('#o-p,#n-p').addClass('error');
        alrt.text('Old and new password cannot be same');
        flag = 0;
        return false;
      }
      else
      {
        $('#o-p,#n-p').removeClass('error');
        flag = 1;
      }
      if ($('#n-p').val() != $('#c-p').val())
      {
        $('#n-p,#c-p').addClass('error');
        alrt.text('confirm password does not match with the new password');
        flag = 0;
        return false;
      }
      else
      {
        $('#n-p,#c-p').removeClass('error');
        $.post('/ajax/chngepwd', {
          'op': $('#o-p').val(),
          'np': $('#n-p').val()
        }, function (status) {
          if (status != 1)
            alrt.text('Oops! Looks like your current password is incorrect');
          else
            $('#sts-msg').showStatus('Password changed Successfully', 'scs');
        });
      }
    }
    $(this).resetForm();
    return false;
  });
  /* Advance setting code */
  $("#adv-stngs #u-n").on("change", function () {
    $("#adv-stngs").data("chngd", "un");
  });
  $("#adv-stngs .chng").on("click", function () {
    var $this = $(this);

    if ($this.attr("id") === "chng-unme") {

      var reg = /^[A-z0-9.]{5,20}$/;
      if (!reg.test($("#adv-stngs #u-n").val())) {
        $("#adv-stngs .err-msg").text(" Username can only contain alphabets, numerals and '.' and of must be of length 6-20.");
        return;
      }
      else if ($("#adv-stngs #u-n").val().charAt(0) == '.') {
        $("#adv-stngs .err-msg").text("Username should not start with dot");
      }
    }
    if ($this.attr("id") == "sus-acc")
      $("#adv-stngs").data("chngd", "susp");
    if ($("#adv-stngs").data("chngd") != undefined && $("#adv-stngs").data("chngd") != "") {
      $.ajax({
        url: api + '/gtf',
        type: 'post',
        data: {
          'id': 'pwCnf',
          'pwdExst': $("#adv-stngs").data("pw")
        },
        success: function (data) {
          data = JSON.parse(data);
          $('#pop-prw').find('section').html(data.frm).showPopup(1);
//        $('#pop-prw').find(".dsc").text("Warning! You cannot access your data if you decide to suspend the account, so it is recommended to download your data before you suspend.");
//        $('#pop-prw').find(".save").html("Suspend");
        }
      });
    }
    //$("#pw-cnf").find("#cnf-msg").text("Note: You can change your username only thrice.").removeClass("err-msg");
  });
  $("#pop-prw").on("submit", "#cnfrm-pwd-frm", function (e) {
    e.preventDefault();
    var dt = {
      'pw': $("#pop-prw").find("#pw-cnf").val(),
      'auth': $(this).getShIntr(),
      'usr': $(this).getLoggedInUsr()
    };

    if ((dt.pw == "" || dt.pw === undefined) && $("#adv-stngs").data("pw") == '1') {
      $("#pop-prw .err-msg").text("Password is mandatory.");
      return;
    }
    if ($("#adv-stngs").data("chngd") == "un") {
      var pth = "cun";
      dt.un = $("#adv-stngs #u-n").val();
    }
    else if ($("#adv-stngs").data("chngd") == "susp")
      pth = "delAcc";
    if (pth !== undefined) {
      $.ajax({
        url: api + '/' + pth,
        type: "post",
        data: dt,
        success: function (res) {
          res = JSON.parse(res);
          if (res.success) {
            $('#pop-prw').removeClass('view');
            $('#sts-msg').showStatus('Username changed successfully. Please wait while the changes are reflected across the website', 'scs');
            setTimeout(function () {
              window.location = $('body').data('auth') + '/ssst/' + res.msg + '?return=' + urlencode(document.URL)
            }, 3000);
          }
          else {
            $('#pop-prw').find('.err-msg').text(res.msg);
          }
        }
      });
    }
    return false;
  });

  function urlencode(str) {
    str = (str + '').toString();
    return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+');
  }

  $("#pop-prw").on("click", "#pw-reset", function () {
    $("#adv-stngs").data("chngd", "");
    $("#adv-stngs .err-msg").text("");
    $("#adv-stngs #u-n").val($("#adv-stngs #u-n").data("un"));
    $("#pop-prw").removeClass("view");
    $(".lightbox").removeClass("err");
  });
  /*End of Advance setting code */
  $('.reset').click(function () {
    $(this).parent('form').resetForm();
    if ($(this).parents('form').attr('id') == "chng-ntf") {
      $(this).closest('form').get(0).reset();
      // resets the form before continuing the function
      $(this).parents('form').find("input:checked").siblings("select").prop("disabled", false);
    }
  });

  /*mobile verification code */
  $("#m-n").on("change", function () {
    ;
    $("#mob-div").find(".vfy-sts").addClass("hideElement");
  });

  $("#m-n").attr('num', $("#m-n").val());
  var sndvrfCount = 0;
  var mbVrfd = $("#mob-div").attr('status'); // mobile vfy_status
  if ($("#m-n").length && $("#m-n").val().length > 0) {
    if (mbVrfd == 1)
      $("#m-n").siblings(".vfy-sts.scs").removeClass("hideElement");
    else
      $("#m-n").siblings(".vfy-sts.err-msg").removeClass("hideElement");
  }

  // Show popup for mobile verification
  $("#mob-div").on("click", ".vfy-sts.err-msg", function () {
    //this ajax call sends verification code to the given phone num
    var popup = $('#pop-prw');
    $.ajax({
      url: api + '/nmb',
      type: 'post',
      data: {
        "auth": $().getShIntr(),
        "num": $("#m-n").val(),
        "usr": $().getLoggedInUsr()
      },
      success: function (t) {
        if (t)
        {
          t = JSON.parse(t);
          if (t.success == 1) {
            $.ajax({
              url: api + '/gtf',
              type: 'post',
              data: {
                "id": "vfy"
              },
              success: function (d) {
                d = JSON.parse(d);
                popup.find('> section').html(d['frm']).showPopup(0);
                popup.find('#cntct-form').removeClass('hideElement').find('.control-group:first').addClass('hideElement');
//                popup.find('.err-msg').html('<p>You are required to verify your contact number.</p>');
                popup.find('#ph-num-save').removeAttr('disabled').attr('value', 'Verify').data('type', -4);
                $('.lightbox').fadeIn(400, function () {
                  $('#pop-prw').addClass('in');
                });
              }
            });
          }
          else {
            $('#sts-msg').showStatus(t.msg, "err");
          }
        }
        else {
          $('#sts-msg').showStatus("Bummer, Something is wrong here and we are looking into this. Please try later", "err");
        }
      }
    });
  });
  $("#pop-prw").on('click', '.snd-vrf.num', function () {
    if (sndvrfCount < 1) {
      var p = $().getShIntr();
      $.ajax({
        url: api + '/rmcd',
        type: 'post',
        data: {
          "auth": $().getShIntr(),
          "usr": $().getLoggedInUsr()
        },
        success: function (data) {
          sndvrfCount++;
          data = JSON.parse(data);
          if (data['success'] == 1) {
            $('#pop-prw').find('.err-msg').text(data['msg']);
          }
          else {
            $('#sts-msg').showStatus(data['msg'], function () {
              closePopPrw();
            });
          }
        }
      });
    }
    else {
      $('#pop-prw').removeClass('in');
      $('#sts-msg').showStatus("If you didn't received any verfication code, there might be some network issue. Pleae try after some time.", function () {
        closePopPrw();
      });
    }
  });

  $("#pop-prw").on('click', '#ph-num-save', function () {
    $.ajax({
      url: api + '/vnmb',
      type: 'post',
      data: {
        "vrf_cd": $("#vrfy-num").val(),
        "auth": $().getShIntr(),
        "usr": $().getLoggedInUsr()
      },
      success: function (data) {
        data = JSON.parse(data);
        if (data['success'] == 1) {
          mbVrfd = 1;//verification status should be updated here 
          $('#pop-prw').removeClass('in');
          $('#sts-msg').showStatus('Successfully Verified', 'scs', function () {
            closePopPrw();
            $("#mob-div").find(".vfy-sts.err-msg").addClass("hideElement");
            $("#m-n").attr("num", $("#m-n").val());
            $("#m-n").siblings(".vfy-sts.scs").removeClass("hideElement");
          });
        }
        else {
          $('#pop-prw').find('.err-msg').text(data['msg']);
        }
      }
    });
    return false;
  });
  /* End of Mobile verification */

  /* Email verification code */
  $("#em-div").on("click", ".vfy-sts.err-msg", function () {
    $.ajax({
      url: api + '/gtf',
      type: 'post',
      data: {
        "id": "e-vfy"
      },
      success: function (d) {
        d = JSON.parse(d);
        $('#pop-prw > section').html(d['frm']).showPopup(0);
      }
    });
  });

  $("#pop-prw").on('click', '.snd-vrf.eml', function () {
    $.ajax({
      url: api + '/rve',
      type: 'post',
      data: {
        "auth": $().getShIntr(),
        "usr": $().getLoggedInUsr()
      },
      success: function (data) {
        data = JSON.parse(data);
        $('#sts-msg').showStatus(data['msg'], (data.success ? "scs" : "err"), function () {
          closePopPrw();
        });
      }
    });
  });
  /* End of email verification code */
  /* show edit option to change profile picture */

  /* Functionality related to user bio */
  $('#usr-bio').on('click', function () {
    if ($(this).attr('placeholder') == $.trim($(this).text()))
      focusUserBioBx();
  });

  $('#usr-bio').on('blur', function () {
    if ($(this).text() == '')
      $(this).addClass('dft-st').removeAttr('contenteditable').text($(this).attr('placeholder'))
              .siblings('a:not(:first)').addClass('hideElement');
  });
  $('#usr-bio').on('paste', function () {
    var $this = $(this);
    var html = [];
    html.push($.trim($this.html()));
    setTimeout(function () {
      var tmp = $('<div>').html($this.html());
      if (tmp.find('span, div, p').length)
      {
        tmp.find('span, div, p').each(function () {
          html.push($.trim($(this).html()));
        });
        $this.html($this.checkUrl(html.join(" ")));
      }
      else
        $this.html($this.checkUrl($this.text()));
      $this.lmtTxt();
    }, 20);
  });
  $('#usr-bio').on('keydown', function (e) {
    var $this = $(this);
    if (e.which == 50)
    {
      if ($this.hasClass('ui-autocomplete-input'))
        $this.autocomplete('destroy');
      $this.getUsrSgstns();
    }
    else if (e.which == 51 && e.shiftKey)
    {
      if ($this.hasClass('ui-autocomplete-input'))
        $this.autocomplete('destroy');
      $this.getHstgSgstns();
    }
    $this.lmtTxt();
  });
  $('.btn').on('mousedown', function () {
    var trgt = $(this).siblings('#usr-bio');
    if ($(this).attr('id') == 'bio-sve')
    {
      $.post('/ajax/upb', {'bio': trgt.trimText(trgt.html().substr(0, 160))}, function (d) {
        if (d == 1)
        {
          if ($.trim(trgt.html()) == trgt.attr('placeholder'))
            $('#sts-msg').showStatus('Bio updated successfully, but our users do love to know about you. Add some description about yourself', 'scs');
          else
            $('#sts-msg').showStatus('Bio updated successfully!', 'scs');
        }
        else
          $('#sts-msg').showStatus('Oops! Something went wrong. Please try again', 'err');
      });
    }
    else {
      if ($(this).data('bio') == 0)
        trgt.text(trgt.attr('placeholder'));
      else
        trgt.html(trgt.buildTxt($(this).data('bio'), 1));
    }
    trgt.removeAttr('contenteditable').siblings('a:not(:first)').addClass('hideElement');
    trgt.siblings('#edt-bio').removeClass('hideElement');
  });

  $('#edt-bio').on('click', function () {
    $(this).addClass('hideElement');
    focusUserBioBx();
  });

  function focusUserBioBx()
  {
    var $this = $('#usr-bio');
    $this.attr('contenteditable', 'true');
    if ($.trim($this.text()) == $this.attr('placeholder'))
      $this.text('').removeClass('dft-st');
    setTimeout(function () {
      $this.focus();
    }, 0); // setTimeout is used as a fix for a bug in firefox.
    $this.siblings('a:not(:first)').removeClass('hideElement');
  }
  /* Show lightbox on clicking the edit profile pic button */
  $('#upld-thmb').on('click', function () {
    $.post($('body').data('api') + '/gtf', {"id": "prfpic"}, function (d) {
      d = JSON.parse(d);
      $('#pop-prw > section').html(d['frm']).showPopup(1);
    });
  });

  /* Mobile Number - Validation */
  $("#m-n").blur(function (e) {
    var n = $(this).val();
    if ((isNaN(n) || !(/^\d{10}$/).test(n)) && n != '') {
      $(this).parents('#chng-prf').find('p.err-msg').text('Looks like ' + $(this).val() + ' is an invalid mobile number');
      $(this).addClass('error');
    }
    else
    {
      $(this).parents('#chng-prf').find('p.err-msg').text('');
      $(this).removeClass('error');
      if ($("#m-n").val() != $("#m-n").attr("num")) {
        $("#m-n").siblings(".vfy-sts.err-msg").removeClass("hideElement");
      }
    }
  });

  /*First Name, Last Name - Validation */

  $("#f-n, #l-n").keydown(function (e) {
    var input = $(this).val();
    if (input.length > 15) {
      $(this).val(input.substring(0, input.length - 2));
    }
  });


  /* Uploading the image on choosing the file */
  var ias = null;
  $('#pop-prw').on('change', '#slct-pic', function () {
    if (ias)
      ias.remove();
    var $this = $(this);
    var file = this.files[0];
    var allowedExt = ['image/jpeg', 'image/png', 'image/gif'];
    if ($.inArray(file['type'], allowedExt) == -1)
    {
      $('#prf-prw').find('.err-msg').text('Invalid file format. Try uploading a jpg/png/gif file');
      return false;
    }
    else
    {
      var trgt = $('#prf-prw #prw');
      $this.on('ajax', function () {
        var $this = $(this);
        var fd = new FormData();
        fd.append('file', file);
        fd.append('auth', $this.getShIntr());
        fd.append('usr', $this.getLoggedInUsr());
        $.ajax({
          url: api + '/uimg',
          type: 'POST',
          data: fd,
          contentType: false,
          processData: false,
          xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            if (xhr.upload)
            {
//                  par.find('progress').removeClass('hideElement');
//                  xhr.upload.addEventListener('progress', function (evt) {
//                    if (evt.lengthComputable) {
//                      var percent_done = parseInt(100 * evt.loaded / evt.total);
//                      par.find('progress').attr('value', Math.ceil(percent_done));
//                    }
//                  }, false);
            }
            return xhr;
          },
          success: function (d) {
            d = JSON.parse(d);
            if (d.success)
            {
              trgt.html('<img src="' + d['msg'] + '" />');
              var prw_bx = $('#prf-prw');
              prw_bx.find('.err-msg').text('');
              prw_bx.removeClass('hideElement').siblings('#upld-prf-frm').addClass('hideElement');
              $('#prf-prw #prw img').on('load', function () {
                var img = this;
                $(this).scaleImages({
                  'dw': $(this).parent().outerWidth(),
                  'dh': $(this).parent().outerHeight()
                });
                if ($(this).outerHeight() > 320)
                  $(this).css("height", "320");
                var rw = 0, rh = 0;
                if (typeof img.naturalWidth == "undefined")
                {
                  var i = new Image();
                  img.src = img.src;
                  rw = i.width;
                  rh = i.height;
                }
                else
                {
                  rw = img.naturalWidth;
                  rh = img.naturalHeight;
                }
                ias = $('#prw img').imgAreaSelect({
                  aspectRatio: "1:1",
                  handles: 'corners',
                  minWidth: 50,
                  minHeight: 50,
                  imageWidth: rw,
                  imageHeight: rh,
                  movable: true,
                  instance: true,
                  onInit: function (inst_img, selection) {
                    var strtx = (img.width - 50) / 2;
                    var strty = (img.height - 50) / 2;
                    ias.update();
                    setTimeout(function () {
                      $(inst_img).trigger('click');
                    }, 100); // Basically a hack to fix issue with loading this selection tool
                  }
                });
                $('#sv-prf').removeAttr('disabled');
              });
            }
          }
        });
      }).trigger('ajax');
    }
  });

  $('#pop-prw').on('click', '#prw img', function () {
    var strtx = ($(this).outerWidth() - 100) / 2;
    var strty = ($(this).outerHeight() - 100) / 2;
    ias.setSelection(strtx, strty, strtx + 100, strty + 100, true);
    ias.setOptions({show: true});
  });

  $('#pop-prw, .sts-msg-bx').on('mousedown', '.pop-cls', function () {
    if (ias)
      ias.remove();
  });
  /* Saving the selection on clicking the button */
  $('#pop-prw').on('click', '#sv-prf', function () {
    var $this = $(this);
    var img = $('#prf-prw img').attr('src');
    $this.attr('disabled', 'disabled');
    $.ajax({
      url: api + '/cpp',
      async: true,
      data: {
        'src': img,
        'slct': ias.getSelection(),
        'auth': $this.getShIntr(),
        'usr': $this.getLoggedInUsr()
      },
      dataType: 'text',
      type: 'post',
      success: function (d, status, xhr) {
        var t = JSON.parse(d);
        if (t.success == -1)
        {
          $('#prf-prw').find('.err-msg').text('No selection found. Click and drag to select an area of the image');
          $this.removeAttr('disabled');
          return false;
        }
        else
          closePrwBox(t.success);
      },
      error: function ()
      {
        closePrwBox(0);
        return false;
      }
    });
  });
  function closePrwBox(data)
  {
    if (ias)
      ias.remove();
    $('.sts-bx').fadeOut(200);
    $('#pop-prw').removeClass('in scrl');
    if (data == 1)
    {
      $('#sts-msg').showStatus('Image saved successfully', 'scs');
      setTimeout(function () {
        location.reload();
      }, 2000);
    }
    else if (data == 0)
      $('#sts-msg').showStatus('An error occured while changing your profile image', 'err');
    else if (data == -1)
      $('#sts-msg').showStatus('Image is too large!', 'err');
  }

  //Profile related code in user settings page
  $('#chng-prf').submit(function () {
    var flag = 0, i = 0;
    var alrt = $(this).find('p.err-msg');
    var reg = /^[a-zA-Z0-9_\+-]+(\.[a-zA-Z0-9_\+-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.([a-zA-Z]{2,4})$/;
    var reg_name = /^[a-zA-Z0-9 ]+$/;
    if ($.trim($('#f-n').val()) == '' || !reg_name.test($('#f-n').val())) {
      if ($('#f-n').val() == '')
        alrt.text('Firstname can not be empty.');
      else
        alrt.text('Firstname can be alpha-numerical or space.');
      return false;
    }
    else if ($.trim($('#l-n').val()) != '' && !reg_name.test($('#l-n').val())) {
      alrt.text('Lastname can be alpha-numerical or space.');
      if ($('#l-n').val() == '')
        $('#l-n').addClass('error');
      return false;
    }
    else if ($('#e-m').val() == '' || !reg.test($('#e-m').val()))
    {
      alrt.text('Looks like email id is not valid');
      $('#e-m').addClass('error');
      return false;
      //   $('#sts-msg').showStatus('Looks like '+email.val()+' is an invalid email ID','err');
      //   email.val('').focus();
    }
    else if (!$("#m-n").val().match(/^\d{10}$/) && $("#m-n").val() != '') {
      alrt.text('Looks like ' + $("#m-n").val() + ' is an invalid mobile number');
      return false;
    }
    else {
      flag = 1;
      alrt.text('');
      $(this).find('input').removeClass('error');
    }

    if (flag)
    {
      //   console.log($('#bd-mt').val(), $('#bd-dy').val(),$('#bd-yr').val());

      $.post('/ajax/updtprf', {
        'fn': $('#f-n').val(),
        'ln': $('#l-n').val(),
        'em': $('#e-m').val(),
        'lc': $('#lc').val(),
        'bd-mt': $('#bd-mt').val(),
        'bd-dy': $('#bd-dy').val(),
        'bd-yr': $('#bd-yr').val(),
        'mn': $('#m-n').val()
      },
      function (res) {
        if (res == -2)
          $('#sts-msg').showStatus('(*) fields are mandatory!!', 'err');
        else if (res == -1)
          $('#sts-msg').showStatus('Oops!! Error in processing. Please try again.', 'err');
        else if (res == -3)
          $('#sts-msg').showStatus('Email already registered with SaddaHaq.', 'err');
        else if (res == -4)
          $('#sts-msg').showStatus('Only alphabets, numerals and spaces are allowed in firstname and lastname!!', 'err');
        else if (res == -5)
          $('#sts-msg').showStatus('Please use another number as the provided mobile number is mapped to another account on SaddaHaq', 'err');
        else {
          $('#sts-msg').showStatus("Yeah! Changes saved successfully", 'scs');
          if ($("#m-n").attr('num') != $("#m-n").val() && $("#m-n").val() != '') {
            $("#m-n").siblings(".vfy-sts.scs").addClass("hideElement");
            $("#m-n").siblings(".vfy-sts.err-msg").removeClass("hideElement");
          }
        }
      });
    }
    return false;
  });
  $('#chng-ntf input[type=checkbox]').on('change', function () {
    var $this = $(this);
    if (!$this.is(':checked')) {
      $this.siblings('select').val(0);
      $this.siblings('select').attr('disabled', 'disabled');
    }
    else {
      $this.siblings('select').val(1);
      $this.siblings('select').removeAttr('disabled');
    }
  });
  $('#chng-ntf').submit(function () {
    var selectVal = {};
    $('#chng-ntf select').each(function (i, elem) {
      var $this = $(elem);
      var id = ($this.attr('id')).split('-');
      if ($this.attr('disabled') == undefined)
        selectVal[id[id.length - 1]] = $this.val();
      else
        selectVal[id[id.length - 1]] = 0;
      selectVal.auth = $(this).getShIntr();
      selectVal.usr = $(this).getLoggedInUsr();
    });
    $.post(api + '/uemln', selectVal,
            function (d) {
              d = JSON.parse(d);
              if (d.success == 0)
                $('#sts-msg').showStatus('Oops!! Error in processing. Please try again.', 'err');
              else
                $('#sts-msg').showStatus("Our systems saved your orders and will send notifications as per your settings.", 'scs');
            });
    return false;
  });
  // Personalisation
  $('#lft-mnu a[href="#prsn-frm"]').click(function (e) {
    var $this = $(this);
    e.preventDefault();
    if (!$this.hasClass('loaded'))
    {
      $.post('/ajax/gtprz', {}, function (cb) {
        cb = JSON.parse(cb);
        if (cb.length)
        {
          var ctlst = $('#prsn-frm ul.ctgy');
          for (var c = 0; c < cb.length; c++)
          {
            var trgtCt = ctlst.find('#' + cb[c]['ct']);
            var sct = cb[c]['sct'];
            trgtCt.data('slctd', sct);
            trgtCt.find('.ct-nm i').addClass('hideElement');
            trgtCt.find('.ct-nm .badge').data('num', sct.length).text(sct.length).removeClass('hideElement');
            for (var sc = 0; sc < sct.length; sc++)
            {
              trgtCt.find('.scts ul li.' + sct[sc]).addClass('slctd').find('i').toggleClass('icon-plus-strong icon-ok-circle');
            }
          }
        }
        $this.addClass('loaded');
      });
    }
  });
  $('#prsn-frm').on('click', '.ctgy li', function (e) {
    if (!($(e.target).hasClass('.scts') || $(e.target).parents('.scts').length))
    {
      $('html,body').animate({scrollTop: $(document).height()});
      var $this = $(this);
      $this.siblings('li.open').removeClass('open')
              .find('.ct-nm i').toggleClass('icon-chevron-down icon-chevron-up');
      $this.toggleClass('open');
      $this.find('.ct-nm i').toggleClass('icon-chevron-down icon-chevron-up');
    }
  });
  $('#prsn-frm').on('click', '.scts li', function () {
    var $this = $(this);
    var arr = [];
    var trgt = $this.parents('.scts').parent();
    if ($this.hasClass('slctd'))
    {
      arr = trgt.data('slctd');
      arr.splice($.trim($this.find('.sct-nm').text().replace(/ /g, '_')), 1);
      trgt.data('slctd', arr);
    }
    else
    {
      if (trgt.data('slctd'))
        arr = trgt.data('slctd');
      arr.push($.trim($this.find('.sct-nm').text()).replace(/ /g, '_'));
      trgt.data('slctd', arr);
    }
    $this.toggleClass('slctd');
    $this.find('.presentation i').toggleClass('icon-plus-strong icon-ok-circle');
    var slctd = $this.parent().find('.slctd').length;
    if (slctd)
    {
      $this.parents('.scts').siblings('.ct-nm').find('i').addClass('hideElement')
              .siblings('.badge').removeClass('hideElement').data('num', slctd).text(slctd);
    }
    else
    {
      $this.parents('.scts').siblings('.ct-nm').find('i').removeClass('hideElement')
              .siblings('.badge').addClass('hideElement');
    }
  });

  $('#prsn-frm').on('click', '#sv-prsn', function () {
    var json = [];
    $(this).siblings('.ctgy').find(' > li').each(function () {
      if ($(this).data('slctd'))
        json.push({
          "ct": $.trim($(this).find('.ct-nm > .nm').text()),
          "sct": $(this).data('slctd')
        });
    });
    if (json.length)
    {
      $.post('/ajax/prz', {
        "slctd": json
      }, function (d) {
        if (d == 1)
          $('#sts-msg').showStatus('Settings saved successfully.', 'scs');
        else
          $('#prsn-frm').find('.err-msg').text('Error processing the request. Please try again!');
      });
    }
    else
      $('#prsn-frm').find('.err-msg').text("Please choose some categories you like to follow");
  });
  /* Loading spaces list */
  $('#lft-mnu').on('click', '.sp a', function (e) {
    e.preventDefault();
    var $this = $(this);
    $this.addClass("active");
    $this.parents("li").siblings("li").find("a").removeClass("active");
    $('#usr-spc').addClass('active').siblings('.tab-pane').removeClass('active');
    $('#usr-spc').empty();
    $('#usr-spc').ldSpcLst({"tp": $this.data('tp'), "usr2": ($('#cvr-img').length ? $('#cvr-img').data('usr')['unme'] : $this.getLoggedInUsr())});
  });
  var sc_data = {};
  var sc_nm = 0;
  var scl_discd = '';
  var scl_slctd = '';
  $('#scl-cnct').on('click', function () {
    var prev_slct = $("#scl-cnt-frm").data("sclCnt");
    $('.sc-cnct').each(function () {
      if ($(this).is(":checked")) {
        if (prev_slct.indexOf($(this).val()) < 0) {
          scl_slctd += $(this).val();
          if ($(this).val() != 'T')
            sc_nm = sc_nm + 1;
          switch ($(this).val()) {
            case 'F':
              FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                  getFbDetails();
                }
                else {
                  FB.login(function () {
                    getFbDetails();
                  }, {scope: 'email,user_friends,publish_actions,public_profile'});
                }
              });
              break;
            case 'G':
              handleClientLoad();
              break;
            case 'T':
              $.ajax({
                url: '/ajax/twcncn',
                success: function (data) {
                  window.location = data;
                }
              });
              break;
          }
        }
      }
      else {
        if (prev_slct.indexOf($(this).val()) >= 0)
          scl_discd += $(this).val();
      }
    });
    sclCnctAjx();
  });

  function sclCnctAjx() {
    if (sc_nm == 0) {
      $.ajax({
        url: api + "/cnct",
        type: "post",
        data: {
          "slc": scl_slctd,
          "us": scl_discd,
          "dt": sc_data,
          "auth": $(this).getShIntr(),
          "usr": $(this).getLoggedInUsr()
        },
        success: function (d) {
          var t = JSON.parse(d);
          if (t.success == 0)
            $('#sts-msg').showStatus(t.msg, 'err');
          if (t.success == 1)
            location.reload();
        }
      });
    }
  }
  function getFbDetails() {
    /* friends list */
    FB.api("/me/friends", function (response) { //console.log(response);
      sc_data['F'] = response.data;
      sc_nm = sc_nm - 1;
      sclCnctAjx();
    });
  }
  function closePopPrw()
  {
    $('#pop-prw').removeClass('in');
    $('.sts-bx').fadeOut(200);
  }
  /* g+ authorization code   */
  var clientId = $("body").data("cid");
  var apiKey = 'AIzaSyDSVxesi6_iLaz4_RD5VwhYfsDt8a1qJh8';
  var scopes = 'https://www.google.com/m8/feeds/contacts/default/full';

  function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 1);
  }
  function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
  }

  function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
      makeApiCall();
    } else {
      handleAuthClick();
    }
  }

  function handleAuthClick() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
  }

  function makeApiCall() {
    gapi.client.load('plus', 'v1', function () {
      var request = gapi.client.plus.people.get({
        'userId': 'me'
      });
      request.execute(function (resp) {
      });
    });
    var authParams = gapi.auth.getToken() // from Google oAuth
    authParams.alt = 'json';
    $.ajax({
      url: 'https://www.google.com/m8/feeds/contacts/default/full',
      dataType: 'jsonp',
      data: authParams,
      success: function (data) {
        sc_data['G'] = data.feed.entry;
        sc_nm = sc_nm - 1;
        sclCnctAjx();
      }
    });
  }
  ;
  /*end of g+ authorization code   */
  /* Functionality to change box based on button clicked */
  $('#lft-mnu.stngs-mnu').on('click', 'a', function (e) {
    e.preventDefault();
    $(this).addClass('active').parent().siblings().find('a').removeClass('active');
    $('#settings').find($(this).attr('href')).removeClass('hideElement').siblings('.stng-bx').addClass('hideElement');
  });

  /* Functionality to remove profile pic */
  var el = null;
  $(document).on('click', '#rmv-thmb a', function (e) {
    e.preventDefault();
    el = $(this);
  });
  $('#con-del #yes').click(function () {
    if (el != null && el.parents("#rmv-thmb").length) {
      $.ajax({
        url: api + '/cpp',
        async: true,
        data: {
          'auth': el.getShIntr(),
          'usr': el.getLoggedInUsr(),
          'tp': 'r'
        },
        type: 'post',
        success: function (d) {
          var t = JSON.parse(d);
          if (t.success) {
            $(".prf-pic").find("img").attr("src", "public/images/user.png");
            $("#rmv-thmb").removeClass("in");
            $("#rmv-thmb").addClass("hideElement");
            $("#upld-thmb").addClass("fill");
          }
          else
            $('#sts-msg').showStatus(t.msg, 'err');
        }
      });
    }
  });

  $('.scl-shr').on('click', '.tw-tweet', function () {
    window.open('https://twitter.com/intent/tweet?original_referer=' + encodeURIComponent($('meta[property="og:url"]').attr('content')) + '&text=' + encodeURIComponent($('meta[name="twitter:title"]').attr('content')) + '&tw_p=tweetbutton&url=' + encodeURIComponent($('meta[property="og:url"]').attr('content')) + '&via=SaddaHaqMedia', '', 'toolbar=0,status=0,width=548,height=325');
  });

  $('.scl-shr').on('click', '.gp-share', function () {
    window.open('https://plus.google.com/share?url=' + encodeURIComponent($('meta[property="og:url"]').attr('content')), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
  });

  /* Twitter page count functionality */
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
});
