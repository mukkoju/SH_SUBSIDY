$('document').ready(function () {
  //New comment
  $('#comments-box,#live-blog').on('paste', '.add-comment,.add-rxn, #blg-embd-inpt', function (e) {
    var el = this;
    var $this = $(this);
    setTimeout(function () {
      var tmpstr = $this.html();
      tmpstr = tmpstr.replace("<div>http", " <div>http");
      $this.html(tmpstr);
      var txt = $.trim($this.is("input") ? $this.val() : $this.text());
      if(txt.match(/(<iframe.*?>.*?<\/iframe>)/g)){
        $("body").append('<div id="tmp-ifm" class"hideElement" >'+txt+'</div>');
        var ifm = $("#tmp-ifm").find("iframe");
        var w = 0.9 * $("#blg-msgs").width();
        var h = (w/(ifm.attr("width")?ifm.attr("width") : ifm.css("width"))) * (ifm.attr("height") ? ifm.attr("height") : ifm.css("height")) ;
        txt = "<iframe width='100%' height = '"+Math.floor(h)+"' src='"+ifm.attr("src")+"' frameborder='0' allowfullscreen></iframe>"; 
        ifm.parents("#tmp-ifm").remove();
      }
      if (txt.match(/(<blockquote.*?>.*?<\/script>)/g) || txt.match(/(<iframe.*?>.*?<\/iframe>)/g))
      {
        $this.is("input") ? $this.val(txt) : $this.text(txt);
        $this.data({'tweet': 1,'html':txt, 'cnt_tp' : 'embed'});
      }
      else
        $this.text('').html(Checkurl(txt));
      $this.placeCaretAtEnd(el, 1);
    }, 20);
  });

  //API url
  var api = $('body').data('api');
/*  $('#live-blog').on('keydown', '.add-rxn,.edt_cmt,.add-comment', function (e) { //#comments-box,
    if ($(this).chkVrfd())
    {
      if ((e.which == 13 && !e.shiftKey) || (e.which == 32 && !$.trim($(this).text()).length))
        e.preventDefault();
    }
    else
      $(this).text('').blur();
  }); */
  /* Embed posts functionality */
  $('#live-blog').on('click', '#blg-embd', function () {
    $(this).toggleClass('active');
    $('#blg-embd-bx').toggleClass('hideElement');
  });

  $('.add-comment, #blg-embd-inpt').keyup(function (e) {
    var $this = $(this);
    if ($this.chkVrfd()) {
      if ($this.attr('id') == 'blg-embd-inpt')
        $this = $('#live-blog').find('.add-comment');
      //Check for @ reference
      if (e.which == 50)
      {
        var tmpstr = $this.html();
        tmpstr = tmpstr.replace("<div>@", " <div>@");
        $this.html(tmpstr);
        $this.placeCaretAtEnd($this.get(0), 1);
        if ($this.hasClass('ui-autocomplete-input'))
          $this.autocomplete('destroy');
        $this.getUsrSgstns();
      }
      // Check for # reference
      if (e.which == 51)
      {
        var tmpstr = $this.html();
        tmpstr = tmpstr.replace("<div>#", " <div>#");
        $this.html(tmpstr);
        $this.placeCaretAtEnd($this.get(0), 1);
        if ($this.hasClass('ui-autocomplete-input'))
          $this.autocomplete('destroy');
        $this.getHstgSgstns();
      }      
      // Check if enter key is pressed and text length is less than 140
//      else if (e.which == 13 && !e.shiftKey && $this.parents("#comment-form").length < 1)
//        addComment($this);
      else if (e.which == 8 || e.which == 46)
      {
        var refTag = $this.updateRefTag($this);
        $this.attr({
          'refd': refTag.refd,
          'tagd': refTag.tagd
        });
      }
    }
  });

  $('#comments-box').on('click', '.cmt-add', function () {
    $(this).addClass('hideElement');
    addComment($(this).siblings('.add-comment'));
  });
  $('#blg-msg-bx').on('click', '#blg-post', function () {
    $('#blg-msg-bx').find('.add-comment').html();
    addComment($('#blg-msg-bx').find('.add-comment'));
  });
  function addComment($this) {
    var text = $this.html() != $this.attr('placeholder') ? $this.html() : '';
    if ($this.data('tweet') != null)
      text = $this.data('html');
    if ($this.parent().siblings('.preview').find('img').length)
      text += $this.parent().siblings('.preview').html();
    // Disable submission of text if the user is choosing a suggestion
    if ($this.hasClass('ui-autocomplete-input'))
    {
      $this.autocomplete('destroy');
      //return false;
    }
    //return false if text is empty
    if (text == '' && $this.parents('#blg-msg-bx').find('#blg-embd-inpt').val() == '')
    {
      $this.html('');
      return false;
    }
    else
    {
      var data = $this.updateRefTag($this), adt = $('.edtr').data('desc');
      adt = (adt != undefined ? adt : $('#cvr-img').data('info'));
      var pstdt = {}, url = api + '/ncmnt', txt = $this.trimText(text), urlid = null;
      if ($this.hasClass('blog'))
      {
        pstdt = {
          "postid": adt.id
        };
        var cnt_tp = $this.data('cnt_tp') ? $this.data('cnt_tp') : "pencil" ;
        url = '/ajax/lbaddpost';
        var embdUrl = $.trim($('#blg-embd-bx input').val());
        if (!(embdUrl.match(/(<iframe.*?>.*?<\/iframe>)/g)) && !(embdUrl.match(/(<blockquote.*?>.*?<\/blockquote>)/g))) {  
          if (embdUrl.match(/(metacafe.com)/g)) {
            cnt_tp = "video";  
            urlid = embdUrl.match(/(\/watch\/([A-z0-9-_]*))/g);
            urlid = urlid[0].substring(7);
            txt += $this.trimText('<iframe src="//www.metacafe.com/embed/' + urlid + '?rel=0&wmode=transparent" width="600" height="450" allowFullScreen frameborder=0></iframe>');
          }
          else if (embdUrl.match(/(youtube.com)/g)) {
            cnt_tp = "video";
            urlid = embdUrl.match(/(v=([A-z0-9-_]*))/g);
            urlid = urlid[0].substring(2);
            txt += $this.trimText("<iframe width='694' height='380' src='//www.youtube.com/embed/" + urlid + "?rel=0&wmode=transparent' frameborder='0' allowfullscreen></iframe>");
          }
          else if (embdUrl.match(/(vimeo.com)/g)) { //regex not done because no key provided for the id. 
            cnt_tp = "video";
            urlid = $('<a>').prop('href', embdUrl).prop('pathname').split("/");
            urlid = urlid[urlid.length - 1];
            txt += $this.trimText('<iframe src="//player.vimeo.com/video/' + urlid + '?wmode=transparent" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
          }
          else if (embdUrl.match(/(twitter.com)/g)) {
            cnt_tp = "twitter";    
            urlid = embdUrl.match(/(\/status\/([A-z0-9-_])*)/g);
            urlid = urlid[0].substring(8);
            txt += $this.trimText('<blockquote class="twitter-tweet" align="center" lang="en"><a href="https://twitter.com/bhogleharsha/status/' + urlid + '?rel=0&wmode=transparent"></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>');
          }
          else if (embdUrl.match(/(vine.co)/g))
          {
            cnt_tp = "video";  
            urlid = embdUrl.match(/(\/v\/([A-z0-9-_])*)/g);
            urlid = urlid[0].substring(3);
            txt += $this.trimText('<iframe class="vine-embed" src="https://vine.co/v/' + urlid + '/embed/postcard" width="480" height="480" frameborder="0"></iframe><script async src="//platform.vine.co/static/scripts/embed.js" charset="utf-8"></script>');
          }
        }
        else
           txt += embdUrl;  
        if ($this.parent().siblings('.preview').find('img').length){
//          txt += $this.parent().siblings('.preview').html();
            cnt_tp = "picture";
        }
      }
      else
      {
        pstdt = {
          "tpauth": adt.auth,
          "tp": $this.parents('#comments-box').data('tp')
        };
      }
      pstdt.cmnt = $this.hasClass('blog') ? {"txt": txt, "tp" : cnt_tp } : txt;
      pstdt.tpid = adt.id;
      pstdt.ref = data.refd;
      pstdt.htg = data.tagd;
      pstdt.auth = $this.getShIntr();
      pstdt.usr = $this.getLoggedInUsr();
      $this.text($this.attr('placeholder')).removeAttr('refd tagd');
      $.post(url, pstdt,
              function (d) {
                $this.html('').addClass('emty');
                d = JSON.parse(d);
                if (d.success == 1 && !$this.hasClass('blog')) {
                  var utxt = $.trim($('#user-navigation').data('unme').split('::')[1]);
                  var str = "<li class='list own " + (pstdt.tp).toLowerCase() + "'><div id=" + d.msg + " class='comment row-fluid'>" +
                          "<div class='pst-stng'>" +
                          "<a href='#' class='popper'><i class='icon-pencil'></i></a>" +
                          "<div class='popout btm'>" +
                          "<ul><li><a href='#' class='edit_cmt'>Edit</a></li>" +
                          "<li><a href='#con-del' class='delete_comment' role='btn' data-toggle='modal'>Delete</a></li>" +
                          "</ul></div></div>" +
                          "<div class='cmnt-orgnl'><span class='usr-dt'>" +
                          "<a class='link user-small' href='/" + pstdt.usr + "'>" +
                          "<img src='" + (($('#user-nav').data('isLive')) ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" :
                                  "/public/Multimedia/P_Pic_") + pstdt.usr + "' />" + utxt + "</a>" +
                          "<span class='tmsp italicText abs' tmsp='" + Math.floor(new Date().getTime() / 1000) + "'>" +
                          "A few secs ago</span></span><div class='cmt'>" + $this.buildTxt(txt, 1) + "</div></div>" +
                          "<ul class='cmt-bns span16'>" +
                          "<li class='rt-bn pull-left'><a href='#' class='rt'><i class='icon-reply'></i>Reply</a></li>" +
                          "<li class='vt-up-bn pull-left'><a href='#' class='vt-up'><i class='icon-chevron-up-sign'></i></a>" +
                          "<span class='v-u-c'> 0 Vote ups</span></li>" +
                          "<li class='vt-dn-bn pull-left'><a href='#' class='vt-dn'><i class='icon-chevron-down-sign'></i></a>" +
                          "<span class='v-d-c'> 0 Vote downs</span></li>" +
                          "</ul>" +
                          "<div class='clearfix'></div>" +
                          "<div class='response'>" +
                          "<ul><li class='list'>" +
                          "<div id='rxn-box'>" +
                          "<div cmtid='" + d.msg + "' contenteditable='true' placeholder='reply to " + utxt + "\'s' class='add-rxn event span16'></div>" +
                          "</div>" +
                          "</li>" +
                          "</ul></div>" +
                          "</li>";
                  $this.parents().find('ul.comments > li:first-child').after(str);
                  $this.parents().find('ul.comments > li:first-child').next().find("img").findPrfPic();
                  $this.parents().find('.comments #' + d.msg + '  .usr-small img').findPrfPic();
//                      $this.css('height', '32px');
                  //Change color to read after adding comment in article options pane
                  $(".icon-comment").attr('class', 'icon-comment visited');
                  $("#comment-text").addClass('visited');
                }
                else
                { 
                  $('#blg-msgs').prepend(buildBlgMsg(pstdt, 0));
                  $('#blg-msgs').find(".msg").first().find(".auth img").findPrfPic();
                  $('#blg-embd-bx input').val('');
                  $this.parent().siblings('.preview').slideUp(300, function () {
                    $(this).html('<i class="sml-ldng"></i>');
                  });
                  $this.data({'tweet': null,'html': null, 'cnt_tp' : null});
                  $("#blg-embd-inpt").data({'tweet': null,'html': null, 'cnt_tp' : null});
                }
              });
      incrementReactions();
    }
  }
  $('#comments-box').on('keyup', '.edt_cmt, .edt_qp', function (e) {
    e.preventDefault();
    var $this = $(this);
    if (e.which == 50)
    {
      if ($this.hasClass('ui-autocomplete-input'))
        $this.autocomplete('destroy');
      $this.getUsrSgstns();
    }
    else if (e.which == 51)
    {
      if ($this.hasClass('ui-autocomplete-input'))
        $this.autocomplete('destroy');
      $this.getHstgSgstns();
    }
  });

  $('#comments-box').on("click", ".cmt-edt", function () {
    var $this = $(this).siblings('.edt_cmt');
    if ($.trim($this.text()) == '')
      return false;
    else
    {
      var adt = $('.edtr').data('desc'), refTags = $this.updateRefTag($this);
      $.post(api + '/ecmnt', {
        'cid': $this.parents('.comment').attr('id'),
        'cmnt': $this.trimText($this.html()),
        'tp': $('#comments-box').data('tp'),
        'ref': refTags.refd,
        'htg': refTags.tagd,
        'pid': adt.id,
        'auth': $this.getShIntr(),
        'usr': $this.getLoggedInUsr()
      },
      function (d) {
        if (d != -1)
        {
          var par = $this.parent();
          par.slideUp(300, function () {
            par.siblings('.cmt-orgnl').slideDown(300).find('.cmt').html(par.find('.edt_cmt').html());
            par.siblings('.cmt-bns').slideDown(300);
            par.siblings('.response').removeClass('no-unfold').siblings('.pst-stng');
            par.remove();
          });
        }
      });
    }
  });

  /* Reporting Spam on Comment*/
  $('.spam_cmt').on('click', function () {
    var spmcmt = null;
    spmcmt = $(this).parents('li.comment');
    var cmtid = spmcmt.attr('id');
    var msg = confirm("Are you sure, this comment has abusive content?");
    if (msg) {
      $.post('/ajax/rprtcmtabs', {
        'id': cmtid
      },
      function () {
        $('#sts-msg').showStatus("Thank you for your input. We'll look into this.", 'scs');
      }
      );
    }
    return false;
  });

  // Reply to a comment
  $('#comments-box').on('keyup', '.add-rxn', function (e) {
    var textarea = $(this);

    var id = textarea.attr("name");
    var d = new Date();
    if (e.which == 50) // && e.shiftKey
    {
      if (textarea.hasClass('ui-autocomplete-input'))
        textarea.autocomplete('destroy');
      textarea.getUsrSgstns();
    }
    else if (e.which == 51) // && e.shifyKey
    {
      if (textarea.hasClass('ui-autocomplete-input'))
        textarea.autocomplete('destroy');
      textarea.getHstgSgstns();
    }
  });
  $('#comments-box').on("click", ".cmt-rply", function () {
    var $this = $(this);
    $this.addClass("hideElement"); 
    var textarea = $(this).siblings('.add-rxn');
    var text = textarea.html();
    if (textarea.data('tweet'))
      text = textarea.text();
    if (text == '')
      return false;
    var adt = $('.edtr').data('desc');
    var data = textarea.updateRefTag(textarea);
    var pstdt = {
      "tpid": adt.id,
      "cmnt": textarea.trimText(text),
      "cpid": textarea.attr('cmtid'),
      "ref": data.refd,
      "htg": data.tagd,
      "tp": $('#comments-box').data('tp'),
      "auth": textarea.getShIntr(),
      "usr": textarea.getLoggedInUsr()
    };
    $.ajax({
      url: api + '/ncmnt',
      type: 'post',
      data : pstdt,
      success :  function(data){
        data = JSON.parse(data);
        textarea.text('').removeAttr('refd tagd').focus();
        var uname = $('#user-navigation').data('unme').split('::');
        var prfPic = new Image();
        prfPic.src = 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' + uname[0];
        var str = "<div id=" + data.msg + " class = 'comment row-fluid transition in' style='background:rgba(0,0,0,.04);'>" +
                "<ul class='dropdown pst-stng'>" +
                '<a href="#" class="popper"><i class="icon-pencil"></i></a>' +
                '<div class="popout btm in" style="top: 30px; left: -36px;"><div class="arrow" style="left: 47px;"></div>'+
                  '<ul>'+
                    '<li class="">'+
                      '<a href="#" class="edit_cmt">Edit</a>'+
                    '</li>'+
                    '<li class="hideElement">'+
                      '<a href="#" class="spam_cmt">Spam</a>'+
                    '</li>'+
                    '<li class="">'+
                      '<a href="#con-del" class="delete_comment" role="btn" data-toggle="modal">Delete</a>'+
                    '</li>'+
                  '</ul>'+
                '</div>'+
                "</ul>";
        str += "<div class='cmt-orgnl'><span class='usr-dt'><a href='/" + uname[0] + "' class='link user-small'>";
        if (prfPic.width == 0)
          str += "<i class='icon-profile'></i>";
        else
          str += "<img src='" + prfPic.src + "' />";
        str += $.trim(uname[1]) + "</a><span class='tmsp italicText abs' tmsp='" + ((new Date()).getTime() / 1000) + "'>" +
                "A few sec ago</span></span>" +
                "<span class='cmt'>" + text + "</span>" +
                "</div><ul class='cmt-bns span16'>" +
                "<li class='vt-up-bn pull-left'><a href='#' class='vt-up'><i class='icon-chevron-up-sign'></i></a>" +
                "<span class='v-u-c'>0 Vote ups</span></li>" +
                "<li class='vt-dn-bn pull-left'><a href='#' class='vt-dn'><i class='icon-chevron-down-sign'></i></a>" +
                "<span class='v-d-c'>0 Vote downs</span></li>" +
                "<li class='pull-right'><a href='#' class='shw-con'>" +
                "<i class='icon-messages'></i> Show Conversation</a></li>" +
                "</ul><div class='clearfix'></div><div class='response'></div></div>";
        textarea.parents('ul.comments').find('> li:first-child').after("<li class='list own " + pstdt['tp'].toLowerCase()
                + "'>" + str + "</li>");
  //        textarea.parents('.response').find('ul > li:last').append("<li class='list " + type + "'><div class='response-holder'>" + str + "</div></li>");
        $('html, body').scrollTop($('.comments .list').find('#' + data['msg']).offset().top - ($(window).height() / 2));
        textarea.removeAttr('disabled');
      //  textarea.blur().siblings('.txt-lmt').text('140/140').fadeOut(300);
     //   $('#comment-reactions-num' + id).html(parseInt($('#comment-reactions-num' + id).text()) + 1);
        setTimeout(function () {
          $('#' + data['msg']).removeAttr('style');
        }, 1500);
        $this.removeClass("hideElement");
      },
      error : function(){
        $this.removeClass("hideElement");  
      }
    });
    incrementReactions();
  });
  /* Increase reactions count by 1 on entry */
  function incrementReactions()
  {
    var prevReaction = parseInt($('#comment_num').html());
    $('#comment_num').html(prevReaction + 1);
  }
  /*
   * Editing comments and quickpost
   */
  $('#comments-box').on('click', '.edit_cmt', function (e) {
    e.preventDefault();
    var $this = $(this);
    $this.parents('.comment').find('.response').addClass('no-unfold');
    var org_txt = $this.parents('.comment').find('.cmt').parent();
    org_txt.siblings('.cmt-bns').slideUp(400);
    org_txt.slideUp(300, function () {
      var edtr = $('<div>');
      org_txt.after(edtr.attr({
        "class": "edt_qp_bx"
      }).append($("<div>").attr({
        "class": "edt_cmt span16 " + $this.attr('tp'),
        "contenteditable": "true",
        "style": "min-height : 90px"
      }).html($.trim(org_txt.find('.cmt').html())))
              .append('<a href="#" class="edt_cls"><i class="icon-remove"></i></a><a href="#" class="cmt-edt btn btn-success">Post</a>'));

      org_txt.find('.edt_cmt').focus();

      if (edtr.find('a.ref').length > 0)
      {
        var tmp = "";
        edtr.find('a.ref').each(function (index, e) {
          tmp += $(this).attr('href').slice(1);
          if (index != edtr.find('a.ref').length - 1)
            tmp += '::';
        });
        edtr.find('.edt_cmt').attr('refd', tmp);
      }
      $this.parents('.pst-stng').addClass('hideElement');
    });
  });

  /* Live Blog */
  var timer = '';
  $(document).on('click', 'a[href="#live-blog"], .opn-lv-blg', function (e) {
    e.preventDefault();
    getBlogData(0);
    timer = setInterval(function () {
      getBlogData(1);
    }, 30000);
  });

  $('#art-tabs a[href="#article-editor"]').click(function () {
    clearInterval(timer);
  });

  $('#sts-lst #edt-lst').click(function (e) {
    e.preventDefault();
    var $this = $(this);
    var inpts = $('#sts-lst').find('input[type="text"]');
    if ($this.hasClass('edtng'))
    {
      var dt = [];
      $('#sts-lst').find('input[type="text"]').each(function () {
        dt.push({
          "id": $(this).attr('id'),
          "val": $(this).val()
        });
        $(this).siblings('span').text($(this).val());
      });
      $.post('/ajax/tmplvbg', {
        "lst": dt
      }, function (data) {
        if (data)
        {
          inpts.css('display', 'none');
          inpts.siblings('.num').removeClass('hideElement');
          $this.text('Edit').removeClass('edtng');
        }
      });
    }
    else
    {
      inpts.siblings('.num').addClass('hideElement');
      inpts.css('display', 'block');
      $this.text('Done').addClass('edtng');
    }
  });

  function buildBlgMsg(pstdt, isAjx) {
    var dt = new Date();
    if (pstdt.cmnt){
      pstdt.B_Tmsp = Math.floor(dt.getTime() / 1000);
      var cnt_tp = (typeof pstdt.cmnt == "object") ? pstdt.cmnt.tp : "compose";  
    }
    else 
      cnt_tp = (typeof pstdt.B_Content == "object") ? pstdt.B_Content.tp : "compose";  
    var bMsg = "<div class='msg span15 ";
    var usr = [$.trim($('.auth-nme').text()), $("body").data("bunme")];
    if (pstdt.B_Username)
      usr = pstdt.B_Username.split('::');
    if (!isAjx)
      bMsg += "frcd";
    if (($('#user-nav').attr('data-is-live') == 1)) {
        var imgPth = 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' + usr[1];
    }
    else {
        imgPth = '/public/Multimedia/P_Pic_' + usr[1];
    }
    bMsg += "' id='" + pstdt['B_ID'] + "'>"+((usr[1] == $("body").data("bunme") || $("body").data("isMod")) ?
            '<a class= "del-lb" href="#con-del" role="btn" data-toggle="modal"><i class="icon-remove" title="Delete Block"></i></a>' : '')
            + "<span class='cnt-icn'><i class='icon-"+cnt_tp+"'></i></span><span class='txt span16'>" +
            '<div class="auth-bx"><a href="/'+ usr[1] +'" class="user-small prf-img small"><div class="pull-left">'+
            '<img src="'+ imgPth +'" class="thumbholder pull-left" align="absmiddle" width="40" height="40"></div>'+
             usr[0] + '<p class="tmsp italicText" tmsp="' + pstdt.B_Tmsp + '">A few sec ago</p></a></div>';
    if (pstdt.cmnt)
      bMsg += $(this).buildTxt((typeof pstdt.cmnt == "object") ? pstdt.cmnt.txt : pstdt.cmnt, 1);
    else
    {
      dt = new Date(pstdt.B_Tmsp * 1000);
      if(typeof pstdt.B_Content == "object")
        bMsg += $(this).buildTxt(pstdt.B_Content.txt, 1);  
      else
        bMsg += $(this).buildTxt(pstdt.B_Content, 1);
    }
    bMsg += "</span></div>";
    return bMsg;
  }

  function getBlogData(isAuto)
  {
    var adt = $('.edtr').data('desc');
    var blg = $('#live-blog').find('#blg-msgs');
    if ($('#cvr-img').data('info') != undefined && adt == undefined)
      adt = $('#cvr-img').data('info');
    var d = new Date();
    var data = {
      "pid": adt.id,
      "updt": isAuto
    };
    if (blg.find('.msg').length)
    {
      if (isAuto)
        data['tmsp'] = parseInt(blg.find('.msg:not(.frcd):first .tmsp').attr('tmsp')) + 1;
      else
      {
        data['tmsp'] = blg.find('.msg:last .tmsp').attr('tmsp');
        data['cnt'] = 6;
      }
    }
    else
    {
      data['tmsp'] = Math.floor(d.getTime() / 1000);
      data['cnt'] = 10;
    }
    $.ajax({
      url: '/ajax/gtlbdt',
      type: 'post',
      data: data,
      success: function (msgs) {
        msgs = JSON.parse(msgs);
        if (!isAuto)
        {
          if (msgs == -1 || msgs.length < data['cnt'])
            blg.siblings('#lv-blg-ld').addClass('hideElement');
          else
            blg.siblings('#lv-blg-ld').removeClass('hideElement');
        }
        if (msgs != '')
        {
          if (msgs.length)
          {
            blg.find('.msg.frcd').remove();
            for (var m = 0; m < msgs.length; m++)
            {
              if (isAuto)
                blg.prepend(buildBlgMsg(msgs[m], 1));
              else
                blg.append(buildBlgMsg(msgs[m], 1));

              $('#' + msgs[m]['B_ID']).find('.auth img').findPrfPic();
            }
          }
        }
      },
      complete: function () {
        blg.find('.tmsp').each(function () {
          $(this).updateTime({'ts': $(this).attr('tmsp')});
        });
      }
    });
    var url = (document.URL).split('/');
    if (url[url.length - 1] == 'india-decides-will-the-big-parties-win-or-will-aap-set-the-tone-for-2014')
    {
      $.post('/ajax/gttmplvbg', {}, function (data) {
        data = JSON.parse(data);
        for (var d = 0; d < data.length; d++)
        {
          var val = 0;
          if (data[d]['val'] != '')
            val = data[d]['val'];
          var inpt = $('#sts-lst').find('#' + data[d]['id']);
          inpt.val(val);
          inpt.siblings('.num').text(val);
        }
      });
    }
  }
  $('#lv-blg-ld').on('click', function () {
    getBlogData(0);
  });

  $('#blg-img').on('change', function () {
    var $this = $(this);
    if ($('#user-nav .usrname').length)
    {
      var allowedExt = ['image/jpeg', 'image/png', 'image/gif'];
      var file = this.files[0];
      var flag = 0;
      if ($.inArray(file['type'], allowedExt) == -1 || file['size'] > 4194304)
      {
        if (file['size'] > 4194304)
          $('#sts-msg').showStatus(file['name'] + '\'s file size is greater than 4MB', 'err');
        else
          $('#sts-msg').showStatus(file['name'] + ' has an invalid file format', 'err');
        $this.val('');
        flag = 1;
        return false;
      }

      if (!flag)
      {
        var trgt = $this.parents('#blg-msg-bx').find('.preview');
        trgt.slideDown(300);
        var fd = new FormData();
        fd.append('file', file);
        fd.append('auth', trgt.getShIntr());
        fd.append('usr', trgt.getLoggedInUsr());
        $.ajax({
          url: api + '/uimg/lb',
          type: 'post',
          data: fd,
          contentType: false,
          processData: false,
          success: function (data) {
            data = JSON.parse(data);
            //data = '<ul class="editor-options"><li><a href="#con-del" role="btn" data-toggle="modal"><i class="icon-trash-can del-img" title="Delete image"></i></a></li></ul>' + data;
            trgt.html('<img src="' + data['msg'] + '" class="img-preview" />');
            var inpt = trgt.parent().find('.add-comment');
            inpt.focus();
            if (inpt.attr('placeholder') == $.trim(inpt.text()))
              inpt.html('');
          },
          complete: function () {
            trgt.find('.img-preview').load(function () {
              $(this).fadeIn();
            });
          }
        });
      }
    }
  });
  //Comment rating vote-up
  $('#comments-box .comments').on('click', '.vt-up, .vt-dn', function () {
    var $this = $(this);
    if ($this.chkVrfd())
    {
      $this.hide();
      var adt = $('.edtr').data('desc');
      var tp = "up";
      if ($this.hasClass('vt-dn'))
        tp = "down";
      $.post(api + '/rcmnt',
              {
                "tp": $this.parents('#comments-box').data('tp'),
                "cid": $this.parents('.comment').attr('id'),
                "rtp": tp,
                'auth': $this.getShIntr(),
                'usr': $this.getLoggedInUsr()
              },
      function (d) {
        var t = JSON.parse(d);
        if (t.success == 1) {
          $this.siblings('.v-u-c, .v-d-c').addClass('voted').find('.num').text(t.msg);
          $this.parent().siblings('.vt-dn-bn, .vt-up-bn').find('a').remove();
        }
        else {
          $('#sts-msg').showStatus(t.msg, 'err');
        }
      });
    }
  });

  /* Drop down to show the responses/comments of user on clicking a particular element. 
   * Deleting .happening temporarily as unfold option is removed from right bar
   */

  $('#comments-box').on('click', '.shw-con', function (e) {
//    if ($.inArray(e.target.className, possiblCls) != -1 || $(e.target).hasClass('user-small') ||
//            $(e.target).hasClass('add-rxn') || e.target.nodeName == 'I' || $(e.target).hasClass('edt_qp') ||
//            $(e.target).parents('.comment').hasClass('tr-elm'))
//    {
//      if (!(e.target.className == 'know-more' || $(e.target).hasClass('ref') || $(e.target).hasClass('user-small')))
//      {
//        e.preventDefault();
//      }
//    }
//    else
//    {
    e.preventDefault();
    //Edited by Venu
    var $this = $(this);
    var response = $this.parents().siblings('.response');
//      if (!($this.hasClass('event') || response.hasClass('unfolded')))
//      {
//        var type = $this.attr('type');
//        var id = $this.attr('art_ev_id');
//      }
    if ($this.hasClass('actv'))
    {
      $this.parents('.comment').siblings('.tr-elm').remove();
      $this.parents('.list').css({"border-top-width": "0", "margin": "0px"});
      $this.removeClass('actv').html('<i class="icon-messages"></i> Show conversation');
    }
    else
    {
      $this.parents('.list').css({"border-top-width": "1px", "margin": "8px 0"});
      $.ajax({
        url: '/ajax/getcmttree',
        data: {
          'id': $this.parents('.comment').attr('id')
        },
        type: 'post',
        beforeSend: function () {
          //      alert("Sending data for comments list");
        },
        success: function (cmts) {
          var rootpos = 0;
          var cmts = JSON.parse(cmts);
          $.each(cmts, function (i, cmt) {
            if (cmt['id'] == $this.parents('.comment').attr('id'))
            {
              rootpos = i;
              return false;
            }
          });
          $.each(cmts, function (i, cmt) {
            if (i != rootpos)
            {
              var rtcln = $this.parents('.comment').clone();
              rtcln.attr('id', cmt.id);
              rtcln.addClass('tr-elm').find('.pst-stng,.response, .shw-con').remove();
              rtcln.find('.cmt-bns .rt-bn').remove();
              var auth = cmt['auth'].split('::');
              var prfPic = new Image();
              var usrAnchr = rtcln.find('.usr-dt a');
              if ($('#user-nav').data('isLive'))
                prfPic.src = 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' + auth[0];
              else
                prfPic.src = '/public/Multimedia/P_Pic_' + auth[0];

              if (prfPic.width == 0)
              {
                usrAnchr.find('img').remove();
                usrAnchr.attr('href', '/' + auth[0]).html('<i class="icon-profile"></i>' + auth[1]);
              }
              else
                usrAnchr.attr('href', '/' + auth[0]).html('<img src="' + prfPic.src + '" /> ' + auth[1]);
              rtcln.find('.tmsp').attr('tmsp', cmt.time).updateTime();
              rtcln.find('.cmt').html($this.buildTxt(cmt.con, 1));
              if (i < rootpos)
              {
                if (i == 0)
                  $this.parents('.comment').before(rtcln);
                else
                  $this.parents('.list').find('.comment:eq(' + (i - 1) + ')').after(rtcln);
              }
              else if (i > rootpos)
              {
                $this.parents('.list').append(rtcln);
              }
            }
          });
        }
      });
      $this.addClass('actv').html('<i class="icon-messages"></i> Hide conversation');
    }
//    }
  });

  function Checkurl(text) {
    var url1 = /(^|&lt;|\s)(www\..+?\..+?)(\s|&gt;|$)/g,
            url2 = /(^|&lt;|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|$)/g;

    var html = $.trim(text);
    if (html) {
      html = html
              .replace(url1, '$1<a class="lnk" target="_blank" href="http://$2">$2</a>$3')
              .replace(url2, '$1<a class="lnk" target="_blank"  href="$2">$2</a>$5');
    }
    return html;
  }

  $('#comments-box').on("keyup", ".add-rxn,.edt_cmt,.add-comment ", function () {
    if (!$(this).hasClass('emty') && $.trim($(this).text()) != '')
      $(this).siblings('.cmt-add').removeClass('hideElement');
    else
      $(this).siblings('.cmt-add').addClass('hideElement');
  });
  
  /* Delete a block in live blog */
  var el = null; 
  $(document).on('click', '.del-lb', function (e) {
    e.preventDefault();
    el = $(this);
  });
  $('#con-del #yes').click(function () {
    if (el != null && el.hasClass('del-lb')) {
        $.ajax({
           url:"/ajax/dlbdt",
           type: "post",
           data : {
             "tpid": $(".edtr").data("desc").id,  
             "pid" : el.parents(".msg").attr("id"),
             "usr" : $(this).getLoggedInUsr(),
             "auth" : $(this).getShIntr()
           },
           success: function(res){
               res = JSON.parse(res);
               $('#sts-msg').showStatus(res.msg, (res.success == 1? 'msg': 'err'));
           }
        });
    }
  });
});
