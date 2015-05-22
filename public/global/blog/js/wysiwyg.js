$(document).ready(function () {
  /* User suggestions to post on behalf of text */
  $('#enbl-pstbehaf').on('change', function () {
    var $this = $(this);
    if ($this.prop('checked'))
    {
      $('#pstbehaf').removeAttr('disabled').getUsrSgstns();
      $this.parents('.cvr').css('left', '105%').siblings('span').addClass('in');
      $this.siblings('label').text('Cancel');
    }
    else
    {
      $this.parents('.cvr').css('left', 0).siblings('span').removeClass('in');
      $('#pstbehaf').attr('disabled', 'disabled').val('').removeAttr('unme');
      $this.siblings('label').text('Post on behalf of someone?');
    }
  });
  //API url
  var api = $('body').data('api');
  //Functionality to show article suggestions on clicking suggestions button
  $('.frame').on('click', '#sgst-art, #sgst-evt,#sgst-ptn', function () {
    var $this = $(this);
    var margin = $('#left-bar').width();
    var cb = $('#aux-content-box');
    cb.find('.article-container,.events-container,.ptns-container').css('display', 'none');
    cb.slideLeftBar({
      'direction': 'left',
      'margin': margin
    });
    cb.find('.' + $this.attr('trgt')).fadeIn(200).find('ul.main-list li').animateAuxContent(function () {
      cb.find('.' + $this.attr('trgt')).find('.frame').sly('reload');
    });
  });

  /* Updating heading of article/event/petition on blur */
  $(document).on('blur', '.m-hd, #ptn-ttl, .smry, .m-b-hdng', function () {
    var $this = $(this);
    if ($.trim($this.text()) == '')
      $this.addClass('emty');
    else
    {
      $this.data($this.updateRefTag());
      $('#art-drft').data('chngd', 1);
    }
  });
  $(document).on('keydown', '.m-hd, .i-t,figcaption,.c-n,.smry, .m-b-hdng', function (e) {
    var el = this;
    var text = $.trim($(this).text());
    var $this = $(this);
    if ((e.which == 8 || e.which == 46) && text == '')
      e.preventDefault();
    if (e.which == 13)
      e.preventDefault();
    else if (e.which == 50 && e.shiftKey)
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
    else
      $this.lmtTxt(e, el);
  });

  $(document).on('keyup', '.m-hd, .i-t,figcaption,.c-n,.smry', function (e) {
    $(this).lmtTxt(e, this);
  });
  $(document).on('paste', '.m-hd,.i-t,figcaption,.c-n, #ptn-ttl, .m-b-hdng, .smry, .pol-opt', function (e) {
    var el = this;
    var $this = $(this);
    setTimeout(function () {
      $this.html($.trim($this.text())).lmtTxt(e, el);
      $this.placeCaretAtEnd(el, 1);
    }, 20);
  });
  /*
   *
   */
  $(document).on('click', '.smry-pop', function () {
    var $this = $(this);
    var blk = $this.parents('#smry-blk');
    if ($this.hasClass('open'))
    {
      blk.find('.txt-lmt').css('opacity', '0');
      blk.find('#smry').removeClass('dropped');
      $this.removeClass('open').find('i').attr('class', 'icon-angle-down');
    }
    else
    {
      blk.find('.txt-lmt').css('opacity', '1');
      blk.find('#smry').addClass('dropped');
      $this.addClass('open').find('i').attr('class', 'icon-angle-up');
    }
  });
  /* -- Hashtag -- */
  $('#progress-bar').on('click', '#hstg', function () {
    if ($(this).val() == '')
      $(this).val('#');
  });
  $('#progress-bar').on('blur', '#hstg', function () {
    if ($(this).val() == '#')
      $(this).val('');
  });
  $('#progress-bar').on('paste', '#hstg', function () {
    var $this = $(this);
    setTimeout(function () {
      var txt = $this.val().replace(/\s+/g, '');
      $this.val(txt);
    }, 20);
  });
  /* New progress bar functionality */
  $('#progress-bar').on('keydown', '.gt-spc-sgstn input', function (e) {
    var $this = $(this), term = null, spcs = null;
//    $this.on("keydown", function (event) {
//      if (event.keyCode === $.ui.keyCode.TAB && $this.data("ui-autocomplete").menu.active) {
//        event.preventDefault();
//      }
//      if (event.keyCode == $.ui.keyCode.ESCAPE)
//      {
//        var html = $this.html();
//        $this.html(html);
//        $this.autocomplete('destroy');
//        $this.placeCaretAtEnd($this.get(0), 1);
//      }
//    });
    $this.autocomplete({
      minLength: 3,
      source: function (req, res) {
        term = req.term;
        if (term.length > 0)
        {
          $.ajax({
            'url': '/ajax/gtspcsgstn',
            type: 'POST',
            dataType: 'text',
            data: {
              'data': req.term
            },
            beforeSend: function () {
              spcs = [];
            },
            success: function (d) {
              d = JSON.parse(d);
              var prvLst = $this.parents('ul[id^="tgd-"]').data('sgstn');
              $.each(d, function (i, e) {
                if ($.inArray(e.P_Id, prvLst) == -1)
                  spcs.push(e);
              });
            },
            complete: function () {
              res(spcs);
            }
          });
        }
      },
      focus: function (e, ui) {
        e.preventDefault();
        $this.val(ui.item.P_Title_ID);
      },
      select: function (e, ui) {
        e.preventDefault();
        var inpt = $this.parent(), trgt = inpt.parent();
        var spcLst = trgt.data('sgstn') != undefined ? trgt.data('sgstn') : [];
        spcLst.push(ui.item.P_Id);
        trgt.data('sgstn', spcLst);
        inpt.before('<li>' + ui.item.P_Title +
                '<a href="#" class="rmv pull-right"><i class="icon-remove"></i></a></li>');
        $this.val('');
        adjustInputPos(inpt);
      }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
      var anchr = "<a href='#' class='spc'><div class='icn-big pull-left'><img src='/public/Multimedia/" +
              item.P_Feature_Image + "' /></div><p><span class='ttl'>" + item.P_Title +
              "</span><span class='dft-msg block'>" + item.P_Follow_Count +
              " Followers</span></p><div class='clearfix'></div></a>";
      ul.addClass('spc-srch');
//      $this.focus();
      return $("<li>").append(anchr).appendTo(ul);
    };
  });
  /* End */
  $('#progress-bar').on('click', 'ul[id^="tgd-"]', function(e){
    var elm = $(e.target);
    if(e.target.nodeName != 'LI' && !elm.hasClass('rmv'))
      $(this).find('input').focus();
  });
  $('#progress-bar').on('focus', '.gt-htg-sgstn input', function (e) {
    if ($(this).val() == '')
      $(this).val('#');
  });
  $('#progress-bar').on('keydown', '.gt-htg-sgstn input', function (e) {
    var $this = $(this), trgt = $this.parents('ul:first');
    $this.getHstgSgstns(1);

    if (e.which == 32 || ((e.which == 8 || e.which == 46) && $this.val() == '#'))
      e.preventDefault();
    else if ((e.which == 9 || e.which == 13) && $this.val() != '')
    {
      e.preventDefault();
      $this.autocomplete('destroy');
      $this.parent().before('<li>' + $this.val() + '<a href="#" class="rmv pull-right"><i class="icon-remove"></i></a></li>');

      var htgLst = trgt.data('sgstn') != undefined ? trgt.data('sgstn') : [];
      htgLst.push($.trim($this.val()).substr(1));
      trgt.data('sgstn', htgLst);
      $this.val('#').focus();

      adjustInputPos($this.parent());
    }
  });
  
  $('#progress-bar').on('keyup', '.gt-htg-sgstn input', function(e){
    if(e.which == 8 || e.which == 46 && $(this).val() == '')
      $(this).val('#');
  });
  
  $('#progress-bar').on('autocompleteselect', '.gt-htg-sgstn input', function (e, ui) {
    var inpt = $(this).parent(), trgt = inpt.parent(),
            htgLst = trgt.data('sgstn') != undefined ? trgt.data('sgstn') : [];
    htgLst.push(ui.item.value);
    trgt.data('sgstn', htgLst);
    inpt.before('<li>#' + ui.item.value +
            '<a href="#" class="rmv pull-right"><i class="icon-remove"></i></a></li>');
    $(this).val('');
    adjustInputPos(inpt);
  });

  $('#progress-bar').on('click', '#ctrl-bx .rmv', function () {
    var trgt = $(this).parents('li'), par = trgt.parent(), indx = par.find('li').index(trgt);
    var fnlLst = par.data('sgstn');
    fnlLst.splice(indx, 1);
    par.data('sgstn', fnlLst);
    trgt.remove();
    adjustInputPos(par.find('.gt-htg-sgstn'));

    // Checking if htg/spc is picked up from suggestions
    par.siblings('.sgstns').find('.frame li.slct').each(function () {

    });
  });

  $('#progress-bar').on('click', '.sgstns li', function (e) {
    e.preventDefault();
    var $this = $(this);
    var trgt = $this.parents('.sgstns').siblings('ul[id^="tgd-"]');
    if (!$this.hasClass('slct'))
    {
      var be4Tgd = trgt.data('sgstn');
      be4Tgd = be4Tgd instanceof Array ? be4Tgd : [];
      $this.addClass('slct');
      trgt.find('li:last').before('<li>#' + $this.data('htg') + '<a href="#" class="rmv pull-right"><i class="icon-remove"></i></a></li>');

      be4Tgd.push($this.data('htg'));
      trgt.data('sgstn', be4Tgd);
      adjustInputPos(trgt.find('li:last'));
    }
  });
  /*
   *  Insert text
   */
  var tlbr = $('#tlbr-popup');
  tlbr.on('click', '#insertText', function (e) {
    e.preventDefault();
    var id = $(this).insertText('clik');
    setFocus(id);
  });
  /*
   *  Insert Image
   */
  tlbr.on('click', '#insertImage', function (e) {
    e.preventDefault();
    //if($('.crnt').find('.i-b #imageUpload').length = 0)
    $(this).insertImage();
  });
  /*
   *  Insert Chart
   */
  tlbr.on('click', '#insertChart', function (e) {
    e.preventDefault();
    if (!$('.stry').data('chtfiles'))
    {
      var css = document.createElement("link");
      css.setAttribute("rel", "stylesheet");
      css.setAttribute("type", "text/css");
      css.setAttribute("href", "/public/global/default/css/chartstyle.css");
      document.getElementsByTagName('head')[0].appendChild(css);
      var d3Js = document.createElement('script');
      d3Js.src = 'https://saddahaq.blob.core.windows.net/v11/gbojd3.v3.min.js';
      document.getElementsByTagName('body')[0].appendChild(d3Js);
      d3Js.onload = function () {
        var chrtJs = document.createElement('script');
        chrtJs.src = '/public/global/default/js/chart.js';
        document.getElementsByTagName('body')[0].appendChild(chrtJs);
        chrtJs.onload = function () {
          $(this).addChartBlock();
          $(".stry").data("chtfiles", "1");
        };
      };
    }
    else
      $(this).addChartBlock();
  });
//  tlbr.on('click', '#insertAudio', function (e) {
//    e.preventDefault();
//    var d = new Date();
//    var audioCnt = d.getTime();
//    var crtStr = '<div class="m-b e-b" id="audblk' + audioCnt + '" ed-dt=\'{"id":"aud' + audioCnt + '"}\'>' +
//            '<ul class="eb-opts">' +
//            '<li><i class="icon-drag handle" title="Move"></i> </li>' +
//            '<li><a href="#con-del" role="btn" data-toggle="modal"><i class="icon-trash-closed del-eb" title="Delete audio"></i></a></li>' +
//            '</ul>' +
//            '<div class=" audio-holder">' +
//            '<h2 class="m-b-hdng" contenteditable="true" placeholder="Add audio title">Add audio title</h2>' +
//            '<section>' +
//            '<input type="radio" name="audio-tp" id = "audio-upld" class="audio-tp box" data-tp="upld" ><label class="lbl" for="audio-upld">Upload</label>' +
//            '<input type="radio" name="audio-tp" id = "audio-rec" class="audio-tp box" data-tp="rec" ><label class="lbl" for="audio-rec">Record</label>' +
//            '<div class="clearfix"></div>' +
//            '<form class="audio-frm no-hgt transition" enctype="multipart/form-data" method="post" action="/ajax/upldaud">' +
//            '<h3>You can only upload  MP2, MP3, WAVE (WAV), and WMA files. The maximum file size is 5MB.</h3>' +
//            '<div>' +
//            '<div class="span12 box">' +
//            '<input type="file" name="audio-fl" class="audio-fl" accept="MP2,.mp2,.MP3,.mp3,.WMA,.wma,.WAV,.wav"></input>' +
//            '<div class="loading sml hideElement"></div>' +
//            '</div>' +
//            '</div>' +
//            '</form>' +
//            '<div class="audio-record no-hgt transition" >' +
//            '<a id = "rec-aud" href = "#"><i class="icon-audio-record" title="Record"></i></a>' +
//            '<a id = "rec-play" href = "#"><i class="icon-audio-play" title="Play"></i></a>' +
//            '<a id = "rec-upld" href = "#"><i class="icon-upload" title="Upload"></i></a>' +
//            '<p class="aud-sts"> </p>' +
//            '</div>' +
//            '</section>' +
//            '<div class="audio hideElement" id="aud' + audioCnt + '">' +
//            '</div>' +
//            '</div></div>';
//    $('.crnt').find(' > .stry > .e-b:eq(' + tlbr.data('indx') + ')').after(crtStr);
//  });
  /* Insert Timeline */
  tlbr.on('click', '#insertTmln', function () {
    var tmlnCnt = new Date().getTime();
    var tmlnStr = '<div tabindex="0" class="m-b e-b media slctd" data-ed-dt=\'{"id":"tmln' + tmlnCnt + '"}\'>' +
            '<ul class="eb-opts">' +
            '<li><i class="icon-sort handle" title="Move"></i> </li>' +
            '<li><a href="#con-del" role="btn" data-toggle="modal"><i class="icon-remove-circle del-eb" title="Delete Timeline"></i></a></li>' +
            '</ul>' +
            '<h2 class="m-b-hdng emty" data-emty="Add a title for this timeline here" contenteditable="true"></h2>' +
            '<div class="tmln-holder" id="tmln' + tmlnCnt + '" >' +
            '<section>' +
            '<div class="clearfix"></div>' +
            '<form class="m-b-form transition in" enctype="multipart/form-data" method="post" action="/ajax/prsxl">' +
            '<h3>Upload Timeline data</h3>' +
            '<div>' +
            '<div class="box">' +
            '<p>' +
            '<i class="icon-xlsx"></i>' +
            '<span class="author block">(upload .xls,.xlsx files only)</span>' +
            '</p>' +
            '<input type="file" class="tmln-fl" name="tmln-fl" accept=".xlsx,.xls"></input>' +
            '<progress max="100" value="0" class="red img-prgs"></progress>' +
            '</div>' +
            '<div class="box">' +
            '<p><a href="#" id = "tmln-smple" class="author block"><i class="icon-xlsx"></i><span class="block">Download Sample Copy</span></a></p>' +
            '</div>' +
            '</div>' +
            '</form>' +
            '</section>' +
            '</div>';
    var container = $('.crnt > .stry'), actvBlk = tlbr.data('indx');
    if (actvBlk['lst'])
      container = container.find('#' + actvBlk['lst'] + ' .item.active');
    container.find(' > .e-b:eq(' + actvBlk['indx'] + ')').after(tmlnStr);
    if (actvBlk['tgd'])
      container.find(' > .e-b:eq(' + actvBlk['indx'] + ')').remove();
  });
  tlbr.on('click', '#insertList', function () {
    var lstCnt = new Date().getTime();
    var lstStr = '<div class="e-b listicle" id="lst' + lstCnt + '">' +
            '<ul class="eb-opts">' +
            '<li><i class="icon-sort handle" title="Move"></i> </li>' +
            '<li><a href="#con-del" role="btn" data-toggle="modal"><i class="icon-remove-circle del-eb" title="Delete listicle"></i></a></li>' +
            '</ul>' +
            '<section>' +
            '<div class="cntr">' +
            '<a href="#" class="lst-prv" data-original-title="View previous item"><i class="icon-chevron-left"></i></a>' +
            '<span class="crnt-cnt">1</span>/<span class="ttl-cnt">1</span>' +
            '<a href="#" class="lst-nxt" data-original-title="View next item"><i class="icon-chevron-right"></i></a>' +
            '</div>' +
            '<div class="carousel-inner">' +
            '<div id="itm' + lstCnt + '" class="item active" data-ed-dt=\'{"id":"itm-' + lstCnt + '", "data":[]}\'>' +
            '<h2 class="m-b-hdng emty" data-emty="Add a title for this chart here" contenteditable="true"></h2>' +
            tlbr.insertText('html') + '<div class="clearfix"></div></div>' +
            '<ul class="lst-opts pull-right">' +
            '<li><a href="#" data-toggle="tooltip" data-original-title="Add new list item after this" class="lst-new">' +
            '<i class="icon-plus-circle"></i></a></li>' +
            '<li><a href="#con-del" role="btn" data-toggle="modal" data-original-title="Delete this list item" class="del-lst">' +
            '<i class="icon-remove-circle"></i></a></li>' +
            '</ul>' +
            '<div class="clearfix"></div>' +
            '<div class="cntr">' +
            '<a href="#" class="lst-prv" data-original-title="View previous item"><i class="icon-chevron-left"></i></a>' +
            '<span class="crnt-cnt">1</span>/<span class="ttl-cnt">1</span>' +
            '<a href="#" class="lst-nxt" data-original-title="View next item"><i class="icon-chevron-right"></i></a>' +
            '</div>' +
            '</div>' +
            '</section>' +
            '</div>';
    var container = $('.crnt > .stry'), actvBlk = tlbr.data('indx');

    container.find(' > .e-b:eq(' + actvBlk['indx'] + ')').after(lstStr);
    if (actvBlk['tgd'])
      container.find(' > .e-b:eq(' + actvBlk['indx'] + ')').remove();

    var actvItm = $('#lst' + lstCnt).find('.carousel-inner .item');
    actvItm.addClass('active').find('.t-b').enableEditor();
    $('.lst-opts a').tooltip({
      "placement": "top",
      "container": "body"
    });
  });
  tlbr.on('click', '#ins-pl', function () {
    var plCnt = new Date().getTime();
    var plStr = '<div tabindex="0" class="e-b poll media slctd box" id="pol' + plCnt +
            '" data-ed-dt=\'{"id":"pol' + plCnt + '","data":{}}\'>' +
            '<ul class="eb-opts">' +
            '<li><i class="icon-sort handle" title="Move"></i> </li>' +
            '<li><a href="#con-del" role="btn" data-toggle="modal"><i class="icon-remove-circle del-eb" title="Delete Poll"></i></a></li>' +
            '</ul>' +
            '<div class="m-b-hdng emty" contenteditable="true" data-emty="Add Poll question here"></div>' +
            '<div class="pol-opts">' +
            '<a class="rm-pol-opt" href="#"><i class="icon-remove-circle"></i></a>' +
            '<div class="pol-opt emty" data-emty="Poll Option" contenteditable="true"></div>' +
            '<div class="pol-opt emty" data-emty="Poll Option" contenteditable="true"></div>' +
            '<a href="#" class="ad-pol-opt"><i class="icon-plus-circle"></i> Add new option</a>' +
            '</div>' +
            '</div>';

    var container = $('.crnt > .stry'), actvBlk = tlbr.data('indx');
    if (actvBlk['lst'])
      container = container.find('#' + actvBlk['lst'] + ' .item.active');
    container.find(' > .e-b:eq(' + actvBlk['indx'] + ')').after(plStr);
    if (actvBlk['tgd'])
      container.find(' > .e-b:eq(' + actvBlk['indx'] + ')').remove();
  });
//  tlbr.on('click', '#bar-chart', function(e) {
//    e.preventDefault();
//    $(this).pieChart();
//  });
  /*
   * Insert Video
   */
  tlbr.on('click', '#insertVid', function (e) {
    e.preventDefault();
    var id = $(this).insertText('vid');
    setFocus(id);
  });
  /*
   * Close tools popup whenever an anchor is clicked
   */
  tlbr.on('click', '.tools a', function () {
    clsPopout($(this).parents('.tools'));
    tlbr.removeClass('in');
  });
  /* converting textboxes into blockquotes/headings/highlights based on the option chosen
   * 
   */
  $('#frmt-opts').on('mousedown', 'a', function () {
    var $this = $(this);
    var trgt = $('.stry  .e-b:eq(' + $this.parents('#edtr-popup').data("indx") + ')');
    var edDt = trgt.data('edDt') != undefined ? trgt.data('edDt') : {"id": trgt.attr('id')};
    var hasSlctn = 0;
    if ($this.hasClass('active'))
    {
      trgt.removeClass('sbh hlt blq');
      edDt['spl'] = '';
    }
    else
    {
      var txt = '';
      if (document.selection && document.selection.createRange().text != '')
      {
        txt = document.selection.createRange().text;
        hasSlctn = 1;
      }
      else if (window.getSelection && window.getSelection().toString() != '')
      {
        txt = window.getSelection().toString();
        hasSlctn = 1;
        window.getSelection().removeAllRanges();
      }
      else
        txt = $.trim(trgt.text());

      if (hasSlctn)
      {
        trgt = $('#' + trgt.insertText('caret'));
        edDt = {"id": trgt.attr('id')};
      }
      trgt.html(txt);

      edDt['spl'] = $this.data('tp'); //To save format of text box
      switch ($this.data('tp'))
      {
        case 'sbh' :
        case 'head' :
          trgt.addClass('sbh').removeClass('blq hlt');
          break;
        case 'blq':
          trgt.addClass('blq').removeClass('sbh hlt head');
          break;
        case 'hlt':
          trgt.addClass('hlt').removeClass('sbh blq head');
          break;
      }
    }
    if (typeof edDt.data != 'undefined')
      $('#art-drft').data('chngd', 1);
    else
      edDt.data = '';
    trgt.data('edDt', edDt);
//    updateDivData(trgt);
  });

  $(".stry").on("click", ".sbh, .hlt, .blq, #txt1", function () {
    if ($(this).text() == "")
      $(this).html("&nbsp;");
  });

  // Image resize options
  $('#grpc-opts').on('mousedown', 'a', function () {
    var $this = $(this);
    var trgt = $('.stry  .e-b:eq(' + $this.parents('#edtr-popup').data("indx") + ')');
    trgt.removeClass(function (index, css) {
      return (css.match(/\bi-b-\S+/g) || []).join(' ');
    }).addClass($this.data('tp'));
    var json = trgt.data('edDt');
    json['spl'] = $this.data('tp');
    trgt.data('edDt', json);
    $this.parents('#edtr-popup').removeClass('in');
    $('#art-drft').data('chngd', 1);
  });

  /* Show and hide placeholder and editor options based on the status of text area and image */
  $(document).on('click focus', '[contenteditable="true"]', function (e) {
    e.stopPropagation();
    if ($(this).hasClass('emty') && !$(this).hasClass('v-b'))
      $(this).removeClass('emty').html("&nbsp;");
  });
  $('.crnt > .stry, .cvr-bg, #progress-bar').on('click', '.c-n, figcaption', function (e) {
    var $this = $(this);
    var isAtEnd = 0;
    if (!$.trim($this.text()).length) {
      $this.removeClass('emty').html('&nbsp;');
      isAtEnd = 1;
    }
    $this.placeCaretAtEnd(this, isAtEnd);
  });

  var updtTmr = null;
  $('.crnt > .stry').on('focus', '.t-b, .v-b', function (e) {
    var $this = $(this);
    if (!$this.hasClass('v-b'))
    {
      $this.addClass('actv');
      $('#tlbr-popup').css('top', $this.offset().top - $this.parents('.crnt').offset().top + 2);
      if ($.trim($this.text()) == '' && !$this.find('iframe').length)
      {
        var actvBlk = {"indx": $this.parents('.stry').find(' > .e-b').index($this), "lst": 0, "tgd": 1};
//    var eblks = $this.parents('.stry').find(' > .e-b'), isLst = 0;
        if ($this.parents('.listicle').length)
        {
          actvBlk['indx'] = $this.parents('.listicle').find('.item.active .e-b').index($this);
          actvBlk['lst'] = $this.parents('.listicle').attr('id');
        }
        $this.html('&nbsp;');
        $('#tlbr-popup').data('indx', actvBlk).addClass('in');
      }
    }
    else if ($this.hasClass('emty'))
      $this.removeClass('emty').append('&nbsp;');

    $this.siblings('.media, .slctd').removeClass('slctd'); // TO remove selection

    updtTmr = setInterval(function () {
      if ($this.hasClass('t-b'))
        updateDivData($this);
    }, 4000);
  });

  $('.crnt > .stry').on('keydown', '.v-b', function (e) {
    if ((e.which == 8 || e.which == 46 || e.which == 13) && $(this).text().trim() == '')
      e.preventDefault();
  });

  $('.crnt > .stry').on('blur', '.t-b, .v-b', function () {
    var $this = $(this);
    clearInterval(updtTmr);
    if (!$this.hasClass('v-b') && !$this.find("iframe").length)
    {
      $this.removeClass('actv').addClass(($.trim($this.text()) == '' ? 'emty' : ''));
      updateDivData($this);
      $this.data($this.updateRefTag());
    }
    else
    {
      var tmp = $('<div>').html($this.html());
      tmp.find('.eb-opts').remove();
      if (!$this.find('iframe').length)
        $this.addClass('emty');
//      if ($.trim(tmp.text()) == '') {
//        $this.addClass('emty');
//        tmp.text(' ');
//      }
    }
    $('#edtr-popup').removeClass('in');
  });

  $('.stry').on('blur', '.media', function () {
    $('#edtr-popup').removeClass('in');
  });
  /*
   * event handlers for t-bs in articles
   */
  $('.crnt').on('paste', '.t-b', function (e) {
    var $this = $(this);
    var parBlk = $this.parents('.e-b:not(.listicle)');
    setTimeout(function () {
      $('#dmp_dt').val($this.html().replace(/\n/g, " ").replace(/style=".*?"/gi, "").replace(/<br.*?>/gi, ""));
      if ($this.text().match(/(<iframe.*?>.*?<\/iframe>)/g) || $this.text().match(/(<div id="fb-root">.*?<\/div><\/div>)/g) || $this.text().match(/(<script.*?>.*?<\/script>)/g))
      {
        $('#sts-msg').showStatus('Some of the embedded content may not appear instantly. You can see them after your story is published', 'scs');
        if (!parBlk.length)
          $this.data('edDt', {"id": $this.attr('id'), "data": $this.trimText($this.html())}).removeClass('error');
        else
          parBlk.data('edDt', {"id": $this.attr('id'), "data": $this.trimText($this.html())}).removeClass('error');

        $this.html("<p>" + $this.text() + "</p>");
      }
      else
      {
        var chld = $('<div>').html($('#dmp_dt').val().replace(/\n/g, " ")), tmp = $('<div>'),
                newP = $('<div>');
        chld.contents().each(function (i, e) {
          if (e.nodeName == 'P' || e.nodeName == 'DIV')
          {
            if (newP.html() != '')
            {
              var newPTxt = newP.clone();
              tmp.append(newPTxt);
            }
            tmp.append($(e));
            newP.html('');
          }
          else
            newP.append($(e));
        });
        $this.html('');
        if (!tmp.children().length || newP.html() != '')
          tmp.append(newP);
        var id = $this.attr('id');
        tmp.children('p,div').each(function (i, e) {
          var html = null;
          if (e.nodeName == 'P' || e.nodeName == 'DIV')
          {
            var txt = $('<div>');
            $(e).contents().each(function (i, e) {
              if (this.nodeType === 3)
                txt.append(this.nodeValue);
              else if (e.nodeName == 'UL' || e.nodeName == 'OL')
              {
                txt.append("<" + e.nodeName.toLowerCase() + " class='edtr-lst'>" +
                        $(e).html() + "</" + e.nodeName.toLowerCase() + ">");
              }
              else
              {
                var excTgs = ['b', 'i', 'u', 'a', 'em', 'strong'];
                if (excTgs.indexOf(this.nodeName.toLowerCase()) != -1)
                {
                  txt.append('<' + this.nodeName.toLowerCase() + (this.nodeName == 'A' ? ' href="' + this.href + '"' : '') + '>' +
                          $(this).text() + '</' + this.nodeName.toLowerCase() + '>');
                }
                else
                  txt.append($(this).html());
              }
            });
            html = txt.html();
          }
          else
            html = $(e).html().replace(/<\/?([b-z]+)[^>]*>/gi, "");
          if ($.trim($(e).text()) != '')
          {
            if (i == 0 || $this.text() == '')
            {
              $this.append(html).placeCaretAtEnd($this.get(0), 1);
              updateDivData(parBlk);
            }
            else
            {
              id = $('#' + id).insertText('caret');
              $('#' + id).removeClass('emty').html(html).placeCaretAtEnd($('#' + id).get(0), 1);
              updateDivData($('#' + id));
            }
          }
        });
      }
    }, 0);
  });
  //Video Block
  $('.crnt > .stry').on('paste', '.v-b', function () {
    var $this = $(this);
    /* end of url to embed code change */
    $this.removeClass('emty');
    setTimeout(function () {
      /*checking the url and making that embed code */
      var urlid = null, embd = null, url = $this.text();
//      $this.text('');
      $this.contents().filter(function () {
        return this.nodeType === 3
      }).remove(); // To remove text
      var edDt = {
        "id": $this.attr('id')
      };
      if ((url.match(/(<iframe.*?>.*?<\/iframe>)/g)))
      {
        var tmp = $('<div>').html(url);
        url = tmp.find('iframe').attr('src');
      }
      if (url.match(/(metacafe.com)/g)) {
        var regex = /\/watch\/([A-z0-9-_]*)/g;
        urlid = regex.exec(url);
        if (urlid)
          urlid = "embed/" + urlid[1];
        else
          urlid = url.match(/embed\/([A-z0-9-_]*)/g);

        embd = '<iframe src="//www.metacafe.com/' + urlid + '?rel=0&wmode=transparent" width="440" height="248" allowFullScreen frameborder=0></iframe>';
        edDt.tp = 'v';
      }
      else if (url.match(/(youtube.com)/g)) {
        urlid = url.match(/(v=([A-z0-9-_]*))/g);

        if (urlid)
          urlid = "/embed/" + urlid[0].substring(2);
        else
          urlid = url.match(/embed\/([A-z0-9-_]*)/g);

        embd = "<iframe width='560' height='315' src='//www.youtube.com/" + urlid + "?rel=0&wmode=transparent' frameborder='0' allowfullscreen></iframe>";
        edDt.tp = 'v';
      }
      else if (url.match(/(vimeo.com)/g)) { //regex not done because no key provided for the id. 
        urlid = $('<a>').prop('href', $.trim(url)).prop('pathname').split("/");
        urlid = urlid[urlid.length - 1];
        embd = '<iframe src="//player.vimeo.com/video/' + urlid + '?wmode=transparent" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        edDt.tp = 'v';
      }
      else if (url.match(/(twitter.com)/g)) {
        urlid = $.trim(url).match(/(\/status\/([A-z0-9-_])*)/g);
        urlid = urlid[0].substring(8);
        embd = '<blockquote class="twitter-tweet" align="center" lang="en"><a href="https://twitter.com/bhogleharsha/status/' + urlid + '?rel=0&wmode=transparent"></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
        edDt.tp = 't';
      }
      else if (url.match(/(vine.co)/g))
      {
        var vineReg = /\/v\/([A-z0-9-_])*/g;
        urlid = vineReg.exec(url)[0];
        embd = '<iframe class="vine-embed" src="https://vine.co/' + urlid + '/embed/postcard" width="480" height="480" frameborder="0"></iframe><script async src="//platform.vine.co/static/scripts/embed.js" charset="utf-8"></script>';
        edDt.tp = 't';
      }
//      $this.find("i").text(''); // because url pasted is copied into the i tag of eb-opts
//      }
//      else
//      {
//        embd = $.trim(url);
//        edDt.tp = 't';
//      }
      edDt.data = $this.trimText(embd);
      $this.data('edDt', edDt).find('.help').remove();
      
      //Remove all html other than editor options and he-bg
      $this.contents().not('.eb-opts').not('.he-bg').remove();
      
      $this.addClass('v-b ed-b').removeClass('t-b error').append('<div class="he-bg"></div>' + embd);
      if (edDt.tp == 'v')
        $this.addClass('media');
      
      
      $this.removeAttr('contenteditable').trigger('click');
      $('#art-drft').data('chngd', 1);
    }, 0);
  });

  $('.crnt > .stry').on('keydown', '.t-b', function (e) {
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
    else if (e.which == 13 && !e.shiftKey)
    {
      var sel = window.getSelection(), entr_prsd_on = sel.anchorNode.parentNode.nodeName, trgt = ['SPAN', 'OL', 'LI', 'UL'];
      if ($(sel.anchorNode.parentNode).hasClass('t-b'))
        e.preventDefault();

      if ($this.hasClass('ui-autocomplete-input') || $this.hasClass('ui-autocomplete-loading'))
      {
        $this.autocomplete('destroy');
        return false;
      }
      else
      {
        if (document.selection)
        {
          console.log("document", document.selection.createRange().tagName);
        }
        else
        {
          setTimeout(function () {
            var sel = window.getSelection();
            sel.collapseToEnd();
            if ($.inArray(entr_prsd_on, trgt))
            {
              e.preventDefault();
              var id = $this.insertText('caret');
              if (sel.rangeCount)
              {
                var selRange = sel.getRangeAt(0);
                var block = getContainer(selRange.endContainer);
                if (block)
                {
                  var range = selRange.cloneRange();
                  range.selectNodeContents(block);
                  range.setStart(selRange.endContainer, selRange.endOffset);
                  $('#' + id).text('');
                  $('#' + id).append(range.extractContents());
                }
              }
              if (navigator.userAgent.toLowerCase().indexOf('chrome') <= -1)
                $('#' + id).placeCaretAtEnd(document.getElementById(id), 0);

              updateDivData($('#' + id));
              $('#' + id).trigger('focus');
              setFocus(id);

            }
          }, 0);
        }
      }
    }
    else if (e.which == 13 && e.ctrlKey)
    {
      $this.insertText('caret');
    }
    else if (e.which == 8 || e.which == 46)
    {
      if ($.trim($this.text()) == '')
      {
        e.preventDefault();
        $('#tlbr-popup').removeClass('in');
        // Move to next block if it is a first para else to previous block
        chngBlk($this, $('.stry').find('.e-b').index($this) == 0 ? 1 : 0);
        $this.remove();
      }
      else if ($this.getCaretPosition() == 0)
      {
        e.preventDefault();
        var trgtEb = $this.prev('.e-b');
        if (trgtEb.length)
        {
          if (trgtEb.hasClass('t-b'))
          {
            trgtEb.placeCaretAtEnd(trgtEb.get(0), 1);
            trgtEb.append($this.html());
            updateDivData(trgtEb);
            $this.remove();
          }
          else
            chngBlk($this, 0);
        }
      }
    }
    else if ($.trim($this.text()) == $this.attr('placeholder'))
      $this.text('');
  });
  /*
   * Progress bar buttons functionality
   */
  // Back button
  $('#progress-bar').on('click', '.go-bk', function () {
    if ($(this).hasClass('er-bx'))
    {
      $(this).parents('.err-box').css('left', '100%').siblings('section').addClass('in').parent().css('overflow', 'hidden');
      if ($(this).parents('.err-box').attr('id') == 'dtls-err')
        $(this).parents('.err-box').remove();
    }
    else
      $(this).parents('section').css('left', 0);
  });
  /* Insert load and scale inline images */
  /* Using ajaxForm to load image asynchronously */
  $('.stry, .slct-cvr-img, #progress-bar').on('change', '.image-file', function (e) {
    var $this = $(this);
    var extUsr = $('#sh-embd-cms').length ? $('#sh-embd-cms').find("#usr-dtls a").attr("href").substr(1) : "";
    var auth = $('#usr-bar .usr-dtls .auth').attr('href').split('/');
    if ($.trim(auth[auth.length - 1]) == $this.getLoggedInUsr() || $.trim(auth[auth.length - 1]) == $("body").data("bunme") || $('body').data('isMod') || $this.getLoggedInUsr(1) == extUsr)
    {
      var count = 0;
      var alwdExt = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!$this.hasClass('cvr'))
        alwdExt.push('image/gif');
      var files = this.files, flag = 0, imgCount = files.length, imgLst = [];
      $.each(files, function (i, file) {
        if ($.inArray(file['type'], alwdExt) == -1)
        {
          $('#sts-msg').showStatus(file['name'] + ' has an unsupported file format', 'err');
          $this.val('');
          flag = 1;
          return false;
        }
        else
        {
          imgLst.push(file['name']);
          flag = 0;
        }
      });
      if (!flag)
      {
        var target = $this.parents('.i-b');
        if ($this.hasClass('cvr') || $this.hasClass('new-cvr'))
          target = $this.parents('.img-upld').siblings('.cvr-bg');
        target.find('progress').fadeIn(200);
//        var trgt = "#" + target.attr('id');
        var par = null;
        if ($this.hasClass('cvr'))
        {
          par = target.parents('#cvr-img');
          par.removeClass('emty').addClass('img');
        }
        else if ($this.hasClass('new-cvr'))
        {
          par = target.parents('#err-img-hldr');
          par.removeClass('emty');
        }
        else
          par = target;
        if (!!window.FormData && !!window.ProgressEvent)
        {
          $this.on('upldimg', function () {
            var $this = $(this);
            if (typeof this.files[count] === 'undefined') {
              return false;
            }
            else
            {
              var fd = new FormData();
              fd.append('file', this.files[count]);
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
                    par.find('progress').removeClass('hideElement').siblings('.help').remove();
                    xhr.upload.addEventListener('progress', function (evt) {
                      if (evt.lengthComputable) {
                        var percent_done = parseInt(100 * evt.loaded / evt.total);
                        if (imgCount > 1)
                        {
                          if (count > 0)
                            percent_done = (100 * (count / imgCount)) + percent_done / imgCount;
                          else
                            percent_done = percent_done / imgCount;
                        }
                        par.find('progress').attr('value', Math.ceil(percent_done));
                      }
                    }, false);
                  }
                  return xhr;
                },
                success: function (data) {
                  count++;
                  var t = JSON.parse(data), imgLft = imgCount;
                  par.find('progress').addClass('hideElement');
                  if (t.success)
                  {
                    imgLst[imgLst.indexOf(t['nme'])] = t.msg;
                    if (imgCount == count)
                    {
                      par.addClass('ed-b');
                      if (imgCount > 1)
                        par.addClass('grid');
                      $this.parents('.img-holder').removeClass('emty').find('form').remove();
                      while (imgLft > 0)
                      {
                        if (imgLft == 4)
                        {
                          processImage(imgLst.splice(0, 2), par);
                          processImage(imgLst, par);
                          imgLft = 0;
                        }
                        else
                        {
                          processImage(imgLst.splice(0, 3), par);
                          imgLft -= 3;
                        }
                      }
                      $('#art-drft').data('chngd', 1);
                    }
                    else
                      par.find('.image-file').trigger('upldimg');
                    if (par.parents("#progress-bar").length) {
                      $("#progress-bar").find("#err-box .err-msg, .messages .sts.err").addClass("hideElement");
                      $("#progress-bar").find("#err-box .s-h").text("Cover image uploaded successfully.");
                    }
                  }
                  else
                  {
                    var errmsg = '';
                    switch (parseInt(t['success']))
                    {
                      case 0:
                        errmsg = 'Error in moving uploaded file';
                        break;
                      case -1:
                        errmsg = 'Upload an image of size less than 4MB';
                        break;
                      case -2:
                        errmsg = 'Invalid file format';
                        break;
                      case -3:
                        errmsg = 'Error while uploading file';
                        break;
                    }
                    $('#sts-msg').showStatus(errmsg, 'err');
                    return false;
                  }

                }
              });
            }
          }).trigger('upldimg');
        }
      }
    }
  });

  $('.stry').on('click', '.chng-img', function () {
    var $this = $(this);
    $this.parents('.preview').html('').siblings('form').removeClass('hideElement')
            .parent().removeClass('no-bdr').find('.i-d').remove();
  });

  function processImage(imgLst, par)
  {
    var imgCnt = imgLst.length;
    if (par.attr('id') == 'cvr-img' || par.attr('id') == 'err-img-hldr')
    {
      if (par.attr('id') == 'cvr-img')
      {
        par.find('.cvr-bg').append($('.edtr').find('#hd-sctn').clone());
        $('.edtr').find('#hd-sctn').remove();
      }
      par.find('.cvr-stngs').addClass('in');
      var i = new Image();
      i.src = imgLst[0];
      par.find('.cvr-bg').removeClass('hideElement').prepend('<img src="' + imgLst[0] + '" />')
              .find('progress').addClass('hideElement');
//      par.find('form').addClass('hideElement').find('.image-file').val('');
      par.data('img', {
        "id": "cvr-bg",
        "src": imgLst[0]
      });
      par.find('.cvr-bg .c-n').addClass('emty');
      par.find('.cvr-bg').positionBackground();
    }
    else if (imgCnt >= 1)
    {
      var dt = par.data('edDt') != undefined ? par.data('edDt') : {"id": par.attr('id'), "data": []};
      for (var c = 0; c < imgLst.length; c++)
      {
        dt['data'].push({'src': imgLst[c], 'cp': {'id': '', 'cn': ''}});
      }
      par.data('edDt', dt).find('.img-holder').append('<div class="fig-bx"><div class="clearfix"></div></div>');
      loadImages(par.find('.fig-bx:last'), imgLst);
    }
  }

  function loadImages(trgt, imgLst)
  {
    var ttl_ar = 0, onLoadCntr = 1;
    for (var c = 0; c < imgLst.length; c++)
    {
      var img = new Image();
      img.src = imgLst[c];
      img.onload = function () {
        var img_ar = parseFloat((this.width / this.height).toFixed(3));
        ttl_ar += img_ar;
        if (onLoadCntr == imgLst.length)
        {
          for (var c = 0; c < imgLst.length; c++)
          {
            var adStr = '<figure class="img-fig box fade transition ' + (c == 0 ? 'actv' : '') + '" tabindex="0">' +
                    '<div class="ar-hldr">' +
                    '<div class="ar"></div>' +
                    '<img src="' + imgLst[c] + '" />' +
                    '<div class="c-n emty edt" data-mx-ln="40" contenteditable="true"></div>' +
                    '</div>' +
                    '<figcaption class="box emty ' + (c == 0 ? '' : 'hideElement') + '" data-mx-ln="140"' +
                    ' contenteditable="true" data-emty="Description for Image ' +
                    (imgLst.length > 1 ? c + 1 : '') + '"></figcaption>' +
                    '</figure>';
            trgt.find('.clearfix').before(adStr);
            trgt.find('figure:last').find('img').on('load', function () {
              var img = $(this), img_ar = parseFloat((this.naturalWidth / this.naturalHeight).toFixed(3));
              img.siblings('.ar').css('padding-bottom', (100 / img_ar) + '%');
              var fig = img.parents('figure');
              fig.css('width', ((img_ar / ttl_ar) * 100) + '%').addClass('in').find('figcaption')
                      .css('width', (((trgt.parents('.i-b').outerWidth() + 10) / fig.outerWidth()) * 100).toFixed(2) + '%');
            });
          }
//          par.data('edDt', dt).find('.fig-bx:last').append('<div class="clearfix"></div>');
          if (!$('#edtr-popup').hasClass('in'))
            showEdtrPopup(trgt.parents('.i-b'));
        }
        onLoadCntr++;
      };
    }
  }
  $('.stry').on('click', '.i-b figure', function (e) {
    var $this = $(this);
    $this.addClass('actv').siblings('figure').removeClass('actv').find('figcaption').addClass('hideElement');
    $this.find('figcaption').css('left', ($this.parents('.fig-bx').offset().left - $this.offset().left) + 'px').removeClass('hideElement');
  });
