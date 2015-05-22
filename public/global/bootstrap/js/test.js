$(document).ready(function() {
  $('body').data({'api': 'https://testingapi.saddahaq.com', 'auth': 'https://testing.saddahaq.com'});
  loadjscssfile('/public/global/bootstrap/css/layout.css', 'css');
  loadjscssfile('/public/global/default/css/newarticle.css', 'css');
  loadjscssfile('/public/global/css/saddahaq.css', 'css');
  loadjscssfile('/public/global/bootstrap/js/custom.js', 'js');
  loadjscssfile('//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js', 'js');
  loadjscssfile('/public/global/bootstrap/js/bootstrap.min.js', 'js');
  loadjscssfile('/public/global/NicEdit/nicEdit.js', 'js');
  loadjscssfile('//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js', 'js');
  loadjscssfile('/public/global/blog/js/wysiwyg.js', 'js');
  loadjscssfile('https://apis.google.com/js/client.js', 'js');
  loadjscssfile('/public/global/blog/js/add.js', 'js');
  loadjscssfile('/public/global/bootstrap/js/sh.sly.js', 'js');
  
  $(window).load(function() {
    WebFont.load({google: {families: ['Open Sans Condensed:bold', 'Open Sans Condensed', 'Open Sans Condensed:light', 'Gentium Basic']}});
    if ($(this).getShIntr()) {
      showCms();
    }
    else
      $('#pop-prw').addClass('view').siblings('.loading').remove();
  });
  
  $("#sh-cms-write").click(function(e) {
    e.preventDefault();
    if ($(this).getShIntr()) {
      showCms();
    }
    else {
      $(this).chkExtLgn(1);  
    }
  });
  
  $(".pop-cls").click(function(e) {
    e.preventDefault();
    var $this = $(this);
    $('.sts-msg').removeClass('err');
    if ($('#progress-bar').hasClass('view'))
    {
      var pb = $('#progress-bar');
      pb.removeClass('view embd');
      $this = pb.find('div.messages');
      $this.find('.sts:first').text('');
      $this.find('.sts').not(':first').remove();
      $this.siblings('progress').attr('value', '0');
    }
    else if ($('#sts-msg').hasClass('view'))
      $('#sts-msg').removeClass('view');
    else if ($('#slde-shw-pop').hasClass('view'))
      $('#slde-shw-pop').removeClass('view');
    else
      $('#pop-prw').removeClass('view');
     $('.sts-msg-bx').removeClass('scs err img-ovrly');
  });
   /* Custom designed dropdown functionality */
  $(document).on('click', '.dd', function (e) {
    if ($(e.target).hasClass('dd') || e.target.nodeName == 'I')
    {
      $(this).find('i').toggleClass('icon-chevron-down icon-chevron-up');
      $(this).find('section').toggleClass('in');
    }
  });
  
  $(document).on('click', '.dd section li', function () {
    var chkbx = $(this).find('input[type="checkbox"]');
    chkbx.prop('checked', !chkbx.prop('checked'));
  });
  
  function showCms() {
    $("#pop-prw").removeClass("view").siblings('.loading').remove();
    $('#sh-embd-cms').find('> .row-fluid').removeClass('hideElement');
    $('#txt1').enableEditor('txt1');
    var uid = $('#sh-embd-cms').getLoggedInUsr(1);
    $.ajax({
      url: $("body").data("api") + '/up',
      data: {
        "usr2": uid
      },
      type: 'post',
      success: function(d) {
        d = JSON.parse(d);       
        if ($('#user-nav').data('isLive'))
          var img_src = "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_";
        else
          img_src = "/public/Multimedia/P_Pic_";
        var prf = $('#sh-embd-cms').find("#usr-dtls .prf-img");
        prf.find("img").attr("src", img_src+uid);
        prf.find("img").findPrfPic();
        prf.attr("href", "/" + uid).append(d["msg"]["FN"]);
       
      }
    });
  }

  function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
      var fileref = document.createElement('script');
      fileref.setAttribute("type", "text/javascript");
      fileref.setAttribute("src", filename);
    }
    else if (filetype == "css") { //if filename is an external CSS file
      var fileref = document.createElement("link");
      fileref.setAttribute("rel", "stylesheet");
      fileref.setAttribute("type", "text/css");
      fileref.setAttribute("href", filename);
    }
    if (typeof fileref != "undefined")
      document.getElementsByTagName("head")[0].appendChild(fileref);
  }

  $.fn.updateRefTag = function(elem)
  {
    var refd = '';
    var tagd = '';
    elem.find('.ref').each(function(i, e) {
      refd += $.trim($(e).attr('href').slice(1));
      if (i < elem.find('.ref').length)
        refd += '::';
    });
    elem.find('.tag').each(function(i, e) {
      tagd += $.trim($(e).text());
      if (i < elem.find('.tag').length)
        tagd += '::';
    });
    return {
      'refd': refd,
      'tagd': tagd
    };
  };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
      return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  window.fbAsyncInit = function() {
    FB.init({
      appId: '213492465468062', //'815989465078673',//213492465468062
      xfbml: true,
      cookie: true,
      version: 'v2.1'
    });
  };
});