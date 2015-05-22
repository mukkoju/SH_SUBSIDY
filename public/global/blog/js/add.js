$(document).ready(function () {
  /*
   *  Enable editor for first text content div
   */
  var vrfd = $(document).chkVrfd();

  if (!$('#user-nav .usrname').length) {
    $(".sts-msg-bx").css("opacity", "0.95").find(".pop-cls").addClass("hideElement");
  }
  else if (!vrfd)
    setTimeout(function () {
      window.location = '/';
    }, 3000);

  var adt = $('.edtr').data('desc');
  if ($('.crnt').data('mode') == 0)
    $('#txt1').enableEditor('txt1');

  //API url
  var api = $('body').data('api');

  // Enabling slider for draft versions dropdown
  if ($('.crnt').data('mode') == 1)
  {
    var revs = adt['revs'];
    if (revs.length > 0)
    {
      var revTrgt = $('#user-nav .wrt-opts').find('#drft-lst ul');
      revTrgt.find('.dft-msg').remove();
      revTrgt.parents('#drft-lst').siblings('.del').removeClass('hideElement');
      for (var r = 0; r < revs.length; r++)
      {
        var dt = $('.crnt').getDateTime(revs[r]['Time']);
        revTrgt.append('<li class="box"><a href="/articledraft/' + adt.id + '/rev/' + revs[r]['Rev_Num'] + '">Saved on ' + dt['m'] + ' ' + dt['d'] + ', ' + dt['t'] + '</a></li>');
      }
    }
  }
  /* Save Article on Clicking save Button */
  var ct = {};
  $('#navigation-bar').on('click', '#art-save', function (e) {
    e.preventDefault();
    clearInterval(drftTimr);
    if ($('#hd-sctn .m-hd').hasClass('emty'))
    {
      $('#sts-msg').showStatus('Your story looks incomplete without a title! Add a title and try publishing again', 'err');
      return false;
    }
    var pb = $('#progress-bar');
    if (pb.find('#ctrl-bx').length == 0)
    {
      $.post(api + "/gtf", {
        "id": "p-b",
        "rt": pb.data('rdrctTo'),
        'auth': $("body").getShIntr(),
        'usr': $("body").getLoggedInUsr()
      }, function (d) {
        d = JSON.parse(d);
        pb.find('> section').html(d['frm']).showPopup(1);
        pb.find('.frame').each(function () {
          $(this).enableSlider();
        });
        $(this).fetchTagSgstns(getArticleText(0), 'A');
        $('#ctgy-box .frame').enableSlider();
        if ($('.crnt').data('mode') == 2)
          pb.loadEdtPrphls(adt);
      });
    }
    else
    {
      pb.find('> section').showPopup(1);
      pb.fetchTagSgstns(getArticleText(0), 'A');
      if ($('.crnt').data('mode') == 2)
        pb.loadEdtPrphls(adt);
      if (Object.keys(ct).length)
      {
        if (ct.ct == undefined || ct.hstg == undefined)
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
  $('#progress-bar').on('click', '#ctgy-box .ctgy-lst li', function (e) {
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

      $(this).fetchTagSgstns(getArticleText(0), 'A', ctgy.join(','));
    }, 20);
  });
  
  /*
   * Save hashtag and space suggestions chosen by author
   */
  $('#progress-bar').on('click', '#sv-sgstns', function () {
    var json = $(this).addHtgSpc();
    ct.hstg = json.hstg;
    ct.spcs = json.spcs;
    $('#progress-bar').data('sgstnAdded', 1);
    chkabsvns();
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
   * Save cover image
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
    var $this = $(this).parent('#art-prw');
    if (ias)
      ias.remove();
    if (!$this.find('#crp-cvr-pic').hasClass('hideElement'))
    {
      $this.find('#crp-cvr-pic').find('.img-preview').remove();
    }
    else
      $('#prw > .prw-container').find('#art').find('.e-b').remove();
  });

  // Sending article for moderation
  $('#progress-bar').on('click', '#snd-fr-mod', function () {
    publishArticle(1);
  });
  // Restore autodraft functionality when progress bar is closed
  $('#progress-bar').on('click', '#prg-close', function () {
    autoDraft();
  });
  // Save article draft
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
    var isChngd = $('#art-drft').data('chngd');
    var usr = $(document).getLoggedInUsr();
    var data = genCt(1);
    var cmplt = data['ct'];
    if (!isAuto && cmplt == undefined)
    {
      $('#sts-msg').showStatus("There's nothing to save as draft", "err");
      return false;
    }

    //Getting article details while editing a drafted article
    if ((cmplt !== undefined && cmplt != '') && (isChngd || !isAuto))
    {
      $('#art-drft').text('Saving..').attr('disabled', 'disabled');
      $.post(api + '/dfts', {
        'data': cmplt,
        'imglst': data['imglst'],
        'atchmt': data['atchmt'],
        'pstbehaf': ($('#pstbehaf').attr('unme') != undefined ? $('#pstbehaf').val() + '::' + $('#pstbehaf').attr('unme') : ''),
        'did': (adt.id == null || adt.id == '') ? drftId : adt.id,
        'isAuto': isAuto,
        'auth': $(document).getShIntr(),
        'usr': usr
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
              if (adt.id == '')
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
                window.location = '/' + usr + '/Dashboard?ArticleDrafts';
              }, 3000);
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
        window.location = '/' + $('.usrname').attr('href').split('/')[3] + '/Dashboard?ArticleDrafts';
      }, 3000);
    }
  }
  //Build and return JSON string for the entire article
  var isError = {};
  /*
   * Param opt is used to check if genct is invoked while drafting 
   * opt = 1 --> draft, 2 --> publish
   
   */
  function genCt(opt) {
    var refd = '';
    var tagd = '';
    var art = [], imglst = [], imgflpath = [];
    if ($('.crnt .t-b:first').data('edDt') != undefined)
      var frstBlk = $('.stry .t-b:first');
    if (!$('#hd-sctn .m-hd').hasClass('emty'))
    {
      ct.ttl = $(this).trimText($('#article-title').html());
      refd += $('#hd-sctn .m-hd').data('refd') ? $('#hd-sctn .m-hd').data('refd') + '::' : '';
      tagd += $('#hd-sctn .m-hd').data('tagd') ? $('#hd-sctn .m-hd').data('tagd') + '::' : '';
    }
    var smryBlk = $('#hd-sctn .smry');
    if (!smryBlk.hasClass('emty'))
    {
      ct.smry = smryBlk.trimText(smryBlk.html());
      refd += smryBlk.data('refd') ? smryBlk.data('refd') + '::' : '';
      tagd += smryBlk.data('tagd') ? smryBlk.data('tagd') + '::' : '';
    }
    else if (opt > 1 && frstBlk)
    {
      ct.smry = frstBlk.text().substr(0, 200).replace(/<\/?[bi]>/g, '');
    }

    var el = $('.crnt > .stry').find(' > .e-b');
    if (el.length)
    {
      var tmpblkdt = null;
      el.each(function (index, elem) {
        var $this = $(elem);
        if ($this.data('edDt') != undefined) {
          if ($this.hasClass("cht-b"))
            tmpblkdt = $this.chkChrtDt();
          else
            tmpblkdt = $this.data('edDt');
          if ($this.hasClass('i-b'))
          {
            var tmp = null;
            if (tmpblkdt.data != undefined)
            {
              $.each(tmpblkdt.data, function (i, img) {
                if (img.src.search('/public/Uploads') != -1 || img.src.search('/public/Multimedia') != -1) {
                  imgflpath.push(img.src);
                  tmp = (img.src).split('/');
                  imglst.push(tmp[tmp.length - 1]);
                }
              });
            }
            else
            {
              tmp = tmpblkdt.src;
              if (tmp.search('/public/Uploads') != -1 || tmp.search('/public/Multimedia') != -1) {
                imgflpath.push(tmp);
                tmp = tmp.split('/');
                imglst.push(tmp[tmp.length - 1]);
              }
            }
          }
          if ((tmpblkdt['data'] != undefined && tmpblkdt['data'] != '') || opt == 1)
            art.push(tmpblkdt);
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
            art.push({"id": $this.attr('id'), "data": listicle});
        }
        refd += $(elem).data('refd') ? $(elem).data('refd') + '::' : '';
        tagd += $(elem).data('tagd') ? $(elem).data('tagd') + '::' : '';
      });
      if (art.length)
        ct.art = art;
    }
    if (!art.length && opt != 1)
    {
      $('#progress-bar .sts:last').clone().removeClass('scs').addClass('err').html("<i class='icon-remove-circle'></i> Oops! Our systems doesn't allow empty stories. Start writing and try again.").appendTo('#progress-bar .messages');
      return false;
    }

    var cvrimg = $('#cvr-img').data('img');
    if (cvrimg != undefined)
    {
      ct.cvimg = cvrimg['src'];
      var tmp = cvrimg['src'].split('/');
      imglst.push(tmp[tmp.length - 1]);
      imgflpath.push(cvrimg['src']);
      art.push(cvrimg);
    }

    if ($.isEmptyObject(ct))
      return 0;
    else
    {
      if ($.isEmptyObject(ct.art) && opt != 'drft')
      {
        return -1;
      }
      else
      {
        var retDt = {};
        if (opt == 'drft' && $('#enbl-pstbehaf').is(":checked"))
          ct.pob = $('#pstbehaf-box #pstbehaf').val() + '::' + $('#pstbehaf-box #pstbehaf').attr('unme');
        retDt.ct = ct;
        retDt.imglst = imglst;
        retDt.imgflpath = imgflpath;
        if (refd != '')
          retDt.refd = refd;
        if (tagd != '')
          retDt.tagd = tagd;
//        console.log({'ct' : ct, 'imglst' : imglst, 'imgflpath' : imgflpath});
        return retDt;
      }
    }
  }

  //Function to extract only text from article
  function getArticleText(chkErrs)
  {
    var txt = [];
    var atxt = {};
    /*
     *  Article title, text and hashtag
     */
    // Article title
    if (!$('#hd-sctn .m-hd').hasClass('emty'))
      atxt.ttl = $.trim($('#hd-sctn .m-hd').text());
    //Checking for cover image
    // Article text
    var tmpstr = '';
    if ($('#enbl-pstbehaf').is(":checked") && $('#usr-bar #pstbehaf').val() == '' && chkErrs)
    {
      isError.sts = 1;
      isError.loc = 'pstbhf';
      return false;
    }
    var el = $('.crnt').find('.e-b');
    el.each(function () {
      var $this = $(this);
      if ($this.data('edDt'))
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
        else if ($this.hasClass(''))
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
    atxt.at = tmpstr.replace(/(undefined)/g, '');
    txt.push(atxt);

    var poll = {};
    $('.polls-container').find('ul.main-list > li').each(function (index, elem) {
      var $this = $(this).find('div.task');
      var key = "p" + (index + 1);
      var tmp = JSON.parse($this.attr('data'));
      var val = tmp.qst + " " + tmp.opts;
      poll[key] = val;
    });
    txt.push(poll);
    return txt;
  }
  function restoreErrImgBox()
  {
    var errImgBx = $('#progress-bar').find('#err-box #err-img-hldr');
    errImgBx.addClass('emty').find('.img-upld').addClass('in');
  }

  function chkabsvns() {
    var pb = $('#progress-bar');
    var sts = $('#progress-bar').find('.messages .sts:last').clone();
    $('#progress-bar').find('.messages .sts:gt(0)').remove();
    var art_data = null;
    $.ajax({
      url: '/ajax/chkabsvnss',
      async: true,
      data: {
        "data": getArticleText(0)
      },
      dataType: 'text',
      type: 'post',
      beforeSend: function () {
        pb.find('.frame').enableSlider();
        pb.find('.sts').addClass('scs').html('<i class="icon-ok-circle"></i>Checking content..');
        art_data = getArticleText(1);
        if (!art_data)
        {
          var loc = '';
          switch (isError.loc)
          {
            case 'ci':
              pb.fetchCvrImg('story');
              loc = 'Cover image missing';
              break;
            case 'pstbhf':
              loc = 'Enter the name of the person on whose behalf you are writing this story';
              break;
            case 'ht_ln':
              loc = 'Looks like one of your hashtags length is more than the maximum limit of 30 characters.';
              break;
          }
          if (loc != '')
            sts.removeClass('scs').addClass('err').html('<i class="icon-remove-circle"></i>' + loc).appendTo('#progress-bar .messages');

          return false;
        }
      },
      success: function (err, status, xhr) {
        if (err != '')
        {
          err = JSON.parse(err);
          var msg = 'Oops! An unexpected word encountered in ';
          if (err['success'] == 0)
          {
            if (err['msg'] == 'at')
              msg += 'your story\'s text or in the descriptions of images.';
            else if (err['msg'] == 'ttl')
              msg += 'the title of your story.';
            else if (err['msg'] == 'hsg')
              msg += 'hashtags you added.';
            else if (err['msg'].match(/^p\w+/))
              msg += 'Poll ' + err['msg'].split('p')[1] + '.';

            sts.removeClass('scs').addClass('err').html('<i class="icon-remove-circle"></i>' + msg + ' Click continue at the bottom if you think there\'s nothing offensive.').appendTo('#progress-bar .messages');
          }
          else if (err['success'] == -10)
            sts.removeClass('scs').addClass('err').html('<i class="icon-remove-circle"></i>' + err['msg']).appendTo('#progress-bar .messages');
          pb.find('.mod-cnfrm').removeClass('hideElement').siblings('> div').addClass('hideElement');
        }
        else
        {
          sts.removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Yeah! Everything is fine').appendTo('#progress-bar .messages');
          pb.find('progress').attr('value', '50');
          publishArticle(0);
        }
      }
    });
  }

  function publishArticle(frcMod)
  {
    var pb = $('#progress-bar');
    pb.find('#ctrl-bx .btn').addClass('hideElement');
    var sts = $('#progress-bar .sts:last').clone();
    sts.removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Processing your article for submission').appendTo('#progress-bar .messages');
    var data = genCt(0);
    if (data)
    {
      //var delay = 7500;
      //Check if the article being written is new or editing an existing article
      var tmp_dt = {
        'smry': ct.smry,
        'ttl': ct.ttl,
        'cvimg': ct.cvimg,
        'hstg': ct.hstg,
        'cntnt': ct.art,
        'imglst': data['imglst'],
        'imgflpath': data['imgflpath'],
        'polls': ct.polls,
        'tmsp': ct.tmsp,
        'ref': data.refd,
        'tag': data.tagd,
        'sndMod': frcMod,
        'spc': (adt.spc ? adt.spc + ',' : '') + ct.spcs,
        'auth': $("body").getShIntr(),
        'usr': $("body").getLoggedInUsr()
      };
      if (drftId != null)
        tmp_dt['drftId'] = drftId;
      if ($('#enbl-pstbehaf').is(":checked"))
        tmp_dt.pob = $('#usr-bar #pstbehaf').attr("unme");

      //Getting article details
      tmp_dt.id = adt.id;
      if ($('.crnt').data('mode') == 2) {

        // 'isE': isE, 'id': adt.id, 'tid': adt.tid, 
        tmp_dt.isE = 1;
        tmp_dt.tid = adt.tid;
      }
      $.ajax({
        url: api + '/ace',
        async: true,
        type: 'post',
        data: tmp_dt,
        dataType: 'text',
        beforeSend: function () {

        },
        success: function (url, status, xhr) {
          var t = JSON.parse(url);
          switch (parseInt(t.success))
          {
            case 0:
              sts.clone().removeClass('scs').addClass('err').html('<i class="icon-remove-circle"></i> ' + t.msg).appendTo('#progress-bar .messages');
              pb.find('#ctrl-bx .btn').removeClass('hideElement');
              break;
            case 1:
            case 2:
              $('.edtr').data('cmplt', 1);
              if (tmp_dt.isE)
              {
                if ($("#art-save").data("psts") == '3')
                  sts.clone().removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Done! Your story is saved successfully. Please wait while we redirect...').appendTo('#progress-bar .messages');
                else
                  sts.clone().removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Done! Your story is saved successfully and will be updated after moderator\'s approval. Please wait while we redirect...').appendTo('#progress-bar .messages');
                setTimeout(function () {
                  window.location = t.msg;
                }, 4000);
              }
              else
              {
                $('.sts-msg-bx .pop-cls').remove();
                pb.find('.mod-cnfrm').addClass('hideElement').siblings('div.pg-cnfrm').removeClass('hideElement');
                var artBtn = pb.find('.pg-cnfrm').find('a[href="#"]');
                var href = decodeURIComponent(artBtn.siblings('a').attr('href'));
                sts.clone().removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>Done! Your story is saved successfully.').appendTo('#progress-bar .messages');
                if (t.success == 1)
                {
                  sts.clone().removeClass('err').addClass('scs').html('<i class="icon-ok-circle"></i>You can check all of your stories in your profile page.').appendTo('#progress-bar .messages');
                  if (href.indexOf('spaces') != -1)
                    sts.clone().removeClass('scs err').html('<i class="icon-ok-circle"></i>This story will be updated into space upon it\'s moderator approval.').appendTo('#progress-bar .messages');
                }
                else if (t.success == 2)
                {
                  sts.clone().removeClass('scs').addClass('err').html('<i class="icon-warning-sign"></i> Your story is saved successfully but unfortunately was not added into space. You can find your stories in your profile.').appendTo('#progress-bar .messages');
                }
                if (!pb.data('rdrct'))
                  artBtn.siblings('a').attr('href', $('body').data('auth') + '/' + $('#user-navigation').data('unme').split('::')[0])
                          .text('View all my stories');
                else
                {
                  if (href.indexOf('spaces') != -1)
                    artBtn.siblings('a').text('Back to space');
                }
                artBtn.attr('href', t.msg).text('View this story');
              }
              pb.find('progress').attr('value', '100');
              break;
          }
        },
        complete: function (d) {
          var t = JSON.parse(d.responseText);
          if ($('.crnt').data('mode') != 2 && $("#del-drft").length == 0) {
            $('#progress-bar').getFdbckFrm("A", t.msg);
          }
        }
      });
    }
  }

  var ias = null;
  function shwImg2Crp(src)
  {
    var imgHolder = $('#art-prw').find('#crp-cvr-pic');
    $('<img src="' + src + '" class="img-preview">').on('load', function () {
      var img = this;
      $(this).prependTo(imgHolder.find('.img-holder'));
      $('#art-prw, .sts-bx').fadeIn(400, function () {
        $('#art-prw').find('.prw-container,.add-ptnr').removeClass('in').addClass('hideElement');
        imgHolder.removeClass('hideElement').addClass('in').find('.img-preview').fadeIn();
        // Initialize ImgAreaSelect
        var rw, rh = 0;
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
        ias = imgHolder.find('.img-preview').imgAreaSelect({
          aspectRatio: "1:1",
          handles: "corners",
          minWidth: 215,
          minHeight: 221,
          imageWidth: rw,
          imageHeight: rh,
          movable: true,
          instance: true,
          onInit: function (inst_img, selection) {
            var strtx = (img.width - 200) / 2;
            var strty = (img.height - 200) / 2;
            ias.setSelection(strtx, strty, strtx + 200, strty + 200, true);
            ias.setOptions({
              show: true
            });
            ias.update();
          }
        });
      });
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
      caption: "Author: " + $("body").data("user"),
      actions: {"name": "Write new story", "link": $("body").data("rd") + "/new/story"}
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


});