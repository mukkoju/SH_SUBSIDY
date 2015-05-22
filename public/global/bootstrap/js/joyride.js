/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function () {
    var api = $('body').data('api');
    try{ 
        var loggedInUsr = $('body').getLoggedInUsr(); }
    catch(e){
        loggedInUsr = $('#user-navigation').data('usr').split("::")[1];
    }
    var c = (document.cookie).split(';');
    var auth = null;
    for (var i = 0; i < c.length; i++) {
      var cArr = c[i].split('=');
      if (cArr[0].indexOf('shIntr') == 1 || cArr[0].indexOf('shIntr') == 0) {
        auth = cArr[1];
      }
    }
    
    var dt = {};
    $.fn.joyRide = function (usr_tp, hlp_tp, req)
    {
        var res = {
            "RG": {
                "jr": {
                    "usr": {
                        "pps": [
                            {
                                "el": "start",
                                "ttl": "Welcome to SaddaHaq",
                                "desc": "Click next to start ride"
                            },
                            {
                                "el": ".nav-menu",
                                "ttl": "This is where the conversation happens",
                                "desc": "The questions, answers and messages from Chief Guest and Moderator.",
                                "images": "<div style='font-size: 2.2em;'><i class='icon-navicon'></i></div>"
                            },
                            {
                                "el": "#main-mnu li:nth-child(1n)",
                                "ttl": "Read all stuff Here",
                                "desc": "Type in your questions and click on \"Post\"",
                                "images": "<div style='font-size: 2.2em;'><i class='icon-add-image'></i></div>"
                            },
                            {
                                "el": "#user-navigation",
                                "ttl": "User navigation",
                                "desc": "Click here to see all the messages. You can re-\"Ask\" others.",
                                "images": "<img style='max-width: 32px;' src='/public/images/user.png'>"
                            },
                            {
                                "el": ".ri8-pn",
                                "ttl": "ACTIVITY IN YOUR NETWORK",
                                "desc": "Click here to see all the messages. You can re-\"Ask\"."
                            }
                        ]
                    }
                },
                "ss": {
                        "gst": {"content": "<div id='hlp_popup'><div id='hlp_popup'><div class='mn_hlp_bx'><div class='hlp_popup_rmv'><i class='icon-remove'></i></div><div class='warm_wlcm_itm curnt'><h1 class='intro-header intro animated'>Welcome to Townhall</h1><div class='sh_logo animated'><i class='icon-saddahaq'></i></div><ul class='th-wlcom-slde'><li class='animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/28564220-usr.png'> <p>User asks a question (or sends a message)</p></li><li class='animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/64164196-mod.png'> <p>The moderator scans the questions and clears a question at appropriate time.</p></li><li class='animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/79202274-guest.png'> <p>You receive the moderated question and can now answer it.</p></li></ul></div><div class='warm_wlcm_itm hideElement'><h1 class='intro-header animated'>How to Answer a Question</h1><p class='intro-text animated'>Underneath each question, you will see an text-box, where you can type in your response. After typing in your answer, click on \"RESPOND\" to publish the answer.</p><div class='twh_answr animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/13458704-screen.png'></div><div class='twh_answr_zoom animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/5666055-respond.png'></div></div><div class='warm_wlcm_itm hideElement'><h1 class='intro-header animated'>Post a Message to the Audience</h1><p class='intro-text animated'>If you would like to post a message to the audience, click on the \"POST A MESSAGE\" at the bottom of your screen.</p><div class='twh_answr post-msg animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/13458704-screen.png'></div><div class='post-msg-bx animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/22259-pot-msg.png'></div></div><div id='hlp-popup-navbar'><div id='progress-bar'><div id='progress-percentage'></div></div><div id='nav-buttons'><button id='nav_bck_btn' class='btn hideElement'>BACK</button><button id='nav_nxt_btn' class='btn'>NEXT</button><button id='nav_got_btn' class='btn btn-success hideElement'>Got it</button></div></div><div class='twh_answr animated'></div><div class='twh_answr_zoom animated'></div></div></div>"}
                }

            },
            "ES": {
                "jr": {
                    "usr": {
                        "pps": [
                            {
                                "el": "start",
                                "ttl": "Welcome to Story write page",
                                "desc": "Click next to start ride"
                            },
                            {
                                "el": ".slct-cvr-img",
                                "ttl": "Select cover image here",
                                "desc": "The questions, answers and messages from Chief Guest and Moderator.",
                                "images": "<div style='font-size: 2.2em;'><i class='icon-add-image'></i></div>"
                            },
                            {
                                "el": "#art-drft",
                                "ttl": "Draft your story here",
                                "desc": "Type in your questions and click on \"Post\" "
                            },
                            {
                                "el": "#art-save",
                                "ttl": "Click to publish story",
                                "desc": "Click here to see all the messages. You can re-\"Ask\" others."
                            },
                            {
                                "el": "#pstbehaf-box",
                                "ttl": "Click to publish story on behalf of someone",
                                "desc": "Click here to see all the messages. You can re-\"Ask\"."
                            }
                        ]
                    }
                },
                "ss": {
                        "gst": {"content": "<div id='hlp_popup'><div id='hlp_popup'><div class='mn_hlp_bx'><div class='hlp_popup_rmv'><i class='icon-remove'></i></div><div class='warm_wlcm_itm curnt'><h1 class='intro-header intro animated'>Welcome to Townhall</h1><div class='sh_logo animated'><i class='icon-saddahaq'></i></div><ul class='th-wlcom-slde'><li class='animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/28564220-usr.png'> <p>User asks a question (or sends a message)</p></li><li class='animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/64164196-mod.png'> <p>The moderator scans the questions and clears a question at appropriate time.</p></li><li class='animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/79202274-guest.png'> <p>You receive the moderated question and can now answer it.</p></li></ul></div><div class='warm_wlcm_itm hideElement'><h1 class='intro-header animated'>How to Answer a Question</h1><p class='intro-text animated'>Underneath each question, you will see an text-box, where you can type in your response. After typing in your answer, click on \"RESPOND\" to publish the answer.</p><div class='twh_answr animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/13458704-screen.png'></div><div class='twh_answr_zoom animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/5666055-respond.png'></div></div><div class='warm_wlcm_itm hideElement'><h1 class='intro-header animated'>Post a Message to the Audience</h1><p class='intro-text animated'>If you would like to post a message to the audience, click on the \"POST A MESSAGE\" at the bottom of your screen.</p><div class='twh_answr post-msg animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/13458704-screen.png'></div><div class='post-msg-bx animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/22259-pot-msg.png'></div></div><div id='hlp-popup-navbar'><div id='progress-bar'><div id='progress-percentage'></div></div><div id='nav-buttons'><button id='nav_bck_btn' class='btn hideElement'>BACK</button><button id='nav_nxt_btn' class='btn'>NEXT</button><button id='nav_got_btn' class='btn btn-success hideElement'>Got it</button></div></div><div class='twh_answr animated'></div><div class='twh_answr_zoom animated'></div></div></div>"}
                }

            },
            "EE": {
                "jr": {
                    "usr": {
                        "pps": [
                            {
                                "el": "start",
                                "ttl": "Welcome to EVENT write page",
                                "desc": "Click next to start ride"
                            },
                            {
                                "el": ".slct-cvr-img",
                                "ttl": "Select cover image here",
                                "desc": "The questions, answers and messages from Chief Guest and Moderator.",
                                "images": "<div style='font-size: 2.2em;'><i class='icon-add-image'></i></div>"
                            },
                            {
                                "el": "#atc",
                                "ttl": "Location of the event",
                                "desc": "Type in your questions and click on \"Post\" "
                            },
                            {
                                "el": "#dt-mth-frm",
                                "ttl": "Event Schedule here",
                                "desc": "Click here to see all the messages. You can re-\"Ask\" others."
                            },
                            {
                                "el": "#evt-save",
                                "ttl": "Click to Save Event",
                                "desc": "Click here to see all the messages. You can re-\"Ask\"."
                            },
                            {
                                "el": "#pstbehaf-box label",
                                "ttl": "Click to publish event on behalf of someone",
                                "desc": "Click here to see all the messages. You can re-\"Ask\"."
                            }
                            
                        ]
                    }
                },
                "ss": {
                        "gst": {"content": "<div id='hlp_popup'><div id='hlp_popup'><div class='mn_hlp_bx'><div class='hlp_popup_rmv'><i class='icon-remove'></i></div><div class='warm_wlcm_itm curnt'><h1 class='intro-header intro animated'>Welcome to Townhall</h1><div class='sh_logo animated'><i class='icon-saddahaq'></i></div><ul class='th-wlcom-slde'><li class='animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/28564220-usr.png'> <p>User asks a question (or sends a message)</p></li><li class='animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/64164196-mod.png'> <p>The moderator scans the questions and clears a question at appropriate time.</p></li><li class='animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/79202274-guest.png'> <p>You receive the moderated question and can now answer it.</p></li></ul></div><div class='warm_wlcm_itm hideElement'><h1 class='intro-header animated'>How to Answer a Question</h1><p class='intro-text animated'>Underneath each question, you will see an text-box, where you can type in your response. After typing in your answer, click on \"RESPOND\" to publish the answer.</p><div class='twh_answr animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/13458704-screen.png'></div><div class='twh_answr_zoom animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/5666055-respond.png'></div></div><div class='warm_wlcm_itm hideElement'><h1 class='intro-header animated'>Post a Message to the Audience</h1><p class='intro-text animated'>If you would like to post a message to the audience, click on the \"POST A MESSAGE\" at the bottom of your screen.</p><div class='twh_answr post-msg animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/13458704-screen.png'></div><div class='post-msg-bx animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/22259-pot-msg.png'></div></div><div id='hlp-popup-navbar'><div id='progress-bar'><div id='progress-percentage'></div></div><div id='nav-buttons'><button id='nav_bck_btn' class='btn hideElement'>BACK</button><button id='nav_nxt_btn' class='btn'>NEXT</button><button id='nav_got_btn' class='btn btn-success hideElement'>Got it</button></div></div><div class='twh_answr animated'></div><div class='twh_answr_zoom animated'></div></div></div>"}
                }

            },
            "EP": {
                "jr": {
                    "usr": {
                        "pps": [
                            {
                                "el": "start",
                                "ttl": "Welcome to PETITION write page",
                                "desc": "Click next to start ride"
                            },
                            {
                                "el": ".slct-cvr-img",
                                "ttl": "Select cover image here",
                                "desc": "The questions, answers and messages from Chief Guest and Moderator.",
                                "images": "<div style='font-size: 2.2em;'><i class='icon-add-image'></i></div>"
                            },
                            {
                                "el": ".ad-nw",
                                "ttl": "Add person you want to Petition",
                                "desc": "Type in your questions and click on \"Post\" "
                            },
                            {
                                "el": "#ptn-save",
                                "ttl": "Click to Save Event",
                                "desc": "Click here to see all the messages. You can re-\"Ask\"."
                            },
                            {
                                "el": "#pstbehaf-box label",
                                "ttl": "Click to publish event on behalf of someone",
                                "desc": "Click here to see all the messages. You can re-\"Ask\"."
                            }
                            
                        ]
                    }
                },
                "ss": {
                        "gst": {"content": "<div id='hlp_popup'><div id='hlp_popup'><div class='mn_hlp_bx'><div class='hlp_popup_rmv'><i class='icon-remove'></i></div><div class='warm_wlcm_itm curnt'><h1 class='intro-header intro animated'>Welcome to Townhall</h1><div class='sh_logo animated'><i class='icon-saddahaq'></i></div><ul class='th-wlcom-slde'><li class='animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/28564220-usr.png'> <p>User asks a question (or sends a message)</p></li><li class='animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/64164196-mod.png'> <p>The moderator scans the questions and clears a question at appropriate time.</p></li><li class='animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/79202274-guest.png'> <p>You receive the moderated question and can now answer it.</p></li></ul></div><div class='warm_wlcm_itm hideElement'><h1 class='intro-header animated'>How to Answer a Question</h1><p class='intro-text animated'>Underneath each question, you will see an text-box, where you can type in your response. After typing in your answer, click on \"RESPOND\" to publish the answer.</p><div class='twh_answr animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/13458704-screen.png'></div><div class='twh_answr_zoom animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/5666055-respond.png'></div></div><div class='warm_wlcm_itm hideElement'><h1 class='intro-header animated'>Post a Message to the Audience</h1><p class='intro-text animated'>If you would like to post a message to the audience, click on the \"POST A MESSAGE\" at the bottom of your screen.</p><div class='twh_answr post-msg animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/13458704-screen.png'></div><div class='post-msg-bx animated'><img src='https://saddahaq.blob.core.windows.net/multimedia/22259-pot-msg.png'></div></div><div id='hlp-popup-navbar'><div id='progress-bar'><div id='progress-percentage'></div></div><div id='nav-buttons'><button id='nav_bck_btn' class='btn hideElement'>BACK</button><button id='nav_nxt_btn' class='btn'>NEXT</button><button id='nav_got_btn' class='btn btn-success hideElement'>Got it</button></div></div><div class='twh_answr animated'></div><div class='twh_answr_zoom animated'></div></div></div>"}
                }

            }
        };
        if (hlp_tp == 'ss'){
            dt = res[$("#hlp_popup").data("pg")][hlp_tp][usr_tp];
            hlp_popup(req);
        }
        else if (hlp_tp == 'jr'){
            dt = res[$("#joy-ride").data("pg")][hlp_tp][usr_tp];
            joyRide1(req);
        }
        
    };
    
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

    function joyRide1(req) {
//        $('.hlp-lightbox').css({'display': 'block'});
//        $('html body').addClass('scrl-off');
        var popup = $('#joy-ride');
        var htm = '<div class="popovr-cntnt-imgs">';
        if (dt.pps.images != undefined) {
                htm += dt.pps.images;
        }
        htm += '</div>';
         htm += '<div class="popovr-cntnt"><h3>' + dt.pps[0].ttl + '</h3><div class"joy-ride-desc">' + dt.pps[0].desc + '</div></div><div class="arrow"></div>';
        
        htm += '<ul class="hlp_sldr_indctrs hideElement">';
        for (var i = 0; i < dt.pps.length - 1; i++) {
            if (i == 0)
                htm += '<li class="grup_nvgtn actv"></li>';
            else
                htm += '<li class="grup_nvgtn"></li>';
        }
        htm += '</ul><span class="rmv_popover"><i class="icon-remove"></i></span><div class="btn_nav"><button class="btn hideElement" id="bck_popver">BACK</button><button class="btn" id="nxt_popver">NEXT</button><button class="btn btn-success hideElement" id="got_popver">Got It</button></div></div>';
        popup.html(htm)
                .addClass('visbl start').removeClass('top btm left right').attr('data-dlog', '0');
          
        // when click got it or remove button
          $('#joy-ride').on('click', '#got_popver, .rmv_popover', function () {
            var pg = $('#joy-ride').data('pg');  
            $('.hlp-lightbox').fadeOut('slow');
            $('#joy-ride').remove();
            $('html body').removeClass('scrl-off');
            if (req == true) {
                return false;
            }
            if (isMobile())
                var md = "M";
            else
                md = 'D';
            $.ajax({
                'url': api + '/mjyrd',
                'type': 'post',
                'data': {'auth': auth, usr: loggedInUsr, tp: pg, md: md},
                success: function (res) {
                }
            });
        });
    
        // Next and back Navigation
        $('#joy-ride').on('click', '.btn_nav button', function () {
            var popup = $('#joy-ride');
            if ($(this).text() == 'NEXT')
                var dlog = popup.data('dlog') + 1;
            else if ($(this).text() == 'BACK')
                var dlog = popup.data('dlog') - 1;
            popup.find('.popovr-cntnt').html('');
            var el = $(document).find(dt.pps[dlog].el);
            el.parents().css({'z-index': '100000000'});
            popup.removeClass('start').data('dlog', dlog).find('.popovr-cntnt').append('<h3>' + dt.pps[dlog].ttl + '</h3>');
                popup.find('.popovr-cntnt').append('<p>' + dt.pps[dlog].desc + '</p>');
                if (dt.pps[dlog].images != undefined) {
                    $('.popovr-cntnt-imgs').html('');
                        $('.popovr-cntnt-imgs').append(dt.pps[dlog].images);
                } else
                    $('.popovr-cntnt-imgs').html('');
//                alert(dlog);
//                alert(dt.pps.length - 1);
            if (dlog == 2)
                popup.find('.btn_nav #bck_popver').removeClass('hideElement');
            else if (dlog == 1) {
                popup.find('.btn_nav #bck_popver').addClass('hideElement');
                $('#joy-ride').find('.hlp_sldr_indctrs').removeClass('hideElement')
            }
            else if (dlog == dt.pps.length - 1) {
                popup.find('.btn_nav #got_popver').removeClass('hideElement');
                popup.find('.btn_nav #nxt_popver').addClass('hideElement');
            }
            if (dlog < dt.pps.length - 1) {
                popup.find('.btn_nav #got_popver').addClass('hideElement');
                popup.find('.btn_nav #nxt_popver').removeClass('hideElement');
            }
            $('#joy-ride').find('.hlp_sldr_indctrs .grup_nvgtn').eq(dlog - 1).addClass('actv').siblings().removeClass('actv')
            setPosition(el);
        });

    }
    

    function setPosition($this) {
        var elTop = $this.offset().top;
        var elLeft = $this.offset().left;
        var eloutrWidth = $this.width();
        var eloutrHeight = $this.height();
        var popup = $('#joy-ride');
        if (elTop - $(window).scrollTop() < 30) {
            if (elLeft > window.outerWidth - popup.outerWidth()) {
                elTop = elTop + eloutrHeight + 10;
                elLeft = elLeft - popup.outerWidth() + eloutrWidth / 2 + 38;
                popup.removeClass('right left top').addClass('btm rght');
            } else {
                if(elLeft < 38){
                    elTop = elTop + eloutrHeight/2-14;
                    elLeft = elLeft + eloutrWidth+24;
                    popup.removeClass('top btm left').addClass('right topedge');
                }else{
                elTop = elTop + eloutrHeight + 10;
                elLeft = elLeft + eloutrWidth/2-38;
                popup.removeClass('right rght left top').addClass('btm');}
            }
        } else if (elLeft > window.outerWidth - popup.outerWidth()) {
            if (elTop > window.outerHeight - popup.outerHeight() - popup.outerHeight() / 2) {
                elTop = elTop - popup.outerHeight() - 8;
                elLeft = elLeft - popup.outerWidth() + eloutrWidth / 2 + 48;
                popup.removeClass('right btm left').addClass('top rght');
            } else {
                elTop = elTop + eloutrHeight / 2 - 38;
                elLeft = elLeft - popup.outerWidth();
                popup.removeClass('right btm top').addClass('left');
            }
        } else if (elTop > window.outerHeight - popup.outerHeight() - popup.outerHeight() / 2) {
            elTop = elTop - popup.outerHeight() - 10;
            elLeft = elLeft + eloutrWidth/2 - 20;
            popup.removeClass('right rght btm left').addClass('top');
        }
        else {
            elTop = elTop + eloutrHeight / 2 - 38;
            elLeft = elLeft + eloutrWidth + 4;
            popup.removeClass('top btm left').addClass('right');
        }
        popup.css({'top': +elTop, 'left': +elLeft}).addClass('visbl');
    };


    function hlp_popup(req) {
        $('#hlp_popup').css({'display': 'block'});
        $('.hlp-lightbox').css({'display': 'block', 'background-color': 'rgba(255, 255, 255, 0.9)'});
        $('#hlp_popup').html(dt.content);
        var prgs_wdth = $('#progress-bar').find('#progress-percentage').width();
        var prgs = $('#hlp_popup .mn_hlp_bx').find('.warm_wlcm_itm').length;
        $('#progress-bar').find('#progress-percentage').css({'width': prgs_wdth / prgs});
    
    $('#hlp_popup').on('click', '.hlp_popup_rmv, #nav_got_btn', function () {
        $('#hlp_popup').fadeOut('slow');
        $('.hlp-lightbox').fadeOut('slow');
        if(req == true){
        return false;
        }
        if(isMobile())
            var md = "M";
        else
            md = 'D';
        $.ajax({
            'url': api+'/mjyrd',
            'type': 'post',
            'data': {'auth': auth, usr: loggedInUsr, tp: $('#hlp_popup').data('pg'), md: md},
            success: function (res) {
            }
        });
    });
    }
    $('#hlp_popup').on('click', '#nav_nxt_btn', function () {
        var $this = $('#hlp_popup .mn_hlp_bx').find('.warm_wlcm_itm.curnt');
        var itms = $('#hlp_popup .mn_hlp_bx').find('.warm_wlcm_itm').length;
        var index = $this.index();
        if (index != itms) {
            $this.find('.animated').addClass('deactv');
            setTimeout(function () {
                $this.addClass('hideElement').removeClass('curnt');
                $('#hlp_popup .mn_hlp_bx').find('.warm_wlcm_itm').eq(index).removeClass('hideElement').addClass('curnt').find('.animated').removeClass('deactv');
                var itms = $('#hlp_popup .mn_hlp_bx').find('.warm_wlcm_itm').length;
                var prsnt_prgs = $('#progress-bar').find('#progress-percentage').width();
                var incrs_prgs = $('#progress-bar').width() / itms
                $('#progress-bar').find('#progress-percentage').css({'width': prsnt_prgs + incrs_prgs});
            }, 1000);
        }

        if (index == itms - 1) {
            $('#hlp_popup').find('#nav_nxt_btn').addClass('hideElement');
            $('#hlp_popup').find('#nav_got_btn').removeClass('hideElement');
        }
        if (index > 0) {
            $('#hlp_popup').find('#nav_bck_btn').removeClass('hideElement');
        }
    });

    $('#hlp_popup').on('click', '#nav_bck_btn', function () {
        var $this = $('#hlp_popup .mn_hlp_bx').find('.warm_wlcm_itm.curnt');
        var itms = $('#hlp_popup .mn_hlp_bx').find('.warm_wlcm_itm').length;
        var index = $this.index();
        if (index != 1) {
            $this.find('.animated').addClass('deactv');
            setTimeout(function () {
                $this.removeClass('curnt').addClass('hideElement');
                $('#hlp_popup .mn_hlp_bx').find('.warm_wlcm_itm').eq(index - 2).removeClass('hideElement').addClass('curnt').find('.animated').removeClass('deactv');
                var prsnt_prgs = $('#progress-bar').find('#progress-percentage').width();
                var incrs_prgs = $('#progress-bar').width() / itms
                $('#progress-bar').find('#progress-percentage').css({'width': prsnt_prgs - incrs_prgs});
            }, 1000);
        }
        if (index < 3) {
            $('#hlp_popup').find('#nav_bck_btn').addClass('hideElement');
        }
        if (index == itms) {
            $('#hlp_popup').find('#nav_got_btn').addClass('hideElement');
            $('#hlp_popup').find('#nav_nxt_btn').removeClass('hideElement');
        }
    });
});