$(document).ready(function () {
  // Checking if user verified his email
  var vrfd = $(this).chkVrfd();
  if (!$('#user-nav .usrname').length) {
    $(".sts-msg-bx").css("opacity", "0.95").find(".pop-cls").addClass("hideElement");
  }
  else if (!vrfd)
    setTimeout(function () {
      window.location = '/';
    }, 3000);
  //Checking if the page is in edit mode
  var isEdit = $('.crnt').data('mode') == 2;

  var map = $('#lc-holder').initMap();

  /*datepicker */
  $('#dt-holder').on('click', '.dt-tm .dropdown-menu', function (e) {
    e.stopPropagation();
  });

  $('#dt-holder').on('shwDtpkr', '.dt-mth', function () {
    var $this = $(this);
    if ($this.attr("id") == "dt-mth-to" && $("#dt-mth-frm").find(".dt").text().trim() != "Add start date") {
      var d = ($("#dt-mth-frm").data('dt')).split('/');
      var minDate = new Date(d[2], d[1] - 1, d[0]);
      $this.parents("#dt-tm-to").find('.dtpkr').datepicker("destroy").datepicker("refresh");
    }
    else
      minDate = new Date();
    if ($this.attr("id") == "dt-mth-frm" && $("#dt-mth-to").find(".dt").text().trim() != "Add end date") {
      d = ($("#dt-mth-to").data('dt')).split('/');
      var maxDate = new Date(d[2], d[1] - 1, d[0]);
      $this.parents("#dt-tm-frm").find('.dtpkr').datepicker("destroy").datepicker("refresh");
    }
    else
      maxDate = " +10m ";
    $this.parents("#dt-tm-to").find('.dtpkr').datepicker("setDate", $this.data('dt'));
    $('#popout').find('.dtpkr-bx .dtpkr').datepicker({
      dateFormat: 'dd/mm/yy',
      minDate: minDate,
      maxDate: maxDate,
      defaultDate: $this.data('dt'),
      onSelect: function (d) {
        var date = d.split('/');
        var trgt = '';
        var mn = $(this).getMnth(date[1] - 1, 'shrt');
        if ($this.attr('id') == 'dt-mth-frm')
          trgt = '-frm';
        else
          trgt = '-to';

        //updating both calenders on progress bar & on event container
        $("[id=" + $this.attr('id') + "]").each(function (i) {
          $(this).data('dt', d).find('.dt').text(mn + ' ' + date[0] + ', ');
          $(this).getTmsp($.trim($(this).find('.tm').text()));
        });

        if (trgt == '-to')
          $('#adv-opt').addClass('added');

        $("#popout").find(".tmpkr").attr("readonly", false);
      }
    }).click(function (e) {
      e.stopImmediatePropagation();
    });

    if ($this.siblings(".clr-tmsp").hasClass("hideElement"))
      $this.siblings(".clr-tmsp").removeClass("hideElement");
    else {
      if (($("#dt-mth-frm").find(".dt").text().trim() == "Add start date") && ($("#dt-mth-frm").find(".tm").text().trim() == ""))
        $("#dt-mth-frm").siblings(".clr-tmsp").addClass("hideElement");
      if (($("#dt-mth-to").find(".dt").text().trim() == "Add end date") && ($("#dt-mth-to").find(".tm").text().trim() == ""))
        $("#dt-mth-to").siblings(".clr-tmsp").addClass("hideElement");
    }
  });

  /* set Map */
  $(document).on('click', '#lc-atc', function () {
    $(this).mapAutocomplete();
  });
  /*
   *  Checking if limit rsvp is checked to enable limit textbox
   */
  $('#dt-holder, #progress-bar').on('change', '#lmt-rsvp', function () {
    var $this = $(this);
    if ($this.prop('checked'))
    {
      $this.siblings('label').text('Cancel');
      $this.parent().css('left', '60%').siblings('span').addClass('in').find('#rsvp-cnt').removeAttr('disabled');
    }
    else
    {
      $this.parent().css('left', '0').siblings('span').removeClass('in').find('#rsvp-cnt').attr('disabled', 'disabled').val('');
      $this.siblings('label').text('Limit RSVP');
    }
  });
  //Getting event details while editing the event

  /* Set default date and time when event page is opened */
  if (isEdit)
  {
    var edt = $('.edtr').data('desc');
    $('#lc-holder').mapLocation();
    $('#loading_img').remove();
    $('#article-editor .stry').loadArt($('.evt-data').val(), 1);
    if ($('.atch-container ul.atch-list').data('atchd') != null)
      $(this).listDoc($('.atch-container ul.atch-list').data('atchd'), 0);
  }
  else
    $('#txt1').enableEditor('txt1');
  /* Showing image description and copyright content on hover */
  $('.i-b, .header-image').on('hover', function (e) {
    $(this).showImgDesc(e);
  });


  //Saving event after editing
  var cmplt = {};
  var pb = $('#progress-bar');
  $('#evt-save').on('click', function (e) {
    e.preventDefault();
    var edtr = $('.crnt');
    if ($('#hd-sctn .m-hd').hasClass('emty'))
    {
      $('#sts-msg').showStatus('Your event looks incomplete without a title! Add a title and try publishing again', 'err');
      return false;
    }
    if ((!edtr.find('.t-b').length) || (edtr.find('.t-b:not(.emty)').length == 0))
    {
      $('#sts-msg').showStatus('Adding description about your event will attract more viewers!', 'err');
      return false;
    }
    if ($('#dt-holder #dt-mth-frm').data('tmsp'))
      cmplt.tmsp = $('#dt-holder #dt-mth-frm').data('tmsp');
    else
      cmplt.tmsp = 0;
    cmplt.etmsp = $('#dt-holder #dt-mth-to').data('tmsp');
    if ($('#dt-holder #lc-atc').val())
      cmplt.lc = $('#dt-holder #lc-atc').val().replace(/'/g, "&#39;");
    else
      cmplt.lc = "";
    if (pb.find('#ctrl-bx').length == 0)
    {
      $.post($('body').data('api') + '/gtf', {
        "id": "p-b",
        "rt": pb.data('rdrctTo')
      }, function (d) {
        d = JSON.parse(d);
        pb.find('> section').html(d.frm).showPopup(1);
        pb.find('.frame').each(function () {
//          $(this).siblings(".scrollbar").css("height",$(this).height());
          $(this).enableSlider();
        });
        pb.fetchTagSgstns(getEvtTxt(0), 'E');
        if (isEdit)
          pb.loadEdtPrphls(edt);
      });
    }
    else
    {
      pb.find('> section').showPopup(1);
      pb.fetchTagSgstns(getEvtTxt(0), 'E');
      if (isEdit)
        pb.loadEdtPrphls(edt);
      if (Object.keys(cmplt).length)
      {
        if (cmplt.ctgy == undefined || cmplt.hstg == undefined)
        {
          pb.find('#ctrl-bx #err-box').css('left', '100%').removeClass('in');
          pb.find('#ctrl-bx > div > section').css('left', '0').addClass('in');
        }
        else if ($('#cvr-img').data('img') == undefined)
          pb.fetchCvrImg();
        else if (!pb.data('sgstnAdded'))
          pb.find('#ctrl-bx section').css('left', '-100%');
        else if ((cmplt.tmsp == undefined) || (cmplt.lc == '') || (cmplt.etmsp != undefined && (cmplt.etmsp <= cmplt.tmsp)))
        {
          var loc = '';
          if (cmplt.tmsp == undefined)
            loc = 'stm';
//          else if (cmplt.lc == '')
//            loc = 'lc';
          else if (cmplt.etmsp < cmplt.tmsp)
            loc = 's>e';
          shwDtlsErr(loc);
        }
        else
          chkabsvns();
      }
    }
  });
  $('#progress-bar').on('click', '#ctgy-box .ctgy-lst li,#ctgy-box .ctgy-lst li input', function (e) {
    var ctlst = $(this).parent().children('li');
    setTimeout(function () {
      var ctgy = [];
      ctlst.find('input').each(function (i, e) {
        if ($(this).prop('checked'))
          ctgy.push($.trim($(this).attr('name')));
      });
      if (ctgy.length == 0)
        $('#ctgy-box').find(' > span').text('Choose Category').addClass('slctd');
      else if (ctgy.length == 1)
        $('#ctgy-box').find(' > span').text(ctgy[0]);
      else
        $('#ctgy-box').find('> span').text(ctgy.length + ' categories selected');
      $(this).fetchHstgSgstns(getEvtTxt(0), 'E', ctgy.join(','));
    }, 20);
  });
  /*
   * Save article/event/petition suggestions chosen by author
   */
  pb.on('click', '#sv-sgstns', function () {
    var json = $(this).addHtgSpc();
    cmplt.hstg = json.hstg;
    cmplt.spc = json.spcs;
    $('#progress-bar').data('sgstnAdded', 1);
    chkabsvns();
  });
  /*
   * Show image upload area when "upload another image" is clicked
   */
  pb.on('click', '#chs-cvr-img', function () {
    $(this).parent().siblings('#err-img-hldr').css('top', '-100%').addClass('in');
  });
  /*
   * Save newly uploaded image as cover image
   */
  pb.on('click', '#err-upld-img', function () {
    var imgDt = $(this).parents('#err-img-hldr').data('img');
    $('#cvr-img').data('img', imgDt);
    chkabsvns();
  });
  /*
   * Show images list when back button is clicked
   */
  pb.on('click', '#err-bk', function () {
    if (!$(this).hasClass('er-bx'))
    {
      $(this).parents('#err-img-hldr').css('top', '0').removeClass('in');
      restoreErrImgBox();
      chkabsvns();
    }
  });
  /*
   *
   */
  pb.on('click', '#sv-cvr-img', function () {
    var slctdImg = $(this).siblings('.frame').find('.img-lst > li.selected').data('img');
    $('#cvr-img').data('img', {
      "id": "cvr-bg",
      "src": slctdImg.src,
      "cn": slctdImg['cp']['cn']
    });
    $(this).parents('section').siblings('.err-msg').text('Cover Image saved')
            .addClass('scs').siblings('.s-h').addClass('hideElement');
    chkabsvns();
  });

  pb.on('click', '#sv-dtls', function () {
    var trgt = $(this).parent();
    var strt = trgt.find("#dt-mth-frm").data('tmsp');
    var end = trgt.find("#dt-mth-to").data('tmsp');
    if (cmplt.tmsp == undefined)
    {
      if (strt !== undefined)
        cmplt.tmsp = strt;
      else
      {
        trgt.find('h4').text('When is this event scheduled?');
        trgt.find('.err-msg').text('Enter event start date and time below');
        return false;
      }
    }
    if (end !== undefined)
    {
      if (end <= strt)
      {
        trgt.find('h4').text('errr..!! Something wrong with the end date');
        trgt.find('.err-msg').text('Event end time cannot be before the start time');
        return false;
      }
      else {
        cmplt.tmsp = strt;
        cmplt.etmsp = end;
      }
    }
    if (trgt.find('#dt-holder #lc-atc').val())
      cmplt.lc = $('#dt-holder #lc-atc').val().replace(/'/g, "&#39;");
//    if (cmplt.lc == '')
//    {
//      if (trgt.find('#lc-atc').val() != '')
//        cmplt.lc = trgt.find('#lc-atc').val().replace(/'/g, "&#39;");
//      else
//      {
//        trgt.find('h4').text('Where is this event happening?');
//        trgt.find('.err-msg').text("Enter event's location below");
//        return false;
//      }
//    }
    chkabsvns();
  });

  /* If clicks 'Yes' to show his/her contacts */
  pb.on('click', '#sv-cnct', function () {
    cmplt.cnct = "y";
    chkabsvns();
  });
  /* If clicks 'No' to show his/her contacts */
  pb.on('click', '#dntsv-cnct', function () {
    cmplt.cnct = "n";
    chkabsvns();
  });

  // Sending article for moderation
  $('#progress-bar').on('click', '#snd-fr-mod', function () {
    publishEvent(1);
  });
  function chkabsvns()
  {
    $.ajax({
      url: '/ajax/chkabsvnss',
      dataType: 'text',
      data: {
        "data": getEvtTxt()
      },
      type: 'post',
      beforeSend: function () {
        pb.find('.sts').addClass('scs').html('<i class="icon-ok-circle"></i>Checking content..');
        var data = getEvtTxt(1);
        if (!data)
        {
          var loc = '';
          switch (isError.loc)
          {
            case 'pstbhf':
              loc = 'Enter the name of the person on whose behalf you are creating this event';
              break;
            case 'stm':
            case 's>e':
              shwDtlsErr(isError.loc);
              loc = 'Err! End time should be greater than start time.';
              break;
          }
          $('#sts-msg').showStatus(loc, 'err');
          return false;
        }
      },
      success: function (err, status, xhr) {
        if (err != '')
        {
          err = JSON.parse(err);
          if (err['success'] == 0)
          {
            var stsmsg = 'Oops! An unexpected word encountered in ';
            switch (err['msg'])
            {
              case 'ttl':
                stsmsg += 'in the title of your event';
                break;
              case 'at':
                stsmsg += 'your event\'s text.';
                break;
              case 'hsg':
                stsmsg += 'hashtags you added.';
                break;
            }
            sts.removeClass('scs').addClass('err').html('<i class="icon-remove-circle"></i>' + stsmsg + ' Click continue at the bottom if you think there\'s nothing offensive.').appendTo('#progress-bar .messages');
          }
          else if (err['success'] == -10)
            sts.removeClass('scs').addClass('err').html('<i class="icon-remove-circle"></i>' + err['msg']).appendTo('#progress-bar .messages');
          pb.find('.mod-cnfrm').removeClass('hideElement').siblings('> div').addClass('hideElement');

          //to fix the overflow hidden issue with calendar on progress bar
          pb.find("#dt-holder").parents(".lft-bx").css("overflow", "visible");
        }
        else
        {
//          sts.removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Yeah! Everything is fine').appendTo('#progress-bar .messages');
          pb.find('progress').attr('value', '50');
          publishEvent(0);
        }
      }
    });
  }
  // Setup error page if any error is encountered with event date/location
  function shwDtlsErr(loc)
  {
    pb.find('#err-box').after('<div class="transition err-box" id="dtls-err"><h4 class="s-h"></h4>' +
            '<p class="err-msg"></p></div>');
    var dtlsErr = pb.find('#dtls-err');
    dtlsErr.addClass('in').css('left', '0').siblings('.err-box').css('left', '100%').removeClass('in')
            .siblings('section').removeClass('in');
    dtlsErr.append($('#dt-holder').clone());
    dtlsErr.find('#dt-holder .dtpkr').datepicker('destroy');
    pb.find('#lc-holder').initMap();
    dtlsErr.append('<button class="btn pull-left go-bk er-bx">Back</button><button class="btn btn-success pull-right" id="sv-dtls">Save</button>');
//    pb.find('#ctrl-bx > div').css('overflow', 'inherit');
//    if (loc == 'lc')
//    {
//      dtlsErr.find('h4').text('Where is this event happening?');
//      dtlsErr.find('.err-msg').text('Enter event location below');
//    }
//    else
//      pb.find('#dtls-err #lc-holder').mapLocation();
    if (loc == 'stm')
    {
      dtlsErr.find('h4').text('When is this event scheduled?');
      dtlsErr.find('.err-msg').text('Enter event start time below');
    }
    else if (loc == 's>e')
    {
      dtlsErr.find('h4').text('errr..!! Some issue with end date');
      dtlsErr.find('.err-msg').text('Event end date cannot be before the start date');
    }
  }

  /* asking permission to show his/her contacts */
  function shwCntctMsg()
  {
    pb.find('#err-box').after('<div class="transition err-box" id="dtls-err"><h4 class="s-h"></h4>' + '</div> ');
    var dtlsErr = pb.find('#dtls-err');
    dtlsErr.addClass('in').css('left', '0').siblings('.err-box').css('left', '100%').removeClass('in')
            .siblings('section').removeClass('in');
    dtlsErr.append("<div><br>You want to show your contact details in event view page ? <br><br><br></div>");
    dtlsErr.append('<button class="btn btn-danger pull-right" id="dntsv-cnct">No</button><button class="btn btn-success pull-right" id="sv-cnct">Yes</button>');
    dtlsErr.append('<button class="btn pull-left go-bk er-bx">Back</button>');
  }
  //Function to extract only text from event
  var isError = {};
  function getEvtTxt(chkErrs)
  {
    var atxt = {};
    // event title
    if (!$('#hd-sctn').find('.m-hd').hasClass('emty'))
      atxt.ttl = $.trim($('.m-hd').text());

    // Event Start time and returning error if start time is not set
    if (cmplt.tmsp == undefined && chkErrs)
    {
      isError.sts = 1;
      isError.loc = 'stm';
      return false;
    }
    // Event end time if set and returning error if end time is before the start time
    if (cmplt.etmsp && (cmplt.etmsp < cmplt.tmsp) && chkErrs)
    {
      isError.sts = 1;
      isError.loc = 's>e';
      return false;
    }
    // Checking if post on behalf option selected and not entedred the name
    if ($('#enbl-pstbehaf').is(":checked") && $('#usr-bar #pstbehaf').val() == '' && chkErrs)
    {
      isError.sts = 1;
      isError.loc = 'pstbhf';
      return false;
    }
    /* Check location */
//    if (cmplt.lc == '' && chkErrs)
//    {
//      isError.sts = 1;
//      isError.loc = 'lc';
//      return false;
//    }
    // If everything is fine, reset iserror variable.
    isError = {};
    // event text
    var tmpstr = '';

    var el = $('.crnt').find(' > .stry > .e-b');
    el.each(function () {
      var $this = $(this);
      if ($this.data('edDt') != undefined)
      {
        if ($this.hasClass("cht-b"))
          var tmp = $this.chkChrtDt();
        else
          tmp = $this.data('edDt');
        if ($this.hasClass('t-b'))
        {
          tmpstr += tmp.data.replace(/<br.*?>/g, '') + " ";
          if (tmp['imgs'])
          {
            $.each(tmp['imgs'], function (i, img) {
              tmpstr += img.cp.it + " " + img.cp.id + " " + img.cp.cn + " ";
            });
          }
        }
        else if ($this.hasClass('m-b'))
        {
          if (tmp.ttl != undefined)
            tmpstr += tmp.ttl + " ";
        }
        else if ($this.hasClass('m-b'))
        {
          if (tmp.ttl != undefined)
            tmpstr += tmp.ttl + " ";
        }
        else if ($this.hasClass('inlne-image'))
        {
          // For getting text from slideshows
          if (tmp.data != undefined)
          {
            $.each(tmp['data'], function (i, img) {
              tmpstr += img.cp.it + " " + img.cp.id + " " + img.cp.cn + " ";
            });
          }
          else // To get desc from images
            tmpstr += tmp.cp.it + " " + tmp.cp.id + " " + tmp.cp.cn + " ";
        }
      }
    });
    atxt.at = tmpstr;
    var etxt = [];
    etxt.push(atxt);
    return etxt;
  }

    function publishEvent(frcMod)
    {
        pb.find('#ctrl-bx .btn').addClass('hideElement');
        pb.find('progress').attr('value', '50');
        var sts = $('#progress-bar').find('.messages .sts:last').clone();
        sts.removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Processing your event data for submission').appendTo('#progress-bar .messages');
        /* Building json object from the event page */
        genCt(frcMod);
        if (!$.isEmptyObject(cmplt))
        {
            $.ajax({
                'url': $('body').data('api') + '/ece',
                'data': cmplt,
                'dataType': 'text',
                'type': 'post',
                'success': function (d, status, xhr) {
                    var t = JSON.parse(d);
                    if (t.success == 1)
                    {
                        $('.edtr').data('cmplt', 1);
                        if (cmplt.isE)
                        {
                            if ($("#evt-save").data("ests") == '3')
                                sts.clone().removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Done! Your event is saved successfully. Please wait while we redirect...').appendTo('#progress-bar .messages');
                            else
                                sts.clone().removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Done! Your event is saved successfully and will be updated after moderator\'s approval. Please wait while we redirect...').appendTo('#progress-bar .messages');
                            setTimeout(function () {
                                window.location = t.msg;
                            }, 4000);
                        }
                        else
                        {
                            $('.sts-msg-bx .pop-cls').remove();
                            pb.find('.mod-cnfrm').addClass('hideElement').siblings('div.pg-cnfrm').removeClass('hideElement');
                            sts.clone().removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Done! Your event is saved successfully.').appendTo('#progress-bar .messages');
//              sts.clone().removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>You can check all your unmoderated events in your dashboard.').appendTo('#progress-bar .messages');
                            var artBtn = pb.find('.pg-cnfrm').find('a[href="#"]');
                            if (!pb.data('rdrct'))
                                artBtn.siblings('a').addClass('hideElement');
                            //.attr('href', '/' + $('#user-nav .usrname').attr('href').slice(1) + '/dashboard?UnmoderatedEvents').text('View all unmoderated events')
                            else
                            {
                                var href = decodeURIComponent(artBtn.siblings('a').attr('href'));
                                if (href.indexOf('elections') != -1)
                                    artBtn.siblings('a').text('Back to elections page');
                            }
                            artBtn.attr('href', t.msg).text('View this event');
                        }
                        pb.find('progress').attr('value', '100');
                    }
                    else {
                        sts.clone().removeClass('scs').addClass('err').html('<i class="icon-remove-circle"></i> ' + t.msg).appendTo('#progress-bar .messages');
                        pb.find('#ctrl-bx .btn').removeClass('hideElement');
                        return false;
                    }
                },
                complete: function (d) {
                    var t = JSON.parse(d.responseText);
                    if (!isEdit && $("#del-drft").length == 0)
                        $('#progress-bar').getFdbckFrm("E", t.msg);
                }
            });
        }
    }

    function genCt(frcMod) {
        var imglst = [], imgflpath = [], evt = [];
        cmplt.ttl = pb.trimText($('.m-hd').html());
        cmplt.sndMod = frcMod;
        var frstBlk = $('.stry > .t-b:first');
        if (frstBlk.data('edDt') != undefined)
        {
            frstBlk = frstBlk.data('edDt');
            cmplt.smry = frstBlk['data'].substr(0, 200);
        }

        var refd = '';
        var tagd = '';
        if ($('#hd-sctn .m-hd').data('refd') != undefined)
            refd += $('#hd-sctn .m-hd').data('refd');
        if ($('#hd-sctn .m-hd').data('tagd') != undefined)
            tagd += $('#hd-sctn .m-hd').data('tagd');

        //RSVP Limit
        if ($('#lmt-rsvp').is(":checked"))
            cmplt.rsvp = $('#rsvp-cnt').val();
        //Adding Editor elements
        var el = $('.crnt').find('.stry > .e-b');
        el.each(function (i, elem) {
            var $this = $(elem);
            if ($this.data('edDt') != undefined)
            {
                if ($this.hasClass("cht-b"))
                    var ed_dt = $this.chkChrtDt();
                else
                    ed_dt = $this.data('edDt');
                var tmp = null;
                if ($this.hasClass('i-b'))
                {
                    if (ed_dt.data != undefined)
                    {
                        $.each(ed_dt.data, function (i, img) {
                            tmp = img.src;
                            if (tmp.search('/public/Uploads') != -1) {
                                imgflpath.push(tmp);
                                tmp = tmp.split('/');
                                imglst.push(tmp[tmp.length - 1]);
                            }
                        });
                    }
                    else
                    {
                        tmp = ed_dt.src;
                        if (tmp.search('/public/Uploads') != -1) {
                            imgflpath.push(tmp);
                            tmp = tmp.split('/');
                            imglst.push(tmp[tmp.length - 1]);
                        }
                    }
                }
                if (ed_dt.data != undefined)
                    evt.push(ed_dt);
            }
            else if ($this.hasClass('listicle'))
            {
                var listicle = [];
                $this.find('.item').each(function (i, e) {
                    var $this = $(this);
                    if ($this.hasClass('active'))
                    {
                        var aDt = $this.data('edDt');
                        aDt = typeof aDt != 'object' ? JSON.parse(aDt) : aDt;
                        aDt['data'] = [];
                        $this.find('.e-b').each(function () {
                            if ($(this).data('edDt') != undefined)
                                aDt['data'].push($(this).data('edDt'));
                        });
                        if (aDt['data'].length)
                            listicle.push(aDt);
                    }
                    else if ($this.data('edDt')['data'] != undefined)
                    {
                        if ($this.data('edDt')['data'].length)
                            listicle.push($this.data('edDt'));
                    }
                });
                if (listicle.length)
                    evt.push({"id": $this.attr('id'), "data": listicle});
            }
            refd += $(elem).data('refd') ? $(elem).data('refd') + '::' : '';
            tagd += $(elem).data('tagd') ? $(elem).data('tagd') + '::' : '';
        });
        if (!evt.length)
        {
            $('#progress-bar .sts:last').clone().removeClass('scs').addClass('err').html("<i class='icon-remove-circle'></i> Oops! Our systems doesn't allow events without any description. Start writing and try again.").appendTo('#progress-bar .messages');
            return false;
        }

        var cvrimg = $('#cvr-img').data('img');
        if (cvrimg != undefined)
        {
            cmplt.c_img = cvrimg['src'];
            var tmp = (cvrimg['src']).split('/');
            imglst.push(tmp[tmp.length - 1]);
            imgflpath.push(cvrimg['src']);
            evt.push(cvrimg);
        }

        cmplt.desc = evt;
        cmplt.imglst = imglst;
        cmplt.imgflpath = imgflpath;

        // Adding attachments to JSON
        var cntnr = $('#event-page').find('.atch-container .atch-list');
        if (cntnr.find('li').length > 1)
        {
            var atchd = [];
            cntnr.find('li').each(function () {
                if ($(this).data('atch') != undefined)
                    atchd.push($(this).data('atch'));
            });
            cmplt.atchmt = atchd;
        }
        if (!$.isEmptyObject(cmplt))
        {
            cmplt['ref'] = refd;
            cmplt['tag'] = tagd;
            cmplt['auth'] = pb.getShIntr();
            cmplt['usr'] = pb.getLoggedInUsr();
            if (isEdit)
            {
                cmplt['isE'] = 1;
                cmplt['eid'] = edt.id;
                cmplt['tid'] = edt.tid;
            }
            else
                cmplt['isE'] = 0;

            if ($('#enbl-pstbehaf').is(":checked"))
                cmplt.pob = $('#usr-bar #pstbehaf').attr("unme");
        }
  }  
  /* Tab structure functionality */
  $('.ad-phpl').on('click', function () {
    var isTbd = $('#event-container').find('#evt-tb').length;
    $('#article-container').addClass('tab-content');
    var reqTb = this.dataset.type;
    if (isTbd)
    {
      var tabs = $('#event-container').find('ul#evt-tb');
    }
    else
    {
      var tabs = $('<ul>').attr('id', 'evt-tb').addClass('nav nav-tabs');
      tabs.append('<li class="span3"><a href="#article-editor" data-toggle="tab">Description</a></li>');

      $('#article-editor').before(tabs);
    }
    if (!tabs.find('li.' + reqTb).length)
    {
      tabs.find('li').removeClass('active');
      $('#event-container .tab-content').find('.crnt').addClass('tab-pane fade in');
      if (reqTb == 'agnda')
      {
        tabs.append('<li class="' + reqTb + ' active span3"><a href="#' + reqTb + '" data-toggle="tab">Agenda</a></li>');
        $('#event-container .tab-content').append('<div id="' + reqTb + '" class="tab-pane fade in active"></div>');
      }
      else if (reqTb == 'lvblg')
      {
        tabs.append('<li class="' + reqTb + ' active span3"><a href="#lvblg" data-toggle="tab">Live Blog</a></li>');
        $('#event-container .tab-content').append('<div id="' + reqTb + '" class="tab-pane fade in active"></div>');
      }
    }
  });

  pb.on('click', '#prg-close', function () {
    if ($('#dtls-err').length)
      $('#dtls-err').remove();
  });

  /* share functionality in progress bar*/
  $('#progress-bar').on('click', '.scl-shr .fb-share', function (e) {
    e.preventDefault();
    var url = $("body").data("rd") + $(this).data("url");
    FB.ui({
      method: 'feed',
      name: cmplt.ttl,
      picture: cmplt.cvimg,
      link: url,
      caption: "Created by: " + $("body").data("user"),
      actions: {"name": "Create new event", "link": $("body").data("rd") + "/new/event"}
    },
    function (res) {
    });
  });

  $('#progress-bar').on('click', '.scl-shr .tw-tweet', function () {
    var url = $("body").data("rd") + $(this).data("url");
    window.open('https://twitter.com/intent/tweet?original_referer=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(cmplt.ttl) + '&tw_p=tweetbutton&url=' + encodeURIComponent(url) + '&via=SaddaHaqMedia', '', 'toolbar=0,status=0,width=548,height=325');
  });

  $('#progress-bar').on('click', '.scl-shr .gp-share', function () {
    var url = $("body").data("rd") + $(this).data("url");
    window.open('https://plus.google.com/share?url=' + url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
  });
  $('#progress-bar').on('click', '.scl-shr .rd-share', function () {
    var url = $("body").data("rd") + $(this).data("url");
    window.open('//www.reddit.com/submit?url=' + encodeURIComponent(url));
    return false;
  });

  /*
   $("#progress-bar").on("click", ".pg-cnfrm a", function() {
   var link = $('body').data('api') + $(".pg-cnfrm a:last-child").attr("href") + "}";
   $.ajax({
   url: '/ajax/getSclSts',
   succes: function(res) {
   for (var i = 0; i < res.length; i++) {
   switch (res[i]) {
   case 'F':
   FB.getLoginStatus(function(response) {
   if (response.status === 'connected') {
   FB.api('/me/feed', 'post', {
   message: 'Attending this event..',
   link: link,
   action: {
   name: "Attend",
   link: link
   }
   }, function(response) {
   });
   } else if (response.status === 'not_authorized') {
   
   } else {
   FB.login(function() {
   FB.api('/me/feed', 'post', {
   message: 'Attending this event..',
   link: link,
   action: {
   name: "Attend",
   link: link
   }
   }, function(response) {
   });
   });
   }
   });
   break;
   
   case 'G':
   var tgturl = "https://plus.google.com/share?url={" + link;
   $("#gp-btn").attr("href", tgturl);
   $("#gp-btn").trigger("click");
   break;
   
   case 'T':
   $.ajax({
   url: "/ajax/twtShr",
   data: {
   "msg": "Attending this event..",
   "url": link
   },
   success: function(res) {
   
   }
   });
   break;
   }
   }
   }
   });
   });
   */

  /* clear date & time in event details*/
  $('#dt-holder').on('click', '.clr-tmsp', function () {
    var $this = $(this);
    var trgt = $this.siblings(".dt-mth");
    if ($(this).siblings(".dropdown-menu").find(".s-h").text() == "End Time")
      trgt.find(".dt").html("Add end date");
    else
      trgt.find(".dt").html("Add start date");
    if (isEdit)
      trgt.data('tmsp', 0);
    else
      trgt.data('tmsp', null);
    trgt.data('dt', null);
    trgt.find(".tm").empty();
    $this.siblings(".dropdown-menu").find(".tmpkr").val("");
    $("#dt-holder").find('.dtpkr').datepicker("destroy").datepicker("refresh");
    $this.addClass("hideElement");
    $(".tmpkr").attr("readonly", "true");
  });
  $('#dt-holder').on('click', '.tmpkr', function () {
    var $this = $(this);
    if ($this.attr("readonly")) {
      $this.siblings(".err-msg").text("Please select a date before choosing time").removeClass("hideElement");
      setTimeout(function () {
        $this.siblings(".err-msg").addClass("hideElement");
      }, 3000);
    }
    //$('#sts-msg').showStatus('Select date before entering time', 'err');
  });

//  $(document).click(function () {
//    if (($("#dt-mth-frm").find(".dt").text().trim() == "Add start date") && ($("#dt-mth-frm").find(".tm").text().trim() == ""))
//      $("#dt-tm-frm").find(".clr-tmsp").addClass("hideElement");
//    if (($("#dt-mth-to").find(".dt").text().trim() == "Add end date") && ($("#dt-mth-to").find(".tm").text().trim() == ""))
//      $("#dt-tm-to").find(".clr-tmsp").addClass("hideElement");
//  });
   
   /* Drafting fucntionality */
    $('#progress-bar').on('click', '#prg-close', function () {
        autoDraft();
    });
    $('#art-drft').on('click', function (e) {
        e.preventDefault();
        saveDrft(0);
    });
    // Auto Drafting every 5seconds
    var drftId = null;
    var drftTimr = null;

    $(window).load(function () {
        autoDraft();
    });
    function autoDraft()
    {
        drftTimr = setInterval(function () {
            saveDrft(1);
        }, 15000);
    }
    
    // Function to save Article draft
    var lstRev = 0;
    function saveDrft(isAuto)
    {
        genCt(1);
        var isChngd = $('#art-drft').data('chngd');
        var usr = $(document).getLoggedInUsr();
        if (!isAuto && $.isEmptyObject(cmplt))
        {
            $('#sts-msg').showStatus("There's nothing to save as draft", "err");
            return false;
        }

        //Getting article details while editing a drafted article
        if (!$.isEmptyObject(cmplt) && (isChngd || !isAuto))
        {
            $('#art-drft').text('Saving..').attr('disabled', 'disabled');
            $.post($('body').data('api') + '/adr', {
                'data': cmplt, 
                'isAuto': isAuto
            },
            function (url) {
                var tmp = JSON.parse(url);
                if (isAuto)
                {
                    /*
                     * save draft Id into "draftId" variable and display last drafted time. 
                     * Also saving the draftId to a-dt:id variable if it is empty so as to send the draftId while publishing the article
                     * 
                     * t.success -> 1  = success
                     *             -1  = something went wrong.
                     *             -2  = Invalid draftId
                     *             -10 = login session doesn't exist
                     */
                    switch (parseInt(tmp.success)) {
                        case 1:
                            drftId = tmp.msg;
                            if (cmplt.id == '')
                                $(".edtr").data('desc', '{"id":"' + drftId + '","tid":""}');
                            lstRev = tmp['rev'] != undefined && tmp['rev'] != lstRev ? tmp['rev'] : lstRev;
                            var d = new Date();
                            var tm = $('#usr-bar').getDateTime(d.getTime() / 1000);
                            var drftbx = $('.wrt-opts').find('#drft-lst');

                            drftbx.siblings('.del').removeClass('hideElement');
                            drftbx.find('.frame > ul').find('.dft-msg').remove();

                            drftbx.find('.frame > ul').prepend('<li><a href="' + $('body').data('auth') + '/articledraft/' + tmp['msg'] + (lstRev ? '/rev/' + lstRev : '') + '">Autosaved on ' + tm.m + " " + tm.d + ", " + tm.t + '</a></li>').parents('.frame').enableSlider();
                            $('#art-drft').data('chngd', 0).text('Draft');
                            history.pushState({}, '', $('body').data('auth') + '/articledraft/' + tmp['msg'] + (lstRev ? '/rev/' + lstRev : ''));
                            break;

                        case 0:
                            $('#sts-msg').showStatus(tmp.msg, 'err');
                            $('#art-drft').data('chngd', 0);
                            break;
                    }
                }
                else
                {
                    switch (parseInt(tmp.success)) {
                        case 1:
                            $('.edtr').data('cmplt', 1);
                            $('#sts-msg').showStatus("Draft saved successfully! Please wait while we redirect you to drafts section..", "scs");
                            $('#art-drft').text('Draft');
                            setTimeout(function () {
                                window.location = '/' + usr + '/drafts';
                            }, 3000);
                            break;
                        case 0:
                            $('#sts-msg').showStatus(tmp.msg, 'err');
                            $('#art-drft').data('chngd', 0);
                            break;
                        default:
                            window.location = '/';
                            break;
                    }
                }
            });
        }
        else if (!isAuto)
        {
            $('#sts-msg').showStatus("Draft saved successfully! Please wait while we redirect you to drafts section..", "scs");
            setTimeout(function () {
                window.location = '/' + $('.usrname').attr('href').split('/')[3] + '/drafts';
            }, 3000);
        }
    }
});