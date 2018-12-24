
(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.9',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        },

        getLineHeight: function(elem) {
            return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));



//index-banner
$(function(){
    var len = 0;
    var $box = $('#banner');
    $box.mousewheel(function(event, delta){
        event.stopPropagation();
        var dir = delta > 0 ? 'Up' : 'Down';
        var scrollTop = $box.scrollTop();

        if (scrollTop == 0 && delta > 0){
            len = 0;

        }
        if(dir == 'Up'){
            len ==0;
            $("h3 span.ban-txt1").stop().animate({'margin-top':0},'350');
            $("h3 span.ban-txt3").stop().animate({'margin-top':0},'350');
            $("h3 span.ban-txt2").stop().animate({'margin-top':0},'350');
            $("h3 span.ban-txt4").stop().animate({'margin-top':0},'350');
            $("p.ban-txtp").stop().animate({'margin-top':0},'200');

            $(".b1").stop().animate({'left':-7 + "%"},'350');
            $(".b2").stop().animate({'left':74 + "%"},'350');
            $(".b3").stop().animate({'top':26.5+ "%"},'450');
            $(".b4").stop().animate({'left':35+ "%"},'350');
            $(".b5").stop().animate({'left':69+ "%"},'550');
            $(".b6").stop().animate({'left':85+ "%"},'250');
            $(".b7").stop().animate({'left':8+ "%"},'350');
            $(".b8").stop().animate({'top':75.5+ "%"},'300');
            $(".b9").stop().animate({'top':53+ "%"},'350');
            $(".b10").stop().animate({'top':48+ "%"},'300');
            $(".b11").stop().animate({'left':15+ "%"},'350');


        }else{
            len += 1;
             // console.log(len);
            if(len < 3){
               if(len == 1){
                /*$(".banner-box").stop().animate({'width': 95 +"%",'left':2.5 + "%"},'800');*/

                $("h3 span.ban-txt1").stop().animate({'margin-top':-20},'350');
                $("h3 span.ban-txt3").stop().animate({'margin-top':-10},'350');
                $("h3 span.ban-txt2").stop().animate({'margin-top':10},'350');
                $("h3 span.ban-txt4").stop().animate({'margin-top':20},'350');
                $("p.ban-txtp").stop().animate({'margin-top':10},'200');

                $(".b1").stop().animate({'left':-4 + "%"},'350');
                $(".b2").stop().animate({'left':76 + "%"},'350');
                $(".b3").stop().animate({'top':21+ "%"},'450');
                $(".b4").stop().animate({'left':32+ "%"},'350');
                $(".b5").stop().animate({'left':65+ "%"},'550');
                $(".b6").stop().animate({'left':88+ "%"},'250');
                $(".b7").stop().animate({'left':11+ "%"},'350');
                $(".b8").stop().animate({'top':77+ "%"},'300');
                $(".b9").stop().animate({'top':56+ "%"},'350');
                $(".b10").stop().animate({'top':42+ "%"},'300');
                $(".b11").stop().animate({'left':18+ "%"},'350');


                /*$(".b1").css("left" ,"1%");
                $(".b10").css("left","85%");
                $(".b11").css("left" ,"18%");*/
               }
               else if(len == 2){
               /* $(".banner-box").stop().animate({'width': 90 +"%",'left':5 + "%"},'800');*/

                $("h3 span.ban-txt1").stop().animate({'margin-top':-40},'350');
                $("h3 span.ban-txt3").stop().animate({'margin-top':-20},'350');
                $("h3 span.ban-txt2").stop().animate({'margin-top':20},'350');
                $("h3 span.ban-txt4").stop().animate({'margin-top':40},'350');
                $("p.ban-txtp").stop().animate({'margin-top':20},'200');


                $(".b1").stop().animate({'left':-1 + "%"},'350');
                $(".b2").stop().animate({'left':78 + "%"},'350');
                $(".b3").stop().animate({'top':23+ "%"},'450');
                $(".b4").stop().animate({'left':34+ "%"},'350');
                $(".b5").stop().animate({'left':66+ "%"},'550');
                $(".b6").stop().animate({'top':28+ "%"},'250');
                $(".b7").stop().animate({'left':13+ "%"},'350');
                $(".b8").stop().animate({'top':79+ "%"},'300');
                $(".b9").stop().animate({'top':58+ "%"},'350');
                $(".b10").stop().animate({'top':38+ "%"},'300');
                $(".b11").stop().animate({'left':20+ "%"},'350');


               }
               return false;
            }
            else if(len == 3){
             //return true;
             //console.log(len);
             $("html, body").animate({
                scrollTop: $("#index-content").offset().top - 80 + "px"
              }, {
                duration: 1500,
                easing: "swing"
              });
              return false;
             }
        }

    });
 });
