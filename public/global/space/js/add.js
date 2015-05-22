$(document).ready(function () {
  var api = $('body').data('api');

  $('#spc-crt').find('.frame').enableSlider();
  /* Functionality to clear placeholder */
  $('#hd-sctn').on('focus', '.m-hd, .smry', function () {
    if ($(this).hasClass('emty'))
      $(this).removeClass('emty');
  });

  $('#cvr-img').on('blur', '.m-hd, .smry', function () {
    var $this = $(this);
    if ($.trim($this.text()) == '')
      $this.addClass('emty');
  });

  $('#hd-sctn').on('keydown', '.m-hd,.smry', function (e) {
    var text = $.trim($(this).text());
    var $this = $(this);
    if ((e.which == 8 || e.which == 46) && text == '')
    {
      $this.html('&nbsp;');
      e.preventDefault();
    }
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
      $this.lmtTxt(e, this);
  });

  $('#cvr-img').on('paste', '.m-hd, .smry', function (e) {
    var el = this;
    var $this = $(this);
    setTimeout(function () {
      $this.lmtTxt(e, el);
      $this.placeCaretAtEnd(el, 1);
    }, 20);
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
                  $this.parents('form').addClass('hideElement').siblings('.cvr-stngs').addClass('in');
                  
                  $('#cvr-img').data('img', {"src": data.msg}).find(".cvr-bg > img").attr('src', data.msg)
                    .removeClass('hideElement').siblings('.he-bg').removeClass('hideElement');
                  positionBackground($('#cvr-img .cvr-bg'));
                  par.find('.plc').removeClass('plc');
                  par.data('src', data.msg).find('progress').fadeOut();
                }
                else
                {
                  $('#sts-msg').showStatus('Something went wrong and we have alredy started to look into it. Please try again', 'err');
                }
              }
            });
          }).trigger('ajax');
        }
      }
    }
    else
      $('#sts-msg').showStatus("Ooops!! Looks like you don't have enough privileges to perform this action.", 'err');
    return false;
  });
  /*
   * Remove Cover image and show upload button
   */
  $('#cvr-img').on('click', '.cvr-stngs a:first', function () {
    var trgt = $(this).parent().siblings('.cvr-bg');
    trgt.children("img").attr("src", "");
    trgt.removeAttr('style').siblings('form').removeClass('hideElement').siblings('.cvr-stngs').removeClass('in');
    trgt.find('.he-bg').addClass('hideElement');
    trgt.find('.chk-lmt').addClass('plc');
  });

    function positionBackground(cvrbg) {
        cvrbg.on('mousedown', '.he-bg', function (e) {
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
  
    $('.cvr-bg').on('mouseup', '.he-bg', function () {
        $(this).off('mousemove');
    });
  
  //add space profile pic
  var ias = null;
  $('#spc-logo').on('change', '.logo-file', function (e) {
    var $this = $(this);
    var file = this.files[0];
    var allowedExt = ['image/jpeg', 'image/png'];
    if ($.inArray(file['type'], allowedExt) == -1)
    {
      $('#sts-msg').showStatus('Invalid file format. Try uploading a jpg/png file', 'err');
      return false;
    }
    else
    {
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
        success: function (d) {
          d = JSON.parse(d);
          if (d.success) {
            $.post($('body').data('api') + '/gtf', {"id": "prfpic"}, function (dt) {
              dt = JSON.parse(dt);
              $('#pop-prw > section').html(dt['frm']).showPopup(1);
              if (ias)
                ias.remove();
              var trgt = $('#prf-prw #prw');
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
              $this.parents('form').removeClass('full').siblings('.prw').prepend('<img src="' + d['msg'] + '" />').siblings('#rm-prf-pic').removeClass('hideElement');
            });
          }
        }
      });
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
    var img = $('#prf-prw img').attr('src'), trgt = $('#spc-logo .prw img');
    //Live preview in thumbnail box
    var slctn = ias.getSelection();
    var sclX = 64 / (slctn.width || 1), sclY = 64 / (slctn.height || 1);
    trgt.css({
      width: Math.round(sclX * trgt.get(0).naturalWidth) + 'px',
      height: Math.round(sclY * trgt.get(0).naturalHeight) + 'px',
      marginLeft: '-' + Math.round(sclX * slctn.x1) + 'px',
      marginTop: '-' + Math.round(sclY * slctn.y1) + 'px'
    }).parents('#spc-logo').data('logo', {"img": trgt.attr('src'), "slctn": slctn});
    $('.lightbox .pop-cls').trigger('click');
    ias.remove();
  });

  /* Save Space Functionality */
  $("#crt-spc").click(function () {
    var $this = $(this);
    var cvr = $('#cvr-img');
    var cgry = $('input[name="spc-ctgy"]:checked').map(function () {
      return this.value;
    }).get();
    if ($('#hd-sctn .m-hd').hasClass('emty')) {
      $('#sts-msg').showStatus('Add a title to your space and then try again', 'err');
      return false;
    }
    else if (!cgry.length) {
      $('#sts-msg').showStatus('Select on or more categories and try again', 'err');
      return false;
    }

    $this.attr('disabled', 'disabled');
    cvr.find('.sv-sts').removeClass('err');
    $.ajax({
      url: '/ajax/chkabsvnss',
      async: true,
      data: {
        "ttl": cvr.find('#hd-sctn .m-hd').text(),
        "at": cvr.find('#hd-sctn .smry').text()
      },
      dataType: 'text',
      type: 'post',
      beforeSend: function () {
        $this.addClass('ldng').find('.content').text('processing..');
      },
      success: function (d) {
        if (d != '')
          $this.removeAttr('disabled');
        else
        {
          var txt = '';
          var dt = {
            'auth': $this.getShIntr(),
            'usr': $this.getLoggedInUsr(),
            'ttl': $this.trimText($('#hd-sctn .m-hd').html()),
            'lg': $("#spc-logo").data('logo'),
            'ctgy': cgry,
            'cvr': $("#cvr-img").find(".cvr-bg > img").attr("src"),
            'smry': $this.trimText($('#hd-sctn .smry').html()),
            'cvr-pos': $("#cvr-img").find(".cvr-bg > img").css("top")
          };
          if ($('#flw-bx').length) // To add space parameters while editing it
          {
            dt['isE'] = 1;
            dt['sid'] = $('#cvr-img').data('info')['id'];
            txt = 'updated';
          }
          else {
            txt = 'created';
          }        
          $.ajax({
            url: api + '/ns',
            async: true,
            data: dt,
            type: 'post',
            success: function (d) {
              d = JSON.parse(d);
              if (d.success == 1)
              {
                $("#crt-spc").css({"cursor": "progress"});
                $('#sts-msg').showStatus('Your space ' + txt + ' successfully. Please wait while we redirect..','scs');
                setTimeout(function () {
                  window.location = '/' + d.msg;
                }, 3000);
              }
              else
              {
                $('#sts-msg').showStatus('Something went wrong. Please try again','err');
                $this.removeAttr('disabled').removeClass('ldng').find('.content').text('Finish');
              }
            }
          });
        }
      }});
  });

  $(document).on('click', '.dd label', function (e) {
    e.stopImmediatePropagation();
  });
  /* Remove space logo */
  var el = null;
  $('#rm-prf-pic').on('click', function(){
    el = $(this);
  });
  $('#con-del #yes').on('click', function(){
    if(el.attr('id') == 'rm-prf-pic'){
      $('#spc-logo').removeData('logo');
      el.siblings(".prw").find("img").attr("src", "");
      el.addClass("hideElement").siblings(".spc-logo-upld").addClass("full");
    }
  }); 
});