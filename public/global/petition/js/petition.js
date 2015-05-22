$(document).ready(function () {
  //API domain
  var api = $('body').data('api');

  if (location.pathname.split("/")[1] == "new") {
    var vrfd = $(this).chkVrfd();
    if (!$('#user-nav .usrname').length) {
      $(".sts-msg-bx").css("opacity", "0.92").find(".pop-cls").addClass("hideElement");
    }
    else if (!vrfd)
      setTimeout(function () {
        window.location = '/';
      }, 3000);
  }

  /*
   * 
   * data-mode value refers to the page user is using
   * 1 -> writing page
   * 2 -> editing page
   * 0/undefined -> view mode
   */
  var isWrite = $('.crnt').data('mode') == 0 || $('.crnt').data('mode') == 2;
  var isEdit = ($('#ptn-ctnt').data('mode') == 2);
  var pet_dt = $('.edtr').data('desc');
  if ($('.atch-container .atch-list').data('atchd') != null)
    $(this).listDoc($('.atch-container .atch-list').data('atchd'), isEdit);
  if (isWrite)
  {
    if (isEdit)
    {
      $('#ptn-ctnt .stry').loadArt(JSON.parse($('#ptn-dt').val()), isEdit);
      $('#aux-container').find('div[class$="-container row-fluid"] img').css({
        'width': '40px',
        'height': '40px'
      });
    }
    else
    {
      $('#txt1').enableEditor();
//      $('#txt1').makeDroppable();
      if ($('#ib-1').find('.img-preview').length)
        $('#ib-1').find('.img-preview').fadeIn();

      $('#imageUpload').positionElement({
        'parent': $('.img-holder'),
        'top': true
      });
    }
    // Adding url to ptn-cncl button based on the status of petition
    if (pet_dt != undefined)
    {
      if (pet_dt.sts == 2)
        $('#menubar #ptn-cncl').attr('href', '/unmoderated/petition/' + pet_dt.tid);
      else
        $('#menubar #ptn-cncl').attr('href', '/petition/' + pet_dt.htg + '/' + pet_dt.tid);
    }
    $('#pop-prw').on('blur', '#ptn-nme', function () {
      var $this = $(this);
      if ($this.val() != '')
        $this.removeClass('error').parents('form').find('p:last').addClass('info')
                .text('You can edit and add other details later if you do not have them ready').removeClass('transparent');
      else
        $this.parents('form').find('p:last').addClass('transparent');
    });
    $('#pop-prw').on('submit', '#ptnr-dt', function (e) {
      e.preventDefault();
      var trgt = $('#ptnr-dtls ul.ptn-lst');
      var $this = $(this);
      var nme = $this.find('#ptn-nme');
      var reg = /^[a-zA-Z0-9_\+-]+(\.[a-zA-Z0-9_\+-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.([a-zA-Z]{2,4})$/;
      var prsn_dtls = {};
      if ($this.find("#ptn-eml").val() != '' && !reg.test($this.find("#ptn-eml").val())) {
        $this.find(".err-msg").text("Invalid Email.").removeClass('transparent info');
        return false;
      }
      if (nme.val() != '')
      {
        var err = nme.parents('form').find('p:last');
        if (trgt.find('li.hideElement').length)
        {
          var json = trgt.find('li.hideElement').data('dtls');
          json.name = trgt.trimText(nme.val());
          json.title = trgt.trimText($this.find('#ptn-nbr').val());
          json.eml = trgt.trimText($this.find('#ptn-eml').val());
          json.adr = trgt.trimText($this.find('#ptn-adrs').val());
          trgt.find('li.hideElement').data('dtls', json)
                  .removeClass('hideElement').find('span.ttl').text(nme.val() + ', ' + $this.find('#ptn-nbr').val());
          $('#sts-msg').showStatus(nme.val() + " details updated successfully", "scs");
          $('.lightbox .pop-cls').trigger('click');
        }
        else
        {
          prsn_dtls = {
            "name": trgt.trimText(nme.val()),
            "title": trgt.trimText($this.find('#ptn-nbr').val()),
            "eml": trgt.trimText($this.find('#ptn-eml').val()),
            "adr": trgt.trimText($this.find('#ptn-adrs').val())
          };
          var apnd = "<li class='span15' data-dtls='" + JSON.stringify(prsn_dtls) + "'>" +
                  "<span class='ttl'> " + $this.find('#ptn-nme').val();
          if ($this.find('#ptn-nbr').val() != '')
            apnd += ", " + $this.find('#ptn-nbr').val();
          apnd += " </span><a href='#' class='ptn-nme transition in' title='Edit'> <i class='icon-pencil'></i> </a>";
          apnd += "<a href='#' class='del-ptnr transition in' title='Delete'> <i class='icon-remove-circle'></i> </a></li>";
          trgt.append(apnd);
          $('#sts-msg').showStatus(prsn_dtls.name + " is added in the list successfully", "scs");
          $('.lightbox .pop-cls').trigger('click');
        }
        $this.resetForm();
        nme.removeClass('error');
        $this.find('#ptn-nme').siblings("p").removeClass('err-msg');
      }
      else
        nme.addClass('error').parents('form').find('p:last').text('Enter the name of the person whom you want to petition').removeClass('scs info transparent');
      $this.resetForm();
      return false;
    });
    /*
     * Functionality to update details of person to whom petition is sent
     */
    $('#ptnr-dtls').on('click', '.ptn-nme,.add-ptnr', function (e) {
      e.preventDefault();
      var $this = $(this);
      var prw = $('#pop-prw');
      if (!prw.find('#ptnr-dt').length)
      {
        $.ajax({
          url: api + '/gtf',
          type: 'post',
          data: {
            'id': 'pr-bx'
          },
          success: function (prw) {
            var data = JSON.parse(prw);
            $('#pop-prw > section').append(data['frm']).showPopup(1);
          },
          complete: function () {
            edtPtnr($this, prw);
          }
        });
      }
      else
      {
        $('#pop-prw > section').showPopup(1);
        edtPtnr($this, prw);
      }
    });

    function edtPtnr($this, prw)
    {
      var frm = prw.find('#ptnr-dt');
      if ($this.hasClass('add-ptnr'))
        frm.resetForm();
      else
      {
        var dtls = $this.parents('li').data('dtls');
        if (dtls['name'])
          frm.find('#ptn-nme').val(prw.buildTxt(dtls['name'].split(',')[0]));
        if (dtls['title'])
          frm.find('#ptn-nbr').val(prw.buildTxt(dtls['title']));
        if (dtls['eml'])
          frm.find('#ptn-eml').val(prw.buildTxt(dtls['eml']));
        if (dtls['adr'])
          frm.find('#ptn-adrs').val(prw.buildTxt(dtls['adr']));
        frm.find('button[type="submit"]').addClass('edit').text('Update');
      }
      $this.parents('li').addClass('hideElement');
    }
    /*
     * Close ptnr details popup without saving
     */
    var pb = $('#progress-bar');
    var ct = {};
    $(document).on('click', '.pop-cls', function () {
      $(this).parents('#art-prw').find('#ptnr-dt').resetForm();
      $('#ptnr-dtls .ptn-lst').find('li.hideElement').removeClass('hideElement');
    });
    var isError = {};
    $('#ptn-save').on('click', function (e) {
      e.preventDefault();
      var edtr = $('.crnt');
      var pb = $('#progress-bar');
      if ($('#ptn-ttl').hasClass('emty'))
      {
        $('#sts-msg').showStatus("Looks like you haven't added subject in your petition. Add it and try again", 'err');
        return false;
      }
      var txtblks = edtr.find('.t-b:not(#tb2)');
      if ((!txtblks.length) || (txtblks.not('.emty').length == 0))
      {
        $('#sts-msg').showStatus('Looks like your petition is empty without any description. Add some description and try again.', 'err');
        return false;
      }
      if (pb.find('#ctrl-bx').length == 0)
      {
        $.post(api + "/gtf", {
          "id": "p-b",
          "rt": pb.data('rdrctTo')
        }, function (d) {
          d = JSON.parse(d);
          pb.find('> section').html(d.frm).showPopup(1);
          pb.fetchTagSgstns(getPtnTxt(0), 'P');
          pb.find('.frame').each(function () {
            $(this).enableSlider();
          });
          if (isEdit)
          {
            pb.loadEdtPrphls(pet_dt);
            ct.ptenddt = pet_dt.endTm;
            ct.sgn = pet_dt.sgn;
            ct.ct = pet_dt.ct;
            ct.htg = pet_dt.sct;
          }
          else
          {
            pb.find('> section').showPopup(1);
            pb.fetchTagSgstns(getPtnTxt(0), 'P');
            var dtls = JSON.parse($('.edtr').data('desc'));
            if (Object.keys(dtls).length)
              pb.loadEdtPrphls(dtls);
          }
          pb.find('#ctrl-bx #ptn-info').removeClass('hideElement');
          pb.find('.frame').enableSlider();
        });
      }
      else
      {
        pb.find('> section').showPopup(1);
        pb.fetchHstgSgstns(getPtnTxt(0), 'P');
        if (Object.keys(ct).length)
        {
          if (ct.ct == undefined || ct.htg == undefined)
          {
            pb.find('#ctrl-bx #err-box').css('left', '100%').removeClass('in');
            pb.find('#ctrl-bx > div > section').css('left', '0').addClass('in');
          }
          else if (!pb.data('sgstnAdded'))
            pb.find('#ctrl-bx section').css('left', '-100%');
          else if ($('#cvr-img').data('img') == undefined)
            pb.fetchCvrImg();
          else
            chkabsvns();
        }
      }
    });

    /*
     * Save hashtags and spaces chosen by author
     */
    $('#progress-bar').on('click', '#sv-sgstns', function () {
      var json = $(this).addHtgSpc();
      ct.hstg = json.hstg;
      ct.spc = json.spcs;
      var ptnInfo = $('#ctrl-bx').find('#ptn-info');
      if (!ptnInfo.find('.ptn-sgns').hasClass('emty'))
        ct.sgn = parseInt($.trim($('#ctrl-bx').find('#ptn-info .ptn-sgns').text()));
      else
      {
        $('#sts-msg').showStatus('Add number of signatures required for this petition', 'err');
        return false;
      }
      if (ptnInfo.find('.dtpkr').data('tmsp'))
        ct.ptenddt = ptnInfo.find('.dtpkr').data('tmsp');
      else
      {
        $('#sts-msg').showStatus('Enter the date by which you need the target signatures', 'err');
        return false;
      }
      $('#progress-bar').data('sgstnAdded', 1);
      chkabsvns();
    });

    $('#progress-bar').on('shwDtpkr', '#ptn-info .dtpkr', function () {
      var $this = $(this);
      $('#popout').find('.dtpkr').datepicker({
        dateFormat: 'dd/mm/yy',
        minDate: new Date(),
        defaultDate: $this.data('dt'),
        onSelect: function (d) {
          $this.text(d);
          $this.getTmsp();
        }
      });
    });
    /*
     * Show image upload area when "upload another image" is clicked
     */
    $('#progress-bar').on('click', '#chs-cvr-img', function () {
      $(this).parent().siblings('#err-img-hldr').css('top', '-100%').addClass('in');
    });
    /*
     * Save newly uploaded image as cover image
     */
    $('#progress-bar').on('click', '#err-upld-img', function () {
      var imgDt = $(this).parents('#err-img-hldr').data('img');
      $('#cvr-img').data('img', imgDt);
      chkabsvns();
    });
    /*
     * Show images list when back button is clicked
     */
    $('#progress-bar').on('click', '#err-bk', function () {
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
    $('#progress-bar').on('click', '#sv-cvr-img', function () {
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
    // Closing preview functionality 
    $(document).on('click', '#prw-close', function () {
      if (!$(this).parents('#art-prw').find('#ptnr-dt').hasClass('hideElement'))
        $('.sts-bx').fadeOut(300);
      $('#prw > .prw-container').find('#art').find('.e-b').remove();
    });
    // Sending petition for moderation
    $('#progress-bar').on('click', '#snd-fr-mod', function () {
      savePetition(1);
    });
    // Enable and Disable continue button based on the checkbox status
    $('#cnfrm-mod').on('change', function () {
      if ($(this).is(':checked'))
        $('#snd-fr-mod').removeAttr('disabled').removeClass('disabled');
      else
        $('#snd-fr-mod').attr('disabled', 'disabled').addClass('disabled');
    });

    // Sending article for moderation
    $('#snd-fr-mod').on('click', function () {
      if ($('#cnfrm-mod').is(':checked'))
        savePetition($('#cnfrm-mod').val());
      else
        $('#sts-msg').showStatus('Confirm submission by checking "send for moderation" checkbox!', 'err');
    });

    function getPtnTxt(chkErrs) {
      var txt = [];
      var ptxt = {};
      if ($('#enbl-pstbehaf').is(":checked") && $('#usr-bar #pstbehaf').val() == '' && chkErrs)
      {
        isError.sts = 1;
        isError.loc = 'pstbhf';
        return false;
      }

      if ($('#ptn-container .ptn-lst li').length)
      {
        var ptntxt = [];
        $('#ptn-container .ptn-lst li').each(function () {
          var tmp = $(this).data('dtls');
          var dtl_str = tmp.name;
          if (tmp.title)
            dtl_str += " " + tmp.title;
          if (tmp.eml)
            dtl_str += " " + tmp.eml;
          if (tmp.adr)
            dtl_str += " " + tmp.adr;
          ptntxt.push(dtl_str);
        });
        ptxt['lst'] = ptntxt;
      }
      else if (chkErrs)
      {
        isError.sts = 1;
        isError.loc = 'no_ptnr';
        return false;
      }
      var dscTxt = '';
      $('.crnt > .stry').find('.e-b').each(function () {
        var $this = $(this);
        if ($this.data('edDt') != undefined)
        {
          if ($this.hasClass("cht-b"))
            var tmp = $this.chkChrtDt();
          else
            tmp = $this.data('edDt');
          if ($this.hasClass('t-b'))
            dscTxt += tmp.data.replace(/<br.*?>/g, '') + " ";
          else if ($this.hasClass('m-b'))
          {
            if (tmp.ttl != undefined)
              dscTxt += tmp.ttl + " ";
          }
          else if ($this.hasClass('m-b'))
          {
            if (tmp.ttl != undefined)
              dscTxt += tmp.ttl + " ";
          }
          else if ($this.hasClass('i-b'))
          {
            // For getting text from slideshows
            if (tmp.data != undefined)
            {
              $.each(tmp['data'], function (i, img) {
                dscTxt += img.cp.it + " " + img.cp.id + " " + img.cp.cn + " ";
              });
            }
            else // To get desc from images
              dscTxt += tmp.cp.it + " " + tmp.cp.id + " " + tmp.cp.cn + " ";
          }
        }
      });
      ptxt['at'] = dscTxt;
      txt.push(ptxt);
      return txt;
    }

    $('.ptn-lst').on('click', '.del-ptnr', function (e) {
      e.preventDefault();
      $(this).parents('li').remove();
    });
  }
  else
  {
    $('#context').setActiveTab();
    $('#happening-now a[href="#context"]').removeAttr('class');
    $('.right-container').find('#context').data('htg', pet_dt.sct);
    //  $('.right-comments').find('div.context .quickpost').text('#'+pet_dt.sct.split(',')[0]).data('htg',pet_dt.sct);
    $('#article-editor .stry').loadArt($('.ptn-data').val(), isWrite);
    // Calculating tab menu height after page is loaded
    $('#tb-mnu').css('height', ($(window).height() - 125));
    setTbMnuPosition();
    $('.stry').find('.t-b:first').attr('id', 'text-block2');

    /* Loading suggestions when none is selected by user */
    if ($('#rltd-lst').find(' > li').length < 4)
      $('#rltd-lst').ldMreSgstns('P', pet_dt.id);

    $(window).load(function () {
      var prcnt = ((pet_dt['got'] / pet_dt['req']) * 100).toFixed(2);
      $('#ptn-sgn').siblings('.percent').css('width', ((prcnt < 100) ? prcnt : 100) + '%');
    });
    $('#ptn-sgn').tooltip();
    $('.clps-scl-drpbx').on('click', function () {
      $(this).parents('.sclbar').find('#scl-drpbx').toggleClass('no-hgt in');
    });

    $('.shr-bx .fb-btn').on('click', function () {
      //fb window.open('https://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + encodeURI(document.URL) + '&p[images][0]=' + encodeURI($('#cvr-img .cvr-bg').css('background-image')) + '&p[title]=' + encodeURI($('#cvr-img .m-hd').text()) + '&p[summary]=' + encodeURI('I just Signed this Petition,' + $(this).parent().data('desc')), 'facebook-share-dialog', 'width=626,height=436');
      /* sends msg */
      FB.ui({
        method: 'send',
        link: document.URL
      }, function () {
      });
      /* post on wall */
//      FB.ui({
//        method: 'share',
//        href: document.URL
//      },function(){});
    });

    $('.shr-bx .tw-btn').on('click', function () {
      window.open('https://twitter.com/intent/tweet?original_referer=' + encodeURI(document.URL) + '&text=' + encodeURI($(this).parent().data('desc')) + '&tw_p=tweetbutton&url=' + encodeURI(document.URL) + '&via=SaddaHaqMedia', '', 'width=626,height=436');
    });
    /* scrolling page to target area based on the tab button clicked */
    $('#tb-mnu').on('click', 'a', function () {
      $('html, body').animate({scrollTop: $('.' + $(this).data('trgt')).offset().top - 110}, 600, 'easeInOutCubic');
      $(this).parents('li').addClass('active').siblings('li').removeClass('active');
    });

    $('#hd-sctn a.btn, #lft-mnu .ptn-sgn').on('click', function () {
      $('#tb-mnu li:last a').trigger('click');
    });
    /* End */
    var prvScrl = 0;
    $(window).scroll(function () {
      setTbMnuPosition();
    });
  }
  function chkabsvns()
  {
    var sts = $('#progress-bar').find('.messages .sts:last').clone();
    $('#progress-bar').find('.messages .sts:gt(0)').remove();
    var ptnTxt = getPtnTxt(1);
    $.ajax({
      url: '/ajax/chkabsvnss',
      dataType: 'text',
      type: 'post',
      data: {
        "data": ptnTxt
      },
      beforeSend: function () {
        $('.sts-bx,#progress-bar').fadeIn(300);
        pb.find('.sts').addClass('scs').html('<i class="icon-ok-circle"></i>Checking content..');
        var data = ptnTxt;
        if (!data)
        {
          var loc = '';
          switch (isError.loc)
          {
            case 'ci':
              pb.fetchCvrImg('petition');
              loc = 'Cover image missing';
              break;
            case 'pstbhf':
              loc = 'Enter the name of the person on whose behalf you are creating this petition';
              break;
            case 'no_ptnr':
              loc = 'Add atleast one person/group you want to petition';
              break;
          }
          sts.clone().removeClass('scs').addClass('err').html('<i class="icon-remove-circle"></i>' + loc).appendTo('#progress-bar .messages');
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
            switch (err[1])
            {
              case 'ttl':
                stsmsg += 'the title of your petition.';
                break;
              case 'at':
                stsmsg += 'your petition\'s text';
                break;
              case 'hsg':
                stsmsg += 'hashtags you added';
                break;
            }
            sts.removeClass('scs').addClass('err').html('<i class="icon-remove-circle"></i>' + stsmsg + '. Click continue at the bottom if you think there\'s nothing offensive.').appendTo('#progress-bar .messages');
          }
          else if (err['success'] == -10)
            sts.removeClass('scs').addClass('err').html('<i class="icon-remove-circle"></i>' + err['msg']).appendTo('#progress-bar .messages');
          pb.find('.mod-cnfrm').removeClass('hideElement').siblings('> div').addClass('hideElement');
        }
        else
        {
          sts.removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Yeah! Everything is fine').appendTo('#progress-bar .messages');
          pb.find('progress').attr('value', '50');
          savePetition(0);
        }
      }
    });
  }
  function savePetition(frcMod)
  {
    var sts = $('#progress-bar').find('.messages .sts:last').clone();
    pb.find('#ctrl-bx .btn').addClass('hideElement');
    pb.find('progress').attr('value', '50');
    sts.clone().removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Processing your data').appendTo('#progress-bar .messages');
    var refd = '';
    var tagd = '';
    var imgflpath = [], imglst = [];
    ct.ttl = pb.trimText($('#ptn-ttl').html());
    var ptnlst = [];
    $('#ptnr-dtls ul.ptn-lst li').each(function () {
      if ($(this).data('dtls') != undefined)
        ptnlst.push($(this).data('dtls'));
    });
    ct.ptnTo = ptnlst;
    var ptnDsc = [];

    var smry = '';
    $('.crnt > .stry').find('> .e-b').each(function () {
      var $this = $(this);
      if ($this.data('edDt') != undefined)
      {
        var tmp = null;
        if ($this.hasClass("cht-b"))
          var json = $this.chkChrtDt();
        else
          json = $this.data('edDt');
        if ($(this).hasClass('i-b'))
        {
          if (json.data != undefined)
          {
            $.each(json.data, function (i, img) {
              if (img.src.search('/public/Uploads') != -1) {
                imgflpath.push(img.src);
                tmp = (img.src).split('/');
                imglst.push(tmp[tmp.length - 1]);
              }
            });
          }
          else
          {
            tmp = json.src;
            if (tmp.search('/public/Uploads') != -1) {
              imgflpath.push(tmp);
              tmp = tmp.split('/');
              imglst.push(tmp[tmp.length - 1]);
            }
          }
        }
        else if (json.imgs != undefined && json.imgs.length > 0)
        {
          $.each(json.imgs, function (i, img) {
            imgflpath.push(img.src);
            tmp = (img.src).split('/');
            imglst.push(tmp[tmp.length - 1]);
          });
        }
//        if($this.hasClass("m-b"))
//          ptnDsc.push(JSON.parse($(this).buildTxt($(this).attr('ed-dt'),1)));
//        else
        if (!($this.hasClass("m-b") && json.data == undefined))
          ptnDsc.push(json);
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
          ptnDsc.push({"id": $this.attr('id'), "data": listicle});

      }
      if ($this.data('refd') != undefined)
        refd += (refd != '' ? '::' : '') + $this.data('refd');
      if ($this.data('tagd') != undefined)
        tagd += (tagd != '' ? '::' : '') + $this.data('tagd');
    });

    if (!ptnDsc.length)
    {
      $('#progress-bar .sts:last').clone().removeClass('scs').addClass('err').html("<i class='icon-remove-circle'></i> Oops! unfortunately our systems doesn't allow empty petitions. Add some description and try again.").appendTo('#progress-bar .messages');
      return false;
    }

    var cvrimg = $('#cvr-img').data('img');
    if (cvrimg != undefined)
    {
      ct.c_img = cvrimg['src'];
      var tmp = (cvrimg['src']).split('/');
      imglst.push(tmp[tmp.length - 1]);
      imgflpath.push(cvrimg['src']);
      ptnDsc.push(cvrimg);
    }

    var frstBlk = $('.stry > .t-b:first');
    if (frstBlk.data('edDt') != undefined)
    {
      frstBlk = frstBlk.data('edDt');
      ct.smry = frstBlk['data'].substr(0, 200);
    }
    ct.imgflpath = imgflpath;
    ct.imglst = imglst;
    ct.dsc = ptnDsc;
    ct.ref = refd;
    ct.tag = tagd;
    ct.auth = $(this).getShIntr();
    ct.usr = $(this).getLoggedInUsr();
    if (pet_dt.tid != null)
      ct.tid = pet_dt.tid;
    else
      ct.tid = $('#wrt-pg').data('petId');

    if ($('#ptn-ctnt').data('mode') == 2 || $('#ptn-ctnt').data('mode') == 0)
    {
      ct.isE = 1;
      ct['id'] = pet_dt.ptid;
    }
    if ($('#enbl-pstbehaf').is(":checked"))
      ct.pob = $('#usr-bar #pstbehaf').attr("unme");
    $.ajax({
      url: api + '/pce',
      async: true,
      type: 'post',
      data: ct,
      dataType: 'text',
      beforeSend: function () {

      },
      success: function (d, status, xhr) {
        var t = JSON.parse(d);
        if (t.success == 1) {
          $('.edtr').data('cmplt', 1);
          if (ct.isE)
          {
            if ($("#ptn-save").data("ptsts") == '3')
              sts.clone().removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Done! Your petition is saved successfully. Please wait while we redirect...').appendTo('#progress-bar .messages');
            else
              sts.clone().removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Done! Your petition is saved successfully and will be updated after moderator\'s approval. Please wait while we redirect...').appendTo('#progress-bar .messages');
            setTimeout(function () {
              window.location = t.msg;
            }, 4000);
          }
          else
          {
            $('.sts-msg-bx .pop-cls').remove();
            pb.find('.mod-cnfrm').addClass('hideElement').siblings('div.pg-cnfrm').removeClass('hideElement');
            sts.clone().removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Done! Your petition is saved successfully.').appendTo('#progress-bar .messages');
//            sts.clone().removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>You can check all your unmoderated petitions in your dashboard.').appendTo('#progress-bar .messages');
            var artBtn = pb.find('.pg-cnfrm').find('a[href="#"]');
            if (!pb.data('rdrct'))
              artBtn.siblings('a').addClass('hideElement');
            //attr('href', '/' + $('#user-nav .usrname').attr('href').slice(1) + '/dashboard?UnmoderatedEvents').text('View all unmoderated petitions')
            else
            {
              var href = decodeURIComponent(artBtn.siblings('a').attr('href'));
              if (href.indexOf('elections') != -1)
                artBtn.siblings('a').text('Back to elections page');
            }
            artBtn.attr('href', t.msg).text('View this petition');
          }
          pb.find('progress').attr('value', '100');
        }
        else {
          sts.clone().removeClass('scs').addClass('err').html('<i class="icon-remove-circle"></i>' + t.msg).appendTo('#progress-bar .messages');
          pb.find('#ctrl-bx .btn').removeClass('hideElement');
        }
      },
      complete: function (d) {
        var t = JSON.parse(d.responseText);
        if ($('#ptn-ctnt').data('mode') != 2 && $("#del-drft").length == 0)
        {
          $('#progress-bar').getFdbckFrm("P", t.msg);
        }
      }
    });
  }

  /* share functionality in progress bar*/
  $('#progress-bar').on('click', '.scl-shr .fb-share', function (e) {
    e.preventDefault();
    var url = $("body").data("rd") + $(this).data("url");
    FB.ui({
      method: 'feed',
      name: ct.ttl,
      picture: ct.cvimg,
      link: url,
      caption: "Created by: " + $("body").data("user"),
      actions: {"name": "Create new petition", "link": $("body").data("rd") + "/new/event"}
    },
    function (res) {
    });
  });

  $('#progress-bar').on('click', '.scl-shr .tw-tweet', function () {
    var url = $("body").data("rd") + $(this).data("url");
    window.open('https://twitter.com/intent/tweet?original_referer=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(ct.ttl) + '&tw_p=tweetbutton&url=' + encodeURIComponent(url) + '&via=SaddaHaqMedia', '', 'toolbar=0,status=0,width=548,height=325');
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
  /* Social share when petiton is created*/
  /* $("#progress-bar").on("click", ".pg-cnfrm a", function() {
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
   message: 'Sign this petition',
   link: link,
   action: {
   name: "Sign",
   link: link
   }
   }, function(response) {
   });
   } else if (response.status === 'not_authorized') {
   
   } else {
   FB.login(function() {
   FB.api('/me/feed', 'post', {
   message: 'Signed this petition',
   link: link,
   action: {
   name: "Sign",
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
   "msg": "Signed this petition",
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

  /* Setting tab menu position based on page scroll */
  var prvScrl = 0;
  function setTbMnuPosition()
  {
    if ($('#rltd-bx').length)
    {
      var scrlTop = $(window).scrollTop();
      var crntTop = parseInt($('#tb-mnu').css('top'));
      if ($(window).height() > $('#rltd-bx').offset().top - scrlTop + 100)
        $('#tb-mnu').css('top', (crntTop - (scrlTop - prvScrl)) + 'px');
      else if (prvScrl > scrlTop && $('#tb-mnu').hasClass('fix'))
        $('#tb-mnu').css('top', (crntTop + (prvScrl - scrlTop) < 108 ? crntTop + (prvScrl - scrlTop) : 108) + 'px');
      prvScrl = scrlTop;
    }
  }

  //Value of shIntr cookie and logged-in username to be used in api calls
  function getShIntr() {
    var cookiesArray = document.cookie.split(';'); //Splitting bcoz there might be other cookies like piwik related
    shIntr = '';
    for (var i = 0; i < cookiesArray.length; i++) {
      var cookieArray = cookiesArray[i].split('=');
      if (cookieArray[0].indexOf('shIntr') == 1 || cookieArray[0].indexOf('shIntr') == 0) {
        shIntr = cookieArray[1];
      }
    }
    return shIntr;
  }
  function getLoggedInUsr() {
    var ssnUsr;
    $.ajax({
      url: '/haq',
      async: false,
      type: 'POST',
      success: function (res) {
        res = JSON.parse(res);
        ssnUsr = res.UserName;
      }
    });
    return ssnUsr;
  }
});


