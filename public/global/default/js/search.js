$(document).ready(function () {
  var hlpTxt = ['Try "in:stories Sachin.."', 'Try "in:events exhibit.."', 'Try "in:petitions Net neu.."', 'Try "@johanathan"', 'Try "#saddahaq"'], focusTmr = null;
  $('.search-query').attr('placeholder', hlpTxt[Math.floor(Math.random() * (hlpTxt.length))]).on('focus',
          function () {
            $this = $(this);
            focusTmr = setInterval(function () {
              $this.attr('placeholder', hlpTxt[Math.floor(Math.random() * (hlpTxt.length))]);
            }, 1500);
          });
  $('.search-query').on('blur', function () {
    clearInterval(focusTmr);
  });

  var api = $('body').data('api');
  $("#search-frm").find('.datepicker').datepicker();
  var sug = "", srch = "", lbl = "",srchLd = true, txt, srchOpts = {};

  $("#search-frm, #search-bx").on("keydown", ".search-query", function (e) {
    var $this = $(this);
    txt = $(this).val().trim();
    srchOpts = {page: 1, cnt: 15, pc: 0};
    var i, sugTags = ["in:stories ", "in:petitions ", "in:events ", "in:townhalls ",
      "in:debates ", "in:hashtags ", "in:users ", "in:spaces "];
    srch = "", sug = "", lbl = "";
//    console.log(txt, e.keyCode);
    if (txt == "" && $this.data('ui-autocomplete')) {
      $this.autocomplete("destroy");
      sug = "", lbl = "";
    }
    else if (txt.indexOf('in') == 0 && e.keyCode == 16) {
      $this.autocomplete({source: sugTags,
        select: function (e, ul) {
          lbl = ul.item.value[3];
          sug = ul.item.value[3].toUpperCase();
          if (ul.item.value == "in:spaces ")
            sug = "SP";
        }});
      $this.autocomplete("enable");
    }
    else if (e.keyCode == 9) {
      var count = 0;
      for (i = 0; i < sugTags.length; i++) {
        if (sugTags[i].indexOf(txt) == 0) {
          count++;
          sug = sugTags[i];
        }
      }
      if (count == 1) {
        $this.val(sug);
        lbl = sug;
        if (sug == "in:spaces ")
          sug = "SP";
        else if(suq == "in:stories ")
          sug = "AR";
        else
          sug = sug[3].toUpperCase();
      }
    }
    else if ((e.keyCode == 8 || e.keyCode == 46) && sug.length && txt.indexOf("in:") == -1) {
      if ($this.data('ui-autocomplete'))
        $this.autocomplete("disable");
      sug = "", lbl = "";
    }

    if (e.keyCode == 9) {
      e.preventDefault();
      return;
    }

    //in case of empty search kwd , remove the popout and empty the results section
    if (e.keyCode == 8 && (sugTags.indexOf(txt.substr(0, txt.length - 1)) != -1 || txt == '@' || txt == '#' || txt.length < 3)) {
      $("#popout").removeClass("in");
      $this.siblings(".popper").removeClass("opn");
      $("#srch-rslt").empty();
    }
    if (txt.length > 2) {
      srch = txt;
      if (txt.indexOf("in:") == 0 && sug.length) {
        if (txt.indexOf(' ') != -1)
          srch = txt.substr(txt.indexOf(lbl), txt.length).trim();
        else
          srch = "";
      }
      //case when filter is not picked from the suggestions / by pressing tab key
      else if (txt.indexOf("in:") == 0 && sug.length == 0) {
        var tmp = txt.substr(3);
        srch = "", sug = "";
        for (i = 0; i < tmp.length; i++) {
          if (tmp[i] == ' ') {
            srch = tmp.substr(i).trim();
            break;
          }
          sug += tmp[i];
        }
        lbl = sug.length ? "in:" + sug : '';
        sug = sug.length ? ((sug == "spaces") ? "SP" : sug[0].toUpperCase()) : '';
      }
      else if (txt.indexOf("#") == 0) {
        sug = 'H', lbl = "#";
        srch = txt.substr(1);
      }
      else if (txt.indexOf("@") == 0) {
        sug = 'U', lbl = "@";
        srch = txt.substr(1);
      }
    }
    if (srch.length > 1) {
      if ($this.parents("#search-bx").length && e.keyCode == 13)
        window.location = $("body").data("auth") + "/search?q=" + encodeURIComponent(txt);
      else
        showSearchResults($this, true);
    }
  });

  $("#search-frm").on("click", "a", function (e) {
    e.preventDefault();
    showSearchResults($(this).parent().siblings("input[type='text']"), true);
  });
  //to show results when redirected from search bar to search page
  if ($("#search-frm").length && $("#search-frm").find(".search-query").val().trim().length) {
    $("#search-frm").find(".search-query").trigger("keydown");
  }

  function showSearchResults($this, loadNw) {
    //if users show suggestions irrespective to search page / search in nav bar
    if (sug == "U" && loadNw) {
      $.ajax({'url': api + '/us',
        data: {'usr': srch},
        type: 'POST',
        success: function (res) {
          res = JSON.parse(res);
          if (res.success == 0) {
            $("#popout").removeClass("in");
            $this.siblings(".popper").removeClass("opn");
            return;
          }
          var imgPth = $('#user-nav').data('isLive') ? 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' : '/public/Multimedia/P_Pic_';
          if ($this.parents("#search-bx").length) {
            var htm = '';
            $.each(res.msg, function (i, v) {
              if (i == 2)
                return false;
              htm += '<a href="' + "/" + v.U + '" class="usr"><div class="pull-left icn"><img src="' +
                      imgPth + v.U + '" /></div><p>' + v.F + " " + v.L + '<span class="dft-msg block">' + '@' + v.U + '</span></p></a>';
            });
            showSuggestions(htm, $this, sug);
          }
          else {
            $("#srch-rslt").empty();
            $.each(res.msg, function (i, v) {
              $("#srch-rslt").append('<a href="' + "/" + v.U + '" class="user-small prf-img small clearfix"><div class="pull-left"><img src="' + imgPth + v.U + '" ></div>' +
                      v.F + " " + v.L + '<p class="dft-msg">' + '@' + v.U + '</p></a>');
              $("#srch-rslt").find("a:last").find("img").findPrfPic();
            });
          }
        }
      });
    }
    else if (sug == "H" && loadNw) {
      $.ajax({'url': '/ajax/gthtgsgstns',
        data: {'htg': srch},
        type: 'POST',
        dataType: 'text',
        success: function (data) {
          data = JSON.parse(data);
          if (data == -1) {
            $("#popout").removeClass("in");
            $this.siblings(".popper").removeClass("opn");
            return;
          }
          var htm = '';
          $.each(data, function (i, v) {
            if (i == 2 && $this.parents("#search-bx").length)
              return false;
            htm += '<a href="' + "/hashtag/" + v.H + '">#' + v.H + '</a>';
          });
          showSuggestions(htm, $this, sug);
        }
      });
    }
    else {
      srchOpts.page = srchOpts.page,
              srchOpts.ctgy = "search",
              srchOpts.scat = sug.length ? sug : "all",
              srchOpts.kwd = srch,
              srchOpts.dt = $("#strt-dt").val() ? Math.floor(new Date($("#strt-dt").val()).getTime() / 1000) : 0,
              srchOpts.edt = $("#end-dt").val() ? Math.floor(new Date($("#end-dt").val()).getTime() / 1000) : Math.floor(new Date().getTime() / 1000),
              srchOpts.auth = $this.getShIntr(),
              srchOpts.usr = $this.getLoggedInUsr();

      $.ajax(api + '/gts', {
        data: srchOpts,
        dataType: 'json',
        async: true,
        type: 'post',
        beforesend: function(){
          srchLd = false;  
        },
        success: function (data) {
          if (data != null)
          {
            data = data.msg;
            var htm = buildSrchRslts(data, $this);
            if ($this.parents("#search-bx").length)  // search suggestions in popout
              showSuggestions(htm, $this);
            else
            {
              if(srchOpts.page > 1)
                $("#srch-rslt").append(htm);
              else
                $("#srch-rslt").empty().html(htm);
              $('#srch-rslt').find('.src-itm .tmsp').updateTime();
            }
            srchOpts.page++;  
            if (srchOpts.page == 1)
              srchOpts.cnt = 15;
            else
              srchOpts.cnt = 6;
            srchOpts.pc = srchOpts.pc + srchOpts.cnt;
          }
          srchLd = true;
        }
      });
    }

//        $.ajax({'url': '/GETRECENTSEARCH',
//            data: {
//                'kwd': srch,
//                "usr": $this.getLoggedInUsr(),
//                "auth": $this.getShIntr(),
//                "scat": sug.length ? sug : "all",
//                'sdt': srchOpts.sdt,
//                'edt': srchOpts.edt
//            },
//            type: 'POST',
//            success: function (res) {
//                if (res.length) {
//                    var htm = "";
//                    $.each(res, function (i, v) {
//                        if (i == 4)
//                            return;
//                        htm += '<a href="/search?q=' + lbl + sug + '">' + srch + '</a>';
//                    });
//                    $("#popout").append(htm);
//                }
//            }});
  }

  function buildSrchRslts(data, $this) {
    var i = 0, nws, dt = [], prepend = '', subcat = '', htm = "";
    while (i < data.length)
    {
      if (i == 2 && $this.parents("#search-bx").length)
        break;
      dt[i] = {};
      nws = data[i];
      dt[i]['ttl'] = nws.P_Title;

      var smry = $(this).buildTxt(nws.P_Smry);
      if (smry.split(':::').length > 1)
        dt[i]['dsc'] = smry.split(':::')[1];
      else if (smry.split('::').length > 1)
        dt[i]['dsc'] = smry.split('::')[1];
      else
        dt[i]['dsc'] = smry;

      switch (nws.ev)
      {
        case 1:
          prepend = 'events/';
          subcat = nws.P_SubCategory.split(',')[0] + '/';
          var d = $this.getDateTime(nws.P_EventStartTime);
          if (nws.P_EventStartTime != 0)
            dt[i]['img'] = '<span class="thumb-holder span4 cal"><span class="mth block">' + d['m'] + '</span><span class="block number">' + d['d'] + '</span></span>';
          else
            dt[i]['img'] = '<img src="' + (($('#user-nav').data('isLive') || $('#right-bar').hasClass('prw-pg')) ? 'https://saddahaq.blob.core.windows.net/multimedia/Tile_' : '/public/Multimedia/Tile_') + nws.P_Feature_Image + '" >';
          break;
        case 2:
          prepend = 'petitions/';
          dt[i]['img'] = '<img src="https://saddahaq.blob.core.windows.net/multimedia/sign-petition.png" >';
          break;
        case 3:
          dt[i]['url'] = $('body').data('twn') + '/' + nws.P_Title_ID;
          dt[i]['img'] = '<img src="https://saddahaq.blob.core.windows.net/multimedia/' + 'P_Pic_' + nws.P_CELEBRITY_UNAME + '" >';
          break;
        case 4 :
          dt[i]['url'] = $('body').data('dbt') + '/' + nws.P_Title_ID;
          dt[i]['img'] = '<img src="/public/images/tile_debate.jpg" >';
          break;
        case 5:
          prepend = 'spaces';
          dt[i]['img'] = (nws.P_Feature_Image != '' ? '<img src="' + (($('#user-nav').data('isLive')) ? 'https://saddahaq.blob.core.windows.net/multimedia/Tile_' : '/public/Multimedia/Tile_') + nws.P_Feature_Image + '" >' : '');
          break;
        default:
          subcat = nws.P_SubCategory.split(',')[0] + '/';
          dt[i]['img'] = (nws.P_Feature_Image != '' ? '<img src="' + (($('#user-nav').data('isLive')) ? 'https://saddahaq.blob.core.windows.net/multimedia/Tile_' : '/public/Multimedia/Tile_') + nws.P_Feature_Image + '" >' : '');
          break;
      }
      if (nws.ev != 3 && nws.ev != 4)
        dt[i]['url'] = "/" + prepend + nws.P_Category.split(',')[0] + "/" + subcat + nws.P_Title_ID;
      if (!$this.parents('#search-bx').length)
      {
        htm += '<div class="src-itm">' +
                '<a href="' + dt[i]['url'] + '">' +
                '<h3 class="ttl">' + dt[i]['ttl'] + '</h3>' +
                '<p class="smry">' + dt[i]['dsc'] + '</p>' +
                '</a>' +
                '<div class="_usr-info">' +
                '<div class="usr">' +
                '<div class="icn pull-left"><img src="' + ($('#user-nav').data('isLive') ? 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' : '/public/Multimedia/P_Pic_') + nws.P_Author + '" /></div>' +
                '<p><a href="/' + nws.P_Author + '" class="user-small">' + nws.P_Author_FullName + '</a>' +
                '<span class="dft-img block">in <span class="usrnme">' +
                'Space name comes here</span> | <span class="tmsp" tmsp="' + nws.P_TimeCreated +
                '"></spa></span></p>' +
                '</div>' +
                '</div>' +
                '<hr>' +
                '</div>';
      }
      else
      {
        htm += '<a href="' + dt[i]["url"] + '"><div class="icn pull-left">' + dt[i]["img"] + '</div><p>' +
                dt[i]['ttl'] + '<span class="dft-msg block usrnme"><i class="icon-profile"></i> ' +
                nws.P_Author_FullName + '</span></p></a>';
      }
      i++;
    }
    return htm;
  }

  function showSuggestions(htm, $this, tp) {
    var pop = $this.siblings(".popout");
    if ($('#popout').hasClass('in'))
      $('#popout').find('#src-rslt').html(htm + '<a class="btm-link" href="/search?q=' + encodeURIComponent($this.val().trim()) + '">View more</a>');
    else
    {
      pop.find('> section').html(htm);
      if (pop.find("a").length > 1 && !$this.siblings(".popper").hasClass("opn"))
        $this.siblings(".popper").trigger("click");
    }
    $("#popout").find('img').each(function () {
      $(this).findPrfPic();
    });
  }

  /* Load additional tiles when the user hits the bottom of the page */
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if ($(document).height() <= ($(window).height() + scroll * 1.5) && $('#srch-rslt').length && srchLd)
      showSearchResults($("#search-frm").find(".search-query"), false);
  });
});
