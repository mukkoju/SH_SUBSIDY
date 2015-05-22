$(document).ready(function() {
    //API, Auth call
  var api = $('body').data('api');
  var auth = $('body').data('auth');
  var isTwnHl = $("#twnhl").length ? true : false ;
    //for townhall & debate
    $.fn.showLogin = function ()
    {
        if (!$('#user-navigation').find("img").length)
        {
            $.ajax({
                url: api + '/gtf',
                type: 'post',
                data: {
                    'id': 'lgn',
                    'ref': window.location.href
                },
                success: function (data) {
                    data = JSON.parse(data);
                    $('#pop-prw').html(data['frm']).addClass('view').find('.err-msg').text('Please login to proceed further');
                }
            });
        }
    };  
    $.fn.extend({
        hideLoginBox: function (tp)
        {
            $('#lgn-bx').fadeOut(300);
            $('#lgn-bx,.lightbox').fadeOut(300, function () {
                $('#twnhl').removeClass('transparent');
                if (isOpn)
                    $('#right-bar').addClass('hideElement');
                else
                {
                    if (tp != 'g')
                    {
                        $('#right-bar').removeClass('hideElement');
                        $('#chat-box').remove();
                        $('#debate').removeClass('offset2');
                    }
                    else
                    {
                        $('#right-bar').addClass('hideElement');
                    }
                }
            });
        }
    });



  /* Scroll page to sneak peek box */
  $('#scrl-dwn').on('click', function(){
    $('html, body').animate({scrollTop: $('#preview').offset().top}, 600, 'easeInOutCubic');
  });
  /* Load about us video */
  $('#abtus').on('click', function(){
    $('#pop-prw > section').html('<p id="vid-cntnt"><iframe width="853" height="480" src="//www.youtube.com/embed/fodj99DqWqU?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe></p>').showPopup(1);
  });
  /*
   * Showing page content once the background-image is fully loaded
   */
  if ($('#right-bar').hasClass('prw-pg'))
  {
    updateBackground();
    setInterval(function() {
      updateBackground();
    }, 15000);
  }
  function updateBackground()
  {
    $.post('/ajax/hp', {}, function(art) {
      art = JSON.parse(art);
      $('#landing').css('background-image', 'url("https://saddahaq.blob.core.windows.net/multimedia/' + art.fimg + '")');
      $('#top-stry').find('.hdng').attr('href', art.url).html($(this).buildTxt(art.ttl, 0));
      var img = new Image();
      img.onload = function() {
        $('#top-stry').find('.byln').html('<img align="absmiddle" src="https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' + art.authUN +
                '" class="thumb-holder" />' + art.authFN);
      };
      img.onerror = function() {
        $('#top-stry').find('.byln').html('<i class="icon-profile"></i> ' + art.authFN);
      };
      img.src = 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' + art.authUN;
    });
  }
  function imageExists(image_url) {
    return http.status != 404;
  }
  $('#main-loader').fadeOut(100, function() {
    if (!$('#user-nav').find('.usrname').length)
    {
      $('#news-bar').loadNews({
        'cgry': 'All',
        'usr': '',
        'tl_tp': 'L'
      });
      $('#right-bar #tab-content-holder').find('#context').addClass('active').siblings('.tab-pane').removeClass('active');
      $('#right-bar').find('h2:first').css({
        'opacity': '1',
        'left': '0px'
      });
      var frame = $('#stream > .frame');
      frame.enableSlider();
      frame.loadData({
        'tab': 'context',
        'tp': 'L'
      });
    }
  });
  $(window).scroll(function() {
    if ($('#right-bar').hasClass('prw-pg'))
    {
      var prw = $('#preview');
      if ($(window).scrollTop() <= prw.offset().top)
      {
        prw.find('#left-bar .left-container').removeClass('fix').addClass('scrl');
        prw.find('#right-bar .right-container').addClass('scrl').removeClass('fix');
        prw.find('#navigation-bar').removeClass('fix');
        $('#lft-mnu').addClass('lft');
      }
      else
      {
        prw.find('#left-bar .left-container').removeClass('scrl').addClass('fix').css('top', '56px');
        prw.find('#right-bar .right-container').addClass('fix').removeClass('scrl').css('top', '56px');
        prw.find('#navigation-bar').addClass('fix');
        $('#lft-mnu').removeClass('lft');
      }
    }
  });
  $("#seconddiv-Username").on('change', function()
  {
    var username = $.trim($("#seconddiv-Username").val());
    if (username.length > 2)
    {
      $("#seconddiv-availability").html('<img src="/public/images/loader.gif" align="absmiddle">&nbsp;Checking availability...');
      $.post('/ajax/chkusrreg', {
        username: username
      }, function(available) {
        if (available == 0)
        {
          $('.alert').printError('');
          $("#seconddiv-Username").removeClass('error');
        }
        else if (available == 1)
        {
          $("#seconddiv-Username").addClass('error').val('');
          $('.alert').printError("Username already taken!");
        }
      });
    }
    else
    {
      $("#seconddiv-availability").html('<font color="#cc0000">Username too short</font>');
    }
  });

  //Activate submit button when user checks the terms and conditions checkbox
  $('#pop-prw').on('change', '#tc_accept', function() {
    if ($(this).is(':checked'))
      $('#reg-form-sbmt').removeClass('disabled').removeAttr('disabled');
    else
      $('#reg-form-sbmt').addClass('disabled').attr('disabled', 'disabled');
  });

  // Registration form submission
  $('#pop-prw').on('submit', '#reg-form', function(e) {
    e.preventDefault();
    var $this = $(this);
    var err = $this.find('.err-msg');
    var elements = $this.find("input[type='text'],input[type='password']");
    var reg = null;
    var error = 'First/Last name cannot be empty';
    var flag = 0;
    var element = null;
    elements.each(function() {
      element = $(this).attr('id');
      switch (element)
      {
        case 'FName':
          error = 'First Name should contain only alphabets, numerals and space';
          reg = /^[a-zA-Z0-9 ]+$/;
          break;
        case 'LName':
          if ($.trim($(this).val()) != '') {
            error = 'Last Name should contain only alphabets, numerals and space';
            reg = /^[a-zA-Z0-9 ]+$/;
          }
          else
            reg = null;
          break;  
        case 'Username':
          error = 'Username should be between 6 and 16 characters and can contain letters, number and period';
          reg = /^[A-z0-9.]{6,16}$/;
          break;
        case 'Email':
          error = 'Invalid email format';
          reg = /^[a-z0-9_\+-]+(\.[a-z0-9_\+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,4})$/;
          break;
        case 'Password':
          error = 'Password should be atleast 6 characters';
          reg = /^(?=.*[A-z0-9]).{6,}$/;
          break;
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
          err.text('');
          $(this).removeClass('error');
        }
      }
    });
    if (flag == 1)
    {
      $('#' + element).addClass('error').val('').focus();
      $('#reg-form').effect('shake', {
        times: 3,
        distance: 5
      }, 300);
      err.text(error);
      return false;
    }
    else
    {
      $.ajax({
        url: auth + '/api/rg',
        type: 'post',
        data: {
          "FName": $this.find('#FName').val(),
          "LName": $this.find('#LName').val(),
          "Username": $this.find('#Username').val(),
          "Email": $this.find('#Email').val(),
          "Password": $this.find('#Password').val()
        },
        success: function(d) {
          var t = JSON.parse(d);
          switch (parseInt(t.success)) {
            case 0:
              err.text(t.msg);
              break;
            case 1:
              $('#pop-prw').removeClass('view');
              showStatus($('#sts-msg'),'Hurrah! Welcome to the SaddaHaq family. Please wait while we create your account...', 'scs', function() {
                setTimeout(function() {
                  window.location = auth + '/ssst/' + t.msg + '?return=' + urlencode(document.URL);
                }, 1500);
              });
              break;
          }
        }
      });
    }
  });

  $('#Registration input').on('click', function() {
    $(this).removeClass('error');
  });

  $(document).on('click', '.register', function(e) {
    e.preventDefault();
    $.ajax({
      url: api + '/gtf',
      type: 'post',
      data: {
        'id': 'reg'
      },
      success: function(data) {
        data = JSON.parse(data);
        if(isTwnHl)
          $('#pop-prw').html(data['frm']).addClass("view");   
        else
          $('#pop-prw > section').html(data['frm']).showPopup(1);  
        var pth = location.pathname.split("/"); 
        if(pth[1] == "new")
          $('#pop-prw > section').find(".pop-cls").addClass("hideElement");
      }
    });
  });

  $('.sts-bx').on('click', function() {
    $('#lgn-bx').removeClass('in');
    $('#pop-prw').removeClass('in');
    if ($('#pop-prw').hasClass('scrl'))
      $('#pop-prw').removeClass('scrl').css('top', '-100%');
    $(this).fadeOut(200);
  });
  /* Reset password form submission */
  $('#pop-prw').on('submit','#resetpwd-form',function(e) {
    e.preventDefault();
    var $this = $(this);
    var email = $('#resetpwd-form #Email');
    var reg = /^[a-z0-9_\+-]+(\.[a-z0-9_\+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,4})$/;
    if (email.val() == '' || !reg.test(email.val()))
    {
      $this.find('.err-msg').removeClass('scs').text('Looks like the email is empty or invalid!', 'err');
      email.val('').focus();
      return false;
    }
    else
    {
      $('#resetpwd-form #submit').attr('disabled', 'disabled');
      $.post(api + '/rpw', {
        'Email': email.val()
      }, function(d) {
        var t = JSON.parse(d);
        if (t.success == 1)
          $this.find('.err-msg').addClass('scs').text(t.msg, 'err');
        else
          $this.find('.err-msg').removeClass('scs').text(t.msg, 'err');
        $('#resetpwd-form #submit').removeAttr('disabled');
      });
    }
    return false;
  });
  $("#lgn-bx, #pop-prw").on("click", ".glgn,.google", function() {
    var OAUTHURL = 'https://accounts.google.com/o/oauth2/auth?';
    var VALIDURL = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
    var SCOPE = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    var CLIENTID = $('body').data('cid');
    var REDIRECT = $('body').data('rd');
    var LOGOUT = 'http://accounts.google.com/Logout';
    var TYPE = 'token';
    var _url = OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
    var acToken;
    var tokenType;
    var expiresIn;
    var user;

    var win = window.open(_url, "windowname1", 'width=800, height=600');
    var pollTimer = window.setInterval(function() {
      try {
        if (win.document.URL.indexOf(REDIRECT) != -1) {
          window.clearInterval(pollTimer);
          var url = win.document.URL;
          acToken = gup(url, 'access_token');
          tokenType = gup(url, 'token_type');
          expiresIn = gup(url, 'expires_in');
          win.close();

          validateToken(acToken);
        }
      } catch (e) {
      }
    }, 500);

    function validateToken(token) {
      $.ajax({
        url: VALIDURL + token,
        data: null,
        success: function(responseText) {
          getUserInfo();
        },
        dataType: "jsonp"
      });
    }

    function gup(url, name) {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regexS = "[\\#&]" + name + "=([^&#]*)";
      var regex = new RegExp(regexS);
      var results = regex.exec(url);
      if (results == null)
        return "";
      else
        return results[1];
    }

    function getUserInfo() {
      $.ajax({
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
        data: null,
        dataType: "jsonp",
        success: function(resp) {
          var usrdt = {
            "fnme": resp.given_name,
            "lnme": resp.family_name,
            "eml": resp.email,
            "img": resp.picture,
            "unme": resp.email.split("@")[0],
            "tp": "G"
          };
          $.post(auth + '/api/sidty', {
            'usrdt': usrdt
          }, function(tkn) {
            if (tkn.length == 128) {
              window.location = auth + '/ssst/' + tkn + '?return=' + urlencode(document.URL);
            }
            else {
              if (tkn == -2) {
                showStatus($('#sts-msg'),'We did not receive any email id from the source you logged in', 'err');
              }
              else if (tkn == 2) {
                showStatus($('#sts-msg'),'Looks like the email id we received is an invalid one', 'err');
              }
              else {
                showStatus($('#sts-msg'),'Bummer, Something has seriously gone wrong while logging in. Please try again', 'err');
              }
            }
          });
        }

      });
    }
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
    $("#lgn-bx, #pop-prw").on("click", ".flgn,.facebook", function () {

        FB.login(function (response) {
            if (response.authResponse) {
                FB.api('/me', function (resp) {
                    //console.log(resp);
                    var usrdt = {
                        "fnme": resp.first_name,
                        "lnme": resp.last_name,
                        "eml": resp.email,
                        "unme": resp.username,
                        "id": resp.id,
                        "tp": "F",
                        "etp": "F"
                    };
                    FB.api('/me/picture', function (res) {
                        usrdt.img = res.data.url ;
                        fbLgnPost(usrdt);
                        function fbLgnPost(usrdt) {
                            $.post(auth + '/api/sidty', {
                                'usrdt': usrdt
                            }, function (tkn) {
                                if (tkn.length == 128) {
                                    window.location = auth + '/ssst/' + tkn + '?return=' + urlencode(document.URL);
                                }
                                else {
                                    if (tkn == -2) {
                                        $.ajax({
                                            url: api + '/gtf',
                                            type: "post",
                                            data: {
                                                'id': 'fbe'
                                            },
                                            success: function (data) {
                                                $('#lgn-bx').removeClass("in");
                                                $('#pop-prw').html(JSON.parse(data)['frm']).showPopup(1);
                                            }
                                        });
                                        $('#pop-prw').on('click', '#fb-ml-sv', function () {
                                            var eml_rgx = /^[a-zA-Z0-9_\+-]+(\.[a-zA-Z0-9_\+-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.([a-zA-Z]{2,4})$/;
                                            var popup_bdy = $(this).siblings(".modal-body");
                                            var email = popup_bdy.find('input').val();
                                            if (email == '' || !eml_rgx.test(email))
                                            {
                                                popup_bdy.find('.err-msg').text('Looks like email id is not valid');
                                                popup_bdy.find('input').addClass('error');
                                                return false;
                                            }
                                            usrdt.eml = email;
                                            usrdt.etp = "E";
                                            fbLgnPost(usrdt);
                                        });
                                        $('#pop-prw').on('click', '#fb-ml #prw-close', function () {
                                            $(this).parents("#pop-prw").fadeOut(100, function () {
                                                showStatus($('#sts-msg'),'Sorry you cannot login without providing email.', 'err');
                                            });
                                        });
                                    }
                                    else if (tkn == -5) {
                                        $('#pop-prw').find(".err-msg").text('Email already associated with another SaddaHaq account. Either please provide another email or login using credentials.');
                                    }
                                    else {
                                        showStatus($('#sts-msg'),'Sorry. Unable to login!!', 'err');
                                    }
                                }
                            });
                        }
                    });
                });
            } else {
        //console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'public_profile, email'});
  });
    /* Showing login popup on clicking login button */
  $(document).on('click', '.lgn-btn', function (e) {
    e.preventDefault();
    var $this = $(this);
    $this.showLgnPopup(($this.parents('#user-nav').length || $this.parent().hasClass('join')) ? 0 : 1);
  });
  
   /* Login Page */
  /* Form validations for empty fields */
  $('#pop-prw').on('submit', '#login-form', function () {
    var brk = 0;
    var $this = $(this);
    $this.find('.btn').attr('disabled', 'disabled');
    $this.find("input[type='text'],input[type='password'],textarea, select").removeClass('error').each(function () {
      if ($(this).val() == '')
      {
        $(this).addClass('error');
        brk = 1;
        return false;
      }
      else
        brk = 0;
    });
    if (brk == 1)
    {
      $this.find('.err-msg').removeClass('scs').text('Username or Password field cannot be empty');
      $this.find('.btn').removeAttr('disabled');
    }
    else
    {
      $.ajax({
        url: $('body').data('auth') + '/api/idty',
        type: 'post',
        data: {
          "email": $this.find('#email').val(),
          "password": $this.find('#password').val()
        },
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: function (d) {
          if (d == 1) {
            if (window.location.href.indexOf('oscar15') !== -1 && $('#pl-cntnr').length)
            {
              $.post("/ajax/osc15", {"opts": $('#qtn').data('slct')}, function (d) {
                d = JSON.parse(d);
                if (d.success)
                {
                  var html = d['msg'] +
                          '<div class="text-align:center;">' +
                          '<div style="font-size : .857em; margin-top : 8px;">Share with your friends : </div>' +
                          '<a class="fb-share btn facebook" style="margin : 4px;">' +
                          '<i class="icon-facebook" style="font-size: 1.4285em;"></i> <span class="hidden-phone">Share</span></a>' +
                          '<a class="tw-tweet btn twitter"><i class="icon-twitter" style="font-size: 1.4285em;"></i>' +
                          '<span class="hidden-phone">Tweet</span></a>' +
                          '</div>';
                  showStatus($('#sts-msg'),html, d.success == 1 ? 'scs' : 'err');
//                  window.location.reload();
                }
              });
            }
            else
            {
//              var t = (window.location.href.indexOf('?') === -1) ? window.location.href : urldecode(window.location.href.split('?')[1].split('=')[1]);
//              var url = null;
//              if (t.indexOf('#') !== -1)
//                url = t.split('#')[0];
//              else if (t.indexOf('&&') === -1) {
//                url = t;
//              }
//              else {
//                var tmp = t.split('&&');
//                url = tmp[0] + '?rt=' + urlencode(tmp[1]);
//              }
              window.location.reload();
            }
          }
          else {
            var msg = '';
            if (d == 0)
              msg = 'User account suspended!!';
            else if (d == -1)
              msg = 'Invalid username or password!!';
            else if (d == -2)
              msg = 'All fields are required!!';
            $this.find('.btn').removeAttr('disabled');
            $this.find('.err-msg').removeClass('scs').text(msg);
          }
        }
      })
    }
    return false;
  });
  function urldecode(str) {
    return decodeURIComponent((str + '')
            .replace(/%(?![\da-f]{2})/gi, function () {
              return '%25';
            })
            .replace(/\+/g, '%20'));
  }
  function urlencode(str) {
    str = (str + '')
            .toString();
    return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .
            replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+');
  }
  /* Forgot password link */
  $('#pop-prw').on('click', '.forgot-pwd', function (e) {
    e.preventDefault();
    if(!isTwnHl)
      $('.alert').printError('');
    var lgnBx = $('#lgn-bx');
    lgnBx.find('.lgn-bx-cntnr').css('left', '-' + lgnBx.outerWidth() + 'px');
  });
  /* Go back to login page */
  $('#pop-prw').on('click', '#go-back', function (e) {
    e.preventDefault();
    var lgnBx = $('#lgn-bx');
    lgnBx.find('.lgn-bx-cntnr').css('left', '0px');
  });
  /* Reset password form submission */
  $('#resetpwd-form').submit(function () {
    var $this = $(this);
    var email = $('#resetpwd-form #Email');
    var reg = /^[a-z0-9_\+-]+(\.[a-z0-9_\+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,4})$/;
    if (email.val() == '' || !reg.test(email.val()))
    {
      $this.find('.err-msg').removeClass('scs').text('Looks like the email is empty or invalid!', 'err');
      email.val('').focus();
    }
    else
    {
      $('#resetpwd-form #submit').attr('disabled', 'disabled');
      $.post(api + '/rpw', {
        'Email': email.val()
      }, function (d) {
        var t = JSON.parse(d);
        if (t.success == 1)
          $this.find('.err-msg').addClass('scs').text(t.msg, 'err');
        else
          $this.find('.err-msg').removeClass('scs').text(t.msg, 'err');
        $('#resetpwd-form #submit').removeAttr('disabled');
      });
    }
    return false;
  });
  
  function showStatus($this, msg, status, callback) {
      $this.find('p').html(msg);
      $('#navigation-bar #c-b').removeClass('in');
      $('.sts-msg-bx').addClass(status);
      $this.addClass('view ' + status);
      if ($('#pop-prw').hasClass('view'))
        $('#pop-prw').removeClass('view');
      if (status == 'scs')
        $this.find('i').addClass('icon-ok-circle').removeClass('icon-warning-sign');
      else if (status == 'err')
        $this.find('i').addClass('icon-warning-sign').removeClass('icon-ok-circle');
      /* To fadeout automatically after 30sec */
      setTimeout(function () {
        $this.removeClass('view err scs');
        $('.sts-msg-bx').removeClass('err scs');
      }, 30000);
      if (callback)
      {
        setTimeout(function () {
          callback();
        }, 3500);
      }
    }
});