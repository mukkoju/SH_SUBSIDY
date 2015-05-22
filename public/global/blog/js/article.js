$(document).ready(function () {
//  $('#art-tabs').find('a:first').tab('show');
  /*
   * Checking if the article is in edit mode or view mode
   */
  var isEdit = ($('#article-editor').data('mode') == 1) || ($('#article-editor').data('mode') == 2);
  var isDrft = ($('#article-editor').data('mode') == 1);

  /*
   * Getting the basic article data using the json string
   */
  var adt = $('.edtr').data('desc');
  /*
   * Check if user logged in
   */
  $('.usr-crdt a').click(function () {
    $(this).chkVrfd();
  });

  //API url
  var api = $('body').data('api');

  // Setting context tab as the default active tab
  $('#context').setActiveTab();
  $('#happening-now a[href="#context"]').removeAttr('class');
  if ($('.article-data').val() != 'null' && $('.article-data').val() != '')
  {
    $('#article-editor .stry').loadArt($('.article-data').val(), isEdit);
    $('#tb-mnu').css('height', ($(window).height() - 125));
  }
//  else if($('.stry .t-b').length)
//    $().enableEditor('text-content1');

  /* Loading suggestions when none is selected by user */
  if ($('#rltd-lst').find(' > li').length < 4)
    $('#rltd-lst').ldMreSgstns('A', adt.id);

  $(window).load(function () {
    if (isEdit)
      $('#article-editor').find('.inline-image').find('.i-t,.i-d,.c-n').attr('contenteditable', 'true');

    if ($('#article').find('.atch-container .atch-list').data('atchd') != null)
      $(this).listDoc($('#article').find('.atch-container .atch-list').data('atchd'), isEdit);

    $('.bg').addClass('in');
  });
  $('.right-container').find('#context').data('htg', adt.sct);
  // $('.right-comments').find('div.context .quickpost').text('#'+adt.sct.split(',')[0]).data('htg',adt.sct);
  if (isEdit)
  {
    /* Set category */
    if (adt.ct)
    {
      var ctgy = (adt.ct).split(',');
      for (var i = 0; i < ctgy.length; i++)
        $('#ctgy-box').find(".accordion-inner a[ct='" + ctgy[i].toLowerCase() + "']").addClass('active').addClass(ctgy[i].substr(0, 3).toLowerCase());
    }
    /* Set hashtag */
    if (adt.sct)
      $('#hstg').val('#' + adt.sct);
  }
  else
    var auth = adt.auth;
  //Article rating
  var inPrcs = false;
  $('#voteup').click(function () {
    var $this = $(this);
    if (!inPrcs && $this.chkVrfd())
    {
      $.ajax({
        url: api + '/ar',
        data: {
          "id": adt.id,
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
            if ($this.hasClass('active'))
              $this.removeClass('active');
            else
              $this.addClass('active');
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

  //Article marked as read later
  $(document).on('click', '#lft-mnu #r-l,#lft-mnu .r-l', function () {
    var rl = $(this);
    if (rl.chkVrfd())
    {
      rl.parents('.sclbar').find('.lightbox').removeClass('hideElement');
      $.post(api + "/arl", {
        'id': adt.id,
        'auth': rl.getShIntr(),
        'usr': rl.getLoggedInUsr()
      },
      function (d) {
        var t = JSON.parse(d);
        if (t.success == 1) {
          if (rl.hasClass('active'))
            rl.removeClass('active');
          else
            rl.addClass('active');
        }
        else {
          $('#sts-msg').showStatus(t.msg, 'err');
        }
      });
    }
  });

  //Article marked as favourite
  $('#lft-mnu').on('click', '#fav', function () {
    var fav = $(this);
    if (fav.chkVrfd())
    {
      fav.parents('.sclbar').find('.lightbox').removeClass('hideElement');
      $.post(api + '/af', {
        "id": adt.id,
        "auth": fav.getShIntr(),
        "usr": fav.getLoggedInUsr()
      },
      function (d) {
        var t = JSON.parse(d);
        if (t.success == 1) {
          if (fav.hasClass('active'))
            fav.removeClass('active');
          else
            fav.addClass('active');
        }
      });
    }
  });
  // // Pin Posts
  $('#lft-mnu').on('click', '#pin-pst', function () {
    var $this = $(this);
    var trgt = $('#pop-prw > section');
    $.post(api + '/gtf', {"id": "pin-pst", "ct": adt['ct'], "pid": adt['id']}, function (d) {
      d = JSON.parse(d);
      trgt.html(d['frm']).showPopup(0);
    });
  });

  $('#pop-prw').on('click', '#pn-sve', function (e) {
    e.preventDefault();
    var $this = $(this);
    var pinned = [];
    $this.parents('#pop-prw').find('input[type="checkbox"]:checked').each(function () {
      pinned.push(this.value);
    });
    $.post('/ajax/pnd', {
      'id': adt.id,
      'pnd': pinned,
      'tid': adt.tid
    }, function (d) {
      if (d == 1) {
        $('#sts-msg').showStatus("Story has been Pinned Successfully!!", 'scs');
        $('#lft-mnu #pin-pst').addClass('active');
      }
      else if (d == 0) {
        $('#sts-msg').showStatus("Story has been unpinned Successfully!!", 'scs');
        $('#lft-mnu #pin-pst').removeClass('active');
      }
      else {
        $('#sts-msg').showStatus("Something went wrong, please try again!!", 'err');
      }
    });
  });

  // Show popup for changes
  $(document).on('click', '.delete', function () {
    var prw = $('#art-prw');
    prw.find('h3.s-h').text('Need your confirmation');
    prw.find('.del').removeClass('hideElement');
  });

  $('#auth-nme').on('hover', '.unflw', function (e) {
    if (e.type == 'mouseenter')
      $(this).text('UNFOLLOW');
    else
      $(this).text('FOLLOWING');
  });

  // Function to scale Images
  function scaleImages(img)
  {
    img.load(function () {
      img.scaleImages({
        'dw': img.parents('.editor-block').width(),
        'dh': img.parents('.editor-block').height()
      });
    });
  }

  //Enable disable live blog
  $('#con-del #yes').click(function () {
    if ($(this).hasClass('enbl-lv-blg'))
    {
      $.post('/ajax/lvblgtgle', {
        "tid": adt.tid,
        "tp": "A"
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
          $('.sts-msg').showStatus("Err!! You are trying to enable/disable Live Blog for an invalid story. Please wait while we redirect you to the hompage...", 'err');
          window.location = '/';
        }
        else if (d == -2)
          $('.sts-msg').showStatus("Something went wrong. Please try again later!!", 'err');
      });
    }
  });

  /* Milaap related functionality */

  $('#tb-mnu').on('click', 'a', function () {
    $('html, body').animate({scrollTop: $('.' + $(this).data('trgt')).offset().top - 110}, 600, 'easeInOutCubic');
    $(this).parents('li').addClass('active').siblings('li').removeClass('active');
  });

  $('.dntn-req').each(function () {
    var trgt = $(this).find('.nmbr').data('num');
    var got = $(this).siblings('.grphc-bx').find('.dntn-got .nmbr').data('num');
    if (trgt > 0)
      $(this).siblings('.grphc-bx').find('.cvr').css('height', (((trgt - got > 0 ? trgt - got : 0) / trgt) * 100).toFixed(2) + '%');
  });

  var prvScrl = 0;
  $(window).scroll(function () {
    if ($('#rltd-bx').length)
    {
      var scrlTop = $(window).scrollTop();
      var crntTop = parseInt($('#tb-mnu').css('top'));
      if ($(window).height() > $('#rltd-bx').offset().top - scrlTop)
        $('#tb-mnu').css('top', (crntTop - (scrlTop - prvScrl)) + 'px');
      else if (prvScrl > scrlTop && $('#tb-mnu').hasClass('fix'))
        $('#tb-mnu').css('top', (crntTop + (prvScrl - scrlTop) < 108 ? crntTop + (prvScrl - scrlTop) : 108) + 'px');
      prvScrl = scrlTop;
    }
  });
});