$(function(){
    $(window).resize(function(){
        var $w1024 = $("#w1024");
        var $w768 = $("#w768");
        //<768
        if($w768.is(":visible")){
            $(".b6,.b10,.b11").hide();
             $(".b1").css("left" ,"-10%");$(".b1").css("top" ,"12%");
             $(".b2").css("left" ,"85%");$(".b2").css("top" ,"25%");
             $(".b3").css("left" ,"10%");$(".b3").css("top" ,"30%");
             $(".b4").css("left" ,"25%");$(".b4").css("top" ,"35%");
             $(".b5").css("left" ,"88%");$(".b5").css("top" ,"50%");

             $(".b7").css("left" ,"5%");$(".b7").css("top" ,"70%");
             $(".b8").css("left" ,"66%");$(".b8").css("top" ,"62%");
             $(".b9").css("left" ,"92%");$(".b9").css("top" ,"68%");
             $(".red-bg").width(0);
        }
        //<1024
        else if($w1024.is(":hidden")){
             $(".b6,.b10,.b11").hide();
             $(".b1").css("left" ,"3%");$(".b1").css("top" ,"5%");
             $(".b2").css("left" ,"80%");$(".b2").css("top" ,"16%");
             $(".b3").css("left" ,"24%");$(".b3").css("top" ,"30%");
             $(".b4").css("left" ,"23%");$(".b4").css("top" ,"32%");
             $(".b5").css("left" ,"75%");$(".b5").css("top" ,"58%");
             $(".b7").css("left" ,"15%");$(".b7").css("top" ,"75%");
             $(".b8").css("left" ,"66%");$(".b8").css("top" ,"62%");
             $(".b9").css("left" ,"78%");$(".b9").css("top" ,"80%");
              $(".red-bg").width(0);
        }
        else{
             $(".b6,.b8,.b10,.b11").show();
             $(".b1").css("left" ,"-7%");$(".b1").css("top" ,"25%");
             $(".b2").css("left" ,"74%");$(".b2").css("top" ,"34%");
             $(".b3").css("left" ,"28%");$(".b3").css("top" ,"26.5%");
             $(".b4").css("left" ,"35%");$(".b4").css("top" ,"25%");
             $(".b5").css("left" ,"69%");$(".b5").css("top" ,"53%");
             $(".b6").css("left" ,"85%");$(".b6").css("top" ,"33%");
             $(".b7").css("left" ,"8%");$(".b7").css("top" ,"64%");
             $(".b8").css("left" ,"58.5%");$(".b8").css("top" ,"75.5%");
             $(".b9").css("left" ,"82.5%");$(".b9").css("top" ,"53%");
             $(".b10").css("left","92%");$(".b10").css("top" ,"48%");
             $(".b11").css("left","15%");$(".b11").css("top" ,"44%");

             var $ind_ab =$(window).width() - $(".img-1").offset().left - $(".img-1").outerWidth();
            //  console.log($ind_ab);
             $(".red-bg").width($ind_ab);
        }



    });
    $(window).resize();
    var j=0;
    setInterval(function(){
        j++;
        $("ul.ban-dot li").eq(j).addClass("fadeli");
        if(j==4){
            j=0;
            $("ul.ban-dot li").removeClass("fadeli");
        }
        //console.log(j);
     },400);

})

$(function(){
    var positionX = 0;
    var positionY = 0;

    var $ban_img = $(".banner-box").find(".b");
    var $ban_len = $ban_img.size();

    // $('#banner').mousemove(function(e) {
    //     e.stopPropagation();
    //     var x = e.clientX, y = e.clientY;


    //     if(positionX === 0 && positionY === 0){
    //         positionX = x;
    //         positionY = y;
    //     }
    //     if(x > positionX && y < positionY){
    //         //top
    //         $ban_img.each(function (i){
    //             var $box_w = $(".banner-box").width();
    //             var $box_h = $(".banner-box").height();
    //             var $ban_x = parseInt($ban_img.eq(i).position().left)/$box_w*100;
    //             var $ban_y = parseInt($ban_img.eq(i).position().top)/$box_h*100;
    //             var $don = parseInt($ban_img.eq(i).position().left)/$box_w;
    //             $ban_img.eq(i).stop().animate({'left': $ban_x +"%",'top':($ban_y + $don) + "%"},'800');
    //             //console.log($ban_x);
    //         });

    //         positionX = x;
    //         positionY = y;
    //     }else if(x > positionX && y > positionY){
    //         //right
    //         $ban_img.each(function (i){
    //             var $box_w = $(".banner-box").width();
    //             var $box_h = $(".banner-box").height();
    //             var $ban_x = parseInt($ban_img.eq(i).position().left)/$box_w*100;
    //             var $ban_y = parseInt($ban_img.eq(i).position().top)/$box_h*100;
    //             var $don = parseInt($ban_img.eq(i).position().left)/$box_w;

    //             $ban_img.eq(i).stop().animate({'left': ($ban_x - $don) + "%",'top': $ban_y +"%"},'800');

    //         });

    //         positionX = x;
    //         positionY = y;
    //     }else if(x < positionX && y < positionY){
    //         //left
    //         $ban_img.each(function (i){
    //             var $box_w = $(".banner-box").width();
    //             var $box_h = $(".banner-box").height();
    //             var $ban_x = parseInt($ban_img.eq(i).position().left)/$box_w*100;
    //             var $ban_y = parseInt($ban_img.eq(i).position().top)/$box_h*100;
    //             var $don = parseInt($ban_img.eq(i).position().left)/$box_w;

    //             $ban_img.eq(i).stop().animate({'left': ($ban_x + $don) + "%",'top': $ban_y +"%"},'800');
    //         });

    //         positionX = x;
    //         positionY = y;
    //     }else if(x < positionX && y > positionY){
    //         //bottom

    //         $ban_img.each(function (i){
    //             var $box_w = $(".banner-box").width();
    //             var $box_h = $(".banner-box").height();
    //             var $ban_x = parseInt($ban_img.eq(i).position().left)/$box_w*100;
    //             var $ban_y = parseInt($ban_img.eq(i).position().top)/$box_h*100;
    //             var $don = parseInt($ban_img.eq(i).position().left)/$box_w;

    //             $ban_img.eq(i).stop().animate({'left': $ban_x +"%",'top': ($ban_y - $don) + "%"},'800');
    //         });

    //         positionX = x;
    //         positionY = y;
    //     }

    // });

    $.extend($.easing,{
        easeOutBack:function(x,t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeOutCubic: function (x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        }
    });
});

