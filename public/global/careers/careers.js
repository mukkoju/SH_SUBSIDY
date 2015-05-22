
$(document).ready(function () {

    $('.brws-team').click(function () {
        var el = $(this);
        $.ajax({
            url: '/ajax/gtjb',
            type: 'post',
            data: {'team': $(this).data('team')},
            success: function (res) {
                var d = JSON.parse(res);
                applyAnimation(el, d);
                $('#new-job-btn').addClass('hideElement');
            },
        });
    });
    function applyAnimation(el, data) {
        var elWidth = el.width();
        var elHeight = el.find('img').height();
        var index = el.index();
        var fly = $('<div/>').addClass('fly').attr('data-target', '').css({
            width: elWidth,
            height: elHeight,
            left: el.offset().left,
            top: el.offset().top
        }).appendTo($('body'));
        setTransition(fly);
        setTimeout(function () {
            var top = 64 + $(window).scrollTop() + 'px';
            if ($(window).width() < 767) {
                var teamLeft = 0;
                var teamWidth = '100%'
            }
            else {
                var teamLeft = $('.creers-dsc').offset().left;
                var teamWidth = $('.creers-dsc').width();
            }
            var teamTop = $('.creers-dsc').offset().top;
            var teamHeight = $('.creers-dsc').height();

            $('body').find('.fly').css({'width': teamWidth, 'min-height': teamHeight, 'left': teamLeft, 'top': teamTop});
        }, 25);
//       $('body').find('.fly').on("webkitTransitionEnd transitionend oTransitionEnd", function (e) {
        setTimeout(function () {
            loadHtml(fly, index, el, data);
            $('body').find('.fly').css({'height': 'auto'});
        }, 320);
//       }); 

        $('.remove-fly').fadeIn('slow').removeClass('hideElement');
    }
    function setTransition(fly) {

        fly.css('transition', 'all 300ms ease-in-out');
    }
    function loadHtml(el, index, target, d) {
        $('.fly').attr('data-target', target.attr('id'));

        if (target.hasClass('brws-team')) {
            if (d.success) {
                var d = d.msg
                var data = '<div class="pos-lsting"><div class="pos-lsting-hdr">' + d[0]._Team_ + '</div><ul>';
                for (var i = 0; i < d.length; i++) {
                    var dsc = JSON.parse[d[i]._Dsc_];
                    data += '<li class="pos-itm"><div class="pos-itm-ttl" data-jbid="' + d[i]._ID_ + '">' + d[i]._Ttl_ + '</div>';
                    if ($('body').data('bunme') == 'bajjuri6' || $('body').data('bunme') == 'maverick218' || $('body').data('bunme') == 'mukkoju')
                        data += '<span class="deactv-jb job-actns"><i class="icon-remove" title="Deactivate job"></i></span>';
                    data += '<span class="job-nav job-actns"><i class="icon-plus" title="Expand view"></i></span><div class="clearfix"></div><div class="job-desc">';
                    data += '<p>' + d[i]._Dsc_.dsc + '</p>';
                    if (d[i]._Dsc_.rls[0] != '') {
                        data += '<div class="job-section"><div class="job-section-hdng">Role & Responsibilities</div><ul>';
                        for (var r = 0; r < d[i]._Dsc_.rls.length; r++) {
                            data += '<li>' + d[i]._Dsc_.rls[r] + '</li>';
                        }
                        data += '</ul></div>';
                    }
                    if (d[i]._Dsc_.req[0] != '') {
                        data += '<div class="job-section"><div class="job-section-hdng">Requirements</div><ul>';
                        for (var q = 0; q < d[i]._Dsc_.req.length; q++) {
                            data += '<li>' + d[i]._Dsc_.req[q] + '</li>';
                        }
                        data += '</ul></div>';
                    }
                    if (d[i]._Dsc_.dsird[0] != '') {
                        data += '<div class="job-section"><div class="job-section-hdng">Desired & Skills</div><ul>';
                        for (var l = 0; l < d[i]._Dsc_.dsird.length; l++) {
                            data += '<li>' + d[i]._Dsc_.dsird[l] + '</li>';
                        }
                        data += '</ul></div>';
                    }
                    if (d[0]._Team_Id_ == 'journalists') {
                        data += '<p class="apply-note">To be considered for this role, Write a story in saddahaq.com on your view, send that Story Url, CV, Expected CTC and earliest possible start date to to <a href="mailto:careers@saddahaq.com">careers@saddahaq.com.</a></p>';
                    } else
                        data += '<p class="apply-note">To be considered for this role, send your application, CV, Expected CTC and earliest possible start date to <a href="mailto:careers@saddahaq.com">careers@saddahaq.com</a>.</p>';
                    data += '</div></li>';
                }
                data += '</ul></div>';
            } else {
                var data = '<h3>' + d.msg + '.</h3>'
            }
            el.html(data);
        } else {
            data = '<form class="form-horizontal" id="nw-job-frm" method="post">'
            data += '<div class="control-group"> <p class="dsc">Select Team<sup class="err-msg">*</sup></p> <select id="sclct-team"><option>SOFTWARE ENGINEERING</option><option>JOURNALISTS</option><option>MARKETING</option><option>BUSINESS DEVELOPMENT</option><option>COMMUNICATIONS</option><option>OTHER</option></select> </div>';
            data += '<form class="form-horizontal" id="nw-job-frm" method="post"><div class="control-group"> <p class="dsc">Title <sup class="err-msg">*</sup></p> <input type="text" id="jb-ttl" placeholder="Title" class="blk-txt input-xxlarge box"> </div>';
            data += '<div class="control-group"> <p class="dsc">Description <sup class="err-msg">*</sup></p> <textarea type="text" id="jb-desc" placeholder="Description" class="input-xxlarge box"></textarea>';
            data += '<div id="job-roles" class="spcfctns"><div class="control-group"> <p class="dsc">Role & Responsibilities<sup class="err-msg"></sup></p> <ul class="jb-list-itms"><li><input type="text" placeholder="Role & Responsibilities" class="blk-txt input-xxlarge box" style="border: 0px;border-bottom: 1px solid #ddd;"><span class="addlst-itm" title="Add more"><i class="icon-plus"></i></span></li></ul> </div></div>';
            data += '<div id="job-reqrmnts" class="spcfctns"><div class="control-group"> <p class="dsc">Requirements<sup class="err-msg"></sup></p> <ul class="jb-list-itms"><li><input type="text" placeholder="Requirements" class="blk-txt input-xxlarge box" style="border: 0px;border-bottom: 1px solid #ddd;"><span class="addlst-itm" title="Add more"><i class="icon-plus"></i></span></li></ul> </div></div>';
            data += '<div id="job-disred" class="spcfctns"><div class="control-group"> <p class="dsc">Desired & Skills<sup class="err-msg"></sup></p> <ul class="jb-list-itms"><li><input type="text" placeholder="Desired & Skills" class="blk-txt input-xxlarge box" style="border: 0px;border-bottom: 1px solid #ddd;"><span class="addlst-itm" title="Add more"><i class="icon-plus"></i></span></li></ul> </div></div>';
            data += '<button class="btn btn-success" id="post-job">POST JOB</button></div> </form>'
            el.html(data);
        }
    }
    $('body').on('click', '.fly .pos-itm-ttl, .job-nav', function () {
        var $this = $(this).parents('.pos-itm');
        if ($this.hasClass('actv')) {
            $this.removeClass('actv').find('.job-nav i').removeClass('icon-minus').addClass('icon-plus').attr('title', 'Expand view');
        } else {
            $this.addClass('actv').find('.job-nav i').removeClass('icon-plus').addClass('icon-minus').attr('title', 'Collapse');
            var scrl = $this.find('.pos-itm-ttl').attr('id');
        }

    });

    $('body').on('click', '.fly .deactv-jb', function () {
        var $this = $(this);
        var c = confirm("Are you sure want to DEACTVE this post");
        if (c == true) {
            $.ajax({
                url: '/ajax/dltjb',
                type: 'post',
                data: {'jbid': $this.parents().find('.pos-itm-ttl').data('jbid')},
                success: function (res) {
                    var d = JSON.parse(res);
                    if (d.success) {
                        $this.parents('.pos-itm').remove();
                        $('#sts-msg').showStatus(d.msg, 'scs');
                    } else {
                        $('#sts-msg').showStatus(d.msg, 'err');
                    }
                }
            });
        }

    });

    function closeLsting(target) {
        var $this = $('#' + target + '');
        var elWidth = $this.width();
        var elHeight = $this.height();
        var elLeft = $this.offset().left;
        var elTop = $this.offset().top;
        setTimeout(function () {
            $('.fly').css({'width': elWidth, 'height': elHeight, 'min-height': elHeight, 'left': elLeft, 'top': elTop, 'opacity': 0.5}).html('');
            setTimeout(function () {
                $('.fly').fadeOut('slow');
                $('.fly').remove();
            }, 300);
        }, 25);
    }

    $('body').find('.remove-fly').click(function () {
        var target = $('body').find('.fly').data('target');
        $(this).fadeOut('slow');
        closeLsting(target);
        $('#new-job-btn').removeClass('hideElement');
    });
    $('#creers').on('click', '#new-job-btn', function () {
        var el = $(this);
        applyAnimation(el);
    });

    $('body').on('click', '.fly .addlst-itm', function () {
        var $this = $(this).find('i');
        if ($this.hasClass('icon-plus')) {
            var parent = $(this).parents('.jb-list-itms');
            parent.append('<li><input type="text" class="blk-txt input-xxlarge box" style="border: 0px;border-bottom: 1px solid #ddd;"><span class="addlst-itm"><i class="icon-minus"></i></span></li>');
        } else {
            $(this).parents('li').remove();
        }
    });


    // submiting new Job
    $('body').on('click', '.fly #post-job', function (e) {
        e.preventDefault();
        var $this = $(this)
        $(this).attr('disabled', 'disabled');
        var data = {
            dsc: $('#nw-job-frm').find('#jb-desc').val(),
            rls: [],
            req: [],
            dsird: [],
        };
        var teamShrt = $('#nw-job-frm').find('#sclct-team option:selected').val();
        var team = $('#nw-job-frm').find('#sclct-team option:selected').val();
        var ttl = $('#nw-job-frm').find('#jb-ttl').val();

        $('#job-roles').find('.jb-list-itms li').each(function () {
            if ($(this).find('input').val() != '')
                data.rls.push($(this).find('input').val());
        });
        $('#job-reqrmnts').find('.jb-list-itms li').each(function () {
            if ($(this).find('input').val() != '')
                data.req.push($(this).find('input').val());
        });
        $('#job-disred').find('.jb-list-itms li').each(function () {
            if ($(this).find('input').val() != '')
                data.dsird.push($(this).find('input').val());
        });
        $.ajax({
            url: '/ajax/adjb',
            type: 'post',
            data: {'desc': JSON.stringify(data), 'ttl': ttl, 'team': team},
            success: function (res) {
                var d = JSON.parse(res);
                if (d.success) {
                    $('#sts-msg').showStatus(d.msg, 'scs');
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                }
                else {
                    $this.prop('disabled', false);
                    $('#sts-msg').showStatus(d.msg, 'err');
                }
            }
        });
    });

    $.ajax({
        url: '/ajax/jbcnt',
        type: 'post',
        data: {},
        success: function (res) {
            var d = JSON.parse(res);
            $('#creers #sftr-eng').find('h4 span').html(d.msg['software-engineering'] ? "(" + d.msg['software-engineering'] + ")" : "(0)");
            $('#creers #jurnlst').find('h4 span').html(d.msg['journalists'] ? "(" + d.msg['journalists'] + ")" : "(0)");
            $('#creers #mrktng').find('h4 span').html(d.msg['marketing'] ? "(" + d.msg['marketing'] + ")" : "(0)");
            $('#creers #busns-dvlpmnt').find('h4 span').html(d.msg['business-development'] ? "(" + d.msg['business-development'] + ")" : "(0)");
            $('#creers #cmunctns').find('h4 span').html(d.msg['communications'] ? "(" + d.msg['communications'] + ")" : "(0)");
            $('#creers #othrs').find('h4 span').html(d.msg['other'] ? "(" + d.msg['other'] + ")" : "(0)");
        }
    });
    $('body').on('click', '.fly .apply-btn button', function () {
        $(this).fadeOut('slow').parents('.pos-itm').find('.apply-note').removeClass('hideElement');
    });
});