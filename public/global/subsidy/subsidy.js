$(document).ready(function ($) {
    var windowHeight = jQuery(window).height();
    $('#intro').height(windowHeight);
    $('#subsdy-mnu .mbl-mnu').height(windowHeight);
    var sloganHight = $('#intro section').height() / 2
    $('#intro section').css({'padding-top': windowHeight / 2 - sloganHight + 'px'});
    $(window).scroll(function () {

        console.log("scroll");
        if ($(window).scrollTop() > 150) {

            $('#intro section').fadeOut();

        } else {

            $('#intro section').fadeIn();

        }
        ;

        if ($(window).scrollTop() > windowHeight - 100) {

            $('.main-header').addClass('shows');

        } else {

            $('.main-header').removeClass('shows');

        }
        ;
    });

    $('body').on('click', '#scrl-dwn', function (e) {
        e.preventDefault()
        $('html, body').animate({
            scrollTop: jQuery(this.hash).offset().top
        }, 500);
    });

    $('body').on('click', '#mbl-nav', function () {
        if ($('body').find(".mbl-mnu").hasClass('actv'))
            $('body').find(".mbl-mnu").removeClass('actv');
        else
            $('body').find(".mbl-mnu").addClass('actv');
    });
    $('#steps').on('click', '.gvup', function () {
        alert();
    });
});