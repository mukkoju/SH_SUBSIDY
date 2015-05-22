$(document).ready(function () {
  var url = (window.location.toString()).split('/');
  var sub = window.location.search.slice(1);
  var subArt = ['ArticleDrafts', 'UnmoderatedArticles', 'ActiveArticles', 'InactiveArticles'];
  var subEvt = ['UnmoderatedEvents', 'ActiveEvents', 'InactiveEvents'];

  if (url[4] == 'articles' || $.inArray(sub, subArt) > -1)
    $('#collapseOne').addClass('in');
  else if (url[4] == 'events' || $.inArray(sub, subEvt) > -1)
    $('#collapseTwo').addClass('in');

  /* on load graph */

  if ($("#grph-area").length)
  {
    var data = $('#usr-stats').data('grp');
    makechart(data['Graph']);
  }

  /* Code to execute when 'Last Year' in user dashboard is clicked */
  $('.lst-yr,.lst-mth,.lst-wk').click(function (e) {
    e.preventDefault();
    var $this = $(this);
    $this.addClass('active').parents('ul').find('li a').not(this).removeClass('active');
    var data = {
      'usr': url[3],
      "dur": $this.data('tmln')
    };

    var statsLst = $('#stats ul');
    var statsTbl = $('#usr-stats-tbl table tbody');
    $.ajax({
      url: '/ajax/dshbrd',
      async: true,
      data: data,
      dataType: 'json',
      type: 'post',
      beforeSend: function () {
        statsLst.find('.views,.comments,.votes').css('opacity', '0');
        statsTbl.fadeOut('300');
      },
      success: function (cb) {
        if (cb)
        {
          statsLst.find('.views').text(cb.Views);
          statsLst.find('.comments').text(cb.Comments);
          statsLst.find('.votes').text(cb.Voteups);
          statsLst.find('.views,.comments,.votes').css('opacity', '1');
          var row = statsTbl.find('tr:first').clone();
          statsTbl.find('tr').remove();
          for (var a = 0; a < cb.Articles.length; a++)
          {
            var art = cb.Articles[a];
            var frstChld = row.find('td:first-child');
            frstChld.find('.span2 img').attr('src', '/public/Multimedia/' + art.P_Feature_Image);
            frstChld.find('.span14 .ttl').text(frstChld.buildTxt(art.P_Title, 1));
            frstChld.find('.span14 .tmsp').attr('tmsp', art.P_TimeCreated).updateTime({'ts': art.P_TimeCreated});
            frstChld.find('.knw-mr').attr('href', '/' + art.P_Category + '/' + art.P_SubCategory + '/' + art.P_Title_ID);
            row.find('td p.views').text(art.P_Num_Views);
            row.find('td p.comments').text(art.P_Num_Comments);
            row.find('td p.votes').text(art.P_Num_Voteups);
            statsTbl.append(row.clone());
          }
          statsTbl.fadeIn('300');
          makechart(cb['Graph']);
        }
      }
    });
  });
  /*
   * Getting Data based on selected tab
   */
  $('#stats .tab').on('click', function (e) {
    e.preventDefault();
    $(this).parents('ul').find('.tab').removeClass('active');
    $(this).addClass('active');
    $.post('/ajax/dshbrd', {
      'usr': url[3],
      'dur': $('#sort-btns').find('li a.active').data('tmln'),
      'tp': this.dataset.type
    }, function (d) {
      d = JSON.parse(d);
      makechart(d['Graph']);
    });
  });

  function makechart(d) {
    var chartData = [];
    var columnArray, rowArray;
    var tday = new Date();
    var n = new Date(tday), nd, ndid;
    var prev_mnth = n.getMonth() + 1;
    var eachRow = {"x": ["Date", "Id"], "y": ["Value"]};
    chartData.push(eachRow);
    //alert($(".lst-mth").hasClass("active"));
    if (d)
    {
      for (var i = 0; i < d.length; i++)
      {
        eachRow = {};
        columnArray = [];
        rowArray = [];

        if ($(".lst-mth").hasClass("active") || $(".lst-wk").hasClass("active")) {
          n = $().getDateTime((tday.getTime() / 1000) - i * 86400);
          nd = n.m + " " + n.d;
          ndid = n.m + "" + n.d;
        }
        else if ($(".lst-yr").hasClass("active")) {
          // if(prev_mnth == n.getMonth()) //this done only for special case march month repeating twice
          n.setMonth(n.getMonth() - 1);
          nd = $().getMnth(n.getMonth(), 'shrt') + " " + n.getYear().toString().substring(1);
          ndid = (n.getMonth() + 1) + "" + n.getYear();
        }
        rowArray.push(nd);
        rowArray.push(ndid);
        eachRow['x'] = rowArray;

        columnArray.push(d[i]);
        eachRow['y'] = columnArray;
        chartData.push(eachRow);

      }
    }
    $("#cht1").drawChart(chartData, 'b', 800, 360, 'grph-area', "dshb");
  }
  /*
   * Loading data based on the tab selected in the left pane
   */
  $(window).load(function () {
    var url = (window.location.toString()).split('?');
    var reqData = {};
    if (url.length > 1)
    {
      switch (url[1].toLowerCase())
      {
        case 'favourites':
          reqData.cgry = 'f';
          break;
        case 'readlater':
          reqData.cgry = 'r';
          break;
        case 'articledrafts' :
          reqData.cgry = 'dad';
          break; 
        case 'unmoderatedarticles':
          reqData.cgry = 'dua';
          break;
        case 'activearticles':
          reqData.cgry = 'dma';
          break;
        case 'inactivearticles':
          reqData.cgry = 'dia';
          break;
        case 'createdspaces':
          reqData.cgry = 'spc';
          break;
        case 'followingspaces':
          reqData.cgry = 'spf';
          break;
      }
    }
    else
    {
      if ($('#lft-mnu').data('type'))  // Checking if unmoderated articles list is opened
      {
        var cgries = {'politics': 'p', 'blog': 'bl', 'technology': "t", 'sports': "s", 'cinema-and-entertainment': "et", 'human-interest': "hi",
          'history':'h', 'art-and-literature':'al', 'lifestyle': "l", 'business': "b", 'foreign-affairs': "f", 'environment': "e", 'unfeatured': "uf",
          'removedfromheadlines': "uhd"};
        var pth = url[0].split("/");
        switch ($('#lft-mnu').data('asgn'))
        {
          case 'assigned':
            reqData.cgry = 'ma';
            break;
          case 'politics':
            reqData.cgry = 'mup';
            break;
          case 'technology':
            reqData.cgry = 'mut';
            break;
          case 'sports':
            reqData.cgry = 'mus';
            break;
          case 'entertainment':
            reqData.cgry = 'mue';
            break;
          case 'humaninterest':
            reqData.cgry = 'muh';
            break;
          case 'lifestyle':
            reqData.cgry = 'mul';
            break;
          case 'business':
            reqData.cgry = 'mub';
            break;
          case 'foreignaffairs':
            reqData.cgry = 'muf';
            break;
          case 'environment':
            reqData.cgry = 'mue';
            break;
          case 'articles':
            if (pth.length > 5)
              reqData.cgry = cgries[pth[5]]; //un moderated articles
            else
              reqData.cgry = "mu";
            reqData.tl_tp = 'mu';
            reqData.tp = 'A';
            break;
          case 'petitions':
            if (pth.length > 5)
              reqData.cgry = cgries[pth[5]]; //un moderated petitions
            else
              reqData.cgry = "mu";
            reqData.tl_tp = 'mu';
            reqData.tp = 'P';
            break;
          case 'events':
            if (pth.length > 5)
              reqData.cgry = cgries[pth[5]]; //un moderated events
            else
              reqData.cgry = "mu";
            reqData.tl_tp = 'mu';
            reqData.tp = 'E';
            break;
          default :
            reqData.cgry = 'mua';
            break;
        }
      }
      else if(location.pathname == "/"+$("body").getLoggedInUsr() + "/" + "drafts")
        reqData.cgry = 'dad';
      
    }
    //infinite load on scroll  functionality implemented for spaces created or spaces following by a user  
    var pg_flw = 0;
    $(window).scroll(function(e) {
      var target = e.currentTarget,
              scrollTop = target.scrollTop || window.pageYOffset,
              scrollHeight = target.scrollHeight || document.body.scrollHeight;
      if (scrollHeight - scrollTop === $(target).innerHeight()) {
        if (reqData.cgry == "spc" || reqData.cgry == "spf")
          $('#usr-pg').ldSpcLst({"tp": reqData.cgry.charAt(2), "usr2": $('#lft-mnu').getLoggedInUsr(), 'pg': ++pg_flw});
      }
    });
    reqData.usr = $('#lft-mnu').getLoggedInUsr();
    if (reqData.cgry == "spc" || reqData.cgry == "spf")
      $('#usr-pg').ldSpcLst({"tp": reqData.cgry.charAt(2), "usr2": $('#lft-mnu').getLoggedInUsr(), 'pg':pg_flw});
    else if (reqData.cgry != undefined)
      $('#usr-pg').loadNews(reqData);

    // Add content on page scroll
    var lastScrollTop = 0;
    $(window).scroll(function () {
      if ((lastScrollTop < $(window).scrollTop()) && $(document).height() <= ($(window).height() + $(window).scrollTop() * 1.5) && $('#usr-pg').length && reqData.cgry != "spc" && reqData.cgry != "spf")
        $('#usr-pg').addNews(reqData);
      lastScrollTop = $(window).scrollTop();
    });
  });

  /* Functionality for anchors based on element selected in btn group */
  //To keep articles tab active 
  setActiveLinks($('#left-bar .btn-group .btn.active'));

  $('#left-bar').on('click', '.btn-group > .btn', function () {
    setActiveLinks($(this));
  });

  function setActiveLinks(elem)
  {
    if (elem.parents('#mod-lnks').length)
    {
      var linkTypes = ['', 'assigned', 'politics', 'technology', 'sports', 'entertainment'];
      var count = elem.parents('#mod-lnks').data('count');
      $('#left-bar .user-data li').each(function (i, e) {
        var text = $.trim(elem.find('> span').contents().filter(function () {
          return  this.nodeType === 3;
        }).text()).toLowerCase();
        var anchr = $(e).find('a');
        anchr.attr('href', '/moderator/' + text + '/' + linkTypes[i]);
        if (elem.data('tp') == 1)
        {
          if (i == 0)
            anchr.find('.pull-right').text(count.ct.unmoderatedA);
          else if (i == 1)
            anchr.find('.pull-right').text(count.act.Articles);
        }
        else if (elem.data('tp') == 2)
        {
          if (i == 0)
            anchr.find('.pull-right').text(count.ct.unmoderatedE);
          else if (i == 1)
            anchr.find('.pull-right').text(count.act.Events);
        }
        else if (elem.data('tp') == 3)
        {
          if (i == 0)
            anchr.find('.pull-right').text(count.ct.unmoderatedP);
          else if (i == 1)
            anchr.find('.pull-right').text(count.act.Petitions);
        }

      });
    }
    else
    {
      var linkTypes = ['Unmoderated', 'Active', 'Inactive'];
      var url = document.URL.toString().split('?')[0];
      if ($.trim(elem.text()) == 'Articles')
        $('#left-bar #usr-lnks li:first').removeClass('hideElement');
      else
        $('#left-bar #usr-lnks li:first').addClass('hideElement');
      var count = elem.parents('.btn-group').data('count');
      $('#left-bar #usr-lnks').find('li:gt(0)').each(function (i, e) {
        var $this = $(this);
        var anchr = $this.find('a');
        var key = "Num_" + $.trim($this.find('.pull-left').text()) + $.trim(elem.text());
        anchr.attr('href', url + '?' + linkTypes[i] + $.trim(elem.text()));
        if (count[key])
          anchr.find('.pull-right').text(count[key]);
      });
    }
  }

  //Sorting moderation content based on category selected from dropdown
  $('#srt-mdrtn').on('change', function () {
    window.location = $(this).val();
  });

  var el = null;
  $('.wrapper').on('click', '.nws-tl .del-drft', function () {
    el = $(this);
  });
  $('#con-del #yes').on('click', function () {
    if (el.hasClass('del-drft'))
    {
      $.post('/ajax/deldrft', {"id": el.parents('.nws-tl').attr('id')}, function (d) {
        switch (parseInt(d)) {
          case 1:
            $('#sts-msg').showStatus('Draft deleted successfully. Please wait while we clean it up...', 'scs');
            setTimeout(function () {
              window.location = '/' + el.getLoggedInUsr() + '/Dashboard?ArticleDrafts';
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
  });
});