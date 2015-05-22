$(document).ready(function () {
//API url
  var api = $('body').data('api');
  $('#navigation-bar #c-b').addClass('hideElement');
  /* Functionality to show author profile at the top of page on scroll */
  $(window).scroll(function () {
    return false;
    if ($('#auth-prf').length)
    {
      if (($('#auth-prf').offset().top - $(window).scrollTop()) <= 32)
      {
        $('#usr-bar').css({'background': 'rgba(75,75,75,.75) ' + $('#cvr-img .cvr-bg').css('background-image') + ' no-repeat', 'background-position': $('#cvr-img .cvr-bg').css('background-position')}).find('section').css('top', '0');
      }
      else
        $('#usr-bar').css('background', 'rgba(75,75,75,.25)').find('section').css('top', '-50px');
    }
    /* Adding keyEvt class to listicle in viewport to enable key events */
    if ($('.stry').find('.listicle').length == 1)
    {
      var lstcl = $('.stry').find('.listicle');
      var lstEl = lstcl.get(0);
      var top = lstEl.offsetTop;
      var height = lstEl.offsetHeight;
      while (lstEl.offsetParent) {
        lstEl = lstEl.offsetParent;
        top += lstEl.offsetTop;
      }
      if (top < (window.pageYOffset + window.innerHeight) && (top + height) > window.pageYOffset)
        lstcl.addClass('keyEvt');
      else
        lstcl.removeClass('keyEvt');
    }
  });
  $('#shr-bx').click(function () {
    var trgt = $(this).siblings('ul');
    var listElem = $(this).parents('ul.pull-right').children('li');
    var indx = listElem.index($(this).parent());
    $(this).parents('ul.pull-right').find('li:lt(' + indx + ')').toggleClass('hideElement');
    trgt.toggleClass('cls in');
  });
  var allImgs = [];
  $.fn.extend({
    /*
     * Function to build img html
     * First Parameter contains image data
     * Second Parameter is used to determine if it is an inline image or a block level image
     * 1 -> block level; 0 -> Inline image
     */
    loadImg: function (elem, isE, callback) {
      var adStr = '<div' + (isE ? ' tabindex="0"' : '') + ' class="e-b i-b ph-vw ' + (elem['spl'] != undefined ? elem['spl'] : '') + (isE ? ' media ed-b' : '') + '" id="' + elem.id + '">';
      if (isE)
      {
        var auth = $('#usr-bar .usr-dtls a').attr('href').split('/');
        adStr += '<ul class="eb-opts"><li><i class="icon-sort handle" title="Move"></i></li>' +
                (auth[auth.length - 1] == $('body').data('bunme') || $('body').data('isMod') ? '<li><a href="#con-del" role="btn" data-toggle="modal"><i class="icon-remove-circle del-eb" title="Delete image"></i></a>' +
                        '</li>' : '') + '</ul>';
      }
      adStr += '</div>';
      $(this).append(adStr);
      $('#' + elem.id).data('edDt', elem);
      if (callback)
        callback();
    },
    listDoc: function (files, isE)
    {
      var cntnr = $('.atch-container .atch-list');
      if (typeof files !== 'object' && files != '')
        files = JSON.parse(files);
      if (files.length > 0)
      {
        for (var i = 0; i < files.length; i++)
        {
          var name = cntnr.buildTxt(files[i]['Attachment_Original_Name']);
          var flnm = name.split('_');
          if (flnm.length >= 2)
          {
            flnm.shift();
            flnm = flnm.join("_");
          }
          else
            flnm = flnm[0];
          flnm = flnm.split('.');
          var ext = flnm.pop();
          if (flnm.length > 1)
            flnm = flnm.join("");
          else
            flnm = flnm[0];
          var href = '';
          if (isE)
            href = '/public/Uploads' + $('#user-nav .usrname').attr('href') + '/' + name;
          else
          {
            if (($('#user-nav').attr('data-is-live') == 1)) {
              href = 'https://saddahaq.blob.core.windows.net/multimedia/' + name;
            }
            else {
              href = '/public/Multimedia/' + name;
            }
          }
          var apndStr = '<li data-atch=\'{"Attachment_Original_Name":"' + cntnr.trimText(name) + '"}\'>';
          if (isE)
            apndStr += '<a class="atch-del" role="btn" data-toggle="modal" href="#con-del"><i class="icon-remove"></i></a>';
          apndStr +=
                  '<a target="_blank" href="' + href + '" class="file-link"><i class="icon-' + ext.toLowerCase() + '"></i>' +
                  '<p>' + cntnr.buildTxt(flnm).substr(0, 25) + '... .' + ext + '</p></a>' +
                  '</li>';
          if (isE)
            cntnr.prepend(apndStr);
          else
            cntnr.append(apndStr);
        }
      }
    },
    loadArt: function (d, isEdit)
    {
      var $this = $(this);
      var chtArray = [];
      if (d instanceof Object)
        var tmp = d;
      else
        var tmp = JSON.parse(d.replace(/\r\n|\n|\r/g, ""));
      var trgt = $this;
      for (var l = 0; l < tmp.length; l++)
      {
        var elem = tmp[l];
        if (!(elem instanceof Object))
          elem = JSON.parse(elem);
//          if (elem.id == undefined)
//            elem = JSON.parse(tmp[l]);
        var type = (elem.id).substring(0, 3);
        if (type != 'ib-' && type != 'ima' && type != 'cvr')
        {
          if (type == 'cht' && elem['data'] != undefined)
          {
            var adStr = '<div' + (isEdit ? ' tabindex="0"' : '') + ' class="e-b cht-b m-b media" id="' + elem.id + '">' +
                    (isEdit ? '<ul class="eb-opts">' +
                            '<li><i class="icon-sort handle" title="Move"></i> </li>' +
                            '<li><a href="#con-del" role="btn" data-toggle="modal"><i class="icon-remove-circle del-eb" title="Delete Chart"></i></a></li>' +
                            '</ul>' : '') + '<div class="cht-hldr">' +
                    '<h2 class="m-b-hdng' + (isEdit ? (elem.ttl != undefined ? '' : ' emty') +
                            '" contenteditable="true" data-emty="Add a title for this chart here"' : '"') + '>' +
                    ((elem.ttl != undefined) ? trgt.buildTxt(elem.ttl, 1) : '') + '</h2>';
            if (isEdit)
            {
              adStr += '<section class="hideElement">' +
                      '<h3>Choose chart type:</h3>' +
                      '<a href="#" class="cht-tp box" data-tp="b"><i class="icon-column-chart"></i><span class="block">COLUMN</span></a>' +
                      '<a href="#" class="cht-tp box" data-tp="l"><i class="icon-line-chart"></i><span class="block">LINE</span></a>' +
                      '<a href="#" class="cht-tp box" data-tp="p"><i class="icon-pie-chart"></i><span class="block">PIE</span></a>' +
                      '<div class="clearfix"></div>' +
                      '<form class="m-b-form no-hgt transition" enctype="multipart/form-data" method="post" action="/ajax/prsxl">' +
                      '<h3>Upload chart data</h3>' +
                      '<div>' +
                      '<div class="box">' +
                      '<p>' +
                      '<i class="icon-xlsx"></i>' +
                      '<span class="author block">(upload .xls,.xlsx files only)</span>' +
                      '</p>' +
                      '<input type="file" name="cht-fl" class="cht-fl"></input>' +
                      '<progress max="100" value="0" class="red img-prgs"></progress>' +
                      '</div>' +
                      '<div class="box">' +
                      '<p><a href="#" class="author block"><i class="icon-xlsx"></i><span class="block">Download Sample Copy</span></a></p>' +
                      '</div>' +
                      '</div>' +
                      '</form>' +
                      '</section>';
            }
            adStr += '<div class="chart">' +
                    '<ul class="cht-opts box"></ul><svg class="svg"></svg><ul class="chart-tags"></ul>' +
                    '</div></div>' +
                    '</div></div>';
            trgt.append(adStr);
            $('#' + elem.id).data('edDt', elem);
            chtArray.push(elem);
          }
          else if (type == 'tml' && elem['data'] != undefined) {
            var adStr = '<div id="' + elem.id + '" tabindex="0" class="m-b e-b media">' + (isEdit ? '<ul class="eb-opts">' +
                    '<li><i class="icon-sort handle" title="Move"></i> </li>' +
                    '<li><a href="#con-del" role="btn" data-toggle="modal">' +
                    '<i class="icon-remove-circle del-eb" title="Delete Timeline"></i></a></li>' +
                    '</ul>' : '') +
                    '<h2 class="m-b-hdng ' + ($.trim(elem.ttl) == '' ? 'emty' : '') + '" ' +
                    (isEdit ? 'contenteditable="true" data-emty="Add a title for this timeline here"' : '') + '>'
                    + ((elem.ttl != undefined) ? trgt.buildTxt(elem.ttl, 1) : '') + '</h2>' +
                    '<div class="tmln-holder"></div></div>';
            trgt.append(adStr);
            $('#' + elem.id).data('edDt', elem);
            if ($('.crnt').data('mode') == 1) // To check for draft page as it doesn't contain params like tid and page type 'tp'
              $("#" + elem.id).find('.tmln-holder').append("<iframe src='" + $('body').data('auth') + "/embed?id=1&d=" +
                      JSON.stringify(elem.data) + "'frameBorder='0' width='99%' height='450'></iframe>");
            else {
              var pgDtls = $('.edtr').data('desc');
              $("#" + elem.id).find('.tmln-holder').append("<iframe src='" + $("body").data("auth") + "/embed?id=" + elem.id +
                      "&tid=" + pgDtls['tid'] + "&tp=" + pgDtls['tp'] + "' frameBorder='0' width='99%' height='450'></iframe>");
            }
            if (isEdit) {
              $("#" + elem.id).find('iframe').load(function () {
                var $this = $(this);
                $(this).contents().find('#my-timeline').bind('click', function (e) {
                  $this.parents(".e-b").focus();
                  $this.parents(".e-b").addClass("slctd").siblings(".e-b.media").removeClass("slctd");
                });
              });
            }
          }
          else if (type == 'lst')
          {
            //building slide show images
            for (var lj = 0; lj < elem["data"].length; lj++) {
              if (elem["data"][lj]["data"]) {
                for (var lk = 0; lk < elem["data"][lj]["data"].length; lk++) {
                  if (elem["data"][lj]["data"][lk]["imgId"]) {
                    allImgs.push([elem["data"][lj]["data"][lk]["src"], elem["data"][lj]["data"][lk]["cp"]["id"]]);
                  }
                  else if (typeof elem["data"][lj]["data"][lk]["data"] == "object") {
                    for (var ln = 0; ln < elem["data"][lj]["data"][lk]["data"].length; ln++) {
                      allImgs.push([elem["data"][lj]["data"][lk]["data"][ln]["src"], elem["data"][lj]["data"][lk]["data"][ln]["cp"]["id"]]);
                    }
                  }
                }
              }
            }

            var adStr = '<div class="e-b listicle" id="' + elem.id + '">' +
                    (isEdit ? '<ul class="eb-opts"><li><i class="icon-sort handle" title="Move"></i></li>' +
                            '<li><a href="#con-del" role="btn" data-toggle="modal">' +
                            '<i class="icon-remove-circle del-eb" title="Delete Listicle"></i></a></li>' +
                            '</ul>' : '') + '<section>' +
                    '<div class="cntr clearfix"><a href="#" class="lst-prv" title="View Previous">' +
                    (trgt.data('isExt') ? '<img src="/public/images/left.png" width="20" height="20" />' : '<i class="icon-chevron-left"></i>') + '</a>' +
                    '<span class="crnt-cnt">1</span>/<span class="ttl-cnt">' + elem['data'].length + '</span>' +
                    '<a href="#" class="lst-nxt" title="View Next">' + (trgt.data('isExt') ? '<img src="/public/images/right.png" width="20" height="20" />' : '<i class="icon-chevron-right"></i>') +
                    '</a></div>' + (isEdit ? '<ul class="lst-opts top view">' +
                            '<li><a href="#" data-toggle="tooltip" class="lst-new" title="Add new list item after this">' +
                            '<i class="icon-plus-circle"></i></a></li><li><a href="#con-del" data-toggle="modal" ' +
                            'title="Delete this list item" data-toggle="tooltip" class="del-lst"><i class="icon-remove-circle"></i>' +
                            '</a></li></ul>' : '') +
                    '<div class="carousel-inner">' +
                    (isEdit ? '<ul class="lst-opts view">' +
                            '<li><a href="#" data-toggle="tooltip" class="lst-new" title="Add new list item after this">' +
                            '<i class="icon-plus-circle"></i></a></li><li><a href="#con-del" data-toggle="modal" ' +
                            'title="Delete this list item" data-toggle="tooltip" class="del-lst"><i class="icon-remove-circle"></i>' +
                            '</a></li></ul>' : '') +
                    '<div class="cntr clearfix"><a href="#" class="lst-prv" title="View Previous">' +
                    (trgt.data('isExt') ? '<img src="/public/images/left.png" width="20" height="20" />' :
                            '<i class="icon-chevron-left"></i>') +
                    '</a>' +
                    '<span class="crnt-cnt">1</span>/<span class="ttl-cnt">' + elem['data'].length + '</span>' +
                    '<a href="#" class="lst-nxt" title="View Next">' +
                    (trgt.data('isExt') ? '<img src="/public/images/right.png" width="20" height="20" />' :
                            '<i class="icon-chevron-right"></i>') +
                    '</a></div><div class="clearfix"></div></div></section></div>';
            trgt.append(adStr);
            var lstcl = $('#' + elem.id);
            lstcl.data('lst', elem['data']);
            var sldNmFrmParam = 0;
            if (!isEdit)
            {
              sldNmFrmParam = parseInt(getQueryParams('sld'));
              sldNmFrmParam = sldNmFrmParam >= elem['data'].length ? elem['data'].length - 1 : sldNmFrmParam - 1;
              var lstItm = elem['data'][getQueryParams('lstid') == elem.id ? sldNmFrmParam : 0];
              lstItm = (typeof lstItm != 'object' ? JSON.parse(lstItm) : lstItm);
              adStr = '<div id="' + lstItm['id'] + '" class="item active"><h2 class="m-b-hdng">' +
                      ((typeof lstItm.ttl != 'undefined') ? trgt.buildTxt(lstItm.ttl, 1) : '') + '</h2>' +
                      '<div class="clearfix"></div></div>';
              lstcl.find('.carousel-inner .cntr').before(adStr);
              var trgtItm = $('#' + lstItm['id']);
              if (lstItm['data'] != undefined)
              {
                if (lstItm['data'].length > 0)
                  $('#' + lstItm['id']).loadArt(lstItm['data'], 0);
              }
            }
            else
            {
              for (var e = 0; e < elem['data'].length; e++)
              {
                var lstItm = elem['data'][e];
                lstItm = (typeof lstItm != 'object' ? JSON.parse(lstItm) : lstItm);
                adStr = '<div id="' + lstItm['id'] + '" class="item' + ((e == 0) ? ' active' : '') + '">' +
                        '<h2 class="m-b-hdng ' + (lstItm.ttl != undefined ? '' : 'emty') + '" contenteditable="true">' +
                        ((lstItm.ttl != undefined) ? trgt.buildTxt(lstItm.ttl, 1) : '') + '</h2>' +
                        '<div class="clearfix"></div></div>';
                lstcl.find('.carousel-inner .lst-opts').before(adStr);
                $('#' + lstItm['id']).data('edDt', lstItm);
                if (lstItm['data'] != undefined)
                {
                  if (e == 0 && lstItm['data'].length > 0)
                    $('#' + lstItm['id']).loadArt(lstItm['data'], 1);
                }
              }
            }
            if (getQueryParams('lstid'))
            {
              $('#' + elem.id).find('.cntr .crnt-cnt').text(sldNmFrmParam + 1);
            }
//            $('.lst-opts a, .cntr a').tooltip({
//              "placement": "top",
//              "container": "body"
//            });
          }
          else if (type == 'aud') {
            var adStr = '<div class="inln-audio e-b"';
            if (isEdit) {
              adStr += ' ed-dt=\'' + JSON.stringify(elem) + '\'>' +
                      '<ul class="eb-opts">' +
                      '<li><i class="icon-sort handle" title="Move"></i> </li>' +
                      '<li><a href="#con-del" role="btn" data-toggle="modal"><i class="icon-remove-circle del-eb" title="Delete audio"></i></a></li>' +
                      '</ul>';
            }
            else
              adStr += '>';
            adStr += '<div class="audio-holder">' +
                    '<h2 class="audio-hdng"';
            if (isEdit)
              adStr += 'contenteditable="true"  placeholder="Add audio title"';
            adStr += '>';
            if (isEdit)
              adStr += ((elem.ttl != undefined) ? elem.ttl : 'Add audio title');
            else
              adStr += ((elem.ttl != undefined) ? elem.ttl : '');
            adStr += '</h2>';
            if (isEdit) {
              adStr += '<section>' +
                      '<input type="radio" name="audio-tp" id = "audio-upld" class="audio-tp box" data-tp="upld" ><label class="lbl" for="audio-upld">Upload</label>' +
                      '<input type="radio" name="audio-tp" id = "audio-rec" class="audio-tp box" data-tp="rec" ><label class="lbl" for="audio-rec">Record</label>' +
                      '<div class="clearfix"></div>' +
                      '<form class="audio-frm no-hgt transition" method="post" action="/ajax/upldaud">' +
                      '<h3>You can only upload AIFF, WAVE (WAV), FLAC, ALAC, OGG, MP2, MP3, AAC, AMR, and WMA files. The maximum file size is 10MB.</h3>' +
                      '<div>' +
                      '<div class="span12 box">' +
                      '<input type="file" name="audio-fl" class="audio-fl" accept=".MP3,.mp3,.wma"></input>' +
                      '<progress max="100" value="0" class="red img-prgs"></progress>' +
                      '</div>' +
                      '</div>' +
                      '</form>' +
                      '<div class="audio-record no-hgt transition" >' +
                      '<a id = "rec-aud" href = "#"><i class="icon-bulb-on" title="Record"></i></a>' +
                      '<a id = "rec-play" href = "#"><i class="icon-chevron-right-sign" title="Play"></i></a>' +
                      '<a id = "rec-upld" href = "#"><i class="icon-chevron-up-sign" title="Upload"></i></a>' +
                      '<p class="aud-sts"> </p>' +
                      '</div>' +
                      '</section>';
            }
            adStr += '<div class="audio" id="' + elem.id + '">' +
                    '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=' + elem.data + '&amp;color=ff6600&amp;auto_play=false&amp;show_artwork=true"></iframe>';
            '</div>' +
                    '</div></div>';
            trgt.append(adStr);
          }
          else if (type == 'pol')
          {
            var adStr = '<div class="e-b poll ph-vw box" id="' + elem['id'] + '">' +
                    '<h2 class="m-b-hdng ' + (isEdit && elem['ttl'] == '' ? 'emty' : '') + '"' +
                    (isEdit ? 'contenteditabled="true" data-emty="Add Poll question here"' : '') + '>' + elem['ttl'] + '</h2>';
            if (isEdit)
            {
              adStr += '<div class="pol-opts">' +
                      '<a class="rm-pol-opt" href="#"><i class="icon-remove-circle"></i></a>';
              if (elem['data']['poll'].length)
              {
                for (var o = 0; o < elem['data']['poll'].length; o++)
                {
                  adStr += '<div class="pol-opt ' + (elem['data']['poll'][o] != '' ? '' : 'emty') +
                          '" data-emty="Poll Option" contenteditable="true">' + elem['data']['poll'][o] + '</div>';
                }
              }
              else
                adStr += '<div class="pol-opt emty" data-emty="Poll Option" contenteditable="true"></div>' +
                        '<div class="pol-opt emty" data-emty="Poll Option" contenteditable="true"></div>';
              adStr += '<a href="#" class="ad-pol-opt"><i class="icon-plus-circle"></i> Add new option</a>' +
                      '</div>';
            }
            else
            {
              adStr += '<form name="frm-' + elem['id'] + '" id="frm-' + elem['id'] + '">';
              // Fix to load previously created poll as 'data' key is not used in previous options
              elem['data'] = elem['data'] != undefined ? elem['data'] : {'poll': elem['poll']};
              for (var o = 0; o < elem['data']['poll'].length; o++)
              {
                adStr += '<p class="pol-opt"><input type="radio" name="pol-rdo" id="pol-rdo' + o + '" /><label for="pol-rdo' + o + '">' +
                        elem['data']['poll'][o] + '</label>' +
                        '<progress class="prgs-pol-opt transition" value="0" max="100"></progress>' +
                        '</p>';
              }

              adStr += '<input type="submit" class="btn btn-success" value="Save" /></form></div>';
            }
            trgt.append(adStr);
            getPollResults($("#frm-" + elem['id']));
            if (isEdit)
              $('#' + elem.id).data('edDt', elem);
          }
          else if (elem['data'] != undefined)
          {
            var tp = elem['tp'] != undefined ? elem['tp'] : elem.id.substr(0, 3);
            if (elem['spl'] != undefined)
              tp = elem['spl'] != 'head' ? elem['spl'] : 'sbh';
            else
            {
              if (tp == 'blq')
                tp = 'blq';
              else if (tp == 'hlt')
                tp = 'hlt';
              else if (tp == 'sub')
                tp = 'sbh';
            }
            var adStr = '<div class="e-b ph-vw ' + (elem['tp'] == 'v' ? 'media ' : '') +
                    (elem['tp'] != undefined ? 'v-b ed-b ' : 't-b ') + tp +
                    (isEdit && elem.data == '' ? ' emty' : '') + '" ' +(isEdit ? ' tabindex="0" ' + 
                    (elem['tp'] == undefined ? 'contenteditable="true"' : '') : '') +' id="' + elem.id + '">' +
                    ((elem['tp'] != undefined && isEdit) ? '<ul class="eb-opts"><li><i class="icon-sort handle" title="Move"></i> </li><li><a href="#con-del" role="btn" data-toggle="modal"><i class="icon-remove-circle del-eb" title="Delete"></i></a></li></ul><div class="he-bg"></div>' : '') + trgt.buildTxt(elem.data, 1) + '</div>';
            trgt.append(adStr);            
            /* code to set iframe height dynamically */
            if (elem.data.indexOf('embd-eb') != -1) {
              var iframeTrgt = $("#" + elem.id).find("iframe");
              iframeTrgt.load(function () {
                iframeTrgt.attr("height",iframeTrgt.contents().find("body").outerHeight());
              });
            }

            if (isEdit)
            {
              $('#' + elem.id).data('edDt', elem);
              if (!elem['tp'])
                trgt.find('.t-b:last').enableEditor();
              if (elem.imgs != undefined)
              {

              }
            }
          }
        }
        else if (type == 'cvr')
        {
          //{'background-image': 'url("' +  + '")', 'background-position': '0 ' + }
          var cvr = $('#cvr-img');
          cvr.removeClass('emty').addClass('img').find('.cvr-bg').removeClass('hideElement')
                  .prepend("<img src='"+(elem.src.indexOf("cloudfront") != -1 ? "https://" : "") + elem.src
                  +"' style='top:"+(elem.ypos !== undefined ? elem.ypos + 'px' : '0px')+"' />");
          $('#rltd-bx .rltd-cntnr').css('background-image', 'url("' + elem.src + '")');
          if (isEdit)
          {
            cvr.data('img', elem);
            cvr.find('.cvr-bg').positionBackground();
            cvr.find('form, progress').addClass('hideElement').siblings('.cvr-stngs').addClass('in');
            cvr.find('.c-n').html((elem.cn != undefined) ? $this.buildTxt(elem.cn, 1) : '')
                    .addClass((elem.cn != undefined) ? '' : 'emty');
            cvr.find('.cvr-bg').append($('.edtr').find('#hd-sctn').clone());
            $('.edtr').find('#hd-sctn').remove();
          }
          else
          {
            if (elem.cn != undefined && elem.cn != '')
              cvr.find('.c-n').html($this.buildTxt(elem.cn));
            else
              cvr.find('.c-n').remove();
          }
        }
        else
        {
          if (trgt.parents(".listicle").length == 0) {
            if (elem["data"] != undefined)
              for (var i = 0; i < elem["data"].length; i++)
                allImgs.push([elem["data"][i]["src"], elem["data"][i]["cp"]["id"]]);
            else
              allImgs.push([elem["src"], elem["cp"]["id"]]);
          }
          trgt.loadImg(elem, isEdit, function () {
            setupImg(elem, isEdit);
          });
        }
        if (!isEdit)
          $('#' + elem.id).find('.c-b').addClass('view-pg');
      }
      // Checking if draft is empty and adding a textblock if it is
      if ($('.crnt').data('mode') == 1 && !$('.stry').find('.e-b').length)
        $('.stry').insertText();
      if (chtArray.length)
      {
        var tag = document.createElement('script');
        tag.src = 'https://saddahaq.blob.core.windows.net/v11/gbojd3.v3.min.js';
        document.getElementsByTagName('body')[0].appendChild(tag);
        tag.onload = function () {
          var tag2 = document.createElement("link");
          tag2.setAttribute("rel", "stylesheet");
          tag2.setAttribute("type", "text/css");
          tag2.setAttribute("href", "/public/global/default/css/chartstyle.css");
          document.getElementsByTagName('head')[0].appendChild(tag2);
          tag2.onload = function () {
            var tag3 = document.createElement('script');
            tag3.src = '/public/global/default/js/chart.js';
            document.getElementsByTagName('body')[0].appendChild(tag3);
            tag3.onload = function () {
              $(".stry").data("chtfiles", "1");
              for (var c = 0; c < chtArray.length; c++)
              {
                trgt.find('#' + chtArray[c]['id']).removeClass('hideElement').drawChart(chtArray[c]['data'], chtArray[c]['tp'], trgt.find('#' + chtArray[c]['id']).width() - 56, 350, chtArray[c]['id'], 1);
              }
            };
          };
        };

      }
      trgt.find('> .loading').remove();
      if ($('.e-b iframe').length)
      {
        $('iframe').each(function () {
          var url = $(this).attr("src");
          if (url != undefined)
          {
            var charctr = "?";
            if (url.indexOf("?") != -1)
              charctr = "&";
            $(this).attr("src", url + charctr + "wmode=transparent");
          }
        });
      }
    },
    ldMreSgstns: function (tp, id) {
      // Adding more related data into rltd-box when tagged suggestions are less than 4
      var trgt = $(this);
      var artslst = trgt.find('.art');
      var arts = [];
      artslst.each(function () {
        arts.push($(this).attr('id'));
      });
      var hsh_tgs = "";
      $("#tag-box a").each(function (i) {
        if (i > 1)
          return false;
        hsh_tgs += (i == 0 ? '' : ',') + $(this).text().replace("#", "");
      });
      $.post('/ajax/rltdart',
              {
                "ids": arts.join(','),
                "cnt": (4 - $('#rltd-lst').find(' > li').length),
                "tp": tp,
                "pid": id,
                "htgs": hsh_tgs
              },
      function (d) {
        if (d)
        {
          arts = JSON.parse(d);
          if (arts.length)
          {
            for (var a = 0; a < arts.length; a++)
            {
              if (!trgt.find(" > li").length)
                addRltdArt(trgt, arts[a]);
              else
              {
                trgt.find(' > li').each(function (i) {
                  if (arts[a]['pubTm'] >= $(this).data("pbtm"))
                  {
                    addRltdArt(trgt.find(' > li:eq(' + i + ')'), arts[a]);
                    return false;
                  }
                });
              }
              // load default profile picture if user didn't update his/her profile picture
              trgt.chkPrfPic(arts[a]['Auth'], arts[a]['id']);
            }
            $('#rltd-lst').find('.art .tmsp').each(function () {
              $(this).updateTime({
                'ts': $(this).attr('tmsp')
              });
            });
          }
          else
            $("#rltd-bx").siblings("hr").remove();
        }
      });
    },
    bldLstItm: function () {
      var trgt = $(this);
      var data = trgt.data('edDt');
      data = (typeof data != 'object') ? JSON.parse(data) : data;
      if (data['data'].length)
        trgt.loadArt(data['data'], 1);
    },
    adjustCounter: function () {
      var btn = $(this);
      var cntrs = btn.parents('.listicle').find('.cntr');
      var crntVal = parseInt(cntrs.first().find('.crnt-cnt').text());
      var ttlVal = parseInt(cntrs.first().find('.ttl-cnt').text());
      if (btn.hasClass('lst-prv'))
        cntrs.find('.crnt-cnt').text(crntVal - 1 > 0 ? crntVal - 1 : crntVal);
      else if (btn.hasClass('del-lst'))
      {
        if (crntVal == ttlVal)
          cntrs.find('.crnt-cnt').text(crntVal - 1 > 0 ? crntVal - 1 : crntVal);
        cntrs.find('.ttl-cnt').text(ttlVal - 1 > 0 ? ttlVal - 1 : ttlVal);
      }
      else
      {
        if (btn.hasClass('lst-new'))
          cntrs.find('.crnt-cnt').text(crntVal + 1).siblings('.ttl-cnt').text(ttlVal + 1);
        else
          cntrs.find('.crnt-cnt').text((crntVal + 1 < ttlVal) ? crntVal + 1 : ttlVal);
      }
    }
  });
  function addRltdArt(trgt, art) {
    var str = '<li class="span16 art" id="' + art['id'] + '" data-pbtm="' + art['pubTm'] + '">' +
            '<article data-href="' + art['url'] + '">' +
            '<a href="' + art['url'] + '" ><div class="img-bx span5" style="background-image:url(https://saddahaq.blob.core.windows.net/multimedia/' +
            art['img'] + ');"></div></a>' +
            '<a href="' + art['url'] + '" ><div class="hdr-bx span11 box">' +
            '<header>' +
            '<h2 class="m-hd">' + trgt.buildTxt(art['ttl'], 0) + '</h2>' +
            '<summary>';
    var smry = art['smry'].split(':::');
    smry = (smry[0] == 1 ? smry[1] : smry[0]);
    str += (smry.length > 120 ? trgt.buildTxt(smry, 0).substr(0, 116) + '...' : trgt.buildTxt(smry, 0));
    str += '</summary>' +
            '</header></a>' +
            '<div class = "usr-dtls box" >' +
            '<div class = "auth-bx span10" >' +
            '<a href = "/' + art['Auth'] + '" class = "user-small prf-img small" >' +
            '<div class = "pull-left usr-img ' + (art.UST == "2" ? "vusr" : "") + '" >' +
            '<img src="https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' + art['Auth'] + '" />' +
            '</div>' + art['Auth_FN'] +
            '<p class = "italicText" > in ' + art['cat'] + '</p>' +
            '</a>' +
            '</div>' +
            '<div class = "tm-bx pull-right transition in" >' +
            '<i class="icon-time"></i> <span class="tmsp" tmsp="' + art['pubTm'] + '"></span>' +
            '</div>' +
            '<div class="vw-prphl  transition in">' +
            '<div>' +
            '<a href="#"><i class="icon-chevron-up-sign"></i> ' + (art['v_users'].length + art['votes']) + '</a>' +
            '</div>' +
            '<div>' +
            '<a href="' + art['url'] + '#comments-box' + '"><i class="icon-message"></i>' + art['Comment_Count'] + '</a>' +
            '</div>' +
            '<div>' +
            '<a href="#" class="popper" ><i class="icon-more"></i></a>' +
            '<div class="popout top">' +
            '<ul class="art-opts">' +
            '<li><a href="#" class="art-fav"><i class="icon-star"> </i> Add to favorites</a></li>' +
            '<li><a class="r-l ' + ((art['rl']) ? 'mrkd' : '') + '" href="#"><i class="icon-bookmark-label"></i> Read Later</a></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="clearfix"></div>' +
            '</article>' +
            '</li>';
    if (trgt.attr('id') == 'rltd-lst')
      trgt.append(str);
    else
      trgt.before(str);
  }
  /* Listicle navigation buttons */
  $('.stry').on('click', '.listicle .lst-opts a:not(.del-lst), .listicle .cntr a', function (e) {
    e.preventDefault();
    var $this = $(this);
    var isE = ($('.crnt').data('mode') != undefined) && !$('.stry').data('isExt');
    var crntNum = parseInt($this.parents('.listicle').find('.cntr:first > .crnt-cnt').text());
    var ttlNum = parseInt($this.parents('.listicle').find('.cntr:first > .ttl-cnt').text());

    if ((!$this.parents('.listicle').data('isL')) || (crntNum == ttlNum && $this.hasClass('lst-prv')) || (crntNum == 1 && $this.hasClass('lst-nxt')))
    {
      $this.parents('.listicle').data('isL', 1);
      var trgt = $this.parents('.listicle').find('section > .carousel-inner');
      if (isE)
      {
        var actvItm = trgt.find('> .item.active');
        if (actvItm.find('.e-b').length)
        {
          var aDt = actvItm.data('edDt');
          aDt = typeof aDt != 'object' ? JSON.parse(aDt) : aDt;
          aDt['data'] = [];
          actvItm.find('.e-b').each(function () {
            if ($(this).data('edDt') != undefined)
              aDt['data'].push($(this).data('edDt'));
          });
          actvItm.data('edDt', aDt);
        }
      }
      if ($this.hasClass('lst-new'))
      {
        var newId = 'itm' + new Date().getTime();
        trgt.find(' > .item.active').after('<div id="' + newId + '" class="item next" data-ed-dt=\'{"id":"' + newId + '"}\'>' +
                '<h2 class="m-b-hdng emty" contenteditable="true" data-emty="Add a heading for this list item">' +
                '</h2>' + trgt.insertText('html') + '<div class="clearfix"></div></div>');
        trgt.find('> .item.next').find('.t-b').enableEditor();
      }
      else if ($this.parents('.cntr').length && !isE && (crntNum >= 1 && crntNum <= ttlNum))
      {
        var sldNm = ($this.hasClass('lst-prv') ? (crntNum > 1 ? crntNum - 1 : crntNum) : (crntNum < ttlNum ? crntNum + 1 : crntNum));
        if (typeof ga != 'undefined')
        {
          var tmpItm = trgt.parents('.listicle').data('lst')[sldNm - 1];
          ga('send', 'pageview', {
            'page': $('body').data('canUrl'),
            'title': $.trim($('title').text()) + ' - ' + tmpItm['ttl']
          });
        }
        var url = document.URL.toString();
        history.pushState({}, '', (url.indexOf('?') > -1 ? url.substr(0, url.indexOf("?")) : url) + '?lstid=' + trgt.parents('.listicle').attr('id') + '&sld=' + sldNm);
        
        //for listicles loading from iframe
        var urlArr = url.split("/");
        if (urlArr[3].indexOf("embed?") == 0){
            urlArr = url.substr(0,url.indexOf("&lstid="));
            window.location = (urlArr.length ? urlArr : url) + '&lstid=' + trgt.parents('.listicle').attr('id') + '&sld=' + sldNm;
        }
      }
      if (($this.hasClass('lst-prv') && crntNum - 1 == 0) || ($this.hasClass('lst-nxt') && ttlNum <= crntNum))
      {
        $this.parents('.listicle').data('isL', 0);
        return false;
      }
      $('body').animate({scrollTop: $this.parents('.listicle').offset().top - 72}, 120, 'easeInOutCubic', function () {
        var items = trgt.find(' > .item');
        var actvIndx = items.index(trgt.find(' > .item.active'));
        // Updating ed-dt whenever next or previous are clicked
        if ($this.hasClass('lst-new'))
        {
          trgt.find('> .item.active, > .item.next').addClass('left');
          if (items.length > 1)
            trgt.find('.lst-opts .hideElement').removeClass('hideElement');
        }
        else if ($this.hasClass('lst-nxt'))
        {
          var nxtItm = null;
          if (!isE)
          {
            if (ttlNum > crntNum)
            {
              buildListcl(trgt, 'a');
              nxtItm = trgt.find(' > .item:last');
            }
          }
          else if (actvIndx < (items.length - 1))
          {
            nxtItm = trgt.find(' > .item:eq(' + (actvIndx + 1) + ')');
            if (!nxtItm.find('.e-b').length)
              nxtItm.bldLstItm();
          }
          if (nxtItm != null)
          {
            trgt.find(' > .item.active').addClass('left');
            nxtItm.addClass('next');
          }
        }
        else if ($this.hasClass('lst-prv'))
        {
          var prvItm = null;
          if (!isE)
          {
            if (crntNum - 1 > 0)
            {
              buildListcl(trgt, 'b');
              prvItm = trgt.find(' > .item:first');
            }
          }
          else if (actvIndx > 0)
          {
            prvItm = trgt.find(' > .item:eq(' + (actvIndx - 1) + ')');
            if (!prvItm.find('.e-b').length)
              prvItm.bldLstItm();
          }
          if (prvItm != null)
          {
            trgt.find(' > .item.active').addClass('right');
            prvItm.addClass('prev');
          }
        }
        setTimeout(function () {
          trgt.find('.next').addClass('left');
          trgt.find('.prev').addClass('right');
        }, 40);
        trgt.find('.item.active').bind("webkitTransitionEnd transitionend oTransitionEnd", function () {
          if (trgt.find(' > .next, > .prev').length)
          {
            if (!isE)
            {
              trgt.find(' > .item.active').remove();
              trgt.find('.next, .prev').addClass('active').removeClass('next prev left right');
            }
            else
            {
              trgt.find(' > .item.active').removeClass('active left right')
                      .siblings('.next, .prev').addClass('active').removeClass('next prev left right');
            }
          }
          $this.parents('.listicle').data('isL', 0);
        });
      });
      $this.adjustCounter();
    }
    else
      return false;
  });
  // Functionality to slide listicle based on keypress
  $(document).on('keyup', function (e) {
    if ((e.which == 37 || e.which == 39) && $('.stry').find('.listicle').length && !$('.crnt').data('mode'))
    {
      var actvLst = $('.stry').find('.listicle.keyEvt');
      if (e.which == 37)
        actvLst.find('.lst-prv:first').trigger('click');
      else if (e.which == 39)
        actvLst.find('.lst-nxt:first').trigger('click');
    }
  });
  function setupImg(elem, isE)
  {
    var par = $('#' + elem.id);
    if (elem.data != undefined)
    {
      var imgLft = elem['data'].length;
      var imgLd = 0;
      while (imgLft > 0)
      {
        if (imgLft == 4)
        {
          processImage(elem['data'].slice(imgLd, imgLd + 2), par);
          processImage(elem['data'].slice(imgLd + 2, imgLd + 4), par);
          imgLft = 0;
        }
        else
        {
          processImage(elem['data'].slice(imgLd, imgLd + 3), par);
          imgLd += 3;
          imgLft -= 3;
        }
      }
    }
    else
    {
      processImage([{"src": elem['src'], "cp": {"id": elem['cp']['id'], "cn": elem['cp']['cn']}}], par, isE);
    }
  }

  function processImage(imgLst, par)
  {
    var imgCnt = imgLst.length;
    if (imgCnt >= 1)
    {
      if (imgCnt > 1)
        par.addClass('grid');
      var ttl_ar = 0, onLoadCntr = 1;
      for (var c = 0; c < imgCnt; c++)
      {
        var img = new Image();
        img.src = imgLst[c]['src'];
        img.onload = function () {
          var img_ar = parseFloat((this.width / this.height).toFixed(3));
          ttl_ar += img_ar;
          if (onLoadCntr == imgCnt)
          {
            par.append('<div class="fig-bx"><div class="clearfix"></div></div>');
            loadImages(par.find('.fig-bx:last'), imgLst, ttl_ar);
          }
          onLoadCntr++;
        };
      }
    }
  }

  function loadImages(trgt, imgLst, ttl_ar)
  {
    var isE = $('.crnt').data('mode') != undefined;
    for (var c = 0; c < imgLst.length; c++)
    {
      var adStr = '<figure class="img-fig box fade transition ' + (isE ? (c == 0 ? 'actv' : '') : 'zoom') + '">' +
              '<div class="ar-hldr">' +
              '<div class="ar"></div>' +
              '<img src="' + imgLst[c]['src'] + '" />' +
              (isE || imgLst[c]['cp']['cn'] != '' ? '<div class="c-n ' + ((imgLst[c]['cp']['cn'] == '' && isE) ? ' emty' : '') +(isE ? ' edt' : '')+
                      '" data-mx-ln="40" ' + (isE ? 'contenteditable="true"' : '') + '>' +
                      (imgLst[c]['cp']['cn'] != '' ? trgt.buildTxt(imgLst[c]['cp']['cn'], 1) : '') : '') +
              '</div>' +
              '</div>' +
              ((isE || imgLst.length == 1) ? '<figcaption class="box' + (c == 0 ? '' : ' hideElement') + 
              (isE && imgLst[c]['cp']['id'] == '' ? ' emty' : '') + '" data-mx-ln="140" '+
              (isE ? 'contenteditable="true" data-emty="Add description for image '+
              (imgLst.length > 1 ? c+1 : '')+'"' : '')+'>' +
              (imgLst[c]['cp']['id'] != '' ? trgt.buildTxt(imgLst[c]['cp']['id'], 1) : '') +
              '</figcaption>' : '') + '</figure>';
      trgt.find('.clearfix').before(adStr);
      trgt.find('figure:last').find('img').on('load', function () {
        var img = $(this), img_ar = parseFloat((this.naturalWidth / this.naturalHeight).toFixed(3));
        img.siblings('.ar').css('padding-bottom', (100 / img_ar) + '%');
        var fig = img.parents('figure');
        fig.css('width', ((img_ar / ttl_ar) * 100) + '%').addClass('in').find('figcaption')
                .css('width', (((trgt.parents('.i-b').outerWidth() + 10) / fig.outerWidth()) * 100).toFixed(2) + '%');
      });
    }
  }

  function buildListcl(trgt, loc, actvIndx)
  {
    actvIndx = actvIndx != undefined ? actvIndx : parseInt(trgt.siblings('.cntr').find('.crnt-cnt').text());
    var lstItm = trgt.parents('.listicle').data('lst');
    lstItm = typeof lstItm != 'object' ? JSON.parse(lstItm)[actvIndx - 1] : lstItm[actvIndx - 1];
    lstItm = (typeof lstItm != 'object' ? JSON.parse(lstItm) : lstItm);
    var adStr = '<div id="' + lstItm['id'] + '" class="item ' + (loc == 'n' ? 'active' : '') + '"><h2 class="m-b-hdng">' +
            ((typeof lstItm.ttl != 'undefined') ? $(this).buildTxt(lstItm.ttl, 1) : '') + '</h2><div class="clearfix"></div></div>';
    if (loc == 'n')
    {
      trgt.find('.item').remove();
      trgt.prepend(adStr);
    }
    else if (loc == 'a')
      trgt.find('.item.active').after(adStr);
    else
      trgt.find('.item.active').before(adStr);
    trgt = $('#' + lstItm.id);
    if (lstItm['data'].length > 0)
      $('#' + lstItm['id']).loadArt(lstItm['data'], 0);
  }

  window.addEventListener('popstate', function () {
    if (!$('.crnt').data('mode'))
    {
      var sldNm = 1;
      if (window.location.search != '' && getQueryParams('lstid'))
      {
        sldNm = getQueryParams('sld');
        buildListcl($('#' + getQueryParams('lstid')).find('section > .carousel-inner'), 'n', parseInt(sldNm != undefined ? sldNm : 0));
      }
      else
        buildListcl($('.stry').find('.listicle').find('section > .carousel-inner'), 'n', 1);
      $('.listicle').find('.cntr .crnt-cnt').text(sldNm);
    }
  });
  /*
   * Functionality to popup embed code for a selected editor block
   */
  var tmr = null, prvIndx = null;
  $('.stry').on('hover', '.e-b', function (e) {
    var $this = $(this), trgt = $this.siblings('.ed-blk-mnu');
    if (e.type == 'mouseenter')
    {
      var crntIndx = $('.stry').find('.e-b').index($this);
      if (tmr != null)
        clearTimeout(tmr);
      /* 
       To check if user is focussing on same paragraph r not. If paragraph is changed, then close the opened popup
       and reset button config
       */
      if (crntIndx != prvIndx && $('#popout').hasClass(trgt.find('.popper').data('newCls')))
      {
        $('#popout').removeClass('in ' + trgt.find('.popper').data('newCls'));
        trgt.find('.popper').removeClass('opn');
      }
      trgt.css('top', ($this.offset().top - $this.parent().offset().top - 20) + 'px').addClass('in').find('.embed').data('trgt', $this.attr('id'));
      prvIndx = crntIndx;
    }
    else if (e.type == 'mouseleave')
    {
      tmr = setTimeout(function () {
        trgt.removeClass('in');
      }, 1000);
    }
  });
  $('.stry').on('hover', '.ed-blk-mnu', function (e) {
    var $this = $(this);
    if (e.type == 'mouseenter' && $this.hasClass('in'))
    {
      if (tmr != null)
        clearTimeout(tmr);
      $this.addClass('in');
    }
  });
  
  /* Embed code generating functionality */
  $(".stry").on("click", ".embed", function (e) {
    e.preventDefault();
    var pb = $('#pop-prw > section');
    pb.addClass('embd').html('<i class="icon-embed"></i><p class="dsc">Copy and paste the code below to embed in your website</p>' +
            '<div id="embed-prw" class="row-fluid">' +
            '<textarea class="block box" rows="4"></textarea>' +
            '<h3 class="s-h">Preview</h3>' +
            '<div class="embd-prw"></div>' +
            '</div>').showPopup(0);
//    var usr = $('#auth-prf').find('.auth-nme');
//    var pgDtls = $('.edtr').data('desc');
    var pth = location.pathname;
    pth = pth.substring(0, pth.lastIndexOf("/"));
    var embedStr = '<a href="' + $('body').data('auth') + '/embed?id=' + $(this).data('trgt') + '&url=' + window.location + '" id="anch-'+$(this).data("trgt")+'" class="sh-anch-ifm"></a><script src= "'+$("body").data("auth")+"/public/global/default/js/embed.js"+'"></script>';
      //    "<iframe id='sh-ifm-"+$(this).data("trgt")+"' class='sh-ifm' onLoad='stShIfmSze(this)' name='embd-eb' src='" + $("body").data("auth") + "/embed?id=" + $(this).data("trgt") + "&tid=" + pgDtls['tid'] + "&tp=" + pgDtls['tp'] + "&user=" + usr.attr('href').split("/")[3] + "::" + $.trim(usr.text()) + "&url=" + pth + "' width='99%' scrolling='yes' style='border:1px solid rgba(0,0,0,.1); max-width : 900px;'></iframe><script src='/public/global/default/js/embed.js'></script>";
    pb.find('textarea').val(embedStr).siblings('.embd-prw').html(embedStr);      
  });
    
  $('#progress-bar').on('click', 'textarea:not("#hstg")', function () {
    $(this).select();
  });
  // Animating slider inside petition suggestion upon hover
  $('#rltd-bx .ptn').on('hover', function (e) {
    var trgt = $(this).find('.sgn-bx .percent');
    if (e.type == 'mouseenter') {
      var timer = trgt.data("timer") || 0;
      clearTimeout(timer);
      var prcnt = ((trgt.data('sgnd') / trgt.data('trgt')) * 100).toFixed(2);
      timer = setTimeout(function () {
        trgt.css('width', prcnt + 'px');
      }, 400);
      trgt.data("timer", timer);
    } else {
      trgt.css('width', '0');
      clearTimeout(timer);
    }
  });

  //Follow, Unfollow user
  $('#follow').on('hover', function (e) {
    if ($(this).hasClass('unflw'))
    {
      if (e.type == 'mouseenter')
        $(this).text(' Unfollow ');
      else if (e.type == 'mouseleave')
        $(this).text('Following');
    }
  });
  $('#follow').click(function () {
    var $this = $(this);
    if ($this.chkVrfd())
    {
      var user = ($this.siblings('.auth-nme').attr('href')).split('/');
      var fnlTxt = ($this.hasClass('unflw')) ? 'Follow' : 'Following';
      $.post(api + '/uf', {
        'usr2': user[user.length - 1],
        'auth': $this.getShIntr(),
        'usr': $this.getLoggedInUsr()
      },
      function (d) {
        t = JSON.parse(d);
        if (t.success == 1) {
          $this.addClass('unflw').text(fnlTxt);
        }
      });
    }
  });
  // To avoid popping up login box when page is viewed without any active session
  if (!$('#user-navigation').length)
    $('#rltd-bx').find('.sgstn > a').addClass('skp-lgn');

  // Read later and fav buttons
//  $('#rltd-bx').on('click', '.img-bx, header', function () {
//    window.location = $("body").data("auth") + $(this).parents('article').data('href');
//  });

  $('#rltd-bx').on('click', '.art .r-l, .art .art-fav', function () {
    var $this = $(this);
    if ($('#user-nav .usrname').length || $this.chkVrfd()) {
      $.post(api + ($this.hasClass('r-l') ? '/arl' : '/af'),
              {"id": $this.parents('li.art').attr('id'), 'auth': $this.getShIntr(), 'usr': $this.getLoggedInUsr()}, function (d) {
        d = JSON.parse(d);
        if (d.success == 1)
          $this.toggleClass('mrkd');
        else
          $('#sts-msg').showStatus(d.msg, 'err');
      });
    }
  });
  // Donate Button 
  $('#rltd-bx').on('click', '.prphl-opn, .prphl-cls', function () {
    var par = $(this).parents(".sgstn-bx");
    if ($(this).hasClass('crwd-fnd') && par.height() < par.find(".wish-berry").height())
      par.css("padding-bottom", (par.find(".wish-berry").height() - par.height() + 24));
    else
      par.css("padding-bottom", 0);
    $(this).parents('.sgstn-bx').toggleClass('up');
    if ($(this).hasClass('dnt-btn'))
    {
      var trgt = $(this).parents('.sgstn-bx').find('.rltd-dntn .dntn-sts');
      var trgt_num = trgt.find('.dntn-req .nmbr').data('num');
      var got = trgt.find('.dntn-got .nmbr').data('num');
      if (trgt_num > 0)
        trgt.find('.cvr').css('height', (((trgt_num - got > 0 ? trgt_num - got : 0) / trgt_num) * 100).toFixed(2) + '%');
    }
  });
  /* Animating donate graphic */
  $('.dntn-sts').each(function () {
    var $this = $(this);
    var req = $this.find('.req').data('num');
    var got = $this.find('.got').data('num');
    $this.find('.nmbr').text($this.frmtNmbr(req));
    var ht = Math.floor(((req - got) / req) * 110);
    $this.find('.num-grpc:not(.red)').css('height', (ht >= 0 ? ht : 0));
    $this.find('.nmbr').tooltip({
      trigger: 'hover',
      container: 'body'
    });
  });
  // Attend event 
  $('#rltd-bx .evt').on('click', '.atnd-evt', function () {
    var $this = $(this);
    if ($this.chkVrfd())
    {
      var dtls = $this.parents('.sgstn').data('desc');
      $.post(api + '/ea', {
        "id": dtls.id,
        "toggle": "Yes",
        "tp": "Yes",
        'auth': $this.getShIntr(),
        'usr': $this.getLoggedInUsr()
      }, function (d) {
        t = JSON.parse(d);
        if (t.success == 1) {
          if ($this.hasClass('mrkd'))
            $this.html('<i class="icon-signin"></i> Attend').removeClass('mrkd');
          else
            $this.html('<i class="icon-signin"></i> Attending').addClass('mrkd');
        }
//      else {
//        alert(t.msg);
//      }
      });
    }
  });
  // Sign petition in related box
  $('#rltd-bx').on('submit', '.dntn-frm', function () {
    var $this = $(this);
    signPetition($this, $this.parents('li').attr('id'), 0);
    return false;
  });
  /* Submit petition signature directly on the page */
  $('#sgn-ptn-frm').on('submit', function () {
    var pet_dt = $('.edtr').data('desc');
    signPetition($(this), pet_dt.id, 1);
    return false;
  });
  function signPetition($this, ptnId, tp)
  {
    $this.find('input[type="submit"]').attr('disabled', 'disabled');
    var elem = $this.find('input[type="text"]');
    var isErr = false;
    if (!$('#user-nav .usrname').length)
    {
      $this.find('input[type="text"]').removeClass('error');
      if ($this.find('.ptn-sgn-nme').val() == '')
      {
        $this.find('.err-msg').html('How should we call you?');
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
    }
    if (isErr)
    {
      $this.find('input[type="submit"]').removeAttr('disabled');
      return false;
    }
    else
    {
      elem.removeClass('error');
      var usr = $this.getLoggedInUsr();
      var data = {
        "msg": $this.trimText($this.find('textarea').val()),
        "id": ptnId,
        "auth": getCookie('shIntr'),
        "usr": usr
      };
      if (!$('#user-nav .usrname').length)
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
            else {
              /* this code update the signatures count without refreshing
               var par = $this.parents(".ptnsgn");
               var full_ht = par.find(".nmbr.req").parents(".num-grpc").height();
               var pts_ttl = par.find(".nmbr.req").data("num");
               var pts_sgnd = par.find(".nmbr.got").data("num") + 1;
               par.find(".nmbr.got").attr("data-original-title", (pts_ttl - pts_sgnd)+" signatures required");     
               par.find(".nmbr.req").attr("data-original-title", pts_sgnd+" signatures received" );
               par.find(".nmbr.req").data("num", pts_sgnd);              
               par.find(".dntn-sts .ptn-rec-txt").text("("+pts_sgnd+" signatures received)");                    
               var req_ht = (full_ht/pts_ttl)*(pts_ttl-pts_sgnd);
               par.find(".nmbr.got").parents(".num-grpc").css("height",req_ht);
               */

              if (tp == 0)
              {
                $this.parents('.sgstn-bx').removeClass('up').find('section .sgn-ptn').remove();
                if (t.msg.length == 128)
                  $('#sts-msg').showStatus("You have successfully signed this petition.", 'scs');
                else
                  $('#sts-msg').showStatus($.trim($this.parents('li').find('.auth a').text()) + t.msg, 'scs');
              }
              else if (tp == 1)
              {
                var pet_dt = $('.edtr').data('desc');
                $this.addClass('hideElement').siblings('.shr-bx').removeClass('hideElement').siblings('.s-h').remove();
                var prcnt = (((parseInt(pet_dt['got']) + 1) / pet_dt['req']) * 100).toFixed(2);
                prcnt = (prcnt > 100) ? 100 : prcnt;
                $('#ptn-sgn').siblings('.percent').css('width', prcnt + '%');
                $('#sts-msg').showStatus($('#lft-mnu .usr-dtls .auth').text() + t.msg, 'scs');
                setTimeout(function () {
                  location.reload();
                }, 3000);
              }
            }
            flag = 1;
          }
          else {
            $('#sts-msg').showStatus(t.msg, 'err');
          }
        }
      });
      if (flag)
        return true;
    }
  }

  /**
   * Report a Bug
   */
  $('#lft-mnu').on('click', '.bug', function () {
    $.ajax({
      url: api + '/gtf',
      type: 'post',
      data: {
        'id': 'r-b'
      },
      success: function (data) {
        data = JSON.parse(data);
        $('#pop-prw > section').html(data['frm']).showPopup(0);
        if (!$('#user-nav .usrname').length)
          $('#pop-prw').find("#gst-eml").removeClass("hideElement");
      }
    });
  });
  $('#pop-prw').on('click', '#bug-rprt', function () {
    var bugdesc = $("#pop-prw").find('#bg-dsc');
    if (bugdesc.val().trim() == "" || bugdesc.val() == null) {
      $("#pop-prw").find('.err-msg').text('Please provide a description about the bug you encountered');
      return false;
    }
    if (!$('#user-nav .usrname').length) {
      var reg = /^[a-z0-9_\+-]+(\.[a-z0-9_\+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,4})$/;
      if (!reg.test($('#pop-prw').find("#gst-eml").val().toLowerCase()))
      {
        $("#pop-prw").find('.err-msg').text('Enter valid email address');
        return false;
      }
    }

    bugdesc.siblings('.err-msg').text('');
    $.post('/ajax/rbug', {
      "uri": document.URL.toString(),
      "dsc": bugdesc.val(),
      "eml": $('#pop-prw').find("#gst-eml").val()
    },
    function (data) {
      if (data)
      {
        $('#pop-prw').removeClass('view');
        $('#sts-msg').showStatus('Thank you for notifying us. Reported bug will be fixed asap.', 'scs');
      }
    }
    );
  });
  /**
   * Report Abuse
   */
  $('#lft-mnu').on('click', '#rep-abs', function () {
    if ($(this).chkVrfd()) {
      $.ajax({
        url: api + '/gtf',
        type: 'post',
        data: {
          'id': 'r-a'
        },
        success: function (data) {
          data = JSON.parse(data);
          $('#pop-prw > section').html(data['frm']).showPopup(0);
          if (!$('#user-nav .usrname').length)
            $('#pop-prw').find("#gst-eml").removeClass("hideElement");
        }
      });
    }
  });
  /**
   * Report abuse 
   */
  $('#pop-prw').on('click', '#absv-rprt', function () {
    var bugdesc = $("#pop-prw").find('#absv-dsc');
    if (bugdesc.val() == "" || bugdesc.val() == null) {
      $("#pop-prw").find('.err-msg').text('Please provide a description about the abusive content.');
      return false;
    }
    if (!$('#user-nav .usrname').length) {
      var reg = /^[a-z0-9_\+-]+(\.[a-z0-9_\+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,4})$/;
      if (!reg.test($('#pop-prw').find("#gst-eml").val().toLowerCase()))
      {
        $("#pop-prw").find('.err-msg').text('Enter valid email address');
        return false;
      }
    }

    if ($('#ptn').length)
      var tp = 'P';
    else if ($('#article').length)
      tp = 'A';
    else if ($('#event').length || $('#event-container').length)
      tp = 'E';
    bugdesc.siblings('.err-msg').text('');
    $.post(api + '/abs', {
      'id': $('.edtr').data('desc').id,
      "dsc": bugdesc.val(),
      'tp': tp,
      'auth': bugdesc.getShIntr(),
      'usr': bugdesc.getLoggedInUsr(),
      'eml': $('#pop-prw').find("#gst-eml").val()
    },
    function (d) {
      d = JSON.parse(d);
      if (d.success == 1)
      {
        $('#pop-prw').removeClass('view');
        $('#sts-msg').showStatus(d.msg, 'scs');
      }
      else {
        $('#sts-msg').showStatus(d.msg, 'err');
      }
    }
    );
  });
  /* Decommisioning a piece */
  $('#lft-mnu').on('click', '.dcm', function () {
    if ($('#lft-mnu').find('.dcm span').text() == "Decommission")
      var tp = "dcm";
    else
      tp = "re";
    $.post(api + '/gtf', {
      'id': 'dcmCnf',
      'tp': tp
    },
    function (d) {
      d = JSON.parse(d);
      $('#pop-prw').find('section').html(d.frm).showPopup(1);
    });
  });
  $('#pop-prw').on('click', '#del-dcm', function () {
    if ($('#ptn').length)
      var tp = 'P';
    else if ($('#article').length)
      tp = 'A';
    else if ($('#event').length || $('#event-container').length)
      tp = 'E';
    $.ajax({
      url: '/ajax/dcm',
      type: 'post',
      data: {
        'id': $('.edtr').data('desc').id,
        'tp': tp
      },
      success: function (d) {
        d = JSON.parse(d);
        if (d.success == 1) {
          $('#sts-msg').showStatus(d.msg, 'scs');
          $('#lft-mnu').find('.dcm span').text("Revert to Active state");
        }
        else
          $('#sts-msg').showStatus(d.msg, 'err');
      }
    });
  });
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ')
        c = c.substring(1);
      if (c.indexOf(name) != -1)
        return c.substring(name.length, c.length);
    }
    return "";
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

  /* Social Sharing */

