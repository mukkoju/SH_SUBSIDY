$(document).ready(function () {
  //API url
  var api = $('body').data('api');

  /*Adjust height of left-bar to screen height */
  var auxHt = ($(window).height() - 100);
  $('.right-container .tab-pane').css('height', ($(window).height() - 64));
  var variables = {
    prevText: '',
    ele_width: 69,
    ele_height: 65,
    prevElem: null,
    prevTagElem: null,
    lmtRchd: false,
    timer: null,
    user: '',
    nxpg: 2,
    loading: false,
    prevNws: 9,
    prevCnt: 0,
    prevtp: 'All',
    prevTab: '',
    prevPst: 10,
    eod: false,
    newTab: false,
    isCmplt: false,
    sly: null,
    slyLoading: false
  };
  $.fn.animateElements = function (callback)
  {
    //var elements = $('.tab-content').find('.active .happening');
    var positioned = false;
    if (!positioned)
    {
      //alert($(this).attr('class') + ":" + $(this).css('left'));
      this.each(function (index)
      {
        $(this).css({
          'left': '-10px',
          'opacity': 0
        });
      });
      positioned = true;
    }
    var delay = 0;
    this.each(function (index) {
      if (positioned)
      {
        $(this).delay(delay).animate({
          left: 0,
          opacity: 1
        }, 'slow', 'easeOutExpo', function () {
          positioned = false;
        });
        delay += 40;
      }
    });
    if (callback)
      callback();
  };
  $.fn.extend({
    animateAuxContent: function (callback)
    {
      var positioned = false;
      if (positioned != true)
      {
        this.each(function (index) {
          $(this).css({
            'left': '20px',
            'opacity': '0'
          });
        });
        positioned = true;
      }
      var delay = 0;
      this.each(function (index) {
        if (positioned == true)
        {
          $(this).delay(delay).animate({
            'left': 0,
            'opacity': '1'
          }, 'slow', 'easeOutExpo', function () {
            positioned = false;
          });
          delay += 20;
        }
      });
      if (callback)
        callback();
    },
    slideLeftBar: function (options, callback)
    {
      var main = $('#main-content-box');
      var aux = $('#aux-content-box');
      if (options.direction == 'right')
      {
        main.find('.jspPane').removeClass('hideElement');
        main.animate({
          'opacity': 1
        }, 'fast', 'easeOutExpo');
        aux.animate({
          'opacity': 0
        }, 'fast', 'easeOutExpo');
        $('.left-container').animate({
          'margin-left': 0
        }, 'slow', 'easeOutExpo', function () {
          aux.addClass('hideElement');
        });
      }
      else if (options.direction == 'left')
      {
        aux.removeClass('hideElement');
        main.animate({
          'opacity': 0
        }, 'fast', 'easeOutExpo');
        aux.animate({
          'opacity': 1
        }, 'fast', 'easeOutExpo');
        $('.left-container').animate({
          'margin-left': '-' + options.margin
        }, 'slow', 'easeOutExpo', function () {
          main.find('.jspPane').addClass('hideElement');
        });
      }
      if (callback)
        callback();
    },
    scaleImages: function (options) {
      var div_height = options.dh;
      var div_width = options.dw;
      var img_width = $(this)[0].naturalWidth;
      var img_height = $(this)[0].naturalHeight;
      var max_side = Math.max(img_width, img_height);
      var scale = (max_side == img_height) ? img_height / div_height : img_width / div_width;
      var new_width = 0;
      var new_height = 0;
      var top = 0;
      var left = 0;
      if (!($(this).parents('div').hasClass('tile1') || $(this).parents('div').hasClass('tile4')))
      {
        if (max_side == img_height)
        {
          new_width = Math.ceil(img_width / scale);
          new_height = Math.ceil(img_height / scale);
          top = 0;
          left = Math.round((div_width - new_width) / 2);
        }
        else
        {
          new_height = Math.ceil(img_height / scale);
          new_width = Math.ceil(img_width / scale);
          top = Math.round((div_height - new_height) / 2);
          left = 0;
        }
      }
      else
      {
        if (img_width > img_height)
        {
          scale = img_height / div_height;
          new_width = Math.ceil(img_width / scale);
          new_height = Math.ceil(img_height / scale);
          top = 0;
          left = Math.round((div_width - new_width) / 2);
        }
        else
        {
          scale = img_width / div_width;
          new_height = Math.ceil(img_height / scale);
          new_width = Math.ceil(img_width / scale);
          top = Math.round((div_height - new_height) / 2);
          left = 0;
        }
      }
      var delayTime = 50;
      if ($(this).parents('div').hasClass('image-holder'))
      {
        new_width -= 4;
        delayTime = 100;
      }
      $(this).css({
        'width': new_width,
        'height': new_height,
        'top': top,
        'left': left
      });
      $(this).delay(delayTime).fadeIn();
    },
    hideScroller: function () {
      $(this).mouseenter(function () {
        $(this).find('.jspVerticalBar').fadeIn('slow');
      });
      $(this).mouseleave(function () {
        $(this).find('.jspVerticalBar').fadeOut('slow');
      });
    },
    hoverEffect: function (options) {
      var pclr = $(this).css('background-color');
      if (options.event.type == 'mouseenter')
      {
        if (!$(this).hasClass('more'))
          $(this).css('background-color', options.color);
      }
      else
      {
        if (!$(this).hasClass('more') && !$(this).hasClass('event'))
          $(this).css('background-color', pclr);
      }
    },
    formatButton: function (options) {
      if (options.event.type == 'mouseenter')
      {
        variables.prevText = this.text();
        if (options.btn.hasClass('yes'))
        {
          this.text("Yes, I'm in");
        }
        else if (options.btn.hasClass('no'))
        {
          this.text("Sorry!");
        }
      }
      else
      {
        this.text(variables.prevText);
      }
    },
    /*
     * positionElement to position elements to center of the page
     * 
     * options is a json which can have 2 parameters
     * 
     *  parent -> the element wrt which the position of target should be centered
     *  top -> boolean; true -> set top value, false -> do not set top value 
     */
    positionElement: function (options) {
      if (this.width() != 0 || this.height() != 0)
      {
        variables.ele_width = this.outerWidth();
        variables.ele_height = this.outerHeight();
      }
      else if (this.outerWidth() == 0)
        variables.ele_width = 32;
      else if (this.outerHeight() == 0)
        variables.ele_height = 32;
      var left = ((options.parent.outerWidth() - variables.ele_width) / 2);
      var bot = ((options.parent.outerHeight() - variables.ele_height) / 2);
      if (options.top == true)
        this.css({
          'left': left,
          'top': bot
        });
      else if (options.top == false)
        this.css({
          'left': left,
          'bottom': bot
        });
      else if (options.top == -1)
        this.css({
          'left': left
        });
      if ($(this).hasClass('loading'))
        $(this).fadeIn(100);
    },
    // printError is used for alerting the user with appropriate error message
    printError: function (msg) {
      var $this = this;
      var errorList = this.find('ul.error-list');
      errorList.find('li').remove();
      if (msg != '')
      {
        errorList.append("<li>" + msg + "</li>");
        $(this).animate({
          opacity: 1
        }, 'fast', 'easeOutExpo', function () {
        });
      }
      if (variables.timer != null)
        clearTimeout(variables.timer);
      variables.timer = setTimeout(function () {
        errorList.find('li').remove();
        $this.animate({
          opacity: 0
        }, 'slow', 'easeOutExpo', function () {
          errorList.find('li:not(:first)').remove();
        });
      }, 8000);
    },
    showStatus: function (msg, status, callback) {
      var $this = $(this);
      $this.find('p').html(msg);
      $this.addClass('view ' + status);
      /* To fadeout automatically after 5sec */
      setTimeout(function () {
        $this.removeClass('view err scs');
      }, 5000);
      if (callback)
      {
        setTimeout(function () {
          callback();
        }, 3500);
      }
    },
    // Form reset
    resetForm: function ()
    {
      this.find('textarea,input:not(:submit),password').each(function () {
        $(this).val('');
      });
      this.find('select').each(function () {
        $(this).val(0);
      });
      this.find('.opt-div:gt(1)').remove();
    },
    /* Showing image description and copyright content on hover */
    showImgDesc: function (e) {
      var elem = $(this).find('.c-b');
      if (e.type == 'mouseenter')
      {
        var timer = elem.data("timer") || 0;
        clearTimeout(timer);
        timer = setTimeout(function () {
          elem.fadeIn();
        }, 300);
        elem.data("timer", timer);
      }
      else
      {
        var timer = elem.data("timer") || 0;
        clearTimeout(timer);
        elem.fadeOut();
      }
    },
    getMnth: function (m, type)
    {
      if (type == '')
      {
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
      }
      else if (type == 'shrt')
      {
        var month = new Array();
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Aug";
        month[8] = "Sep";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";
      }
      return month[parseInt(m)];
    },
    setActiveTab: function () {
      $('#happening-now').find('li.menu i.icon-caret-up').addClass('hideElement');
      $('.tab-content').find('.tab-pane').removeClass('active');
      $('#happening-now').find('a[href="#' + $(this).attr('id') + '"] > i.icon-caret-up').removeClass('hideElement');
      $(this).addClass('active');
    },
    getDateTime: function (tmsp) {
      var d = new Date(tmsp * 1000);
      var month = new Array();
      month[0] = "Jan";
      month[1] = "Feb";
      month[2] = "Mar";
      month[3] = "Apr";
      month[4] = "May";
      month[5] = "Jun";
      month[6] = "Jul";
      month[7] = "Aug";
      month[8] = "Sep";
      month[9] = "Oct";
      month[10] = "Nov";
      month[11] = "Dec";

      var hrs = d.getHours();
      var zn = 'AM';
      if (hrs > 12)
      {
        hrs -= 12;
        zn = 'PM';
      }
      else if (hrs < 10)
        hrs = '0' + hrs;

      var mins = d.getMinutes();
      if (mins < 10)
        mins = '0' + mins;
      var secs = d.getSeconds();
      if (secs < 10)
        secs = '0' + secs;
      var date = {};
      date.m = month[d.getMonth()];
      date.d = d.getDate();
      date.t = hrs + ":" + mins + ":" + secs + " " + zn;
      return date;
    },
    getUsrSgstns: function (isMod) {
      var $this = $(this);
      var isPrv = true;
      var term = '';
      var carPos = 0;
      if (variables.prevElem != $this.attr('id'))
      {
        variables.prevElem = $this.attr('id');
        isPrv = false;
      }
      var unames = [];
      if ($this.offset().top > ($(window).height() - $this.offset().top))
        var sugs_pos = {my: "left bottom", at: "left top", collision: "flip"};
      else
        sugs_pos = {my: "left top", at: "left bottom", collision: "flip"};
      $this// don't navigate away from the field on tab when selecting an item
              .on("keydown", function (event) {
                if (event.keyCode === $.ui.keyCode.TAB &&
                        $(this).data("ui-autocomplete").menu.active) {
                  event.preventDefault();
                }
              }).autocomplete({
        source: function (request, response)
        {
          term = $.trim(request.term);
          if (!($this.hasClass('invitee')) && term.indexOf('@') >= 0)
          {
            if ($this.attr('contenteditable'))
            {
              carPos = $this.getCaretPosition();
              term = request.term.substr(0, carPos).split(' ');
              if (term.length > 1)
              {
                term.shift();
                term = term[term.length - 1].substr(1);
              }
              else
                term = term[0].substr(1);
            }
            else
              term = request.term.substr(1);
          }
          else if ($this.parents("#search-frm").length) {
            if (term.indexOf("in:users") != 0)
              return;
            term = term.substr(9, term.length);
          }
          else
            term = term.substr(1);
          if (term.length > 0) {
            $.ajax({
              'url': api + '/us',
              data: {
                'usr': term,
                'tp': (isMod ? 1 : 0)
              },
              type: 'POST',
              dataType: 'text',
              beforeSend: function () {
                unames = [];
              },
              success: function (d) {
                var t = JSON.parse(d);
                if (t.success == 1) {
                  var prfpic = $("body").data("auth") + '/public/Multimedia/P_Pic_';
                  if ($('#user-nav').data('isLive'))
                    prfpic = 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_';
                  for (var u = 0; u < ((t.msg.length <= 5) ? t.msg.length : 5); u++)
                  {
                    unames.push({
                      'name': t.msg[u].F + (t.msg[u].L != null ? " " + t.msg[u].L : ""),
                      'unme': t.msg[u].U,
                      'img': prfpic + t.msg[u].BU
                    });
                  }
                }
              },
              complete: function () {
                if (!isPrv)
                  response(unames);
                else
                {
                  if ($this.parents('.e-b').data('refd') != undefined)
                  {
                    var be4Ref = $this.parents('.e-b').data('refd').split('::');
                    be4Ref.forEach(function (e, i) {
                      unames = $.grep(unames, function (user) {
                        return user.unme != e;
                      });
                    });
                  }
                  response(unames);
                }
              }
            });
          }
        },
        create: function () {
          $('.ui-helper-hidden-accessible').remove();
        },
        focus: function (event, ui) {
          //Prevent value inserted on focus
          return false;
        },
        select: function (event, ui) {
          event.preventDefault();
          var refd = '';
          if ($this.prop('tagName') != 'INPUT')
          {
            var tmp = $.trim($this.html());
            var ti = tmp.indexOf('@' + term);
            var strB4r = tmp.substr(0, ti);
            var strAftr = tmp.substr(ti + 1).replace(term, '');
            $this.html(strB4r + ' <a class="ref" href="' + $('body').data('auth') + '/' + ui.item.unme + '">' + ui.item.name + '</a> ' + strAftr);

            if ($this.hasClass('search-query'))
              window.location = '/' + ui.item.unme;
            else
            {
              refd = $this.parents('.e-b').data('refd') != undefined ? $this.parents('.e-b').data('refd') : '';
              $this.parents('.e-b').data('refd', refd + (refd != '' ? '::' + ui.item.unme : ui.item.unme));
              $this.placeCaretAtEnd(this, 1);
            }
          }
          else
          {
            if ($this.hasClass('search-query'))
              window.location = '/' + ui.item.unme;
            else if ($this.attr('id') == 'inv-sh')
            {
              var inpt = $this.parent();
              var trgt = inpt.parent();
              var invLst = trgt.data('invt') != undefined ? trgt.data('invt') : [];
              invLst.push(ui.item.unme);
              trgt.data('invt', invLst);
              inpt.before('<li>' + ui.item.name +
                      '<a href="#" class="inv-rmv pull-right"><i class="icon-remove"></i></a></li>');
              $this.val('');
              if (((trgt.outerWidth() + trgt.offset().left) - (inpt.prev('li').outerWidth() + inpt.prev('li').offset().left)) < 100)
                inpt.css('width', '100%');
              else
                inpt.css('width', ((trgt.offset().left + trgt.outerWidth()) - (inpt.prev('li').outerWidth() + inpt.prev('li').offset().left) - 16));
              refd = $this.data('refd') != undefined ? $this.data('refd') : '';
              $this.data('refd', refd != '' ? refd + '::' + ui.item.unme : ui.item.unme);
            }
            else {
              this.value = ui.item.name;
              $this.data('unme', ui.item.unme).focus();
            }
          }
          return false;
        }
      }).data("ui-autocomplete")._renderItem = function (ul, item) {
        ul.addClass('srch');
        var anchr = "<a class='block box' title='" + item.unme + "'";
        if ($this.hasClass('search-query'))
          anchr += " href='/" + item.unme + "'";
        anchr += "><img src='" + item.img + "' class='icn pull-left' align='absmiddle' /><p><span class='user-small'>" + item.name + "</span><span class='dft-msg block'>@" + item.unme + "</span></p></a>";
        $("<li>").addClass('box').append(anchr).appendTo(ul);
        ul.find("li:last-child").find("img").findPrfPic();
        return ul.find("li:last-child");
      };
      if (!$this.hasClass('search-query'))
        $this.autocomplete("option", "position", sugs_pos);
    },
    getHstgSgstns: function (rtnDt) {
      var $this = $(this);
      var isPrv = true;
      if (variables.prevTagElem != $this.attr('id') && ($this.attr('id') != 'hstg' && $this.val() == ''))
      {
        variables.prevTagElem = $this.attr('id');
        isPrv = false;
      }
      var tags = [];
      var carPos = 0;
      var term = '';
      if ($this.offset().top > ($(window).height() - $this.offset().top))
        var sugs_pos = {my: "left bottom", at: "left top", collision: "flip"};
      else
        sugs_pos = {my: "left top", at: "left bottom", collision: "flip"};
      $this
              // don't navigate away from the field on tab when selecting an item
              .on("keydown", function (event) {
                if (event.keyCode === $.ui.keyCode.TAB && $this.data("ui-autocomplete").menu.active) {
                  event.preventDefault();
                }
                if (event.keyCode == $.ui.keyCode.ESCAPE)
                {
                  var html = $this.html();
                  $this.html(html);
                  $this.autocomplete('destroy');
                  $this.placeCaretAtEnd($this.get(0), 1);
                }
              })
              .autocomplete({
                minLength: 2,
                source: function (request, response) {
                  // delegate back to autocomplete, but extract the last term
                  term = $.trim(request.term);
                  if ($this.hasClass('search-query'))
                  {
                    term = request.term.substr(1);
                  }
                  else if ($this.attr('id') == 'hstg')
                  {
                    term = extractLast(request.term);
                  }
                  else if ($this.attr('contenteditable'))
                  {
                    carPos = $this.getCaretPosition();
                    term = request.term.substr(0, carPos).split(' ');
                    if (term.length > 1)
                    {
                      term.shift();
                      term = term[term.length - 1].substr(1);
                    }
                    else
                    {
                      term = term[0].split('#');
                      term = term[term.length - 1];
                    }
                  }
                  else
                  {
                    term = term.substr(1);
                  }
                  if (term.length > 0)
                  {
                    $.ajax({
                      'url': '/ajax/gthtgsgstns',
                      data: {
                        'htg': term
                      },
                      type: 'POST',
                      dataType: 'text',
                      beforeSend: function () {
                        tags = [];
                      },
                      success: function (data) {
                        data = JSON.parse(data);
                        if (data != -1) {
                          for (var u = 0; u < ((data.length <= 5)? data.length : 5); u++)
                            tags.push(data[u].H);
                        }
                      },
                      complete: function () {
                        if (!isPrv)
                          response(tags);
                        else
                        {
                          if ($this.data('tagd') != undefined)
                          {
                            var be4Tagd = $this.data('tagd').split('::');
                            be4Tagd.forEach(function (e, i) {
                              tags = $.grep(tags, function (tag) {
                                return tag != e;
                              });
                            });
                          }
                          response(tags);
                        }
                      }
                    });
                  }
                },
                close: function (event, ui) {
                  var html = $this.html();
                  $this.html(html);
                },
                focus: function (event, ui) {
                  // prevent value inserted on focus
                  if ($this.attr('contenteditable') || $this.hasClass('e-b') || $this.attr('id') == 'hstg' || $this.hasClass('htg-bx'))
                    return false;
                  else
                    this.value = ui.item.value;
                },
                select: function (event, ui) {
                  if (!rtnDt)
                  {
                    if ($this.get(0).nodeName == 'INPUT' || $this.get(0).nodeName == 'TEXTAREA')
                    {
                      var terms = split(this.value);
                      // remove the current input
                      terms.pop();
                      // add the selected item
                      terms.push('#' + ui.item.value);
                      // add placeholder to get the comma-and-space at the end
                      terms.push("");

                      this.value = terms.join(", ");
                      // Saving already added tags
                      var tagd = $this.data('tagd') != undefined ? $this.data('tagd') : '';
                      $this.data('tagd', tagd + (tagd != '' ? '::' + ui.item.value : ui.item.value));
                    }
                    else if ($this.hasClass('search-query'))
                      window.location = '/hashtag/' + ui.item.value.toLowerCase();
                    else
                    {
                      var tmp = $.trim($this.html());
                      var ti = tmp.indexOf('#' + term);
                      var strB4r = tmp.substr(0, ti);
                      var strAftr = tmp.substr(ti + 1).replace(term, '');
                      $this.html(strB4r + ' <a class="tag" href="' + $('body').data('auth') + '/hashtag/' + ui.item.value.toLowerCase() + '">' + ui.item.value + '</a> ' + strAftr);
                      $this.placeCaretAtEnd($this.get(0), 1);

                      var tagd = $this.parents('.e-b').data('tagd') != undefined ? $this.parents('.e-b').data('tagd') : '';
                      $this.parents('.e-b').data('tagd', tagd + (tagd != '' ? '::' + ui.item.value : ui.item.value));
                      $this.placeCaretAtEnd(this, 1);
                    }
                  }
                  return false;
                }
              }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var anchr = "<a class='hash transition in box'";
        if ($this.hasClass('search-query'))
          anchr += " href='/hashtag/" + item.value.toLowerCase() + "'";
        anchr += ">#" + item.value + "</a>";
        ul.addClass('srch');
        if ($this.hasClass('search-query'))
          ul.addClass('span8');
        else
          ul.addClass('span3 sml');
        $this.attr('hlink', '/hashtag/' + item.value.toLowerCase()).focus();
        return $("<li>").addClass('box').append(anchr).appendTo(ul);
      };
      $this.on("autocompleteselect", function (event, ui) {
        if ($this.hasClass('search-query'))
          window.location = '/hashtag/' + ui.item.value.toLowerCase();
      });
      if (!$this.hasClass('search-query'))
        $this.autocomplete("option", "position", sugs_pos);
    },
    stripHtml: function (html)
    {
      var tmp = $('<div>');
      var txt = html.replace(/\\"/g, '"');
      tmp.html(txt);
      return $.trim(tmp.text());
    },
    placeCaretAtEnd: function (el, isEnd) {
      el.focus();
      if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        if (isEnd)
        {
          sel.removeAllRanges();
          sel.addRange(range);
          if (sel.rangeCount)
            sel.collapseToEnd();
        }
        else
          sel.collapseToStart();
      } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
      }
    },
    getCaretPosition: function () {
      var caretOffset = 0, element = $(this).get(0);
      if (typeof window.getSelection != "undefined") {
        var range = window.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
        var textRange = document.selection.createRange();
        var preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
      }
      return caretOffset;
    },
    updateRefTag: function ()
    {
      var refd = '', tagd = '', elem = $(this);
      elem.find('.ref').each(function (i, e) {
        if ($.trim($(e).text()) != '')
        {
          var usr = $(e).attr('href').split('/');
          refd += usr[usr.length - 1] + (i < elem.find('.ref').length - 1 ? '::' : '');
        }
      });
      elem.find('.tag').each(function (i, e) {
        if ($.trim($(e).text()) != '')
          tagd += $.trim($(e).text()) + (i < elem.find('.tag').length - 1 ? '::' : '');
      });
      return {
        'refd': refd,
        'tagd': tagd
      };
    },
    buildTxt: function (txt, hasAnchr)
    {
      if (txt != '' && txt != undefined)
      {
        if (hasAnchr)
        {
          return txt.replace(/\[u:(.*?)\](.*?)\[\/u\]/g, '<a class="ref" href="' + $('body').data('auth') + '/$1">$2</a>').replace(/\[h](.*?)\[\/h\]/g, '<a class="tag" href="' + $('body').data('auth') + '/hashtag/$1">$1</a>')
                  .replace(/\[dlqt\]/g, '"').replace(/\[slqt\]/g, "'").replace(/\[bksh\]/g, "\\");
        }
        else
          return txt.replace(/\[u:(.*?)\](.*?)\[\/u\]/g, '<span class="ref">$2</span>').replace(/\[h](.*?)\[\/h\]/g, '<span class="tag">$1</span>').replace(/\[dlqt\]/g, '"').replace(/\[slqt\]/g, "'").replace(/\[bksh\]/g, "\\");
      }
      else
        return '';
    },
    trimText: function (txt)
    {
      return $.trim(txt).replace(/<a class="ref" href="http(.*?):\/\/(.*?)\/(.*?)">(.*?)<\/a>/g, '[u:$3]$4[/u]').replace(/<a class="tag" href="(.*?)\/hashtag\/(.*?)">(.*?)<\/a>/g, '[h]$2[/h]').replace(/\\/g, "[bksh]").replace(/\t/g, " ")
              .replace(/'|&#39;|&#8217;|&#8216;/g, '[slqt]').replace(/"|&#8221;|&#8220;|&#34;|&quot;/g, '[dlqt]').replace(/&nbsp;/g, " ").replace(/\r?\n|\r/g, " ");
    },
    lmtTxt: function (evt, elem)
    {
      var $this = $(this);
      var txt4len = $this.text().length;
      var maxLn = $this.data('mxLn');
      if (maxLn - txt4len < 60)
        $this.addClass('lmt');
      else
        $this.removeClass('lmt red');
      if (maxLn - txt4len <= 0)
        $this.addClass('red');
      else
        $this.removeClass('red');

      $this.attr('data-ln', maxLn - txt4len);
      if (evt.type == 'paste')
      {
        $this.text($this.text());
        $this.placeCaretAtEnd($this.get(0), 1);
      }
    },
    rplcTgs: function (txt) {
      return txt.replace(/<a class="ref" href="http(.*?):\/\/(.*?)\/(.*?)">(.*?)<\/a>/g, '@$4').replace(/<a class="tag" href="(.*?)\/hashtag\/(.*?)">(.*?)<\/a>/g, '#$2').replace(/\\/g, "[bksh]").replace(/\t/g, " ")
              .replace(/<span class="tag">(.*?)<\/span>/g, '#$1').replace(/&nbsp;/g, " ").replace(/\r?\n|\r/g, " ");
    },
    frmtNmbr: function (num) {
      if (num)
      {
        if (num >= 1000 && num < 1000000)
          num = (num / 1000).toFixed(1).toString() + 'K';
        else if (num >= 1000000)
          num = (num / 1000000).toFixed(1).toString() + 'M';
      }
      return num;
    },
    checkUrl: function (text) {
      var url1 = /(^|&lt;|\s)(www\..+?\..+?)(\s|&gt;|$)/g,
              url2 = /(^|&lt;|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|$)/g;

      var html = $.trim(text);
      if (html) {
        html = html
                .replace(url1, '$1<a class="ref" target="_blank" href="http://$2">$2</a>$3')
                .replace(url2, '$1<a class="ref" target="_blank"  href="$2">$2</a>$5');
      }
      return html;
    },
    getTmSgstns: function (d, trgt, flag) {
      var $this = $(this);
      d = new Date(d);

      if (flag == 1)// flag will be 1 when end date and time selected first and if start time = end time.
      {
        var et = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 00, 00, 00);
        var eTmsp = d.getTime() / 1000;
        var dTmsp = (et.getTime() / 1000);
        var hrs = 0;
      }
      else {
        et = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        dTmsp = d.getTime() / 1000;
        eTmsp = et.getTime() / 1000;
        hrs = d.getHours();
      }

      var zn = 'AM';
      var mins = d.getMinutes();
      var tArray = [];
      while (dTmsp < eTmsp)
      {
        var tStr = '';
        var m = '';
        var h = '';
        if (hrs == 0 && mins == 0)
          tArray.push('12:00 AM');
        if (mins >= 0 && mins < 15)
          m = '15';
        else if (mins >= 15 && mins < 30)
          m = '30';
        else if (mins >= 30 && mins < 45)
          m = '45';
        else if (mins >= 45)
        {
          m = '00';
          mins -= 60;
          ++hrs;
        }
        h = hrs;
        if (hrs >= 12)
        {
          zn = 'PM';
          h -= 12;
        }
        if (h == 0)
          h = 12;
        mins += 15;
        dTmsp += 900;
        var tStr = h + ":" + m + " " + zn;
        if ($.inArray(tStr, tArray) == -1)
        {
          tArray.push(tStr);
          if (h < 10)
            tArray.push('0' + tStr);
        }
      }
      $this.autocomplete({
        minLength: 1,
        source: function (req, res) {
          var re = $.ui.autocomplete.escapeRegex(req.term);
          var matcher = new RegExp("^" + re, "i");
          res($.grep(tArray, function (item) {
            return matcher.test(item);
          }));
        },
        change: function () {
          if ($.inArray($this.val(), tArray) < 0)
          {
            $this.val('').addClass('error');
            return false;
          }
          else
            $this.removeClass('error');
        },
        select: function (evt, ui) {
          $('#'+$this.parents('.dtpkr-bx').data('trgt')).find('.tm').text(ui.item.value);
//          $this.parents('.dt-tm').find('.dt-mth > .tm').text(ui.item.value);
          trgt.getTmsp(ui.item.value);
        }
      });
      $this.autocomplete("option", "position", {
        my: "right bottom",
        at: "right top"
      });
    },
    getTmsp: function (tm) {
      var $this = $(this), date = null, 
              hrs = 0, mins = 0, tmpDt = new Date();
      if (tm)
      {
        var tmp = tm.split(':');
        var hrs = parseInt(tmp[0]);
        var zn = tmp[1].split(' ');
        mins = zn[0];
        if (zn[1] == 'PM' && hrs != 12)
          hrs += 12;
        if (zn[1] == 'AM' && hrs == 12)
          hrs = 0;
      }
      if ($this.val() != '' && $this.val() != undefined)
      {
        var d = ($this.val()).split('/');
        var date = new Date(d[2], d[1] - 1, d[0], hrs, mins);
      }
      else if ($this.data('dt') != undefined)
      {
        var d = ($this.data('dt')).split('/');
        var date = new Date(d[2], d[1] - 1, d[0], hrs, mins);
      }
      else
        var date = new Date(tmpDt.getFullYear(), tmpDt.getMonth(), tmpDt.getDate(), hrs, mins);
      $this.data('tmsp', Math.floor(date.getTime() / 1000));
    },
    loadData: function (options) {
      variables.user = $(this).getLoggedInUsr(0);
      ldElem($(this), options);
    },
    addNews: function (options) {
      var $this = $(this);
      if (!variables.loading && $this.find('.nws-tl').length && !variables.isCmplt)
      {
        variables.loading = true;
        if (variables.prevtp != options.cgry)
        {
          variables.prevtp = options.cgry;
          variables.prevNws = 15;
        }
        else
          variables.prevNws += 6;
        $.ajax(api + '/gts', {
          dataType: 'json',
          async: true,
          type: 'post',
          data: {
            'page': variables.nxpg,
            'ctgy': options.cgry,
            'cnt': 6,
            'htg': options.htg,
            'kwd': options.kwd,
            'pc': variables.prevNws,
            'type': options.tl_tp,
            'auth': $this.getShIntr(),
            'usr': $this.getLoggedInUsr(),
            'usr2': options.usr2,
            'sid': options.spcId,
            'tp': options.tp,
            'sdt': options.sdt,
            'edt': options.edt
          },
          beforeSend: function () {
            if (variables.isCmplt)
            {
              $this.find('img.loading').positionElement({
                'parent': $this,
                'top': false
              });
              return false;
            }
          },
          success: function (posts) {
            if (posts.success)
            {
              posts = posts['msg'];
              for (var d = 0; d < posts.length; d++)
              {
                var nws = posts[d];
                $this.append(buildStryTl(nws, (options.isSpc != undefined ? options.isSpc : 0)));
                $this.chkPrfPic((nws['D_ID'] != undefined ? $("body").data("bunme") : nws.P_Author), (nws.P_Id ? nws.P_Id : nws.D_ID));
                if (!isMobile())
                  setPosition($this.find('.nws-tl:last'), $this);
                else
                  $this.find('.nws-tl:last').addClass('in');

                if (d == posts.length - 1)
                  variables.loading = false;
              }
              if (posts.length < 6)
                variables.isCmplt = true;
              $this.find('.rdltr , .actn-btn').tooltip();
            }
          },
          complete: function () {
            $this.find(' > .loading').remove();
            if (variables.isCmplt)
            {
//              var lstTl = $this.find('.nws-tl:last');
              $this.append('<div class="end">No more stories</div>');
              setEndPosition($this.find('.end'), $this);
            }
            scaleImages($this);
            variables.nxpg++;
          }
        });
      }
    },
    loadNews: function (options) {
      var $this = $(this);
      if (/^[a-zA-Z0-9- ]*$/.test(options.cgry) == false) {
        options.cgry = '';
      }
      if (options.cgry == 'Articles')
        $('#usr-pg').append("<div class='loading sml'></div>");
      else if (!$this.find('.loading').length)
        $this.append("<div class='loading sml'></div>");
      var cnt = 15;
      $.ajax(api + '/gts', {
        data: {
          'sid': options.spcId,
          'tp': options.tp,
          'page': 1,
          'ctgy': options.cgry,
          'htg': options.htg,
          'cnt': cnt,
          'kwd': options.kwd,
          'pc': 0,
          'auth': $this.getShIntr(),
          'usr': $this.getLoggedInUsr(),
          'usr2': options.usr2,
          'type': options.tl_tp,
          'scat': options.scat,
          'sdt': options.sdt,
          'edt': options.edt
        },
        dataType: 'json',
        async: true,
        type: 'post',
        success: function (data) {
          if (data != null)
          {
            data = data.msg;
            var d = 0;
            var lvblg = 1;
            while (d < data.length)
            {
              var nws = data[d];
              if (!nws.D_Content)
              {
                if (nws.P_Id == '')
                  nws.P_Id = "tmp" + Math.floor(new Date().getTime() / 1000);
              }
              $this.append(buildStryTl(nws, options.isSpc));
              $this.chkPrfPic((nws['D_ID'] != undefined ? $("body").data("bunme") : nws.P_Author), (nws.P_Id ? nws.P_Id : nws.D_ID));
              if (!isMobile())
                setPosition($this.find('.nws-tl:last'), $this);
              else
                $this.find('.nws-tl:last').addClass('in');
              d++;

              if (nws.P_Id == "wb2b8bdbf4920d4569fb3935628a4bdd3") //wishbery static tile
                bruteForceWb();
            }
            $this.find('.rdltr , .actn-btn').tooltip();
          }
        },
        complete: function () {
          $this.find('> .loading').remove();
          if (!$this.find('.nws-tl').length)
          {
            if (options.tl_tp == 'P' || options.htg != null)
              $("#rltd-bx").removeClass("hideElement");
            else {
              var msg = '';
              switch (options.cgry)
              {
                case 'R':
                  msg = "You are an avid reader. You have marked nothing to read later.";
                  break;
                case 'U':
                  msg = "You don't have any story waiting for moderators approval."
                  break;
                case 'M':
                  msg = "You don't have any stories.";
                  break;
                case 'I':
                  msg = "You don't have any stories.";
                  break;
                case 'F':
                  msg = "You got to have something as your favorite! Pick them up so that we can show them here.";
                  break;
                case 'D':
                  msg = "You don't have any drafts.";
                  break;
                case 'MA':
                  msg = "You don't have any story assigned to Moderate.";
                  break;
                case 'MU':
                  msg = "You don't have any stories to Moderate.";
                  break;
                case 'Articles':
                  msg = "No stories found.";
                  break;
                case 'politics':
                case 'technology':
                case 'sports':
                case 'entertainment':
                default:
                  msg = "We couldn't find any stories.";
                  break;
              }
              if (!$this.find("#page" + variables.nxpg).length)
                $this.append("<div id='page" + variables.nxpg + "'><div class='msg'>" + msg + "</div></div>");
            }
          }
          if ($this.parent().find('.end').length || $this.siblings('.end').length)
          {
            var lstTl = $this.find('.nws-tl:last');
            $this.siblings('.end').removeClass('hideElement').css('top', (parseInt(lstTl.css('top')) + $this.find('.nws-tl:last').outerHeight()) + 'px');
          }
          scaleImages($this);
          if ($this.attr("id") == "srch-tls")
            $("#srch-rslt").find(".frame").enableSlider();
        }
      });
    },
    ldSpcLst: function (dt) {
      var $this = $(this);
      $.ajax(api + '/gsu', {
        data: dt,
        dataType: 'json',
        async: true,
        type: 'post',
        success: function (data) {
          data = data.msg;
          var d = 0;
          if (data.length == 0) {
            if (dt.tp == "c" && $("#usr-pg").find(".msg").length == 0 && $("#usr-pg").find(".nws-tl").length == 0)
              $("#usr-pg").append("<div class='msg'>No Created Spaces Found</div>");
            else if (dt.tp == "c" && $("#usr-pg").find(".msg").length == 0)
              $("#usr-pg").append("<div class='msg'>No More Created Spaces Found</div>");
            else if (dt.tp == "f" && $("#usr-pg").find(".msg").length == 0 && $("#usr-pg").find(".nws-tl").length == 0)
              $("#usr-pg").append("<div class='msg'>No More Following Spaces Found</div>");
            else if (dt.tp == "f" && $("#usr-pg").find(".msg").length == 0)
              $("#usr-pg").append("<div class='msg'>No Following Spaces Found</div>");
            var msgTrgt = $("#usr-pg").find(".msg");
            var top = msgTrgt.prev().css("top");
            top = parseInt(top.replace("px", "")) + 500;
            top = top + "px";
            msgTrgt.css({"position": "absolute", "top": top});
          }
          while (d < data.length)
          {
            var nws = data[d];
            if (!nws.D_Content)
            {
              if (nws.P_Id == '')
                nws.P_Id = "tmp" + Math.floor(new Date().getTime() / 1000);
            }
            $this.append(buildStryTl(nws));
            $this.chkPrfPic((nws['D_ID'] != undefined ? $("body").data("bunme") : nws.P_Author), nws.P_Id);

            if (!isMobile())
              setPosition($this.find('.nws-tl:last'), $this);
            else
              $this.find('.nws-tl:last').addClass('in');
            d++;
          }
          // console.log(d);
        }
      });
    },
    updateTime: function (options) {
      if (options != undefined)
        var ts = options.ts;
      else
        var ts = $(this).attr('tmsp');
      var tmsp = new Date(ts * 1000);
      var td = new Date();
      var diff = Math.floor((td.getTime() - tmsp.getTime()) / 1000);
      var month = new Array();
      month[0] = "Jan";
      month[1] = "Feb";
      month[2] = "Mar";
      month[3] = "Apr";
      month[4] = "May";
      month[5] = "Jun";
      month[6] = "Jul";
      month[7] = "Aug";
      month[8] = "Sep";
      month[9] = "Oct";
      month[10] = "Nov";
      month[11] = "Dec";

      if (diff < 60)
        $(this).text('A few sec ago');
      else if (diff >= 60 && diff < 3600)
      {
        var tmp = Math.floor(diff / 60);
        if (tmp == 1)
          $(this).text('A min ago');
        else
          $(this).text(tmp + 'min ago');
      }
      else if (diff >= 3600 && diff < 86400)
      {
        var tmp = Math.floor(diff / (60 * 60))
        if (tmp == 1)
          $(this).text('An hr ago');
        else
          $(this).text(tmp + 'hrs ago');
      }
      else if (diff >= 86400 && diff < 2592000)
      {
        var tmp = Math.floor(diff / (60 * 60 * 24));
        if (tmp == 1)
          $(this).text('A day ago');
        else
          $(this).text(tmp + 'days ago');
      }
      else
      {
        $(this).text(month[tmsp.getMonth()] + " " + tmsp.getDate() + ", " + tmsp.getFullYear());
      }
    },
    chkVrfd: function () {
      if ($('#user-navigation').length)
      {
        if ($('#user-navigation').data('vfd') != 1)
        {
          $('#sts-msg').showStatus('You need to verify your account before posting anything! <span id="rsnd-eml" class="row-fluid"><a href="#" class="block bdr rsnd-eml ref">Resend Verification email</a>' +
                  '<a href="/settings" class="block bdr ref">Go to settings page</a></span>', 'err');
          return 0;
        }
        else
          return 1;
      }
      else if ($(this).hasClass('skp-lgn'))
        return 1;
      else
        $(this).showLgnPopup(1);
    },
    showLgnPopup: function (askLgn, size) {
      if ($('#pop-prw').find('#lgn-frm').length)
      {
        $('#pop-prw > section').showPopup(size);
        if (askLgn)
          $('#pop-prw').find('.err-msg').text('You need to login to perform this action');
      }
      else
      {
        $.ajax({
          url: $('body').data('api') + '/gtf',
          type: 'post',
          data: {
            'id': 'lgn',
            'ref': window.location.href
          },
          success: function (data) {
            data = JSON.parse(data);
            $('#pop-prw > section').html(data['frm']).showPopup(size);
            if (askLgn)
              $('#pop-prw').find('.err-msg').text('You need to login for that');
          }
        });
      }
    },
    chkExtLgn: function (clk) {
      var $this = $(this);
      var win = window.open($("body").data("auth") + "/extlogin", "", "width=600, height=450");
      var pollTimer = window.setInterval(function () {
        try {
          if ($this.getShIntr()) {
            window.clearInterval(pollTimer);
            win.postMessage("ChkSHLgn", $("body").data("auth"));
            if (clk == 1)
              $this.trigger("click");
            else if (clk == 2)
              $this.submit();
          }
        } catch (e) {
        }
      }, 500);
    },
    enableSlider: function () {
      var frame = $(this);
      var opt = null;
      if (frame.find('> ul').length)
      {
        opt = {
          itemNav: 'basic',
          smart: 1,
          activateOn: null,
          mouseDragging: 1,
          touchDragging: 1,
          releaseSwing: 1,
          startAt: 0,
          scrollBar: frame.siblings('.scrollbar'),
          scrollBy: 1,
          speed: 300,
          elasticBounds: 1,
          easeing: 'easeOutExpo',
          dragHandle: 1,
          dynamicHandle: 1,
          clickBar: 1
        };
      }
      else
      {
        opt = {
          speed: 300,
          scrollBar: frame.siblings('.scrollbar'),
          scrollBy: 120,
          easing: 'easeOutExpo',
          dragHandle: 1,
          dynamicHandle: 1,
          clickBar: 1,
          touchDragging: 1,
          releaseSwing: 1
        };
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        {
          opt.forward = frame.siblings('#rltd-nav-btns').find('.rltd-dwn');
          opt.backward = frame.siblings('#rltd-nav-btns').find('.rltd-up');
          opt.moveBy = 4800;
        }
      }
      var sly = new Sly(frame, opt);
      sly.init();
      if (sly.pos['start'] == sly.pos['end'])
        frame.siblings('.scrollbar').addClass('transparent').removeClass('opq');
      else
        frame.siblings('.scrollbar').removeClass('transparent').addClass('opq');
      frame.data('sly', sly);
      if (frame.parent().hasClass('tab-pane') || frame.find("#srch-tls").length)
        frame.loadOnScroll();
      else
        return sly;
    },
    loadOnScroll: function () {
      var frame = $(this);
      var sly = null;
      if (frame.data('sly'))
      {
        sly = frame.data('sly');
        sly.on('move', function () {
          var pos = sly.pos;
          var id = frame.parent().attr('id');
          if (pos['dest'] > pos['end'] * 0.9 && !variables.slyLoading)
          {
            variables.slyLoading = true;
            if (id == "srch-rslt") // in case of search 
              $('#srch-tls').addNews($("#srch-tls").data("opts"));
            else if (id != 'context' && id != 'posts')
            {
              var dt = {'tab': 'stream'};
              if ($('#cvr-img').data('info') != undefined)
                dt = {
                  'tp': 'S',
                  'id': $('#cvr-img').data('info')['id']
                };
              variables.slyLoading = !(frame.loadData(dt));
            }
            else
            {
              if (id == 'posts')
              {
                frame.loadData({
                  'tab': 'context',
                  'usr': $('#cvr-img').length ? $('#cvr-img').data('usr')['unme'] : frame.getLoggedInUsr()
                });
              }
              else
              {
                var adt = $('.edtr').data('desc');
                var data = {
                  'tab': 'context',
                  'tp': 'H',
                  'htg': frame.parent().data('htg'),
                  'id': adt.id
                };
                if ($('#article').length)
                  data.tp = 'A';
                else if ($('#event').length)
                  data.tp = 'E';
                else if ($('#ptn').length)
                  data.tp = 'P';
                frame.loadData(data);
              }
            }
          }
        });
      }
    },
    showPopup: function (size, x) {
      var $this = $(this).parent();
      $('#con-del').modal('hide'); // TO hide confirmation popups
      $('.sts-msg-bx').addClass('err');
      $this.addClass('view');
      if (size)
        $this.addClass('big');
      else
        $this.removeClass('big');
    },
    getShIntr: function () {
      var cookiesArray = document.cookie.split(';'); //Splitting bcoz there might be other cookies like piwik related
      var shIntr = '';
      for (var i = 0; i < cookiesArray.length; i++) {
        var cookieArray = cookiesArray[i].split('=');
        if (cookieArray[0].indexOf('shIntr') == 1 || cookieArray[0].indexOf('shIntr') == 0) {
          shIntr = cookieArray[1];
        }
      }
      return shIntr;
    },
    getLoggedInUsr: function (bunme) {
      if (!bunme) {
        var usrlg = $('#user-navigation').length ? $('#user-navigation').data('unme').split('::') : '';
        return usrlg.length ? usrlg[0] : 0;
      }
      var ssnUsr;
      $.ajax({
        url: '/haq',
        async: false,
        type: 'POST',
        success: function (res) {
          res = JSON.parse(res);
          if (bunme == 1)
            ssnUsr = res.BaseUserName;
          else
            ssnUsr = res.UserName;
        }
      });
      return ssnUsr ? ssnUsr : '0';
    },
    chkPrfPic: function (usr, id) {
//      var src = '/public/Multimedia/P_Pic_' + usr;
      var trgt = $(this).find('#' + id).find('.auth-bx .usr-img');
//      if ($('#user-nav').data('isLive'))
      var src = 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' + usr;
      var img = new Image();
      img.src = src;
      img.onload = function () {
        trgt.prepend('<img src="' + src + '" class="thumbholder" align="absmiddle" />');
      };
      img.onerror = function () {
        trgt.prepend('<img src="/public/images/user.png" class="thumbholder pull-left" align="absmiddle" width="40" height="40" />');
        if (id == "wb2b8bdbf4920d4569fb3935628a4bdd3") //wishberry static tile
          trgt.prepend('<img src="/public/images/wishberry-logo.png" class="thumbholder pull-left" align="absmiddle" width="40" height="40" />');
      };
      trgt.find('img:last').remove();
    },
    findPrfPic: function (icon) {
      var $this = $(this);
      var img = new Image();
      img.src = $this.attr('src');
      img.onerror = function () {
        if (icon == 1)
          $this.replaceWith("<i class=icon-profile></i>");
        else {
          $this.replaceWith('<img src="/public/images/user.png" class="'+$this.attr('class')+'">');
        }
      };
    }
  });
//Value of shIntr cookie and logged-in username to be used in api calls
  function split(val) {
    return val.split(/,\s*/);
  }
  function extractLast(term) {
    return split(term).pop().split('#').pop();
  }
  /* 
   * Functions moved in from rightpane.js
   * These are used to display article/event/quickpost related data
   */
  //For event related data in right pane
  function ldevt(data, to)
  {
    var ev = {
      auth: '',
      dt: '',
      mth: '',
      tm: '',
      lc: '',
      id: '',
      url: '',
      tag: '',
      tl: '',
      ctgy: '',
      tmsp: ''
    };
    if (isJSON(data.QP_Content))
    {
      var content = $.parseJSON(data.QP_Content);
      var link = (data.QP_Url).split("/");
      var date = $(to).getDateTime(content.date);
      ev.auth = data.QP_User;
      ev.authFullName = data.QP_User_FullName;
      ev.url = data.QP_Url;
      ev.dt = date['d'];
      ev.mth = date['m'];
      ev.tm = date.t;
      ev.lc = content.loc;
      ev.id = data.Article_Event_ID;
      ev.tmsp = data.QP_Timestamp;
      var btns = '';
      switch (data.QP_Tag)
      {
        case 'I':
          ev.tag = 'invited you to event';
          btns = "<button type='button' class='btn btn-success yes accept span7 offset1'>Accept</button><button type='button' class='btn no decline span7'>Decline</button>";
          break;
        case 'A':
          ev.tag = 'attending';
          btns = "<button type='button' class='btn btn-success yes join span8 offset4'>Join</button>";
          break;
        case 'C':
          ev.tag = 'created an event';
          btns = "<button type='button' class='btn btn-success yes join span8 offset4'>Join</button>";
          break;
        case 'CM':
          ev.tag = 'commented on event';
          btns = "<button type='button' class='btn btn-success yes join span8 offset4'>Join</button>";
          break;
        case 'CC':
          ev.tag = 'replied to comment in';
          btns = "<button type='button' class='btn btn-success yes join span8 offset4'>Join</button>";
          break;
        case '@':
          ev.tag = 'mentioned you in event';
          break;
        case '@C':
          ev.tag = 'mentioned you in comment';
          break;
        case 'N':
          ev.tag = 'sent a notification in event';
          break;
      }
      if (((to == 'stream') && (data.QP_Refer_To == '') && (data.QP_Tag == 'CC') && (variables.user == data.QP_Article_Event_Owner)) || (to == 'context' && data.QP_Tag == '@C')) {
        return 0;
      }

      if ((to == 'reactions' && data.QP_Tag == 'CM') || ((variables.user == data.QP_Article_Event_Owner)
              && (data.QP_Tag != 'CC') && (data.QP_Tag != 'N') && (data.QP_Tag != 'C') && (data.QP_Tag != '@') && (data.QP_Tag != '@C'))) {
        ev.tag = 'commented on your event';
      }
      else if (variables.user == data.QP_User && data.QP_Tag == 'CC') {
        ev.tag = 'replied to your comment in';
      }

      if ((variables.user == data.QP_Article_Event_Owner) && (data.QP_Tag == 'A')) {
        ev.tag = 'attending your event';
      }

      ev.ctgy = link[2];

      if (data.E_Attending == null) {
        ev.evtgng = 0;
      }
      else if (data.E_Attending.indexOf(',')) {
        var evtgngtmp = data.E_Attending.split(',');
        ev.evtgng = evtgngtmp.length;
      }
      else {
        ev.evtgng = 1;
      }

      var txt = content.ttl;
      if (to == 'reactions') {
        if (data.QP_Tag == '@') {
          txt = content.ttl;
        }
        else {
          txt = content.cmnt;
        }
      }
      if (data.QP_Tag == 'N') {
        var usrslst = "<p class='user-small'>" + data.QP_User_FullName + "</p>";
      }
      else {
        var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'E');
        usrslst = (usrslst != '') ? usrslst : "<p class='user-small'>" + ev.authFullName + "</p>";
      }
      var ld = "<li class='list'><div class='happening event' data=" + ev.url + ">" +
              "<a href='" + ev.url + "'>" +
              "<span class='thumb-holder img-cnt'><img src='" +
              ($('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" : "/public/Multimedia/P_Pic_") +
              ev.auth + "' /></span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + ev.tag + "</span>" +
              "<span class='ttl'>" + $(this).buildTxt(txt, 0) + "</span>" +
              "<span class='tmsp block' tmsp='" + ev.tmsp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div>" +
              "</a>" +
              "</div><hr>" +
              "</li>";
      return ld;
    }
  }

  // For published, vote up, and article related
  function ldpblsh(data, to)
  {
    var pb = {
      auth: '',
      img: '',
      id: '',
      url: '',
      tag: '',
      tl: '',
      rxn: '',
      rtg: '',
      tmsp: ''
    };
    pb.img = (data.QP_Refer_To).split(',').shift().split(':')[0];
    pb.auth = data.QP_User;
    pb.authFullName = data.QP_User_FullName;
    switch (data.QP_Tag)
    {
      case 'W':
        pb.tag = 'published a story';
        pb.img = pb.auth;
        break;
      case 'P':
        pb.tag = 'voted poll in story';
        break;
      case 'CM':
        pb.tag = 'commented on the story';
        break;
      case 'V' :
        pb.tag = 'voted up story';
        break;
      case 'CC':
        pb.tag = 'replied to comment in this story';
        break;
      case '@':
        pb.tag = 'mentioned you in the story';
        break;
      case '@C':
        pb.tag = 'mentioned you in this comment';
        break;
      case 'M':
        pb.tag = 'assigned this story to moderate';
        break;
    }
    if (isJSON(data.QP_Content))
    {
      var content = $.parseJSON(data.QP_Content);
      pb.ttl = content.ttl;
      if (data.P_Reactions)
        pb.rxn = data.P_Reactions;
      else
        pb.rxn = 0;
      if (data.P_Rating)
        pb.rtg = data.P_Rating;
      else
        pb.rtg = 0;
      pb.url = data.QP_Url;
      pb.id = data.Article_Event_ID;
      pb.tmsp = data.QP_Timestamp;

      if ((to == 'stream' && data.QP_Refer_To == '' && data.QP_Tag == 'CC' && (variables.user == data.QP_Article_Event_Owner)) || (to == 'context' && data.QP_Tag == '@C')) {
        return 0;
      }

      if ((to == 'stream') && (data.QP_Tag == 'V') && (variables.user == data.QP_Article_Event_Owner)) {
        pb.tag = 'voted up your story';
      }
      else if ((to == 'stream') && (data.QP_Tag == 'P') && (variables.user == data.QP_Article_Event_Owner)) {
        pb.tag = 'voted your poll in story';
      }
      else if ((data.QP_Tag == 'CC') && (variables.user == data.QP_User)) {
        pb.tag = 'replied to your comment in';
      }

      var txt = content.ttl; //other than comment entries
      if (to == 'reactions') {
        if (data.QP_Tag == '@C') {
          pb.tag = 'mentioned you in this comment';
        }
        else {
          pb.tag = 'commented on your story';
        }
        txt = content.cmnt; //For comment entries

        if (data.QP_Tag == '@') {
          txt = content.ttl;
        }
      }

      if (((variables.user == data.QP_Article_Event_Owner) && (data.QP_Tag != 'CC') && (data.QP_Tag != '@')
              && (data.QP_Tag != 'P') && (data.QP_Tag != 'W') && (data.QP_Tag != 'V') && (data.QP_Tag != '@C'))) {
        pb.tag = 'commented on your story';
      }
      else if (to == 'stream' && data.QP_Refer_To == '' && data.QP_Tag == 'CC') {
        pb.tag = 'replied to comment in this story';
      }

      var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'A');
      usrslst = (usrslst != '') ? usrslst : "<p class='user-small'>" + pb.authFullName + "</p>";
      var ld = "<li class='list'><div class='happening published'>" +
              "<a href='" + pb.url + "'>" +
              "<span class='thumb-holder img-cnt'><img src='" +
              ($('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" : "/public/Multimedia/P_Pic_") + pb.img + "' /></span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + pb.tag + "</span>" +
              "<span class='ttl'>" + $(this).buildTxt(txt, 0) + "</span>" +
              "<span class='tmsp block' tmsp='" + pb.tmsp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div>" +
              "</a>" +
              "</div><hr>" +
              "</li>";
      return ld;
    }
  }

  //For petition related data
  function ldptn(data)
  {
    if (isJSON(data.QP_Content))
    {
      var tag = null, usrimg = (data.QP_Refer_To).split(',').shift().split(':')[0];
      switch (data.QP_Tag)
      {
        case 'C':
          tag = 'published a petition';
          usrimg = data.QP_Article_Event_Owner;
          break;
        case 'P' :
          tag = 'voted poll in petition';
          break;
        case 'CM':
          tag = 'commented on petition';
          if (variables.user == data.QP_Article_Event_Owner)
            tag = 'commented on your petition';
          break;
        case 'CC':
          tag = 'replied to a comment in this petition';
          break;
        case '@C':
          tag = 'mentioned you in a comment';
          break;
        case 'S':
          tag = 'signed a petition';
          break;
      }
      var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'P');
      var ttl = $(this).buildTxt(JSON.parse(data['QP_Content'])['ttl'], 0);
      if (ttl.length > 58)
        ttl = ttl.substr(0, 58) + '...';
      usrslst = (usrslst != '') ? usrslst : "<p class='user-small'>" + data.QP_User_FullName + "</p>";
      var ld = "<li class='list'><div class='happening ptn' id='" + data.Article_Event_ID + "'>" +
              "<a href='" + data.QP_Url + "'>" +
              "<span class='thumb-holder img-cnt'>" +
              "<img src='" + ($('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" : "/public/Multimedia/P_Pic_") + usrimg + "' />" +
              "</span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + tag + "</span>" +
              "<span class='ttl'>" + ttl + "</span>" +
              "<span class='tmsp block' tmsp='" + data.QP_Timestamp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div></a></div><hr>" +
              "</li>";
      return ld;
    }
  }
  // Townhall related entries
  function ldtwnhl(data) {
    if (isJSON(data.QP_Content))
    {
      var tag = null;
      switch (data.QP_Tag)
      {
        case 'W':
          tag = 'hosting a townhall';
          break;
        case 'P':
          tag = 'participated in townhall';
          break;
        case 'Q':
          tag = 'asked a question in townhall';
          if (variables.user == data.QP_Article_Event_Owner)
            tag = 'asked you a question in townhall';
          break;
        case 'CM':
          tag = 'commented on an answer in townhall';
          if (variables.user == data.QP_Article_Event_Owner)
            tag = 'commented on your answer in townhall';
          break;
      }
      var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'T');
      usrslst = (usrslst != '') ? usrslst : "<span href='/" + data.QP_User + "' class='user-small'>" + data.QP_User_FullName + "</span>";
      var content = JSON.parse(data.QP_Content);
//      var link = (data.QP_Url).split("/");
      var date = $(this).getDateTime(content.date);
      var ld = "<li class='list'><div class='happening published' id='" + data.Article_Event_ID + "'>" +
              "<a href='https://townhall.saddahaq.com" + data.QP_Url + "'>" +
              "<span class='thumb-holder cal box'><span class='block mth twn'>" + date['m'] + "</span><span class='block number'>" +
              date['d'] + "</span></span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + tag + "</span>" +
              "<span class='ttl'>" + $(this).buildTxt(content['ttl'], 0) + "</span>" +
              "<span class='tmsp block' tmsp='" + data.QP_Timestamp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div></a></div><hr>" +
              "</li>";
      return ld;
    }
  }
  //Debate related entries
  function lddbt(data) {
    if (isJSON(data.QP_Content))
    {
      var tag = null;
      switch (data.QP_Tag)
      {
        case 'W':
          tag = 'started a debate';
          break;
        case 'P':
          tag = 'participated in debate';
          break;
        case 'Q':
          tag = 'asked a question in debate';
          if (variables.user == data.QP_Article_Event_Owner)
            tag = 'asked you a question in debate';
          break;
        case 'CM':
          tag = 'commented on an answer in debate';
          if (variables.user == data.QP_Article_Event_Owner)
            tag = 'commented on your answer in debate';
          break;
      }
      var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'T');
      usrslst = (usrslst != '') ? usrslst : "<span href='/" + data.QP_User + "' class='user-small'>" + data.QP_User_FullName + "</span>";
      var content = JSON.parse(data.QP_Content);
      var date = $(this).getDateTime(content.date);
      var ld = "<li class='list'><div class='happening published' id='" + data.Article_Event_ID + "'>" +
              "<a href='" + $('body').data('dbt') + data.QP_Url + "'>" +
              "<span class='thumb-holder cal box'><span class='block mth dbt'>" + date['m'] + "</span><span class='block number'>" +
              date['d'] + "</span></span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + tag + "</span>" +
              "<span class='ttl'>" + $(this).buildTxt(content['ttl'], 0) + "</span>" +
              "<span class='tmsp block' tmsp='" + data.QP_Timestamp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div></a></div><hr>" +
              "</li>";
      return ld;
    }
  }
  // For all quickposts and reactions
  function ldqp(str, to)
  {
    var rating = 0;
    if (str.QP_Rating != null)
      rating = str.QP_Rating;
    var rxns = 0;
    if (str.P_Reactions != null)
      rxns = str.P_Reactions;

    var ld = "<li class='list ";
    if (variables.user == str.QP_User)
      ld += "own";
    ld += "' id='" + str.QP_ID + "'><div class='happening posted'><span class='tmsp abs italicText' tmsp='" + str.QP_Timestamp + "'>few sec ago</span>";
    if (variables.user == str.QP_User)
    {
      ld += "<ul class='dropdown pst-stng'><a class='dropdown-toggle' data-toggle='dropdown' href='#'><i class='icon-pencil'></i></a>" +
              "<ul class='dropdown-menu pull-right'>" +
              "<li><A href='#' class='edit_qp' >Edit</li>" +
              "<li><a href='#con-del' role='btn' data-toggle='modal' class='delete_quickpost' qpid='" + str.QP_ID + "' qpuser='" + str.QP_User + "'>Delete</a></li></ul>" +
              "</ul>";
    }
    ld += "<p class='span16'>" +
            "<span class='thumb-holder'>" +
            "<span class='block'><a href='#' class='qp_rating' qpostid='" + str.QP_ID + "' qpnum='" + rating + "'><i class='icon-chevron-sign-up'></i></a></span>" +
            "<span class='block number'>" + rating + "</span><span class='block txt'>votes</span>" +
            "</span>" +
            "<span class='content'>" +
            "<a href='/" + str.QP_User + "' class='user-small'>" + str.QP_User_FullName + "</a>" +
            "<span class='italicText'>posted</span>" +
            "<span class='ttl'>" + $(this).buildTxt(str.QP_Content, 1) + "</span>" +
            "</span>" +
            "</p>" +
            "<ul class='unfold span16'>";
    //  "<li class='unfold-ul span4'><i class='icon-long-arrow-down'></i> unfold</li>"+
    "<li class='rct-display span4'>" + rxns + " Reactions</li>" +
            "<li class='rct-btn span4'><a href='#' class='react'>Reply</a></li>" +
            "</ul>" +
            "<div class='clearfix'></div></div>" +
            "<div class='response'><div class='response-holder'>" +
            "<ul class='res-list'>" +
            "<li>" +
            "<form name='quickpost-form' class='rxn quickpost-form'>" +
            "<textarea name='quickpost' class='quickpost' rows='1' placeholder='React to " + str.QP_User_FullName + "&#39;s post'></textarea>" +
            "</form>" +
            "</li>" +
            "</ul>" +
            "</div></div></li>";
    return ld;
  }

  //load space social stream 
  function ldspc(data) {
    if (isJSON(data.QP_Content))
    {
      var tag = null;
      switch (data.QP_Tag)
      {
        case 'C':
          tag = 'created a space';
          break;
        case 'CA':
          tag = 'contributed a story';
          break;
        case 'CP':
          tag = 'contributed a petition';
          break;
        case 'CE':
          tag = 'contributed an event';
          break;
        case 'F':
          tag = 'following the space';
          break;
      }
      var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'U');
      usrslst = (usrslst != '') ? usrslst : "<span href='/" + data.QP_User + "' class='user-small'>" + data.QP_User_FullName + "</span>";
      var content = JSON.parse(data.QP_Content);
      var ld = "<li class='list'><div class='happening published' id='" + data.Article_Event_ID + "'>" +
              "<a href='" + $('body').data('rd') + data.QP_Url + "'>" +
              "<span class='thumb-holder img-cnt'><img src='" +
              ($('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" :
                      "/public/Multimedia/P_Pic_") + data.QP_User + "' /></span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + tag + "</span>" +
              "<span class='ttl'>" + $(this).buildTxt(content['ttl'], 0) + "</span>" +
              "<span class='tmsp block' tmsp='" + data.QP_Timestamp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div></a></div><hr>" +
              "</li>";
      return ld;
    }
  }

  //load user related social stream 
  function ldusr(data) {
    if (isJSON(data.QP_Content))
    {
      var tag = null;
      switch (data.QP_Tag)
      {
        case 'F':
          tag = 'following ';
          data.QP_Featured_Image = data.QP_User;
          break;
      }
      var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'T');
      usrslst = (usrslst != '') ? usrslst : "<span href='/" + data.QP_User + "' class='user-small'>" + data.QP_User_FullName + "</span>";
      var content = JSON.parse(data.QP_Content);
      var ld = "<li class='list'><div class='happening published' id='" + data.Article_Event_ID + "'>" +
              "<a href='" + $('body').data('rd') + data.QP_Url + "'>" +
              "<span class='thumb-holder img-cnt usr-img'><img src='" +
              ($('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" :
                      "/public/Multimedia/P_Pic_") + data.QP_Featured_Image + "' /></span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + tag + "</span>" +
              "<span class='ttl'>" + $(this).buildTxt(content['ttl'], 0) + "</span>" +
              "<span class='tmsp block' tmsp='" + data.QP_Timestamp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div></a></div><hr>" +
              "</li>";
      return ld;
    }
  }

  function ldCmpn(data) {
    if (isJSON(data.QP_Content))
    {
      var content = JSON.parse(data.QP_Content);
      var ld = "<li class='list'>" +
              "<a href='" + data.QP_Url + "' target='_blank'>" +
              "<div class='happening cmpn' id='" + data.Article_Event_ID + "'>" +
              "<span class='tmsp abs italicText' tmsp='" + data.QP_Timestamp + "'></span>" +
              "<p class='span16'>" +
              "<span class='thumb-holder span3 img-cnt usr-img'><img src='" +
              data.QP_Featured_Image + "' /></span>" +
              "<span class='content span12'>" + "<span href='/" + data.QP_User + "' class='user-small'>" +
              data.QP_User_FullName + "</span>" +
              "<span class='italicText'>started a campaign</span>" +
              "<span class='ttl'>" + $(this).buildTxt(content['title'], 1) + "</span>" +
              "</span>" +
              "</p>" +
              "<p class='span16 cmpn-btn'><i class='icon-donate'></i> Donate</p>" +
              "<div class='clearfix'></div></div>" +
              "</a>" +
              "</li>";
      return ld;
    }
  }

  function consolidateList(tag, usrs, tp) {
    var usrslst = '';
    var tags = null;
    switch (tp)
    {
      case 'A':
        tags = ['V', 'CM', 'CC', 'P'];
        break;
      case 'P':
        tags = ['P', 'CM', 'CC', 'S'];
        break;
      case 'E':
        tags = ['V', 'CM', 'CC', 'A'];
        break;
      case 'T':
        tags = ['P', 'Q', 'CM'];
        break;
      case 'S':
        tags = ['C', 'CA', 'CP', 'CE'];
    }
    if ($.inArray(tag, tags) != -1) {
      usrs = usrs.split(',');
      var numusrs = usrs.length;
      var usr = usrs.shift().split(':');
      usrslst = "<p class='user-small'>" + usr[1] + "</p>";
      if (numusrs > 1)
      {
        var five_usrs = usrs.slice(0, 5);
        var mrlst = '';
        for (var u = 0; u < five_usrs.length; u++)
          mrlst += five_usrs[u].split(':')[1] + (u < five_usrs.length - 1 ? '<br/>' : '');
        if (numusrs > 6)
          mrlst += " and " + (numusrs - 6) + " more";
        usrslst += ' and <p class="shw-mre tltp" data-lst="' + mrlst + '" data-usr-lst=\'' + JSON.stringify(usrs) + '\'>' + (numusrs - 1) + ' more</p>';
      }
    }
    return usrslst;
  }
  $('.right-comments').on('click', '.shw-mre', function () {
    var $this = $(this);
    var usrlst = $this.data('usrLst');
    var cnt = $this.siblings("span.italicText").text();
    $.post($('body').data('api') + "/gtf",
            {
              "id": "mre",
              "tp": ($this.parents('.happening').hasClass('ptn') ? 'p' : ($this.parents('.happening').hasClass('event') ? 'e' : 's')),
              "cnt": cnt
            },
    function (d) {
      d = JSON.parse(d);
      var popup = $('#pop-prw'), imgPath;
      popup.find('> section').html(d['frm']).showPopup(0);
      if ($('#user-nav').data('isLive'))
        imgPath = "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_";
      else
        imgPath = $("body").data("auth") + "/public/Multimedia/P_Pic_";
      for (var u = 0; u < usrlst.length; u++)
      {
        var usr = usrlst[u].split(':');
        popup.find('#more').find('.slidee').append('<li class="box">' +
                '<a class="transition in" href="/' + usr[0] + '"><div class="thumb-holder img"><img src="https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' + usr[0] + '" align="absmiddle"/></div>' + usr[1] + '</a>' +
                '</li>');
      }
      popup.find('.slidee .thumb-holder img').bind('error', function () {
        $(this).parent().append('<i class="icon-profile"></i>');
        $(this).remove();
      });
      popup.find('.frame').enableSlider();
    });
  });

  function isJSON(str)
  {
    try
    {
      JSON.parse(str);
    }
    catch (e)
    {
      return false;
    }
    return true;
  }

  function ldElem(parent, options)
  {
    var str = '';
    var reqPst = 5;
    var newtab = false;
    if (variables.prevTab != options.tab)
    {
      variables.prevTab = options.tab;
      variables.prevPst = 0;
      if (options.tab == 'posts')
        reqPst = 5;
      else
        reqPst = 10;
      newtab = true;
      variables.eod = false;
    }
    else
    {
      reqPst = 5;
      variables.prevPst += reqPst;
    }
    if (!variables.eod)
    {
      var sndDt = {
        'tab': options.tab,
        'cnt': reqPst,
        'prevCnt': variables.prevPst,
        'auth': parent.getShIntr(),
        'usr': parent.getLoggedInUsr()
      };
      if (options.usr)
        sndDt.usr2 = options.usr;
      if (options.tab == 'context')
      {
        sndDt.htg = options.htg;
        if (options.tp)
        {
          sndDt.tp = options.tp;
          sndDt.id = options.id;
        }
      }
      else if (options.tp == 'S')
      {
        sndDt.tp = options.tp;
        sndDt.id = options.id;
      }
      $.ajax({
        url: api + '/rp',
        async: true,
        data: sndDt,
        dataType: 'json',
        type: 'post',
        beforeSend: function () {
        },
        success: function (data) {
          if (data != null)
          {
            if (data.length)
            {
              for (var i = 0; i < data.length; i++)
              {
                switch (data[i].QP_Type)
                {
                  case 'E' :
                    var tmp = ldevt(data[i], options.tab);
                    if (tmp != 0)
                      str += tmp;
                    break;
                  case 'A' :
                    tmp = ldpblsh(data[i], options.tab);
                    if (tmp != 0)
                      str += tmp;
                    break;
                  case 'Q' :
                    str += ldqp(data[i]);
                    break;
                  case 'P' :
                    str += ldptn(data[i]);
                    break;
                  case 'T':
                    str += ldtwnhl(data[i]);
                    break;
                  case 'D':
                    str += lddbt(data[i]);
                    break;
                  case 'S':
                    str += ldspc(data[i]);
                    break;
                  case 'U':
                    str += ldusr(data[i]);
                    break;
                  case 'CP':
                    str += ldCmpn(data[i]);
                    break;
                }
              }
            }
            else if (data.length < reqPst)
              variables.eod = true;
          }
        },
        complete: function () {
          if (newtab && variables.prevTab != 'posts')
            variables.prevPst += 5;
          var sly = parent.data('sly');
          if (str != '') {
            sly.add(str);
            var usrPicElms = $('.right-comments').find(".usr-img");
            usrPicElms.each(function () {
              $(this).find("img").findPrfPic();
            });
          }
          else
          {
//            sly.add("<li class='right-dft-msg'><p>" + (parent.find('.list').length ? "It's dead end!" : "Looks like there's no activity") + "</p></li>");
            if (!parent.find('.list').length) {
              sly.add("<li class='right-dft-msg'><p>The stream looks empty! Start following people or begin a conversation so that we can keep you updated</p><hr></li>");
              $.ajax({
                url: api + "/gfws",
                async: true,
                data: {
                  usr: $(this).getLoggedInUsr(),
                  cnt: 6,
                  pc: 0
                },
                dataType: 'json',
                type: 'post',
                success: function (d) {
                  if (d)
                  {
                    var temp, prfpic;
                    prfpic = '/public/Multimedia/P_Pic_';
                    if ($('#user-nav').data('isLive'))
                      prfpic = 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_';
                    for (var i = 0; i < d.length; i++) {
                      temp = '<li class="list"><div class="auth-bx ad-mrgn"><a href="' + ($("body").data("auth") + "/" + d[i]["uname"]) + '" class="user-small prf-img small" >\n\
                            <div class="pull-left usr-img ' + (d[i].ust == 2 ? "vusr" : "") + '"><img src = "' + (prfpic + d[i]["uname"]) + '" class="thumbholder pull-left" width="40" height="40">\n\
                            </div><a class="user-small" href="' + ($("body").data("auth") + "/" + d[i]["uname"]) + '">' + d[i]["fullname"] + '</a><a data-uname="' + d[i]['uname'] + '" class="follow btn btn-success btn-mini ad-mrgn">Follow</a></a></div><hr></li>';
                      sly.add(temp);
                      parent.find("img").findPrfPic();
                    }
                  }
                }
              });
            }
          }
          var pos = sly.pos;
          if (pos.start == pos.end)
            parent.siblings('.scrollbar').addClass('transparent');
          else
          {
            parent.siblings('.scrollbar').removeClass('transparent');
          }
          parent.find('.tmsp').each(function () {
            $(this).updateTime({
              'ts': $(this).attr('tmsp')
            });
          });
          variables.slyLoading = false;
          if (variables.prevPst < 10)
            $('.tab-content').find('.active .happening').animateElements(function () {
              parent.sly('reload');
            });
          parent.find('.tltp').tooltip();
          str = null;
        }
      });
    }
  }

  function scaleImages(parent)
  {
    parent.find('.tile-image').each(function () {
      $(this).load(function () {
        $(this).scaleImages({
          'dw': $(this).parents('div').width(),
          'dh': $(this).parents('div').height()
        });
      });
    });
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

  /* 
   * isSpc => 1 - a normal user viewing space homepage
   *       => 2 - an admin viewing space homepage
   *       => 3 - admin page
   */
  function buildStryTl(nws, isSpc)
  {
    var smry = $(this).buildTxt(nws.P_Smry);
    if (smry.split(':::').length > 1)
      smry = smry.split(':::')[1];
    else if (smry.split('::').length > 1)
      smry = smry.split('::')[1];
    var drftId = null, isDrft = (isJSON(nws.D_Content) ? 1 : 0),
            cimg_url = ($('#user-nav').data('isLive') || $('#right-bar').hasClass('prw-pg')) ? 'https://saddahaq.blob.core.windows.net/multimedia/Tile_' : '/public/Multimedia/Tile_';
    var cimg = null, href = null, prepend = null, tp = null, tag = null, subcat = null;
    if (isDrft)
    {
      drftId = nws.D_ID;
      href = '/articledraft/' + drftId;
      dt = JSON.parse(nws.D_Content);
      if (dt['cvimg']) {
        cimg = dt['cvimg'];
      }
      else
        cimg = '';
      tp = 'A';
      var dTm = $(this).getDateTime(nws.D_TimeModified);
      tag = 'On ' + dTm['d'] + ' ' + dTm['m'] + ', ' + dTm['t'];
    }
    else
    {
      var inactv = null;
      cimg = cimg_url + nws.P_Feature_Image;
      switch (nws.ev)
      {
        case 1:
          prepend = 'events/';
          tp = 'E';
          inactv = 'event';
          tag = 'created an event';
          subcat = nws.P_SubCategory.split(',')[0] + '/';
          break;
        case 2:
          prepend = 'petitions/';
          inactv = 'petition';
          tp = 'P';
          tag = 'published a petition';
          subcat = '';
          break;
        case 3:
          tp = 'T';
          tag = 'hosting a townhall';
          href = $('body').data('twn') + '/' + nws.P_Title_ID;
          cimg = 'https://saddahaq.blob.core.windows.net/multimedia/' + 'P_Pic_' + nws.P_CELEBRITY_UNAME;
          if (nws.P_MODERATOR_UNAME) {
            nws.P_Author = nws.P_MODERATOR_UNAME;
            nws.P_Author_FullName = nws.P_MODERATOR_FULLNAME;
          }
          break;
        case 4 :
          tp = 'D';
          tag = 'Started a debate';
          href = $('body').data('dbt') + '/' + nws.P_Title_ID;
          cimg = '/public/images/tile_debate.jpg';
          break;
        case 5:
          prepend = 'spaces';
          tp = 'SP';
          tag = 'created a space';
          subcat = '';
          break;
        default:
          prepend = '';
          tp = 'A';
          inactv = 'article';
          tag = 'published a story';
          subcat = nws.P_SubCategory.split(',')[0] + '/';
          break;
      }
      if (nws.ev != 3 && nws.ev != 4) {
        if (nws.P_Status == -2) {
          href = '/inactive/' + inactv + '/' + nws.P_Title_ID;
        }
        else {
          href = "/"+nws.P_Title_ID + ((nws.P_Status == 2 || nws.P_Status == 9 || nws.P_Status == 13) ? '?mod=1' : '');
        }
      }
    }

    var str = '<div class="nws-tl transition ph-vw ' + tp + '" id="' +
            (isDrft ? drftId : (nws.P_Id != null ? nws.P_Id : 'tmp' + new Date().getTime())) + '" data-tp="' + tp + '">' +
            '<section>' +
            '<div class="auth-bx">' +
            '<a href="/' + nws.P_Author + '" class="prf-img small">' +
            '<div class="pull-left usr-img ' + (nws.UST == 2 ? "vusr" : "") + '"></div>' +
            '<span class="user-small " data-href="' + nws.P_Author + '">' + nws.P_Author_FullName + '</span>' +
            '<p class="italicText">' + tag + '</p>' +
            '</a>' +
            '</div>';
    if (!isDrft)
    {
      //Commenting code as pin to profile option for user has to be enabled on his piece tile -- Venugopal
//      if (nws.ev == 0 && $('#user-nav').attr('plg') < 50)
//      {
//        str += '<a href="#" class="rdltr actn-btn transition in ' + (nws.P_IsMarkedReadLater ? 'mrkd' : '') +
//                '" data-toggle="tooltip" data-container="body" data-placement="top" data-original-title="Mark to read later"' +
//                '><i class="icon-bookmark-label"></i></a>';
//      }
//      else
//      {
      var stsFlgs = {
        "isSpc": (isSpc ? true : false),
        "rdl": nws.P_IsMarkedReadLater,
        "pnd": nws.P_Pin,
        "evt": nws.P_EventAttendStatus,
        "ptn": nws.P_PetitionSignStatus,
        "tp": nws.ev,
        "psts": nws.P_Status,
        "dcm": nws.DCM,
        "vts": nws.votes + nws.v_users.length,
        "vtd": nws.isVoted
      };
      str += '<a href="#" class="transition in actn-btn" data-flgs=\'' + JSON.stringify(stsFlgs) + '\'><i class="icon-more"></i></a>';
//      }
    }
    else
    {
      str += '<a href="#con-del" class="del-drft actn-btn" data-toggle="modal" data-container="body" data-placement="top" data-original-title="Discard draft" role="button"><i class="icon-trash-closed"></i></a>';
    }
    str += '<div class="tl-dtls">' +
            '<div class="actn-bx no-hgt box transition">' +
            '<div class="loading sml"></div>' +
            '</div>' +
            '<a href="' + href + '">' +
            '<div class="cvr-bx" style="background-image:url(' + cimg + ');">' +
            '<div class="he-bg"></div>' +
            '<div class="stry-dtls">' +
            '<div class="ttl">' +
            $(this).buildTxt((isDrft ? (dt.ttl ? dt.ttl : 'Article Draft') : nws.P_Title), 0) + '</div>';
    if (nws.ev == 0)
      str += '<div class="smry">' + ((smry.length > 100) ? smry.substr(0, 97) + '...' : smry) + '</div>';
    else if (nws.ev == 1 || nws.ev == 3 || nws.ev == 4)
    {
      var d = $(this).getDateTime(nws.P_EventStartTime);
      if (nws.ev != 1)
        str += '<div class="evt-dtls row-fluid pull-left" data-stm="' + nws.P_EventStartTime + '" data-etm="' + (parseInt(nws.P_EventStartTime) + parseInt(nws.P_EventEndTime)) + '">';
      else
        str += '<div class="evt-dtls row-fluid pull-left" data-stm="' + nws.P_EventStartTime + '" data-etm="' + nws.P_EventEndTime + '">';
      if (nws.P_EventStartTime != 0)
      {
        str += '<div class="span4">' +
                '<span class="cal box">' +
                '<span class="block mth">' + d['m'] + '</span>' +
                '<span class="block number">' + d['d'] + '</span></span>' +
                '</div>' +
                '<div class="span12 tm-lc">' +
                '<span class="block tm"><i></i>' + d['t'] + '</span>';
      }
      else
        str += '<div class="span12 tm-lc"><span class="tm block"><i></i> To be announced</span>';
      if (nws.ev == 1)
        str += '<span class="block loc"><i></i>' + (nws.P_EventLocation != '' ? nws.P_EventLocation : 'Venue to be announced') + '</span>';
      else
        str += '<p>Duration : ' + (nws.P_EventEndTime / 60) + 'mins</p>';

      str += (nws.P_EventStartTime != '' ? '</div>' : '') + '</div>' +
              '<div class="clearfix"></div>';
    }
    str += '</div></div></a>' + // End cvr-bx, stry-dtls and story link 'a'
            '<div class="dsc-bx">';
    if (!isDrft)
    {
      var dt = $(this).getDateTime(nws['P_TimeCreated']);
      str += '<p class="dt-ln">Posted in "SPACE_NAME COMES HERE" on ' + dt['m'] + ' ' + dt['d'] + '</p>';
      if (nws.v_users != undefined && nws.v_users.length > 0) {
        str += '<hr><p class="v-lst"><a class="user-small" href="/' + nws.v_users[0].UName + '">' + $.trim(nws.v_users[0].Name) + '</a>' +
                (nws.v_users[1] ? ', <a class="user-small" href="/' + nws.v_users[1].UName + '">' + $.trim(nws.v_users[1].Name) + '</a>' : '') +
                (nws.votes > 0 ? ' and <a href="#">' + nws.votes + ' other(s)</a>' : '');
        if (nws.ev == 0)
          str += ' votedup this story</p>';
        else if (nws.ev == 1)
          str += (nws.v_users.length > 1 ? ' are' : ' is') + ' attending this event';
        else if (nws.ev == 5)
          str += ' following this space';
        else
          str += ' signed this petition';
      }
      if (nws.P_Num_Comments != undefined && nws.P_Num_Comments > 0) {
        str += '<hr><p class="c-lst"><a class="user-small" href="/' + nws.Commented_Users[0].UN + '">' + nws.Commented_Users[0].FN + '</a>' +
                (nws.Commented_Users[1] ? ', <a class="user-small" href="/' + nws.Commented_Users[1].UN + '">'
                        + nws.Commented_Users[1].FN + '</a>' : '') +
                (nws.Comment_Count_Unique - 2 > 0 ? ' and <a href="#">' + (nws.Comment_Count_Unique - 2) + ' other(s)</a>' : '');
        str += ' commented on this ' + (nws.ev == 0 ? 'story' : (nws.ev == 1 ? 'event' : 'petition')) + '</p>';
      }
      str += '</div></div>';
    }
    str += '</div>' +
            '</section>' +
            '</div>';
    return str;
  }

  function setPosition($this, cntnr)
  {
    var nwstls = cntnr.find('.nws-tl');
    var i = nwstls.index($this);
    if ((i > 0 && i <= 1) && nwstls.length <= 2)
    {
      var prev = $this.prev();
      prev = prev.get(0);
      $this.css({'top': 0, 'left': $(prev).outerWidth() + parseInt(prev.style.left != '' ? prev.style.left : 0)});
    }
    else if (i > 1 || nwstls.length > 3)
    {
      var frstElm = null, scndElm = null;
      scndElm = cntnr.find('.r:last').get(0);
      frstElm = cntnr.find('.l:last').get(0);
      var frstElmTop = parseInt(frstElm.style.top != '' ? frstElm.style.top : 0);
      var frstElmBtm = (frstElmTop < 100 ? 0 : frstElmTop) + $(frstElm).outerHeight();
      var scndElmBtm = parseInt(scndElm.style.top != '' ? scndElm.style.top : 0) + $(scndElm).outerHeight();

      var pos = {};
      if (frstElmBtm < scndElmBtm)
        pos = {'top': frstElmBtm, 'left': parseInt(frstElm.style.left != '' ? frstElm.style.left : 0)};
      else
        pos = {'top': scndElmBtm, 'left': parseInt(scndElm.style.left != '' ? scndElm.style.left : 0)};

      $this.css(pos);
    }
    if (parseInt($this.get(0).style.left) == 0 || i == 0)
      $this.addClass('l');
    else if (parseInt($this.get(0).style.left) == $this.outerWidth())
      $this.addClass('r');
    $this.addClass('in');
  }
//  function setPosition3($this, cntnr)
//  {
//    var nwstls = cntnr.find('.nws-tl');
//    var i = nwstls.index($this);
//    if ((i > 0 && i <= 2) && nwstls.length <= 3)
//    {
//      var prev = $this.prev();
//      prev = prev.get(0);
//      $this.css({'top': 0, 'left': $(prev).outerWidth() + parseInt(prev.style.left != '' ? prev.style.left : 0)});
//    }
//    else if (i > 2 || nwstls.length > 3)
//    {
//      var frstElm = null, scndElm = null, thrdElm = null;
//      thrdElm = cntnr.find('.r:last').get(0);
//      scndElm = cntnr.find('.m:last').get(0);
//      frstElm = cntnr.find('.l:last').get(0);
//      var frstElmTop = parseInt(frstElm.style.top != '' ? frstElm.style.top : 0);
//      var frstElmBtm = (frstElmTop < 100 ? 0 : frstElmTop) + $(frstElm).outerHeight();
//      var scndElmBtm = parseInt(scndElm.style.top != '' ? scndElm.style.top : 0) + $(scndElm).outerHeight();
//      var thrdElmBtm = parseInt(thrdElm.style.top != '' ? thrdElm.style.top : 0) + $(thrdElm).outerHeight();
//      var pos = {};
//      if (frstElmBtm < scndElmBtm && frstElmBtm < thrdElmBtm)
//        pos = {'top': frstElmBtm, 'left': parseInt(frstElm.style.left != '' ? frstElm.style.left : 0)};
//      else if (scndElmBtm < frstElmBtm && scndElmBtm < thrdElmBtm)
//        pos = {'top': scndElmBtm, 'left': parseInt(scndElm.style.left != '' ? scndElm.style.left : 0)};
//      else if (thrdElmBtm < frstElmBtm && thrdElmBtm < scndElmBtm)
//        pos = {'top': thrdElmBtm, 'left': parseInt(thrdElm.style.left != '' ? thrdElm.style.left : 0)};
//      else if (frstElmBtm == scndElmBtm)
//      {
//        if (frstElmBtm == thrdElmBtm || thrdElmBtm > frstElmBtm)
//          pos = {'top': frstElmBtm, 'left': 0};
//        else if (thrdElmBtm < frstElmBtm)
//          pos = {'top': thrdElmBtm, 'left': thrdElm.offsetLeft};
//      }
//      else if (frstElmBtm == thrdElmBtm)
//      {
//        if (scndElmBtm == frstElmBtm || scndElmBtm > frstElmBtm)
//          pos = {'top': frstElmBtm, 'left': 0};
//        else if (scndElmBtm < frstElmBtm)
//          pos = {'top': scndElmBtm, 'left': scndElm.offsetLeft};
//      }
//      else if (scndElmBtm == thrdElmBtm)
//      {
//        if (frstElmBtm == scndElmBtm || frstElmBtm < scndElmBtm)
//          pos = {'top': frstElmBtm, 'left': 0};
//        else if (frstElmBtm > scndElmBtm)
//          pos = {'top': scndElmBtm, 'left': scndElm.offsetLeft};
//      }
//      $this.css(pos);
//    }
//    if (parseInt($this.get(0).style.left) == 0 || i == 0)
//      $this.addClass('l');
//    else if (parseInt($this.get(0).style.left) == $this.outerWidth())
//      $this.addClass('m');
//    else
//      $this.addClass('r');
//    $this.addClass('in');
//  }

  function setEndPosition($this, cntnr) {
    var thrdElm = cntnr.find('.r:last').get(0);
    var scndElm = cntnr.find('.m:last').get(0);
    var frstElm = cntnr.find('.l:last').get(0);
    $this.css('top',
            Math.max(frstElm != undefined ? (frstElm.offsetTop < 100 ? 0 : frstElm.offsetTop) + $(frstElm).outerHeight() : 0,
                    scndElm != undefined ? scndElm.offsetTop + $(scndElm).outerHeight() : 0,
                    thrdElm != undefined ? thrdElm.offsetTop + $(thrdElm).outerHeight() : 0)
            );
  }
  function ldSpcLvBlg($this, srcId)
  {
    var tmp = '<div class="nws-tl cntrbt-bx transition" id="cntrb-bx">' +
            '<section class="cntrbt">' +
            '<div class="auth-bx"></div>' +
            '<a href="#live-blog" class="nw-nt transition in actn-btn opn-lv-blg' +
            '" data-toggle="tooltip" data-container="body" data-placement="top"' +
            ' data-original-title="Drop your note here..">' +
            '<i class="icon-plus" style="font-size : 1.5714em; margin: -1px 0 0 4px;"></i></a>' +
            '<a href="#live-blog" class="opn-lv-blg">' +
            '<div class="smry"></div>' +
            '</a>' +
            '</section>' +
            '</div>';
    $this.append(tmp);
    $.post('/ajax/gtlbdt', {"pid": srcId, "cnt": "1", "tmsp": Math.floor(new Date() / 1000), "updt": 0}, function (d) {
      var trgt = $('#cntrb-bx');
      if (d == -1)
        trgt.find('.opn-lv-blg .smry').html('<p class="drp">Drop your note here</p>');
      else
      {
        d = JSON.parse(d);
        var tmp = $('<div>');
        tmp.html($this.buildTxt(d[0]['B_Content'], 1));
        var frstNode = tmp.get(0).childNodes[0];
        var usr = d[0]['B_Username'].split('::');
        trgt.find('.auth-bx').html('<a href="/' + usr[1] + '" class="user-small prf-img small"><img src="/public/Multimedia/P_Pic_' + usr[1] + '"' +
                ' class="thumbholder pull-left" align="absmiddle" width="40" height="40" />' +
                usr[0] + '<p class="italicText">dropped a note</p></a>');
        if (frstNode.nodeType == 3)
          trgt.find('.opn-lv-blg .smry').html((frstNode['data'].length > 180 ? frstNode['data'].substr(0, 176) + '...' : frstNode['data']));
        else
          trgt.find('.opn-lv-blg .smry').html('<img src="' + frstNode['src'] + '" />');
      }
    });
  }
  function isMobile() {
    if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/IEMobile/i)
            ) {
      return true;
    }
    else {
      return false;
    }
  }

  /* brute force changes for wishberry static tile in repeal-section-377 */
  function bruteForceWb() {
    var trgt = $("#wb2b8bdbf4920d4569fb3935628a4bdd3");
    if (trgt.length) {
      trgt.find(".cvr-bx").css("background-image", "url(https://saddahaq.blob.core.windows.net/multimedia/53ea4502575d2TGZ3_Header.jpg)");
      // trgt.find(".auth-bx a").attr("href", "https://www.wishberry.in/");
      trgt.find(".auth-bx p").text("Crowd funding campaign");
      trgt.find(".tl-dtls > a").attr("href", "https://www.wishberry.in/campaign/gaysi-zine/");
      trgt.find(".dt-ln").html("<br>");
      var actnCnt = '<div class="rltd-dntn transition in prphl-bx"> ' +
              '<div class="row-fluid wish-berry">' +
              ' <div class="span8 ">' +
              ' <a target="_blank" href= "https://www.wishberry.in/campaign/gaysi-zine/" class ="rltd-img-bx hidden-phone">' +
              '  <img class= "wb-dnt-img" src="https://saddahaq.blob.core.windows.net/multimedia/ThankYou.jpg"> ' +
              ' <p class="user-small">Thank You Note! <span class="block">Rs.200 / $4</span></p>' +
              '</a>' +
              '<div><span> 3 Claimed</span>' +
              '  <span class="pull-right wb-clm-btn">' +
              '   <a target="_blank" href="https://www.wishberry.in/campaign/gaysi-zine/" class="">CLAIM</a>' +
              '</span>' +
              '</div>    ' +
              '</div>' +
              ' <div class="span8 ">' +
              '  <a target="_blank" href= "https://www.wishberry.in/campaign/gaysi-zine/" class ="rltd-img-bx hidden-phone">' +
              '   <img class= "wb-dnt-img" src="https://saddahaq.blob.core.windows.net/multimedia/Cover.jpg">' +
              '  <p class="user-small">Thank You - Size Up!<span class="block">Rs.500 / 9$</span></p>' +
              '</a>' +
              ' <div><span> 10 Claimed</span>' +
              ' <span class="pull-right wb-clm-btn">' +
              '  <a target="_blank" href="https://www.wishberry.in/campaign/gaysi-zine/" class="">CLAIM</a>' +
              ' </span>' +
              ' </div>    ' +
              ' </div>' +
              '<div class="span8 ">' +
              ' <a target="_blank" href= "https://www.wishberry.in/campaign/gaysi-zine/" class ="rltd-img-bx hidden-phone">' +
              '  <img class= "wb-dnt-img" src="https://saddahaq.blob.core.windows.net/multimedia/Reward.jpg">  ' +
              ' <p class="user-small">WOW! <span class="block">Rs.3000 / 49$</span></p>' +
              '</a>' +
              '<div><span> 9 Claimed</span>' +
              ' <span class="pull-right wb-clm-btn">' +
              '  <a target="_blank" href="https://www.wishberry.in/campaign/gaysi-zine/" class="">CLAIM</a>' +
              '</span>' +
              '</div>    ' +
              '</div>' +
              '<div class="span8 ">' +
              ' <a target="_blank" href= "https://www.wishberry.in/campaign/gaysi-zine/" class ="rltd-img-bx hidden-phone">' +
              '  <img class= "wb-dnt-img" src="https://saddahaq.blob.core.windows.net/multimedia/t-shirt.jpg">      ' +
              ' <p class="user-small">We *Heart* You! <span class="block">Rs.12000 /196$</span></p>' +
              '</a>' +
              '<div><span> 3 Claimed</span>' +
              ' <span class="pull-right wb-clm-btn">' +
              '  <a target="_blank" href="https://www.wishberry.in/campaign/gaysi-zine/" class="">CLAIM</a>' +
              '</span>' +
              '</div>    ' +
              '</div>' +
              '</div>' +
              ' </div>';

      trgt.find(".actn-bx").html(actnCnt);
    }
  }
});