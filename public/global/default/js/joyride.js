/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function () {
var dt = {};
$.fn.joyRide = function (data)
{  
//   dt = data; 
   dt = {'pps': [{'el': 'start', 'ttl': 'Welcome to saddahaq', 'desc': 'Worlds Largest Online Social Journalism Platform On Latest News', 'images': ['https://localhost/public/images/user.png', 'https://localhost/public/images/user.png']}, {'el': '#search-bx', 'ttl': 'Side menu', 'desc': 'somthing', 'images': ['http://cdn.flaticon.com/png/256/74920.png', 'http://cdn.flaticon.com/png/256/52988.png']}, {'el': '.right-container', 'ttl': 'Context menu', 'desc': 'somthing', 'images': ['http://cdn.flaticon.com/png/256/8566.png', 'http://cdn.flaticon.com/png/256/8566.png']}, {'el': '#user-navigation', 'ttl': 'User profile', 'desc': 'somthing'}, {'el': '.dummy1', 'ttl': 'Search box', 'desc': 'Search somthing', 'images': ['http://cdn.flaticon.com/png/256/10279.png', 'http://cdn.flaticon.com/png/256/10279.png']}]};
   joyRide1();
};

function joyRide1() {
    var popup = $('#joy-ride');
    var htm = '<div class="popovr-cntnt"><h3>' + dt.pps[0].ttl + '</h3><p>' + dt.pps[0].desc + '</p></div><div class="arrow"></div>';
    htm += '<div class="popovr-cntnt-imgs">';
    if (dt.pps[0].images != undefined) {
        for (var i = 0; i < dt.pps[0].images.length; i++) {
            htm += '<img src="' + dt.pps[0].images[i] + '">';
        }
    }
    htm += '</div>';
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
}


$('#joy-ride').on('click', '#got_popver, .rmv_popover', function () {
        $('#joy-ride').removeClass('visbl start');
        $.ajax({
           'url': '/index/dummy',
           'type': 'post',
           'data': {'flag': 1},
           success: function(res){
               alert('done');
           }
        });
    });
    
// Next and back Navigation
$('#joy-ride').on('click', '.btn_nav button', function () {
    var popup = $('#joy-ride');
    if ($(this).text() == 'NEXT')
        var dlog = popup.data('dlog') + 1;
    else
        var dlog = popup.data('dlog') - 1;

    var el = dt.pps[dlog].el;
    popup.removeClass('start').data('dlog', dlog).find('.popovr-cntnt h3').html(dt.pps[dlog].ttl).find('.popovr-cntnt p').html(dt.pps[dlog].desc);
    if (dt.pps[dlog].images != undefined) {
        $('.popovr-cntnt-imgs').html('');
        for (var i = 0; i < dt.pps[dlog].images.length; i++) {
            $('.popovr-cntnt-imgs').append('<img src="' + dt.pps[dlog].images[i] + '">');
        }
    }else
        $('.popovr-cntnt-imgs').html('');

    if (dlog == 2)
        popup.find('.btn_nav #bck_popver').removeClass('hideElement');
    else if (dlog == 1) {
        popup.find('.btn_nav #bck_popver').addClass('hideElement');
        $('#joy-ride').find('.hlp_sldr_indctrs').removeClass('hideElement')
    }
    else if (dlog < dt.pps.length - 1) {
        popup.find('.btn_nav #got_popver').addClass('hideElement');
        popup.find('.btn_nav #nxt_popver').removeClass('hideElement');
    }
    else if (dlog == dt.pps.length - 1) {
        popup.find('.btn_nav #got_popver').removeClass('hideElement');
        popup.find('.btn_nav #nxt_popver').addClass('hideElement');
    }
    $('#joy-ride').find('.hlp_sldr_indctrs .grup_nvgtn').eq(dlog - 1).addClass('actv').siblings().removeClass('actv')
    setPosition($('body').find(el));
});
   
   


function setPosition($this) {
    var elTop = $this.offset().top;
    var elLeft = $this.offset().left;
    var eloutrWidth = $this.width();
    var eloutrHeight = $this.height();
    var popup = $('#joy-ride');
    if (elTop - $(window).scrollTop() < 30) {
        if (elLeft > window.outerWidth - popup.outerWidth()) {
            elTop = elTop + eloutrHeight + 8;
            elLeft = elLeft - popup.outerWidth() + eloutrWidth / 2 + 32;
            popup.removeClass('right left top').addClass('btm rght');
        } else {
            elTop = elTop + eloutrHeight + 8;
            elLeft = elLeft - eloutrWidth + 38;
            popup.removeClass('right rght left top').addClass('btm');
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
        elTop = elTop - popup.outerHeight() - 8;
        elLeft = elLeft - eloutrWidth + 38;
        popup.removeClass('right rght btm left').addClass('top');
    }
    else {
        elTop = elTop + eloutrHeight / 2 - 38;
        elLeft = elLeft + eloutrWidth + 4;
        popup.removeClass('top btm left').addClass('right');
    }
    popup.css({'top': +elTop, 'left': +elLeft}).addClass('visbl');
};
});