//  $('.scl-shr').on('click', '.fb-share', function () {
//    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent($('meta[property="og:url"]').attr('content')) + '&display=popup&ref=plugin', '', 'toolbar=0,status=0,width=548,height=325');
//  });

  $('.scl-shr, #pop-prw').on('click', '.tw-tweet', function () {
    window.open('https://twitter.com/intent/tweet?original_referer=' + encodeURIComponent($('meta[property="og:url"]').attr('content')) + '&text=' + encodeURIComponent($('meta[name="twitter:title"]').attr('content')) + '&tw_p=tweetbutton&url=' + encodeURIComponent($('meta[property="og:url"]').attr('content')) + '&via=SaddaHaqMedia', '', 'toolbar=0,status=0,width=548,height=325');
  });
  $('.scl-shr, #pop-prw').on('click', '.gp-share', function () {
    window.open('https://plus.google.com/share?url=' + encodeURIComponent($('meta[property="og:url"]').attr('content')), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
  });
  $('.scl-shr,#pop-prw').on('click', '.rd-share', function () {
    window.open('//www.reddit.com/submit?url=' + encodeURIComponent(window.location), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
  });
  if ($('.scl-shr').length)
  {
    $.ajax('https://api.facebook.com/method/links.getStats', {
      data: {'urls': document.URL, 'format': 'json'},
      type: 'GET',
      success: function (d) {
        if (d.length)
          $('.scl-shr').find('.fb-share span:not(.hidden-phone)').text($(this).frmtNmbr(d[0]['total_count']));
      }
    });
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

  var invtd_mls;
  $(".eml-snd").on('click', function () {
    if ($(this).chkVrfd()) {
      $.post(api + '/gtf', {
        'id': 'inv-mls'
      },
      function (d) {
        invtd_mls = "";
        d = JSON.parse(d);
        $('#pop-prw').find('section').html(d.frm).showPopup(1);
      });
    }
  });
  $("#pop-prw").on('keyup', '#inv-eml', function (e) {
    if (e.keyCode == 13 || e.keyCode == 188) {
      if (e.keyCode == 188)
        $(this).val($(this).val().replace(',', ''));
      addEmlTag($(this).val());
    }

  });
  $("#pop-prw").on('paste', '#inv-eml', function () {
    var $this = $(this);
    setTimeout(function () {
      var emls = $this.val();
      emls = emls.split(",");
      $.each(emls, function (i, v) {
        addEmlTag(v);
      });
    }, 20);
  });
  function addEmlTag(tmp) {
    if (invtd_mls.search(tmp) != -1)
      return false;
    var eml_reg = /^[a-zA-Z0-9_\+-]+(\.[a-zA-Z0-9_\+-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.([a-zA-Z]{2,4})$/;
    if (tmp == '' || !eml_reg.test(tmp))
      return false;
    invtd_mls += tmp + ',';
    tmp = "<span class='btn btn-small eml-tg'><span>" + tmp + "</span><a href='#' class='tg-cls'><i class='icon-remove'></i></a></span>";
    $("#pop-prw").find("#invtd-mls").prepend(tmp);
    $("#pop-prw").find("#inv-eml").val('');
  }

  $("#pop-prw").on('click', '#snd-ml-invts', function () {
    var eml_reg = /^[a-zA-Z0-9_\+-]+(\.[a-zA-Z0-9_\+-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.([a-zA-Z]{2,4})$/;
    var tmp = $(this).siblings("#invtd-mls").find("#inv-eml").val();
    if (invtd_mls.length == 0 && eml_reg.test(tmp))
      invtd_mls += tmp + ',';
    else if (invtd_mls.length == 0) {
      $("#pop-prw").find(".err-msg").text("You must provide at least one recipient email.");
      return false;
    }
    $.post(api + '/eim', {
      'eml': invtd_mls,
      'id': $('.edtr').data("desc")['id'],
      'auth': $(this).getShIntr(),
      'usr': $(this).getLoggedInUsr(),
      'msg': $(this).siblings("textarea").val()
    },
    function (d) {
      var t = JSON.parse(d);
      $('#pop-prw').removeClass('view');
      if (t.success == 0)
        $('#sts-msg').showStatus(t.msg, 'err');
      else
        $('#sts-msg').showStatus(t.msg, 'scs');
    });
  });
  $("#pop-prw").on('click', '.tg-cls', function () {
    var ml = $(this).parents('.eml-tg').find('span').text().trim() + ',';
    invtd_mls = invtd_mls.replace(ml, "");
    $(this).parents('.eml-tg').remove();
  });
  /* Image slide show code */
  var sldeImgIndx = 0;
  $("#article, #event, #ptn").on("click", ".img-fig", function () {
    if ($("#article").data("view") || $("#event").data("view") || $("#ptn").data("view")) {
      var pb = $('#slde-shw-pop');
      var trgt = pb.find("#slde-shw");
      var imgAttrs, curr = $(this).find("img"), str = "", w = $(window).width();
      trgt.empty();
      for (var i = 0; i < allImgs.length; i++) {
        imgAttrs = sldeImgAttr(allImgs[i][0]);
        if (allImgs[i][0] == curr.attr("src")) {
          sldeImgIndx = i;
          pb.css("position", imgAttrs.pos);
          if (imgAttrs.pos == "absolute")
            trgt.css("top", $(window).scrollTop() + 80);
          else
            trgt.css("top", 0);
          str += '<div class="slde active" style=" top: ' + (imgAttrs.pos == "fixed" ? (imgAttrs.top + 72) : 0) + 'px;" ><img src="' + allImgs[i][0] + '" style="max-width: ' + (w - w / 8) + 'px;" ><p class="sldshw-img-des" data-mx-ln="140">' +
                  (allImgs[i][1] != undefined ? (allImgs[i][1].length > 140) ? pb.buildTxt(allImgs[i][1].substr(0, 137), 1) + ".." : pb.buildTxt(allImgs[i][1], 1) : '')
                  + '</p></div>';
          //in case of listicle all imgs are not loaded. so image attributes will be zero. to fix that next img is added in dummy.  
          (i == allImgs.length - 1) ? pb.find("#nxt-img").attr("src", allImgs[0][0]) : pb.find("#nxt-img").attr("src", allImgs[i + 1][0]);
          break;
        }
      }
      trgt.append(str);
      $('.sts-msg-bx').addClass('err');
      $('#slde-shw-pop').addClass('view big');
    }
  });
  $("#slde-shw-pop #slde-lft").click(function () {
    if (sldeImgIndx == 0)
      return false;
    sldeImgIndx--;
    var w = $(window).width();
    var trgt = $("#slde-shw-pop").find("#slde-shw");
    trgt.find(".slde.active").animate(
            {"left": "100%"},
    {duration: 500, complete: function () {
        var imgAttr = sldeImgAttr(allImgs[sldeImgIndx][0]);
        $("#slde-shw-pop").css("position", imgAttr.pos);
        if (imgAttr.pos == "absolute")
          trgt.css("top", $(window).scrollTop() + 80);
        else
          trgt.css("top", 0);
        trgt.find(' > .slde.active').before('<div class="slde" style="top: ' + (imgAttr.pos == "fixed" ? (imgAttr.top + 72) : imgAttr.top) + 'px; left: -100%"><img src="' + allImgs[sldeImgIndx][0] + '" style="max-width: ' + (w - w / 8) + 'px;" ><p class="sldshw-img-des" data-mx-ln="140">' +
                (allImgs[sldeImgIndx][1] != undefined ? (allImgs[sldeImgIndx][1].length > 140) ? trgt.buildTxt(allImgs[sldeImgIndx][1].substr(0, 137), 1) + ".." : trgt.buildTxt(allImgs[sldeImgIndx][1], 1) : '')
                + '</p></div>');
        var prvItm = trgt.find(".slde:first");
        trgt.find(".slde:not(:first-child)").remove();
        prvItm.css("left", 0).addClass("active");
        if (typeof ga != 'undefined')
        {
          ga('send', 'pageview', {
            'page': $('body').data('canUrl'),
            'title': $.trim($('title').text()) + ' - ' + "image slideshow" + sldeImgIndx
          });
        }
      }});
  });
  $("#slde-shw-pop #slde-rgt").click(function () {
    if (sldeImgIndx == allImgs.length - 1) {
      $("#slde-shw-pop #nxt-img").attr("src", allImgs[0][0]);
      return false;
    }
    $("#slde-shw-pop #nxt-img").attr("src", allImgs[sldeImgIndx + 1][0]);
    sldeImgIndx++;
    var w = $(window).width();
    var trgt = $("#slde-shw-pop").find("#slde-shw");
    trgt.find(".slde.active").animate(
            {"left": "-100%"},
    {duration: 500, complete: function () {
        var imgAttr = sldeImgAttr(allImgs[sldeImgIndx][0]);
        $("#slde-shw-pop").css("position", imgAttr.pos);
        if (imgAttr.pos == "absolute")
          trgt.css("top", $(window).scrollTop() + 80);
        else
          trgt.css("top", 0);
        trgt.find(' > .slde.active').after('<div class="slde" style="top: ' + (imgAttr.pos == "fixed" ? (imgAttr.top + 72) : imgAttr.top) + 'px; left: 100%"><img src="' + allImgs[sldeImgIndx][0] + '" style="max-width: ' + (w - w / 8) + 'px;"><p class="sldshw-img-des" data-mx-ln="140">' +
                (allImgs[sldeImgIndx][1] != undefined ? (allImgs[sldeImgIndx][1].length > 140) ? trgt.buildTxt(allImgs[sldeImgIndx][1].substr(0, 137), 1) + ".." : trgt.buildTxt(allImgs[sldeImgIndx][1], 1) : '')
                + '</p></div>');
        var nxtItm = trgt.find(".slde:last");
        trgt.find(".slde:not(:last-child)").remove();
        nxtItm.css("left", 0).addClass("active");
        if (typeof ga != 'undefined')
        {
          ga('send', 'pageview', {
            'page': $('body').data('canUrl'),
            'title': $.trim($('title').text()) + ' - ' + "image slideshow" + sldeImgIndx
          });
        }
      }});
  });

  $(document).click(function (e) {
    if ($("#slde-shw-pop").hasClass("view") && $(e.target).parents('.slde').size() == 0 && $(e.target).parents('#slde-ctrl').size() == 0 && $(e.target).parents('.img-fig').size() == 0)
      $(".pop-cls").trigger("mousedown");
  });
  function sldeImgAttr(src) {
    var image = new Image();
    image.src = src;
    var nw = image.naturalWidth, mw = $(window).width(), nh = image.naturalHeight, mh = 0.8 * $(window).height(), w, h, r;
    mw = mw - mw / 8;
    h = nh, w = nw;
    if (nw > mw) {
      r = mw / nw;
      w = mw;
      h = r * nh;
    }
    var pos = {
      top: (h < mh) ? Math.floor((mh - h) / 2) : 20,
      left: Math.floor(((mw - w) / 2) + (($(window).width() - mw) / 2)),
      w: w,
      h: h,
      pos: (h < mh) ? "fixed" : "absolute"
    };
    return pos;
  }
  /* End of Image slide show code */

  $(".usr-vrf-sts").on("click", ".mre", function () {
    var $this = $(this);
    if ($(this).hasClass('o'))
    {
      $this.removeClass('o').find('i').addClass('icon-chevron-down').removeClass('icon-chevron-up');
      $this.siblings('span,p').addClass('hideElement');
    }
    else
    {
      $this.addClass('o').find('i').addClass('icon-chevron-up').removeClass('icon-chevron-down');
      $this.siblings('span,p').removeClass('hideElement');
    }
  });
  /* Poll submission */

  $('.stry').on('submit', '.poll form', function (e) {
    e.preventDefault();
    var $this = $(this);
    if ($this.getShIntr())
      getPollResults($this);
    else if ($this.parents('.embd-elm').length)
      $this.chkExtLgn(2);
    else
      $this.chkVrfd();
  });

  function getPollResults($this) {
    var chkd = $this.find("input[type='radio'][name='pol-rdo']:checked");
    chkd = chkd.length ? chkd.attr("id").substr(7) : '';
    $.ajax({
      url: "POLLURLHERE",
      data: {
        'auth': $this.getShIntr(),
        'usr': $this.getLoggedInUsr() ? $this.getLoggedInUsr() : $this.getLoggedInUsr(2),
        'id': ($('.edtr').data("desc")) ? $('.edtr').data("desc")['id'] : $('.stry').data('orgin'),
        'pid': $this.attr("id").substr(4),
        'pval': chkd
      },
      success: function (res) {
        res = JSON.parse(res);
        $this.find('label').addClass('scl').siblings('progress').addClass('in');

        // $.each($this.find('progress'), function (i, p) {
        //    p.attr("value", res.msg[i]);
        // });

      }
    });
  }

// Fetch 'GET' params from url
  function getQueryParams(srchParam)
  {
    var params = window.location.search.substr(1).split('&');
    for (var p = 0; p < params.length; p++)
    {
      var param = params[p].split('=');
      if (param[0] == srchParam)
        return param[1];
    }
    return 0;
  }
//Fb like related code

  $("#fb-lk-wrp").parent().mousemove(function (e) {
    $("#fb-lk-wrp").css({
      top: e.pageY - 10,
      left: e.pageX + 30
    });
  });
  $('#fb-lk-wrp').click(function () {
    $(this).remove();
  });
  fb_hider();
  var fb_timer = setTimeout(fb_hider(), 5000);
  function fb_hider() {
    $(document).on('mouseout', "a,i, #right-bar, button, input,.cht-hldr, textarea, div[contenteditable='true'], figure, .usr-img,#rltd-lst",
            function () {
              $('#fb-lk-wrp').show();
            });
    $(document).on('mouseover', "a,i,#right-bar,button,input,.cht-hldr, textarea, div[contenteditable='true'], figure, .usr-img,#rltd-lst",
            function () {
              $('#fb-lk-wrp').hide();
            });
  }
});
