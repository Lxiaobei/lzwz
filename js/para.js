/**
 *
 * @authors Your Name (you@example.org)
 * @date    2017-08-15 11:46:49
 * @version $Id$
 */

/**
 * parallaxy
 */
var parallaxController;
var ismobile = (function (a) { return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)) })(navigator.userAgent || navigator.vendor || window.opera);
; (function () {
    parallaxController = this;
    // Totally lifted from this: http://stackoverflow.com/questions/11197247/javascript-equivalent-of-jquerys-extend-method
    function extend() {
        for (var i = 1; i < arguments.length; i++)
            for (var key in arguments[i])
                if (arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    }
    // Lifted from: http://stackoverflow.com/questions/18359093/how-to-copy-javascript-object-to-new-variable-not-by-reference
    // I can't believe that I had to look this up.
    // Object.prototype.copy = function() {
    //     return JSON.parse(JSON.stringify(this));
    // }
    var menuClosed = true;
    // HTML Stuff
    this.paralaxxed = document.getElementsByClassName("parallaxy-animate");
    // Create the logic
    parallaxate = function (parallax_elements, defaultSettings) {
        var elements = parallax_elements;
        for (i = 0; i < elements.length; i++) {
            // console.log(elements[i]);
            var settings = JSON.parse(JSON.stringify(defaultSettings)); // defaultSettings.copy();
            var options = JSON.parse(elements[i].getAttribute('parallaxy-options'));
            elements[i].settings = extend(settings, options);
            if (options.positionType == 'relative') {
                elements[i].initial_offset = parseInt(window.getComputedStyle(elements[i], null).getPropertyValue('margin-top'), 10);
                // elements[i].dataset.positionType = "relative";
                elements[i].setAttribute("data-position-type", "relative");
            } else {
                elements[i].initial_offset = elements[i].offsetTop;
                // elements[i].dataset.positionType = "absolute";
                elements[i].setAttribute("data-position-type", "absolute");
            }
            // elements[i].dataset = options.direction;
            // console.log(elements[i].dataset);
            // elements[i].dataset.currentDelta = 0;
            // elements[i].dataset.newDelta = 0;
            elements[i].dataset = options.direction;
            elements[i].setAttribute("data-current-delta", "0");
            elements[i].setAttribute("data-new-delta", "0");
            // container.addEventListener("scroll", function(event) {
            //                 for (i = 0; i < elements.length; i++) {
            //                     var newDelta = (0 - (container.scrollTop * elements[i].settings.multiplier));
            //                     if(elements[i].settings.direction == "down") {
            //                         newDelta = (0 + (container.scrollTop * elements[i].settings.multiplier));
            //                     }
            //                     elements[i].dataset.newDelta = newDelta;
            //                 }
            // 				parallaxController.scrollHandler()
            //             });
        }
    }
    scrollHandler = function () {
        var that = this;
        var scrollTop = window.pageYOffset;
        for (i = 0; i < paralaxxed.length; i++) {
            // var currentDelta = paralaxxed[i].dataset.currentDelta;
            var currentDelta = paralaxxed[i].getAttribute("data-current-delta");
            // var newDelta = paralaxxed[i].dataset.newDelta;
            var newDelta = (0 - (scrollTop * paralaxxed[i].settings.multiplier));
            if (paralaxxed[i].settings.direction == "down") {
                newDelta = (0 + (scrollTop * paralaxxed[i].settings.multiplier));
            }
            // figure out the tween.
            // var tweenDelta = (currentDelta - ((currentDelta - newDelta) * 0.08)); // up
            if (paralaxxed[i].settings.direction == "down") {
            } else {
                if (ismobile) {
                    tweenDelta = (currentDelta - ((currentDelta - newDelta)));
                    if (currentDelta && currentDelta < 0) paralaxxed[i].style.transform = "translateY(" + tweenDelta + "px)";
                    // if(currentDelta && currentDelta < 0 ) paralaxxed[i].style.webkitTransform = "translateY(" + tweenDelta + "px)";
                } else {
                    var tweenDelta = (currentDelta - ((currentDelta - newDelta) * 0.08));
                    // paralaxxed[i].style.transform = "translateY(" + tweenDelta + "px) translateZ(0)";
                    // paralaxxed[i].style.webkitTransform = "translateY(" + tweenDelta + "px) translateZ(0)";
                    paralaxxed[i].style.transform = "translateY(" + tweenDelta + "px) translateZ(-10px)";
                    paralaxxed[i].style.webkitTransform = "translateY(" + tweenDelta + "px) translateZ(-10px)";
                    // paralaxxed[i].style.marginTop = tweenDelta + "px";
                }
                // paralaxxed[i].style.transform = "translate3d(0px," + tweenDelta + "px, 0px)";
                // paralaxxed[i].dataset.currentDelta = tweenDelta;
                paralaxxed[i].setAttribute("data-current-delta", tweenDelta);
                // console.log(tweenDelta);
            }
        }
        if (menuClosed) {
            window.requestAnimationFrame(scrollHandler);
        }
        // window.requestAnimationFrame( scrollHandler );
    }
    // init the thing
    function init() {
        var that = this;
        var paralaxxedsettings = {
            "multiplier": "0.2",
            "direction": "up",
            "positionType": "absolute",
        };
        if (paralaxxed.length > 0) {
            parallaxate(that.paralaxxed, paralaxxedsettings);
        }
        scrollHandler();
        // sets the interval
    }
    pauseTween = function () {
        menuClosed = false;
        // console.log("pause parallax");
        $(".parallaxy-animate").removeAttr("style");
    }
    restartTween = function () {
        menuClosed = true;
        // console.log("restart parallax");
        scrollHandler();
    }
    init()
    $(window).resize(function () {
        // console.log("a");
        if ($(this).width() < 1024) {
            pauseTween();
            setTimeout(function () {
                $(".parallaxy-animate").removeAttr("style");
            }, 250);
        } else {
            restartTween();
        }
    }).resize();
})();