// Remove Individual elements from slideshow 
  $(document).on('click', '.rm-img', function (e) {
    e.preventDefault();
    var trgt = $(this).parents(".i-b").find('.item.active');
    var json = JSON.parse(trgt.parents('.i-b').data('edDt'));
    if (json['data'].length == 2)
    {
      $('#sts-msg').showStatus("Slideshow must have atleast 2 images", 'err');
      return false;
    }
    else
    {
      $.each(json.data, function (i, img) {
        if (trgt.data('img') == img.id)
        {
          json.data.splice(i, 1);
          trgt.parents('.carousel').carousel('prev');
          return false;
        }
      });
      trgt.parents('.i-b').data('edDt', json);
      trgt.parents('.carousel').find('.carousel-indicators li:last').remove();
      trgt.remove();
    }
  });
  /*
   * Remove Cover image and show upload button
   */
  $(document).on('click', '.cvr-stngs a', function () {
    var trgt = $(this).parents('#cvr-img');
    $('.edtr').prepend(trgt.find('.cvr-bg #hd-sctn').clone());
    if (trgt.length)
    {
      trgt.removeData('img').addClass('emty').find('.cvr-bg').addClass('hideElement').siblings('.cvr-stngs').removeClass('in')
              .siblings('form').removeClass('hideElement');
      trgt.find('.cvr-bg #hd-sctn').remove();
    }
    else
    {
      trgt = $(this).parents('.cvr-bg');
      trgt.removeAttr('style').addClass('hideElement').siblings('form').removeClass('hideElement').siblings('.cvr-stngs').removeClass('in');
    }
  });
  /* Insert load Documents*/
  /* Using ajaxForm to upload Documents asynchronously */
  $(document).on('change', '#doc-fl, .cht-fl, .tmln-fl', function () {
    var $this = $(this);
    var flag = 0;
    var files = this.files;
    if (files.length)
    {
      var alwdExt = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/pdf",
        "application/msword",
        "application/vnd.ms-excel",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/rtf",
        "text/plain"];
      var extUsr = $('#sh-embd-cms').length ? $('#sh-embd-cms').find("#usr-dtls a").attr("href").substr(1) : "";
      var auth = $('#usr-bar .usr-dtls .auth').attr('href').split('/');
      if ($.trim(auth[auth.length - 1]) == $this.getLoggedInUsr() || $.trim(auth[auth.length - 1]) == $("body").data("bunme") || $('body').data('isMod') || $this.getLoggedInUsr(1) == extUsr)
      {
        $.each(files, function (i, file) {
          if ($.inArray(file['type'], alwdExt) == -1 || file['size'] > 26214400)
          {
            if (file['size'] > 26214400)
              $('#sts-msg').showStatus(file['name'] + '\'s file size is greater than 2MB', 'err');
            else
              $('#sts-msg').showStatus(file['name'] + ' has an invalid file format', 'err');
            $this.val('');
            flag = 1;
            return false;
          }
          else
            flag = 0;
        });
        if (!flag)
        {
          var count = 0;
          var prgs = $this.parents('#doc-atch').siblings('progress');
          if ($this.hasClass('cht-fl'))
            prgs = $this.siblings('progress');
          prgs.fadeIn(100);
          $this.on('upldfl', function () {
            var $this = $(this);
            if (typeof this.files[count] === 'undefined')
              return false;
            else
            {
              var fd = new FormData();
              fd.append('cht-fl', this.files[count]);
              fd.append('auth', $this.getShIntr());
              fd.append('usr', $this.getLoggedInUsr());
              $.ajax({
                url: '/ajax/prsxl',
                type: 'POST',
                data: fd,
                contentType: false,
                processData: false,
                xhr: function () {
                  var xhr = $.ajaxSettings.xhr();
                  if (xhr.upload)
                  {
                    prgs.removeClass('hideElement').siblings('.help').remove();
                    xhr.upload.addEventListener('progress', function (evt) {
                      if (evt.lengthComputable) {
                        prgs.attr('value', parseInt(100 * evt.loaded / evt.total));
                      }
                    }, false);
                  }
                  return xhr;
                },
                success: function (data) {
                  count++;
                  prgs.addClass('hideElement');
                  var errmsg = '';
                  switch (parseInt(data))
                  {
                    case 0:
                      errmsg = 'Error in moving uploaded file. Please try again!';
                      break;
                    case -1:
                      errmsg = 'Upload an image less than 2MB size';
                      break;
                    case -2:
                      errmsg = 'Invalid file format';
                      break;
                    case -3:
                      errmsg = 'Error while uploading file. Please try again!';
                      break;
                    default :
                      if ($this.hasClass('cht-fl'))
                        $this.parseChtExcel($this, data);
                      else if ($this.hasClass('tmln-fl')) {
                        try {
                          parseTmLn($this, data);
                        }
                        catch (e) {
                          if (e == "Invalid Start-Date" || e == "Start date and Headline are mandatory For Every Entry")
                            $('#sts-msg').showStatus(e, "err");
                          else
                            $('#sts-msg').showStatus("Looks like there's some mismatch with the required format. Why don't you try downloading and editing the sample copy?", "err");
                        }
                      }
                      else
                        updtDoc(data);
                      break;
                  }
                  if (errmsg != '')
                    $('#sts-msg').showStatus(errmsg, "err");
                }
              });
            }
          }).trigger('upldfl');
        }
      }
    }
  });
  /*
   $(document).on('change', '.audio-fl', function () {
   var $this = $(this);
   $this.parents('form').ajaxForm({
   data: {
   "file": $this.attr('class'),
   "title": $this.parents(".audio-holder").find(".m-b-hdng").text()
   },
   beforeSend: function () {
   $this.siblings(".loading").removeClass("hideElement");
   },
   success: function (data) {
   if (data != undefined)
   {
   var par = $this.parents('.m-b');
   var updtJson = par.data('edDt');
   updtJson = (updtJson !== undefined) ? updtJson : {};
   updtJson.data = data;
   par.data('edDt', updtJson);
   $this.parents('section').addClass('hideElement');
   var sc_iframe = '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=' + data + '&amp;color=ff6600&amp;auto_play=false&amp;show_artwork=true"></iframe>';
   par.find(".audio").removeClass("hideElement");
   setTimeout(function () {
   par.find(".audio").html(sc_iframe);
   $('#sts-msg').showStatus("Audio is successfully uploaded. Note: Player might not be loaded now, but it will be loaded once this is published.", "scs");
   $this.find(".loading").addClass("hideElement");
   }, 1500);
   //  $('#sts-msg').showStatus(data, "scs");
   }
   },
   error: function (err) {
   $('#sts-msg').showStatus("Oops..! Something went wrong. Please try again.", "err");
   $this.siblings('.loading').addClass("hideElement");
   $this.parents('form').addClass('no-hgt').removeClass('in');
   $this.parents('.audio-holder').find('input[name="audio-tp"]').prop('checked', false);
   },
   complete: function () {
   $this.parent().removeClass('hideElement');
   $this.val("");
   }
   }).submit();
   });
   
   $('.crnt').on('click', '.audio-holder #rec-aud', function (e) {
   e.preventDefault();
   var $this = $(this);
   if ($this.find('i').hasClass("icon-audio-record")) {
   $this.find('i').removeClass("icon-audio-record").addClass("icon-audio-stop");
   $this.find('i').attr("title", "Stop");
   SC.record({
   progress: function (ms, avgPeak) {
   updateTimer(ms, $this);
   }
   });
   }
   else if ($(this).find('i').hasClass("icon-audio-stop")) {
   $(this).find('i').removeClass("icon-audio-stop").addClass("icon-audio-record");
   $this.find('i').attr("title", "Record");
   SC.recordStop();
   }
   });
   
   $('.crnt').on('click', '.audio-holder #rec-play', function (e) {
   e.preventDefault();
   var $this = $(this);
   updateTimer(0, $this);
   SC.recordPlay({
   progress: function (ms) {
   updateTimer(ms, $this);
   }
   });
   });
   $('.crnt').on('click', '.audio-holder #rec-upld', function (e) {
   e.preventDefault();
   var $this = $(this);
   $this.siblings('.aud-sts').html("Uploading...");
   SC.recordUpload({
   track: {
   title: $this.parents(".audio-holder").find(".m-b-hdng").text(),
   sharing: 'public'
   }
   }, function (track) {
   // $this.find('.aud-sts').addClass("hideElement");
   setTimeout(function () {
   $this.siblings('.aud-sts').html("Uploaded: <a href='" + track.permalink_url + "'>" + track.permalink_url + "</a>");
   var par = $this.parents('.m-b');
   var updtJson = par.data('edDt');
   updtJson = (updtJson !== undefined) ? updtJson : {};
   updtJson.data = track.permalink_url;
   par.data('edDt', updtJson);
   $this.parents('section').addClass('hideElement');
   var sc_iframe = '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=' + track.permalink_url + '&amp;color=ff6600&amp;auto_play=false&amp;show_artwork=true"></iframe>';
   $this.parents('.m-b').find(".audio").html(sc_iframe);
   par.find(".audio").removeClass("hideElement");
   $('#sts-msg').showStatus("Audio is successfully uploaded. Player might not be loaded now, but it will be loaded once this is published.", "scs");
   }, 1500);
   });
   });
   function updateTimer(ms, $this) {
   $this.siblings('.aud-sts').text(SC.Helper.millisecondsToHMS(ms));
   }
   */
  /* download sample chart, timeline excel */
  $(".stry").on("click", "#cht-smple", function (e) {
    e.preventDefault();
    window.location.href = $("body").data("auth") + '/public/Multimedia/chartsample.xls';
  });
  $(".stry").on("click", "#tmln-smple", function (e) {
    e.preventDefault();
    window.location.href = $("body").data("auth") + '/public/Multimedia/timelinesample.xls';
  });
  /* Function to run after successful upload doc */
  function updtDoc(data)
  {
    var files = data.split('::');
    if (files.length > 0)
    {
      var cntnr = $('.atch-container .atch-list');
      for (var i = 0; i < files.length; i++)
      {
        var name = files[i].split('/');
        /*
         *{
         'Attachment_Original_Name':cntnr.trimText(name[name.length-1])
         }
         */
        var flnm = (name[name.length - 1]).split('_');
        if (flnm.length > 1)
        {
          var tmp = '';
          for (var t = 1; t < flnm.length; t++)
          {
            tmp += flnm[t];
            if (t < flnm.length - 1)
              tmp += '_';
          }
          flnm = tmp;
        }
        else
          flnm = flnm[0];
        flnm = flnm.split('.');
        var ext = flnm.pop();
        if (flnm.length > 1)
          flnm = flnm.join("");
        else
          flnm = flnm[0];
        cntnr.prepend('<li data-atch=\'{"Attachment_Original_Name":"' + cntnr.trimText(name[name.length - 1]) + '"}\'>' +
                '<a class="atch-del" role="btn" data-toggle="modal" href="#con-del"><i class="icon-remove"></i></a>' +
                '<a href="' + files[i] + '" class="file-link">' +
                '<i class="icon-' + ext.toLowerCase() + '"></i>' +
                '<p>' + flnm.substr(0, 25) + '.. .' + ext + '</p>' +
                '</a>' +
                '</li>');
      }
      cntnr.find('li:last').children('progress').fadeOut(100).attr('value', 0);
      $('#art-drft').data('chngd', 1);
    }
  }

  /* Showing image description and copyright content on hover */
  // $('.i-b, .header-image').on('hover',function(e){
  //  $(this).showImgDesc(e);
  // });
  /* Updating image json object on editing copyright details when image is not resized and placed inside a text block */
  $('.stry, .cvr-bg').on('blur', 'figcaption,.c-n', function (e) {
    var trgt = $(e.target).parents('.i-b'), chld = $(e.target), chldTxt = chld.html().replace(/(&nbsp;)/g, '');
    if (chldTxt == '')
      chld.addClass('emty');
    else if (trgt.length)
    {
      var ed_dt = trgt.data('edDt');
      var par = chld.parents('figure');
      if (ed_dt.data != undefined)
        ed_dt['data'][trgt.find('figure').index(par)]['cp'][chld.hasClass('c-n') ? 'cn' : 'id'] = chld.trimText(chld.html());
      trgt.data('edDt', ed_dt).data(chld.updateRefTag());
      $('#art-drft').data('chngd', 1);
    }
    else
    {
      trgt = $(this).parents('#cvr-img');
      if (trgt.attr('id') == undefined)
        trgt = $(this).parents('#err-img-hldr');
      var imgDt = trgt.data('img');
      if (imgDt != undefined)
        imgDt['cn'] = trgt.trimText($(this).html());
      else
        imgDt = {
          "cn": trgt.trimText($(this).html())
        };
      trgt.data('img', imgDt).data(chld.updateRefTag());
    }
  });

  /*
   *Disabling image dragging in editor 
   */
  $('.edtr').on('dragstart', 'img', function () {
    return false;
  });
  /* Sorting of Block level elements i.e. elements with class span9 */
  $('.crnt > .stry').on('mousedown', '.e-b .eb-opts .handle', function (e) {
    var $this = $(this).parents('.e-b');
    if (e.target.nodeName != 'FIGCAPTION' && !$(e.target).hasClass('c-n'))
    {
      $this.removeClass('emty');
      $('.crnt').sortable({
        items: '> .stry > .e-b',
        cursor: "move",
        handle: ".handle",
        cursorAt: {
          left: 5
        },
        opacity: 0.5,
        helper: function () {
          return ("<i class='icon-navicon clone span1'></div>");
        },
        stop: function (event, ui) {
          $('.crnt').sortable("destroy");
        }
      });
    }
  });

  $('.crnt > .stry').on('mouseup', '.e-b .eb-opts .handle', function () {
    if ($('.crnt').hasClass('ui-sortable'))
      $('.crnt').sortable('destroy');
  });

  $('.crnt > .stry').on('click', '.e-b:not(.t-b, .listicle)', function (e) {
    var $this = $(this);
    if ($('.crnt').hasClass('ui-sortable'))
      $('.crnt').sortable('destroy');

    if ($this.hasClass('media') && !$(e.target).attr('contenteditable'))
      $this.addClass('slctd').siblings(".media.slctd").removeClass("slctd");
    else
      $this.removeClass('slctd');
  });

  $('.crnt > .stry').on('click', '.t-b, .ed-b', function (e) {
    if ($.trim(e.target.className) == 'c-n' || e.target.nodeName == 'FIGCAPTION')
      $(this).removeClass('slctd');
    else if (!$(this).hasClass('t-b'))
      $(this).addClass('slctd').find('.eb-opts').addClass('in');
    showEdtrPopup($(this));
  });

  /*
   * Showing add new elements button upon hovering over an e-b
   * 
   * Filtering out #t-b2 from event capturing list as it is
   * exclusively added in petition creation page for salutation purpose
   */

  $('.stry').on('hover', '.listicle', function (e) {
    var $this = $(this);
    var cntnr = ($this.parents('.listicle').length ? $this.parents('.item') : $this.parents('.crnt'));
    if (e.type == 'mouseenter' && !$this.next('.e-b').length)
    {
      var timer = $this.data("timer") || 0;
      clearTimeout(timer);
      timer = setTimeout(function () {
        $('#tlbr-popup').css('top', $this.offset().top - cntnr.offset().top + $this.outerHeight() + 8).addClass('in')
                .data('indx', {"indx": cntnr.find(' > .e-b').index($this), "lst": ($this.parents('.listicle').length ? 1 : 0), "tgd": 0});
      }, 250);
      $this.data("timer", timer);
    }
    else
    {
      var timer = $this.data("timer") || 0;
      clearTimeout(timer);
    }
  });
  /*
   * Showing popup to add new elements when tlbr-popup is clicked
   */
  if (tlbr.length)
  {
    tlbr.append('<div id="toolbox" class="tools right">' +
            '<span class="mnu box" title="Add a new paragraph">' +
            '<a href="#" id="insertText"><i class="icon-file"></i><span class="block">PARAGRAPH</span></a>' +
            '</span>' +
            '<span class="mnu box" title="Add a new image or a slideshow">' +
            '<a href="#" id="insertImage"><i class="icon-picture"></i><span class="block">IMAGE</span></a>' +
            '</span>' +
            '<span class="mnu box" title="Embed tweets, videos, vines etc from other sites">' +
            '<a href="#" id="insertVid"><i class="icon-embed"></i><span class="block">EMBED</span></a>' +
            '</span>' +
            '<span class="mnu box" title="Add a Graph">' +
            '<a href="#" id="insertChart"><i class="icon-column-chart"></i><span class="block">CHART</span></a>' +
            '</span>' +
            '<span class="mnu box" title="Add a Timeline">' +
            '<a href="#" id="insertTmln"><i class="icon-timeline"></i><span class="block">TIMELINE</span></a>' +
            '</span>' +
            '<span class="mnu box" title="Add a Poll">' +
            '<a href="#" id="ins-pl"><i class="icon-ok-circle"></i><span class="block">POLL</span></a>' +
            '</span>' +
            '<span class="mnu box" title="Add a Listicle">' +
            '<a href="#" id="insertList"><i class="icon-listicle"></i><span class="block">LISTICLE</span></a>' +
            '</span>' +
            '<div class="clearfix"></div>' +
            '</div>');

    tlbr.on('click', '.shw-tlbr', function (e) {
      e.preventDefault();
      var trgt = tlbr.find('.tools');
      if (tlbr.data('indx')['lst'])
        trgt.find(' > span:last').addClass('hideElement');
      else
        trgt.find(' > span:last').removeClass('hideElement');

      trgt.css('width', (tlbr.find('.tools > .mnu:first').outerWidth() * tlbr.find('.mnu:not(.hideElement)').length) + 'px');

      if (trgt.hasClass('in'))
        trgt.removeClass('in');
      else
        trgt.css({'top': -((tlbr.find('.tools').outerHeight() - tlbr.outerHeight()) / 2) + 'px',
          'left': ($(this).outerWidth() + 11) + 'px'}).addClass('in');
    });
  }
  /*
   * event handler to listen for text selection
   */
  $('.stry').on('keyup mouseup', '.t-b', function () {
    var $this = $(this);
    var slct = 0;
    if (document.selection)
    {
      if (document.selection.createRange().text != '')
        slct = 1;
    }
    else if (window.getSelection)
    {
      if (window.getSelection().toString() != '')
        slct = 1;
    }
    if (slct)
      showEdtrPopup($this);
    else
      $this.siblings('#edtr-popup').removeClass('in');
  });

  function showEdtrPopup($this)
  {
    var parOffset = $this.parents('.crnt').offset().top, popup = $('#edtr-popup');
    ;
    var eDt = $this.data('edDt') != undefined ? $this.data('edDt') : {"id": $this.attr('id')};
    if ($this.hasClass('i-b') || $this.hasClass('v-b'))
      popup.find('#grpc-opts').removeClass('hideElement').siblings().addClass('hideElement');
    else
    {
      if ($this.hasClass('sbh') || $this.hasClass('blq') || $this.hasClass('hlt'))
        $('#editor-panel').addClass('hideElement');
      else
        $('#editor-panel').removeClass('hideElement');
      popup.find('#grpc-opts').addClass('hideElement').siblings('ul').removeClass('hideElement');
    }
    $('#frmt-opts').find('a').removeClass('active');
    switch (eDt['spl'])
    {
      case 'head':
      case 'sbh':
        $('#frmt-opts').find('a[data-tp="sbh"]').addClass('active');
        break;
      case 'blq':
        $('#frmt-opts').find('a[data-tp="blq"]').addClass('active');
        break;
      case 'hlt':
        $('#frmt-opts').find('a[data-tp="hlt"]').addClass('active');
        break;
    }
    var eblks = $this.parents('.stry').find('.e-b');
    popup.data('indx', eblks.index($this));
    popup.css({
      "top": ($this.offset().top - parOffset - 60) + 'px',
      "left": ((($this.outerWidth()) - popup.outerWidth()) / 2) + parseInt($this.css('margin-left')) + 'px'
    }).addClass('in');
  }
  /*
   * Delete the e-b element based on the button clicked and 
   * the alert modal here opens from the data-toggle attribute of the button
   */
  var el = null;
  $('.frame,.edtr, .atch-list').on('mousedown', '.del, .del-eb, .event-delete, .atch-del', function (e) {
    e.preventDefault();
    el = $(this);
  });
  $(document).on('click', '.del, .del-eb, .event-delete, .atch-del, .del-lst', function (e) {
    e.preventDefault();
    el = $(this);
    // To hide toolbar whenever delete is clicked. This is to avoid the lag in hiding toolbar after corresponding article is deleted.
    $('#tlbr-popup').removeClass('in');
  });
  $('#con-del #yes').click(function () {
    $('#edtr-popup').removeClass('in');
    if (el.hasClass('del-eb'))
    {
      var trgt = el.parents('.e-b:first');
      if (!trgt.siblings('.e-b').length)
        trgt.insertText('caret');
      trgt.remove();
    }
    else if (el.hasClass('event-delete'))
    {
      var lst = el.parents('ul.main-list');
      el.parents('li.list').remove();
      if (!lst.find('li').length)
        lst.siblings('.dft-msg').removeClass('hideElement');
    }
    else if (el.hasClass('atch-del'))
      el.parents('li').remove();
    else if (el.hasClass('del-lst'))
    {
      var trgt = el.parents('.listicle').find('section > .carousel-inner > .item.active');
      if (trgt.siblings('.item').length > 0)
      {
        var nxtElm = trgt.next('.item');
        var prvElm = trgt.prev('.item');
        if (nxtElm.length)
        {
          nxtElm.addClass('active');
          if (!nxtElm.find('.e-b').length)
            nxtElm.bldLstItm();
        }
        else if (prvElm.length)
        {
          prvElm.addClass('active');
          if (!prvElm.find('.e-b').length)
            prvElm.bldLstItm();
        }
        trgt.remove();
        el.adjustCounter();
      }
      else
        $('#sts-msg').showStatus("You cannot delete the last item of this listicle!", "err");
    }
    else if (el.attr('id') == 'del-drft') {
      $(window).unbind('beforeunload');
      $.post('/ajax/deldrft', {
        'id': $('.edtr').data('desc')['id']
      }, function (d) {
        switch (parseInt(d)) {
          case 1:
            $('#sts-msg').showStatus('Draft deleted successfully. Please wait while we redirect you to your drafts', 'scs');
            setTimeout(function () {
              window.location = '/' + $(this).getLoggedInUsr() + '/Dashboard?ArticleDrafts';
            }, 2000);
            break;
          case 0:
            $('#sts-msg').showStatus('Oops! You don\'t have enough privilege to delete this content.', 'err');
            break;
          case -1:
            $('#sts-msg').showStatus('Oops! An error occured while deleting. Please try later.', 'err');
            break;
          case -2:
            $('#sts-msg').showStatus('Oops! You\'re trying to delete an invalid content.', 'err');
            break;
        }
      });
    }
    else
    {
      if (el.parents('.e-b').siblings('.e-b').length)
        el.parents('.e-b:not(.listicle)').remove();
      else
        el.parents('.e-b').removeData('edDt').find('.text-content').html('').focus();
    }
  });

  /*
   * Hiding toolbar when user starts to type
   */
  var isEnd = false;
  $('.stry').on('keyup', '.t-b', function (e) {
    var $this = $(this);
    if ($.trim($this.text()) != '')
    {
      e.preventDefault();
      $('#tlbr-popup').removeClass('in');
    }
    if (e.which == 8 || e.which == 46)
    {
      $this.data($this.updateRefTag());
      if ($.trim($this.text()) == '')
        $this.siblings('#tlbr-popup').addClass('in');
    }
    else if (e.which == 38 || e.which == 40)
    {
      var pos = getSelectionTextInfo($this.get(0));
      if (pos.atEnd && !isEnd)
      {
        isEnd = true;
        return false;
      }

      if (pos.atStart && e.which == 38 && $this.prev('.e-b').length)
        chngBlk($this, 0);
      else if (pos.atEnd && isEnd && e.which == 40 && $this.next('.e-b').length)
      {
        isEnd = false;
        chngBlk($this, 1);
      }
    }
  });

  $('.stry').on('keyup', '.media.slctd:not(.t-b), .ed-b.slctd', function (e) {
    var $this = $(this);
    if (e.which == 38 || e.which == 40)
    {
      e.which == 38 ? chngBlk($this, 0) : chngBlk($this, 1);
      $this.removeClass('slctd').blur();
    }
    else if (e.which == 13)
    {
      var id = $this.insertText('caret');
      $this.removeClass('slctd').blur();
      setFocus(id);
    }
  });

  $('.stry').on('keydown', '.e-b.slctd:not(.t-b,figcaption,.m-b-hdng)', function (e) {
    if ((e.which == 8 || e.which == 46) && $(this).hasClass('slctd'))
    {
      e.preventDefault();
      $(this).find('.eb-opts .del-eb').trigger('mousedown');
      $('#con-del').modal('show');
    }
  });

  function chngBlk($this, isNxt)
  {
    var trgt = isNxt ? $this.next('.e-b') : $this.prev('.e-b');
    if (trgt.length)
    {
      $('<div contenteditable="true"></div>').appendTo('body').focus().remove();
      if (trgt.hasClass('t-b'))
      {
        trgt.placeCaretAtEnd(trgt.get(0), !isNxt);
        $.trim(trgt.text()) == '' ? trgt.removeClass('emty') : '';
      }
      else if (!trgt.hasClass('listicle'))
      {
        trgt.focus().trigger('click');
        if (trgt.hasClass('i-b') || trgt.hasClass('v-b'))
          showEdtrPopup(trgt);
        trgt.addClass('slctd');
      }
    }
    else
    {
      var id = $this.insertText('caret');
      setFocus(id);
    }
  }

  $('.stry').on('focus', '.media.slctd', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  /*
   * Showing article prvw box on clicking the suggested article link
   */
  $(document).on('click', 'a.ttl', function (e) {
    e.preventDefault();
    var $this = $(this);
    var prw = $('#art-prw');
//    if (!prw.length)
//    {
//      $.ajax({
//        url: api + '/gtf',
//        type: 'post',
//        data: {
//          'id': 'pr-bx'
//        },
//        success: function (prw) {
//          var data = JSON.parse(prw);
//          $('#progress-bar').before(data['frm']);
//        },
//        complete: function () {
//          prw = $('#art-prw');
//          prw.addClass('scrl').css('margin-left', -(prw.outerWidth() / 2) + 'px');
//          shwPrwBx($this, prw);
//        }
//      });
//    }
//    else
//    {
//      prw.addClass('scrl').css('margin-left', -(prw.outerWidth() / 2) + 'px');
//      shwPrwBx($this, prw);
//    }
  });
  function shwPrwBx($this, prw)
  {
    prw.find('.add-ptnr').removeClass('in').addClass('hideElement');
    prw.find('.prw-container').removeClass('hideElement').addClass('in');
    var data = $this.data('dt');
    if (data.url)
    {
      var tmp = data['url'].split('/');
      data.tid = tmp[tmp.length - 1];
    }
    if ($this.parents('.task').hasClass('event'))
    {
      var evtDet = prw.find('.event-details');
      evtDet.removeClass('hideElement');
      var dt = $this.getDateTime(data.tmsp);
      evtDet.find('#dt-tm-frm').find('.dt').text(dt.m + " " + dt.d + ", ");
      evtDet.find('#dt-tm-frm').find('.tm').text(dt.t);
      // Checking for End date
      if (data.edte != null)
      {
        dt = $this.getDateTime(data.edte);
        evtDet.find('#dt-tm-to').find('.dt').text(dt.d + ", ");
        evtDet.find('#dt-tm-to').removeClass('hideElement').find('.tm').text(dt.t);
      }
      else
        evtDet.find('#dt-tm-to').addClass('hideElement');
      // Checking for RSVP Limit
      if (data.rsvp != null)
        evtDet.find('.rsvp').removeClass('hideElement').text('RSVP Limit : ' + data.rsvp);
      else
        evtDet.find('.rsvp').addClass('hideElement');
    }
    else
      prw.find('.event-details').addClass('hideElement');
    $('.sts-bx').fadeIn(300, function () {
      $this.parents('#progress-bar').css('top', '100%');
      prw.css('top', '10%').addClass('in');
      prw.find('#prw-article-title').html(prw.buildTxt(data.ttl, 0));
      prw.find('div.user-details i').addClass(data.ctgy + "-i");
      if ($this.parents('.task').hasClass('event'))
      {
        //Mapping location
        var prwmap = null;
        if (prwmap == null)
        {
          evtDet.find('#lc-holder').attr('data-lc', data.lc);
          evtDet.find('#lc-holder').initMap();
        }
        evtDet.find('#lc-holder').mapLocation();
        evtDet.find('#lc-atc').val(data.lc);
      }
    });
    var pstdt = {
      'tid': data.tid
    };
    if ($this.parents('.task').hasClass('article'))
      pstdt.type = 'A';
    else if ($this.parents('.task').hasClass('ptn'))
      pstdt.type = 'P';
    else
      pstdt.type = 'E';
    $.ajax({
      url: '/ajax/gtCntFrSgstn',
      data: pstdt,
      dataType: 'json',
      type: 'post',
      success: function (data) {
        prw.find('#prw').find('.user-details .author').attr('href', '/' + data.Author_Username).text(data.Author_FullName);
        data = JSON.parse(data.Content);
        prw.find('#art').find('.loading').remove();
        prw.find('.prw-container').loadArt(data, 0);
        prw.find('#art').find('.preview img').fadeIn(200).css('display', 'block');
        $('html, body').animate({scrollTop: 0}, 400);
      }
    });
  }
  $(document).on('click', '#prw-close', function () {
    if (!$(this).hasClass('intro-vid'))
      $('#progress-bar').css('top', '10%').addClass('in');
    $('#art-prw').css('top', '-100%').removeClass('in scrl').find('.prw-container').find('.e-b').remove();
  });
  /*
   * suggestions box functionality
   */
  $('#progress-bar').on('click', '.clps-ul li', function (e) {
    if (!($(e.target).hasClass('.sub-clps-ul') || $(e.target).parents('.sub-clps-ul').length))
    {
      var $this = $(this);
      $this.siblings('li.open').removeClass('open')
              .find('.presentation i').toggleClass('icon-chevron-down icon-chevron-up');
      $this.toggleClass('open');
      $this.find('.presentation i').toggleClass('icon-chevron-down icon-chevron-up');
    }
  });
  /*
   * Cover image choosing box functionality
   */
  $('#progress-bar').on('click', '.img-lst li', function () {
    $(this).siblings('li').removeClass('selected');
    $(this).toggleClass('selected');
  });
  /* Functionality to enable slider in related a/e/p boxes inside progress bar */
  $('#progress-bar').on('click', '#sgstn-bx clps-ul li', function () {
    var trgt = $(this).find('.clps-div .frame');
    if (trgt.data('sly'))
      trgt.sly('reload');
    else
      trgt.enableSlider();
  });
  /* Editor tools */
  var config = {
    'buttonList': ['bold', 'italic', 'center', 'link', 'unlink', 'removeformat', 'ol', 'ul']
  };
  var editor = new nicEditor(config);
  $.fn.enableEditor = function (id) {
    if (!$('.stry').data('isNE'))
    {
      editor.setPanel('editor-panel');
      $('.stry').data('isNE', 1);
    }
    editor.addInstance(id != undefined ? id : $(this).attr('id'));
  };
  var outof = null, draggedout = null;
  $.fn.extend({
    findInstance: function () {
      return editor.editors;
    },
    insertText: function (tp) {
      var $this = $(this);
      if (!$this.hasClass('e-b'))
        $this = $this.parents('.e-b:not(.listicle)');
      var d = new Date();
      var pCount = d.getTime();
      var id = 'txt' + pCount;
      var str = '<div tabindex="0" contenteditable="true" class="e-b' + (tp != '' && tp != 'caret' ? ' emty' : '') +
              (tp == 'vid' ? ' v-b' : ' t-b') + '" id="' + id + '">' +
              (tp == 'vid' ? '<ul class="eb-opts"><li><i class="icon-sort handle" title="Move"></i></li>' +
                      '<li><a href="#con-del" role="btn" data-toggle="modal">' +
                      '<i class="icon-remove-circle del-eb" title="Delete image"></i></a></li>' +
                      '<li class="hideElement"><a href="#" class="resize-link" title="Resize image"><i class="icon-resize-small"></i></a></li>' +
                      '</ul>' : '') +
              '</div>';
      var container = $('.crnt').find(' > .stry');
      if (tp == 'caret')
        $this.after(str);
      else if (tp == '')
        $this.parents('.stry').find('.e-b:last').after(str);
      else if (tp == 'html')
        return str;
      else if (tp == 'clik' || tp == 'vid')
      {
        var actvBlk = tlbr.data('indx');
        if (actvBlk['lst'])
          container = container.find('#' + actvBlk['lst']).find('.item.active');
        container.find('> .e-b:eq(' + actvBlk['indx'] + ')').after(str);
        if (tp == 'vid')
          container.find('> .e-b:eq(' + actvBlk['indx'] + ')').remove();
        setFocus(id);
      }
      else if (tp != 'html')
        container.append(str);
      /*
       * Enabling focus on the newly added textbox when enter is pressed in the current active block
       */
      if (tp == 'html')
        return str;
      else
      {
        $('#' + id).enableEditor();
        return id;
      }
    },
    insertImage: function (retHtml) {
      var d = new Date();
      var iCount = d.getTime();
      var imgStr = '<div tabindex="0" class="i-b e-b media" id="ib-' + iCount + '">';
      if (!retHtml)
      {
        imgStr += '<ul class="eb-opts">' +
                '<li><i class="icon-sort handle" title="Move"></i></li>' +
                '<li><a href="#con-del" role="btn" data-toggle="modal"><i class="icon-remove-circle del-eb" title="Delete image"></i></a></li>' +
                '<li class="hideElement"><a href="#" class="resize-link" title="Resize image"><i class="icon-resize-small"></i></a></li>' +
                '</ul>';
      }
      imgStr += '<div class="img-holder emty">' +
              '<p class="help">Upload JPG, PNG or GIF images. Select MULTIPLE images to create a slideshow</p>' +
              '<form name="image-upload" id="imageUpload" class="image-upload"  method="post" enctype="multipart/form-data" action="' +
              api + '/uimg">' +
              '<div class="slct-pic"><input type="file" name="image-file[]" class="image-file" multiple/>' +
              '<i class="icon-add-image transition in"></i></div>' +
              '</form><progress value="0" max="100" class="img-prgs red"></progress></div></div>';
      if (retHtml)
        return imgStr;
      else
      {
        var container = $('.crnt > .stry'), actvBlk = tlbr.data('indx');
        if (actvBlk['lst'])
          container = container.find('#' + actvBlk['lst'] + ' .item.active');
        container.find(' > .e-b:eq(' + actvBlk['indx'] + ')').after(imgStr);
        if (actvBlk['tgd'])
          container.find(' > .e-b:eq(' + actvBlk['indx'] + ')').remove();
      }
    },
    addHtgSpc: function () {
      var json = {};
      // Adding Hashtags 
      json.hstg = $('#ctrl-bx #tgd-htgs').data('sgstn').toString();
      
      //Adding spaces 
      json.spcs = $('#ctrl-bx #tgd-spcs').data('sgstn').toString();
      return json;
    },
    addSgstns: function () {
      var retJson = {};
      // Adding suggested articles to JSON
      if ($(this).attr('id') == 'skp-dtls')
      {
        var sgstdt = $('.crnt').data('sgstd');
        retJson = {
          "arts": sgstdt['a'],
          "evts": sgstdt['e'],
          "ptns": sgstdt['p']
        };
      }
      else
      {
        var sgstnBox = $('#progress-bar #ctrl-bx').find('#sgstn-box');
        var s_arts = sgstnBox.find('.article-container ul.main-list').find('> li div.article.selected');
        if (s_arts.length > 0)
        {
          var arts = [];
          s_arts.each(function () {
            arts.push($(this).find('a.ttl').data('dt'));
          });
          retJson.arts = arts;
        }
        //Adding events into article JSON string
        var events = sgstnBox.find('.events-container ul.main-list').find(' > li div.event.selected');
        if (events.length > 0)
        {
          var evts = [];
          events.each(function () {
            if ($(this).parent().hasClass('sgstn') || !$(this).attr('data'))
              evts.push($(this).find('a.ttl').data('dt'));
            else
              evts.push(JSON.parse($(this).attr('data')));
          });
          retJson.evts = evts;
        }
        // Adding petitions into article JSON
        var petns = sgstnBox.find('.petitions-container ul.main-list').find(' > li div.ptn.selected');
        if (petns.length > 0)
        {
          var ptns = [];
          petns.each(function () {
            ptns.push($(this).data('dt'));
          });
          retJson.ptns = ptns;
        }
      }
      return retJson;
    },
    fetchCvrImg: function (tp) {
      if ($('.crnt').find('.e-b').length)
      {
        var trgt = $('#progress-bar #err-box').find('.img-lst');
        trgt.find('li').remove();
        trgt.parents('#err-box').siblings('section').removeClass('in');
        trgt.parents('.frame').enableSlider();
        $('.crnt').find('.stry .i-b').each(function (index, elem) {
          if ($(elem).data('edDt')) {
            var ed_dt = $(elem).data('edDt');
            if (ed_dt.data != undefined)
            {
              $.each(ed_dt.data, function (i, img) {
                trgt.append("<li class='box pull-left' data-img='" + JSON.stringify(img) + "'><img src='" +
                        img.src + "' /><i class='icon-ok'></i></li>");
              });
            }
            else
            {
              trgt.append("<li class='box pull-left' data-img='" + JSON.stringify(ed_dt) +
                      "'><img src='" + ed_dt.src + "'/><i class='icon-ok'></i></li>");
            }
          }
        });
      }
      // If there are any images in article, show the list of images and ask user to pick one among them
      if (trgt.find('li').length)
      {
        $('#progress-bar').find('.err-msg').text("Choose one of the images you uploaded as cover image or upload a new one below.");
        var frame = trgt.parents('.frame');
        frame.sly('reload');
        var pos = frame.data('sly').pos;
        if (pos.start < pos.end)
          frame.siblings('.scrollbar').removeClass('transparent');
        trgt.find('#err-bk').removeClass('er-bx');
      }
      // If no images are found, ask user to upload a cover image.
      else
      {
        $('#progress-bar').find('.err-msg').text("We couldn't find any images in your " + tp + ". Upload a cover image below.");
        trgt.parents('section').find('#err-img-hldr').css('top', '-100%').addClass('in').find('#err-bk').addClass('er-bx');
      }
      $('#progress-bar').find('#err-box').css('left', '0').addClass('in');
    },
    positionBackground: function () {
      var cvrbg = $(this);
      cvrbg.on('mousedown', '.he-bg', function (e) {
        var trgt = $(this).siblings('img');
        var strtY = e.clientY, imgY = parseInt(trgt.css('top'));
        imgY = isNaN(imgY) ? 0 : imgY;
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

      cvrbg.on('mouseup', '.he-bg', function () {
        $(this).off('mousemove');
      });
    },
    fetchTagSgstns: function (text, tp, nw_ctgy)
    {
      var txtdata = '';
      $.each(text, function (key, val) {
        $.each(val, function (k, v) {
          txtdata += v + " ";
        });
      });
      var data4hstg = {
        "data": txtdata,
        "tp": tp
      };
      var desc = $('.edtr').data('desc');
      if (nw_ctgy != 'undefined')
        data4hstg['ctgy'] = nw_ctgy;
      if ($('.crnt').data('mode') == 2)
        data4hstg['ed_id'] = desc.id;
      $.post('/ajax/gthtsgstn', data4hstg, function (hshCld) {
        hshCld = hshCld.split(',');
        if (hshCld.length)
        {
          var trgt = $('#ctrl-bx .htg');
          var prvCld = trgt.data('htg');
          prvCld = (prvCld !== undefined) ? prvCld : [];
          for (var h = 0; h < hshCld.length; h++)
          {
            if ($.inArray(hshCld[h], prvCld) == -1 && hshCld[h] != '')
            {
              trgt.find('.sgstns ul').append("<li data-htg='" + hshCld[h] + "' class='pull-left' title='Click to include into hashtag list'><a href='#'>#" + hshCld[h] + "</a> <i class='icon-ok'></i></li>");
              prvCld.push(hshCld[h]);
            }
          }
          trgt.data('htg', prvCld).find('.sgstns .frame').sly('reload');
        }
      });

      $.post('/ajax/gtspcsgstn', data4hstg, function (spcs) {
        console.log(spcs);
      });
    },
    /*
     * Function to load category and hashtags into respective boxes while editing anything
     * @param {type} ct -> category of article/event/petition
     * @param {type} sct -> hashtags
     */
    loadEdtPrphls: function (data)
    {
      var tgbx = $('#progress-bar #tag-box');
      if (data.sgn != 'undefined')
      {
        tgbx.find('#ptn-info input:first').val(data.sgn);
        var ptnEnd = new Date(data.endTm * 1000);
        var mnth = ptnEnd.getMonth() + 1;
        mnth = (mnth < 10) ? '0' + mnth : mnth;
        var dtTm = tgbx.getDateTime(data.endTm);
        tgbx.find('#ptn-info .dtpkr').val(((dtTm.d < 10) ? '0' + dtTm.d : dtTm.d) + '/' + mnth + '/' + ptnEnd.getFullYear())
                .data('tmsp', data.endTm).siblings('.tmpkr').val(dtTm.t);
      }
      var ctgy = (data.ct).split(',');
      tgbx.find('.ctgy-lst input[type="checkbox"]').each(function () {
        if ($.inArray($(this).attr('name'), ctgy) != -1)
          $(this).prop('checked', true);
      });
      if (data.sct != '')
        tgbx.find('#hstg').val('#' + data.sct);
      if (!$('#progress-bar').find('.modal-footer #skp-dtls').length)
      {
        $('#progress-bar').find('.modal-footer').removeClass('hideElement').append('<button class="btn btn-success pull-right" id="skp-dtls">Skip all and save this</button>');
      }
    },
    getArticleSgstns: function (isE, ctgy, hstg)
    {
      var $this = $(this);
      var d = '';
      $('.t-b').each(function (i, e) {
        if (!$($this).hasClass('emty'))
          d += $this.trimText($(this).text()) + " ";
      });
      var p_dt = {
        'ctgy': ctgy,
        'hstg': hstg
      };

      if (!$('#hd-sctn .m-hd').hasClass('emty'))
        d += " " + $this.trimText($('#hd-sctn .m-hd').text());

      if ($('#usr-bar').find('#art-save').length)
        p_dt['tp'] = 'A';
      else if ($('#usr-bar').find('#evt-save').length)
        p_dt['tp'] = 'E';
      else
        p_dt['tp'] = 'P';

      p_dt['data'] = d;

      if (isE == 2) //Edit mode
      {
        var desc = $('.edtr').data('desc');
        p_dt['ed_id'] = desc.id;
      }

      $.ajax({
        url: '/ajax/gtSgstn',
        data: p_dt,
        type: 'post',
        async: false,
        dataType: 'text',
        success: function (rd) {
          if (rd != '')
          {
            var data = JSON.parse(rd);
            if (data.length > 0)
            {
              var ab = $this.find('.article-container ul.main-list');
              var eb = $this.find('.events-container ul.main-list');
              var pb = $this.find('.petitions-container ul.main-list');
//              var slctd = [];
//              $this.find('#sgstn-bx .inner .sgstn > .selected').each(function(){
//                slctd.push($(this).attr('id'));
//              });
//              
//              //emptying these divs because if user clicks back  button and then clicks next, data is appended
//              ab.empty();
//              eb.empty();
//              pb.empty();
              var imgPth = "";
              for (var a = 0; a < data.length; a++)
              {
                if (data[a].ev == 0 && !ab.find('#' + data[a].tid).length)
                {
                  imgPth = $('#user-nav').data('isLive') ? 'https://saddahaq.blob.core.windows.net/multimedia/Thumb_' : '/public/Multimedia/Thumb_';
                  var str = "<li class='list box sgstn' id='" + data[a].tid + "'>" +
                          "<div class='task span16 article'>" +
                          "<i class='icon-ok'></i>" +
                          "<div class='span3'>" +
                          "<span class='span16 thumb-holder sml'><img src='" + imgPth + data[a].img + "'/></span>" +
                          "</div>" +
                          "<div class='span13 dsc box'>" +
                          "<a class='ttl' href='#' data-dt='" + JSON.stringify(data[a]) + "'>" + ab.buildTxt(data[a].ttl, 0) + "</a>" +
                          "<p class='dft-msg'>#" + data[a].htg + "</p>" +
                          "</div>" +
                          //         "<div class='new-li block'>" +
                          //         "<a class='ttl' href='#' data-dt='"+JSON.stringify(data[a])+"'>"+ab.buildTxt(data[a].ttl,1)+"</a>" +
                          //         "<p>#"+data[a].htg+"</p>"+
                          //         "</div>"+
                          "<div class='clearfix'></div>" +
                          "</div>" +
                          "</li>";
                  ab.append(str);
                }
                else if (data[a].ev == 1 && !eb.find('#' + data[a].tid).length)
                {
                  data[a].tp = 'sgtn';
                  var date = $(this).getDateTime(parseInt(data[a].tmsp));
                  var str = "<li class='list box sgstn' id='" + data[a].tid + "'>" +
                          "<div class='task span16 event'>" +
                          "<i class='icon-ok'></i>" +
                          "<div class='new-li span16'>" +
                          "<span class='span3'>" +
                          "<span class='span16 thumb-holder sml cal'>" +
                          "<span class='block mth'>" + date.m + "</span>" +
                          "<span class='block number'>" + date.d + "</span>" +
                          "</span>" +
                          "</span>" +
                          "<span class='span13 dsc box'>" +
                          "<a class='ttl' href='#' data-dt='" + JSON.stringify(data[a]) + "'>" + eb.buildTxt(data[a].ttl, 0) + "</a>" +
                          "</span>" +
                          "<span class='clearfix'></span>" +
                          "</div>" +
                          "<div class='span16'>" +
                          "<div class='span5 box tm'>" +
                          "<i class='icon-time'></i> " + date.t +
                          "</div>" +
                          "<div class='span11 box lc' data-toggle='tooltip' data-container='body' data-placement='top' data-original-title='" + data[a].lc + "'>" +
                          "<i class='icon-map-location'></i> " + data[a].lc.substr(0, 20) + "..." +
                          "</div>" +
                          "</div>" +
                          "</li>";
                  eb.append(str);
                }
                else if (data[a].ev == 2 && !pb.find('#' + data[a].tid).length)
                {
                  var str = "<li class='list box sgstn' id='" + data[a].tid + "'>" +
                          "<div class='task transition in ptn span16' data-dt='" + JSON.stringify(data[a]) + "'>" +
                          "<i class='icon-ok'></i>" +
                          "<div class='span3'>" +
                          "<span class='thumb-holder sml ptn-img box block'>" +
                          "<img src='https://saddahaq.blob.core.windows.net/multimedia/sign-petition.png' class='block' />" +
                          "</span>" +
                          "</div>" +
                          "<div class='span13 dsc box'>" +
                          "<a class='ttl' href='#' data-dt='" + JSON.stringify(data[a]) + "'>" + eb.buildTxt(data[a].ttl, 0) + "</a>" +
                          "</div>" +
                          "<div class='span16'>" +
                          "<div class='span8 box tm'>" +
                          "<i class='icon-pencil'></i> Sign" +
                          "</div>" +
                          "<div class='span8 box lc' data-toggle='tooltip' data-container='body' data-placement='top' data-original-title='" + data[a].goal + " signatures required'>" +
                          "<i class='icon-user'></i> " + data[a].goal +
                          " signs req.. </div>" +
                          "</div>" +
                          "</div>" +
                          "</li>";
                  pb.append(str);
                }
              }
              $this.find('#sgstn-box .clps-ul li .frame').each(function () {
                $(this).enableSlider();
              });
            }
          }
        }
      });
    },
    chkChrtDt: function ()
    {
      var data = $(this).data('edDt');
      if (typeof data != 'object')
      {
        data = $(this).buildTxt(data, 0);
        return JSON.parse(data);
      }
      else
        return data;
    }
  });
  /* Function to move text into new div from cursor position */
  function getContainer(node) {
    while (node) {
      if (node.nodeType == 1 && /^(p|H[1-6]|DIV)$/i.test(node.nodeName))
      {
        return node;
      }
      node = node.parentNode;
    }
  }

  function setFocus(id, callback) {
    var sel = window.getSelection();
    if ($('.crnt > .stry').find('.t-b').length > 0)
    {
      var trgt = $('#' + id);
      var innerDiv = document.getElementById(id);
      sel.collapse(innerDiv, 0);
      if (!trgt.hasClass('v-b'))
        trgt.removeClass('emty').focus();
      // setTimeout is used here to fix issue with firefox.  http://stackoverflow.com/questions/7046798/jquery-focus-fails-on-firefox
    }
    if (callback)
      callback();
  }
  /*
   * Updating ed-dt attrib when div loses focus or divs are created on the fly
   */
  function updateDivData($this)
  {
    var data = $this.data('edDt') != undefined ? $this.data('edDt') : {"id": $this.attr('id')};
    if (!$this.find('iframe').length)
    {
      var tmp = $("<div>");
      tmp.html($.trim($this.html())).find('.eb-opts').remove();
      if ($.trim(tmp.text()) != '')
      {
        if ($this.data('edDt') != undefined)
          data['data'] = !$this.hasClass('emty') ? $this.trimText(tmp.html()) : '';
        else
          data = {'id': $this.attr('id'), 'data': (!$this.hasClass('emty') ? $this.trimText(tmp.html()) : '')};
        $this.data('edDt', data);
      }
      if (data['data'] != '')
        $('#art-drft').data('chngd', 1);
    }
  }
  /* --------------------- New Poll --------------------- */
  $('.stry').on('click', '.ad-pol-opt', function () {
    $(this).before('<div class="pol-opt emty" data-emty="Poll Option" contenteditable="true"></div>');
  });

  $('.stry').on('blur', '.pol-opt', function () {
    var $this = $(this);
    if ($.trim($this.text()) == '')
      $this.addClass('emty');
    else
    {
      var eDt = $this.parents('.e-b').data('edDt');
      eDt['data']['poll'] = eDt['data']['poll'] != undefined ? eDt['data']['poll'] : [];
      var thisIndx = $this.parents('.pol-opts').find('.pol-opt').index($this);
      eDt['data']['poll'][thisIndx] = $this.trimText($this.html());
      $this.parents('.e-b').data('edDt', eDt);
      $('#art-drft').data('chngd', 1);
    }
  });

  var rmTmr = null;
  $('.stry').on('hover', '.pol-opt, .rm-pol-opt', function (e) {
    var $this = $(this);
    if (e.type == 'mouseenter')
    {
      clearTimeout(rmTmr);
      if (!$this.hasClass('rm-pol-opt'))
        $this.siblings('.rm-pol-opt').css({'top': ($this.offset().top - $this.parents('.pol-opts').offset().top)}).addClass('in')
                .data('plIndx', $this.parents('.pol-opts').find('.pol-opt').index($this));
    }
    else if (e.type == 'mouseleave')
    {
      rmTmr = setTimeout(function () {
        $this.siblings('.rm-pol-opt').removeClass('in').removeData('plIndx');
      }, 400);
    }
  });

  $('.stry').on('click', '.rm-pol-opt', function () {
    var trgtIndx = $(this).data('plIndx');
    if (trgtIndx != undefined)
    {
      var trgt = $(this).parents('.pol-opts').find('.pol-opt:eq(' + trgtIndx + ')');
      if ($.trim(trgt.text()) != '')
      {
        var eDt = trgt.parents('.e-b').data('edDt');
        eDt['data']['poll'].splice(trgtIndx, 1);
        trgt.parents('.e-b').data('edDt', eDt);
      }
      trgt.remove();
    }
  });
  /* 
   * Updating titles of charts, timelines and listicles on blur 
   */
  $('.crnt').on('blur', '.m-b-hdng', function () {
    var $this = $(this);
    if ($.trim($(this).text()) != '')
    {
      var trgt = $this.parents('.e-b:first');
      trgt = trgt.hasClass('listicle') ? $this.parents('.item') : trgt;
      var json = (trgt.data('edDt') !== undefined) ? trgt.data('edDt') : {};
      json.ttl = trgt.trimText($this.html());
      trgt.data('edDt', json);
    }
    else
      $this.addClass('emty');
  });

  function parseTmLn(elem, d) {
    if (d != undefined)
    {
      d = JSON.parse(d);
      var dateRe = /\d{4},\d{2},\d{2}/g;
      var dateArray = new Array();
      for (var i = 3; i <= Object.keys(d).length; i++) {

        if (d[i]['A'] == "" || d[i]['A'] == null || d[i]['C'] == "" || d[i]['C'] == null)
          throw "Start-Date and Headline Mandatory For Every Entry";
        if (!d[i]['A'].match(dateRe))
          throw "Invalid Start-Date";
        var dict = {
          "startDate": d[i]['A'],
          "endDate": d[i]['B'],
          "headline": d[i]['C'],
          "text": (d[i]['D'] ? d[i]['D'] : "  "),
          "type": d[i]['I'],
          "tag": d[i]['J'],
          "classname": "timline",
          "asset": {
            "media": d[i]['E'],
            "thumbnail": d[i]['H'],
            "credit": d[i]['F'],
            "caption": d[i]['G']
          }
        };
        dateArray.push(dict);
      }
      var dataObject = {
        "timeline":
                {
                  "startDate": d[2]['A'],
                  "endDate": d[2]['B'],
                  "headline": d[2]['C'],
                  "text": (d[2]['D'] ? d[2]['D'] : "  "),
                  "type": "default",
                  "tag": d[2]['J'],
                  "classname": "timline",
                  "asset": {
                    "media": d[2]['E'],
                    "thumbnail": d[1]['H'],
                    "credit": d[2]['F'],
                    "caption": d[2]['G']
                  },
                  "date": dateArray
                }
      };
      var tmlnElem = elem.parents('.tmln-holder');
      var strData = JSON.stringify(dataObject);
      strData = strData.replace('#', '[rp23rp]').replace('&', '[rp26rp]').replace("'", '[rp2crp]');
      $("#" + tmlnElem.attr("id")).append("<iframe src='" + $('body').data('auth') + "/embed?id=1&d=" + strData + "' frameBorder='0' width='99%' height='450'></iframe>");
      var updtJson = elem.parents('.m-b').data('edDt');
      updtJson = (updtJson !== undefined) ? updtJson : {};
      updtJson.data = dataObject;
      elem.parents('.m-b').data('edDt', updtJson);
      elem.closest('section').addClass('hideElement');
      elem.parents('.m-b').find('iframe').load(function () {
        var $this = $(this);
        $this.contents().find('#my-timeline').bind('click', function (e) {
          $this.parents(".e-b").focus();
          $this.parents(".e-b").addClass("slctd").siblings(".e-b.media").removeClass("slctd");
        });
      });
    }
  }
  // Functionality to close toolbar or category list when clicked anywhere outside
  $(document).click(function (e) {
    var trgt = $(e.target);
    if ($('#ctgy-box').find('section').hasClass('in') && !(trgt.parents('#ctgy-box').length || (trgt.attr('id') == 'ctgy-box')))
      $('#ctgy-box').find('i').removeClass('icon-chevron-up').addClass('icon-chevron-down').siblings('section').removeClass('in');
    if (!trgt.parents('#tlbr-popup').length && $('#toolbox').hasClass('in'))
      tlbr.find('.tools').removeClass('in');
  });
// $(window).bind('beforeunload', function(){
//  if(!$('.edtr').data('cmplt'))
//   return 'Wait a minute!!';
// });

  $("#progress-bar").on("change", ".fdbk-y-n input[type='radio']", function () {
    var $this = $(this);
    var txtarea = $this.siblings('textarea');
    if (txtarea.data('shwOn') == $this.val())
      txtarea.removeClass('hideElement');
    else
      txtarea.addClass('hideElement');
  });
  $("#progress-bar").on("click", ".fdbk-s", function () {
    var $this = $(this);
    $this.prevAll().find("i").css("color", "#E31E24");
    $this.find("i").css("color", "#E31E24");
    $this.nextAll().find("i").css("color", "#232931");
    $this.siblings("input").val($this.attr("value"));
  });
  $("#progress-bar").on("click", "#fdbk-sbmt", function () {
    var $this = $(this);
    var tp, d;
    if ($this.parents("#feedback-container").attr("cnt") == "a") {
      d = {
        "q1": $('#article-ques1').find("input[type='radio'][name='fdbk-a1']:checked").val(),
        "q1_c": $('#article-ques1').find("textarea").val(),
        "q2": $('#article-ques2').find("input[type='radio'][name='fdbk-a2']:checked").val(),
        "q3": $('#article-ques3').find("input[type='radio'][name='fdbk-a3']:checked").val(),
        "q3_c": $('#article-ques3').find("textarea").val(),
        "q4": $('#article-ques4').find("textarea").val()
      };
      tp = "a";
    }
    else if ($this.parents("#feedback-container").attr("cnt") == "e") {
      d = {
        "q1": $('#event-ques1').find("input").val(),
        "q2": $('#event-ques2').find("input[type='radio'][name='fdbk-e2']:checked").val(),
        "q2_c": $('#event-ques2').find("textarea").val(),
        "q3": $('#event-ques3').find("input[type='radio'][name='fdbk-e3']:checked").val(),
        "q3_c": $('#event-ques3').find("textarea").val(),
        "q4": $('#event-ques4').find("input[type='radio'][name='fdbk-e4']:checked").val()
      };
      tp = "e";
    }
    else if ($this.parents("#feedback-container").attr("cnt") == "p") {
      d = {
        "q1": $('#petition-ques1').find("input[type='radio'][name='fdbk-p1']:checked").val(),
        "q1_c": $('#petition-ques1').find("textarea").val(),
        "q2": $('#petition-ques2').find("input[type='radio'][name='fdbk-p2']:checked").val(),
        "q2_c": $('#petition-ques2').find("textarea").val(),
        "q3": $('#petition-ques3').find("input[type='radio'][name='fdbk-p3']:checked").val(),
        "q3_c": $('#petition-ques3').find("textarea").val(),
        "q4": $('#petition-ques4').find("input[type='radio'][name='fdbk-p4']:checked").val()
      };
      tp = "p";
    }
    if ($.trim(((d.q1 == undefined) ? '' : d.q1) + ((d.q2 == undefined) ? '' : d.q2) + ((d.q3 == undefined) ? '' : d.q3) + ((d.q4 == undefined) ? '' : d.q4)) == "")
    {
      $('#sts-msg').showStatus('Please give your feedback and submit..');
    }
    else {
      $.ajax({
        url: '/ajax/fdbkc',
        type: 'post',
        data: {
          "d": d,
          "tp": tp
        },
        success: function (res) {
          var fdbk_res = '<div id="fdbk-res"><h1 class="s-h sts"></h1></div>';
          $('#progress-bar').find('#err-box').html(fdbk_res);
          if (res == "1")
            $('#progress-bar').find('#err-box .sts').text("Your feedback saved successfully.").addClass("scs");
          else
            $('#progress-bar').find('#err-box .sts').text("Something went wrong.").addClass("err-msg");
        }
      });
    }
  });
  $("#progress-bar").on("click", "#fdbk-cncl", function () {
    $('#progress-bar').find('#err-box').css('left', '-200%').removeClass('in');
  });
  // Help video
  if ($('.stry').data('shwIntro'))
    $('#edtr-hlp').trigger('click');
  $('#edtr-hlp').on('click', function () {
    $('#pop-prw > section').html('<iframe width="760" height="428" src="//www.youtube.com/embed/Q5PNefcs_7E?rel=0&wmode=transparent" frameborder="0" allowfullscreen></iframe>').showPopup(1);
  });
  $.fn.extend({
    /* feed back script */
    getFdbckFrm: function (type, shrUrl) {
      var fdbkId;
      var pb = $('#progress-bar');
      pb.find('.err-box').css('left', '-100%').removeClass('in');
      pb.find('#err-box').siblings('section').css('left', '-200%').removeClass('in');
      pb.find('#err-box').css('left', '0').addClass('in');
      var sclShr = '<h4 class="s-h">Share this with your friends: </h4><ul class="scl-shr transition in pull-left ">' +
              '<li><a class="tw-tweet btn"><i class="icon-twitter"></i> <span class="hidden-phone">Tweet</span></a></li>' +
              '<li><a class="fb-share btn"><i class="icon-facebook"></i> <span class="hidden-phone">Share</span></a></li>' +
              '<li><a class="gp-share btn"><i class="icon-google"></i> <span class="hidden-phone">Share</span></a></li>' +
              '<li><a class="rd-share btn"><i class="icon-redditt-round"></i><span class="hidden-phone">Reddit</span> </a></li>' +
              '</ul>';
      if ($("#usr-bar").find(".usr-dtls").data("fdbk") == 1) {
        pb.find("#err-box").html(sclShr);
        pb.find(".scl-shr a").data("url", shrUrl);
      }
      else {
        switch (type) {
          case "A":
            fdbkId = "art-fdbk";
            break;
          case "E":
            fdbkId = "evt-fdbk";
            break;
          case "P":
            fdbkId = "pt-fdbk";
            break;
          default:
            break;
        }
        $.ajax({
          url: api + '/gtf',
          type: 'post',
          data: {
            "id": fdbkId,
            "fdbk": $("#usr-bar").find(".usr-dtls").data("fdbk")
          },
          success: function (d) {
            d = JSON.parse(d);
            pb.find("#err-box").html(d['frm']);
            pb.find("#pb-scl").html(sclShr);
            pb.find(".scl-shr a").data("url", shrUrl);
            pb.find("#err-box").css("overflow-y", "auto");
          }
        });
      }
    }
  });

  function getSelectionTextInfo(el) {
    var atStart = false, atEnd = false;
    var selRange, testRange;
    if (window.getSelection) {
      var sel = window.getSelection();
      if (sel.rangeCount) {
        selRange = sel.getRangeAt(0);
        testRange = selRange.cloneRange();

        testRange.selectNodeContents(el);
        testRange.setEnd(selRange.startContainer, selRange.startOffset);
        atStart = (testRange.toString() == "");

        testRange.selectNodeContents(el);
        testRange.setStart(selRange.endContainer, selRange.endOffset);
        atEnd = (testRange.toString() == "");
      }
    } else if (document.selection && document.selection.type != "Control") {
      selRange = document.selection.createRange();
      testRange = selRange.duplicate();

      testRange.moveToElementText(el);
      testRange.setEndPoint("EndToStart", selRange);
      atStart = (testRange.text == "");

      testRange.moveToElementText(el);
      testRange.setEndPoint("StartToEnd", selRange);
      atEnd = (testRange.text == "");
    }

    return {atStart: atStart, atEnd: atEnd};
  }

  function clsPopout(trgt)
  {
    trgt.removeClass('in');
    setTimeout(function () {
      trgt.removeAttr('style');
    }, 100);
  }

  function adjustInputPos(inpt)
  {
    var trgt = inpt.parent(), prv = inpt.prev('li');
    prv = prv.length ? (prv.outerWidth() + prv.offset().left) : 0;
    if (((trgt.outerWidth() + trgt.offset().left) - prv) < 160 || !prv)
      inpt.css('width', '100%');
    else
      inpt.css('width', ((trgt.offset().left + trgt.outerWidth()) - (inpt.prev('li').outerWidth() + inpt.prev('li').offset().left) - 16));
  }
//  $(window).bind('beforeunload', function (e) {
//    return 'Wait a minute!!';
//  });

});