$(document).ready(function () {
  /* Invitation Module */
  $('.container-fluid, #pop-prw, #rltd-bx').on('click', '.inv-lst', function (e) {
    $(this).find('input').focus();
  });
  $('.container-fluid, #pop-prw, #rltd-bx').on('keydown', '.inv #inv-sh', function () {
    $(this).getUsrSgstns();
  });
  
  $('.container-fluid, #pop-prw, #rltd-bx').on('change', '.invt-opts input', function () {
    var trgt = $('#' + $(this).val());
    if ($(this).parents('.tl-dtls, .pet, .evt').length)
      trgt = $(this).parent().siblings('.' + $(this).val());
    trgt.removeClass('hideElement').siblings('.inv').addClass('hideElement');
  });
  
  $('.container-fluid, #pop-prw, #rltd-bx').on('keydown', '#inv-em, #inv-sm', function (e, p1) {
    var $this = $(this);
    $this.parents('ul').siblings('.err-msg').text('');
    if (e.which == 13 || e.which == 186 || e.which == 32 || e.which == 188 || p1)
    {
      e.preventDefault();
      var eml = $.trim($this.val());
      var trgt = $this.parents('ul');
      var invLst = trgt.data('invt') != undefined ? trgt.data('invt') : [];
      if (((/^[a-z0-9_\+-]+(\.[a-z0-9_\+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,4})$/).test(eml) || (/^\d{10}$/).test(eml))
              && $.inArray(eml, invLst) == -1)
      {

        $this.parent().before('<li>' + eml + '<a href="#" class="inv-rmv pull-right"><i class="icon-remove"></i></a></li>');
        invLst.push(eml);
        trgt.data('invt', invLst);
        $this.val('');
        adjustInvPstn($this.parent());
      }
      else if ($.inArray(eml, invLst) != -1)
        $this.parents('ul').siblings('.err-msg').text('You have already added ' + eml + ' in invitation list');
      else
        $this.val('').parents('ul').siblings('.err-msg').text('Looks like "' + eml + ($this.attr('id') == 'inv-em' ? '" is an invalid email!' : '" is an invalid phone number!'));
    }
  });

  $('.container-fluid, #pop-prw, #rltd-bx').on('click', '.inv-rmv', function () {
    var trgt = $(this).parents('li'), par = trgt.parent(), indx = par.find('li').index(trgt);
    var fnlLst = par.data('invt');
    fnlLst.splice(indx, 1);
    par.data('invt', fnlLst);
    trgt.remove();
    adjustInvPstn(par.find('.inpt-bx'));
  });

  /*
   *  'invt' -> list of invited people
   *  'invt_tp' -> Flag to mark the type of invitation 1 = Saddahaq, 2 = email, 3 = sms
   *  'pg_tp' -> Page on which this invitation module is active 'A/E/P/S' = 'Article/Event/Petition/Space"
   *  'id' -> Id of A/E/P/S on which invitation module is active
   */
  $('.container-fluid, #pop-prw, #rltd-bx').on('click', '.inv .btn', function() {
    if($(this).parents(".scl-shr").length)
      return;
    var $this = $(this).parents('.inv');
    var data = $(this).siblings('ul').data('invt');
    if ($this.siblings(".invt-opts").find(".invt-opt-eml,#invt-opt-eml").prop("checked") && $this.find(".invt-opt-gml").prop("checked")){
      var gmls_lst =  $(this).parents(".em, #em").find('.gml-lst').data("gmls");
      if (gmls_lst != null && gmls_lst.length > 0) {
        data = gmls_lst.substr(0, gmls_lst.length - 1);
        data = data.split(",");
      } 
    }
    if(data == undefined){ //case : when contact entered and not pressed on enter/,/space/etc 
      $('.container-fluid, #pop-prw, #rltd-bx').find('#inv-em, #inv-sm').trigger("keydown", [1]);
      data = $(this).siblings('ul').data('invt');
    }
    if (data.length)
    {
      var isTile = $this.parents('.nws-tl,.pet, .evt').length;
      var pstdt = {
        'invt': data
      };
      if (isTile)
      {
        pstdt['invt_tp'] = $this.hasClass('sh') ? 1 : ($this.hasClass('em') ? 2 : 3);
        pstdt['pg_tp'] = $this.parents('.nws-tl, .pet, .evt').data('tp');
        pstdt['id'] = $this.parents('.nws-tl, .pet, .evt').attr('id');
      }
      else
      {
        pstdt['invt_tp'] = $this.attr('id') == 'sh' ? 1 : ($this.attr('id') == 'em' ? 2 : 3);
        pstdt['pg_tp'] = $('#comments-box').data('tp') ? $('#comments-box').data('tp') : 'S';
        pstdt['id'] = $this.siblings('.invt-opts').data('pgid');
      }
      pstdt['auth'] = $().getShIntr();
      pstdt['usr'] = $().getLoggedInUsr();
      $.ajax({
        url: $('body').data('api') + '/inv',
        data: pstdt,
        type: 'post',
        success: function(d) {
          d = JSON.parse(d);
          if(d.success == 1){
            if(d.msg.Failure == undefined)
              $('#sts-msg').showStatus("Invitation sent successfully", 'scs');
            else
              $('#sts-msg').showStatus("Invitation sent successfully to all contacts except for these, "+d.msg.Failure.join() , 'scs');
          }
          else
            $('#sts-msg').showStatus(d.msg, 'err');
        }
      });
    }
    else
      $(this).siblings('.err-msg').text("Looks like you haven't added any details of the person to be invited. Please try again.");
  });
  
    $('.container-fluid, #pop-prw, #rltd-bx').on("click", ".scl-shr .btn", function () {
        var $this = $(this);
        var dt = {};
        dt.tp = $this.parents(".tl-dtls").siblings(".actn-btn").data("flgs").tp;
        dt.url = ($this.parents(".actn-bx").siblings("article").length ?  $this.parents(".actn-bx").siblings("article").data("href")
                                          :$this.parents(".actn-bx").siblings("a").attr("href") ); 
        if(dt.tp != 3 && dt.tp != 4) 
          dt.url = $("body").data("auth") + dt.url ;
        dt.ttl = $this.rplcTgs($this.parents(".nws-tl").find(".tl-dtls .ttl").html()); 
//        dt.img = $this.parents(".tl-dtls").find(".cvr-bx").css("background-image").trim();
//        dt.img = dt.img.substr(4, dt.img.length-5);
//        dt.smry = $this.parents(".nws-tl").find(".tl-dtls .smry").text();
        if ($this.hasClass("fb-share"))
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(dt.url) + '&display=popup&ref=plugin', '', 'toolbar=0,status=0,width=548,height=325');
        else if ($this.hasClass("tw-tweet")) 
            window.open('https://twitter.com/intent/tweet?original_referer=' + encodeURIComponent(dt.url) + '&text=' + encodeURIComponent(dt.ttl) + '&tw_p=tweetbutton&url=' + encodeURIComponent(dt.url) + '&via=SaddaHaqMedia', '', 'toolbar=0,status=0,width=548,height=325');
        else if ($this.hasClass("gp-share"))
            window.open('https://plus.google.com/share?url=' + encodeURIComponent(dt.url), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
        else if ($this.hasClass("rd-share")) 
            window.open('//www.reddit.com/submit?url=' + encodeURIComponent(dt.url), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
        
    });
    
  function adjustInvPstn(inpt) {
    var trgt = inpt.parent(), prv = inpt.prev('li');
    prv = prv.length ? (prv.outerWidth() + prv.offset().left) : 0;
    if (((trgt.outerWidth() + trgt.offset().left) - prv) < 160 || !prv)
      inpt.css('width', '100%');
    else
      inpt.css('width', ((trgt.offset().left + trgt.outerWidth()) - (inpt.prev('li').outerWidth() + inpt.prev('li').offset().left) - 16));
  }

  /* news tiles event/petition functionalities */
  $('.tab-pane').on('click', '.tgl-swtch input[type="checkbox"]', function () {
    
    //commented because toggle should be done only after successfull ajax call and the related code is already written in default.js
    //$(this).parent().toggleClass('atnd'); 
  });
  
  /* invite gmail functionality */
  /* g+ authorization code   */
  var clientId =  $("body").data("cid") ; // "222333367262-7euqmlnhqd5s8d1g7k57f0i62rb8l3ob.apps.googleusercontent.com" ; //
  var apiKey =    'AIzaSyDSVxesi6_iLaz4_RD5VwhYfsDt8a1qJh8'; //  "AIzaSyDGM1rONFQ466Go9Pvb2HXkTD2xObpSjdY"; //
  var scopes = ["https://www.google.com/m8/feeds/contacts/default/full", "https://www.googleapis.com/auth/plus.me", "https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/contacts"];
  var makeApiCall;
  var mls_added = false;
  var gmlAll="";
  
  function rfc3339(d) {
    function addZeroToLeft(n) {
      return n < 10 ? '0' + n : n;
    }
    d = d.getUTCFullYear() + '-'
            + addZeroToLeft(d.getUTCMonth() + 1) + '-'
            + addZeroToLeft(d.getUTCDate()) + 'T'
            + addZeroToLeft(d.getUTCHours()) + ':'
            + addZeroToLeft(d.getUTCMinutes()) + ':'
            + addZeroToLeft(d.getUTCSeconds()) + '.000+05:30';
    return d;
  }

  $('.container-fluid, #pop-prw, #rltd-bx').on("click", ".nws-tl .st-rmdr, .evt .st-rmdr", function() {
    var $this = $(this);
    var dtls = $this.parents(".tl-dtls").find(".evt-dtls");
    var id = $this.attr("id");
    if (id.indexOf("rmd-ggl") >= 0) {
      if (dtls.data("stm") == null || dtls.data("stm") == 0 || dtls.data("etm") == null || dtls.data("etm") == 0) {
        $('#sts-msg').showStatus("Start time / End time of this is not set, so you cannot add this event to your google calendar.", 'err');
        return;
      }
      var sd = new Date(parseInt(dtls.data("stm")) * 1000);
      var ed = new Date(parseInt(dtls.data("etm")) * 1000);
      makeApiCall = function crtGgleCalEvt() {
        gapi.client.load('calendar', 'v3', function() {
          var resource = {
            "summary": dtls.siblings(".ttl").text(),
            "location": dtls.find(".tm-lc .loc").text(),
            "start": {
              "dateTime": rfc3339(sd)
            },
            "end": {
              "dateTime": rfc3339(ed)
            }
          };
          var request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': resource
          });
          request.execute(function(resp) {
//          console.log(resp);
            if (resp.status == "confirmed")
              $('#sts-msg').showStatus('New event added to your google calendar successfully.', 'scs');
            else
              $('#sts-msg').showStatus(resp.message, 'err');
          });
        });
      };
      handleClientLoad();
    }
    else{
      var evtUri = dtls.parents("a").attr("href") || dtls.siblings("a").attr("href");
      var fname = evtUri.split("/")[evtUri.split("/").length - 1];
      var ettl = $().trimText(dtls.siblings(".ttl").text());
      var url =  $("body").data("auth")+"/calendar.php"+'?sum="'+ettl+'"&ds="'+dtls.data("stm")+'"&de="'+dtls.data("etm")+'"'; 
      url += '&loc="'+dtls.find(".tm-lc .loc").text()+'"&uri="'+$("body").data("rd")+evtUri+'"&fname="'+fname+'"';
      window.open(url);
    }
  });
  
//  On click invite gmail contacts 
  $('.container-fluid, #pop-prw, #rltd-bx').on("click", ".invt-opt-gml", function() {
    var par = $(this).parents(".em, #em");
    makeApiCall = function getGmailContacts() {
      gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.people.get({
          'userId': 'me'
        });
        request.execute(function(resp) {
        });
      });
      var authParams = gapi.auth.getToken(); // from Google oAuth
      authParams.alt = 'json';
      $.ajax({
        url: 'https://www.google.com/m8/feeds/contacts/default/full',
        dataType: 'jsonp',
        data: authParams,
        success: function(data) {
          var mlData = data;
          var cntct = "", mid = '';
          if(par.parents(".nws-tl").length > 0)
            mid = par.parents(".nws-tl").attr("id");
          if (mlData.feed.entry.length > 0) {
            //Handle Response
            var email = [];
            for (var i = 0; i < mlData.feed.entry.length; i++)
            {
              if (mlData.feed.entry[i].gd$phoneNumber)
              {
                continue;
              }
              else {
                email[i] = mlData.feed.entry[i].gd$email[0].address;
                cntct += '<li class="span16"><input type="checkbox" name="gml-cntcts" id="gml-cntct' + mid + i + '" class="gml-cntct" value="' + mid + i  + '" checked />' +
                        '<label for="gml-cntct' + mid + i + '" class="lbl gml-lbl">' + email[i] + ' </label></li>';

                gmlAll += email[i] + ",";
              }
            }
            par.find('.gml-lst').append(cntct).data("gmls",gmlAll);
            par.find('.frame').enableSlider();
          }
          mls_added = true;
        }
      });
    };

    if (par.find(".gml-cntcs-bx").hasClass("hideElement")) {
      par.find(".gml-cntcs-bx").removeClass("hideElement");
      par.find(".inv-lst").addClass("hideElement");
      par.find(".gml-unslct").next().removeClass("hideElement");
      par.find(".dsc").addClass("hideElement");
      
      if (!mls_added)
        handleClientLoad();
      else{
        var cntct = "",mid,mlsArr,i;
        var gmls_lst = par.find('.gml-lst').data("gmls");
        if(gmls_lst == null)
          gmls_lst = gmlAll;
        if(par.parents(".nws-tl").length > 0)
            mid = par.parents(".nws-tl").attr("id");
        if (gmls_lst.length > 0) {
          mlsArr = gmls_lst.substr(0, gmls_lst.length - 1);
          mlsArr = mlsArr.split(",");
        } 
        for(i=0;i<mlsArr.length;i++){
          cntct += '<li class="span16"><input type="checkbox" name="gml-cntcts" id="gml-cntct' + mid + i + '" class="gml-cntct" value="' + mid + i + '" checked />' +
                        '<label for="gml-cntct' + mid + i + '" class="lbl gml-lbl">' + mlsArr[i] + ' </label></li>';
        }
        par.find('.gml-lst').data("gmls", gmls_lst);
        par.find('.gml-lst').append(cntct);
        par.find('.frame').enableSlider();
      }
    }
    else {
      par.find(".gml-cntcs-bx").addClass("hideElement");
      par.find(".inv-lst").removeClass("hideElement");
      par.find(".gml-unslct").next().addClass("hideElement");
      par.find(".dsc").removeClass("hideElement");
    }
  });
  
  function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 1);
  }
  function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
  }

  function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
      delete authResult['g-oauth-window'];
      makeApiCall();
    } else {
      handleAuthClick();
    }
  }

  function handleAuthClick() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
  }

  //on click on gmail contact
  $('.container-fluid, #pop-prw, #rltd-bx').on("click", ".gml-lbl", function(e) {
    var ele = $(this);
    var gmls_lst = ele.parents(".em, #em").find('.gml-lst').data("gmls");
    var ml = ele.text().trim() + ",";
    ml = ml.trim();
    if (ele.siblings("input").prop('checked'))
      gmls_lst = gmls_lst.replace(ml, "");
    else
      gmls_lst += ml;
    ele.parents(".em, #em").find('.gml-lst').data("gmls",gmls_lst);    
  });
  
   $('.container-fluid, #pop-prw, #rltd-bx').on("click", ".gml-unslct", function(e) {
     var par = $(this).parents(".em, #em");
     if($(this).attr("checked")){
       par.find('.gml-cntcs-bx').find( "ul input[type=checkbox]" ).attr('checked', false); 
       par.find('.gml-lst').data("gmls","");
     }
     else{
       par.find('.gml-cntcs-bx').find( "ul input[type=checkbox]" ).attr('checked', true); 
       par.find('.gml-lst').data("gmls",gmlAll);
     }
   });
  
  /*end of get gmail contacts code  */
});


