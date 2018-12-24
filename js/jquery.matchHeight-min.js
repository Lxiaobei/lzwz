/**
* jquery.matchHeight-min.js v0.5.2
* http://brm.io/jquery-match-height/
* License: MIT
*/
(function (c) {
    var f = -1, g = -1, q = function (a) { var b = null, d = []; c(a).each(function () { var a = c(this), l = a.offset().top - k(a.css("margin-top")), m = 0 < d.length ? d[d.length - 1] : null; null === m ? d.push(a) : 1 >= Math.floor(Math.abs(b - l)) ? d[d.length - 1] = m.add(a) : d.push(a); b = l }); return d }, k = function (a) { return parseFloat(a) || 0 }, n = function (a) { var b = { byRow: !0, remove: !1, property: "height" }; "object" === typeof a && (b = c.extend(b, a)); "boolean" === typeof a && (b.byRow = a); "remove" === a && (b.remove = !0); return b }, b = c.fn.matchHeight = function (a) {
        a =
        n(a); if (a.remove) { var e = this; this.css(a.property, ""); c.each(b._groups, function (a, b) { b.elements = b.elements.not(e) }); return this } if (1 >= this.length) return this; b._groups.push({ elements: this, options: a }); b._apply(this, a); return this
    }; b._groups = []; b._throttle = 80; b._maintainScroll = !1; b._beforeUpdate = null; b._afterUpdate = null; b._apply = function (a, e) {
        var d = n(e), h = c(a), l = [h], m = c(window).scrollTop(), g = c("html").outerHeight(!0), f = h.parents().filter(":hidden"); f.css("display", "block"); d.byRow && (h.each(function () {
            var a =
                c(this), b = "inline-block" === a.css("display") ? "inline-block" : "block"; a.data("style-cache", a.attr("style")); a.css({ display: b, "padding-top": "0", "padding-bottom": "0", "margin-top": "0", "margin-bottom": "0", "border-top-width": "0", "border-bottom-width": "0", height: "100px" })
        }), l = q(h), h.each(function () { var a = c(this); a.attr("style", a.data("style-cache") || "").css("height", "") })); c.each(l, function (a, b) {
            var e = c(b), f = 0; d.byRow && 1 >= e.length || (e.each(function () {
                var a = c(this), b = {
                    display: "inline-block" === a.css("display") ?
                        "inline-block" : "block"
                }; b[d.property] = ""; a.css(b); a.outerHeight(!1) > f && (f = a.outerHeight(!1)); a.css("display", "")
            }), e.each(function () { var a = c(this), b = 0; "border-box" !== a.css("box-sizing") && (b += k(a.css("border-top-width")) + k(a.css("border-bottom-width")), b += k(a.css("padding-top")) + k(a.css("padding-bottom"))); a.css(d.property, f - b) }))
        }); f.css("display", ""); b._maintainScroll && c(window).scrollTop(m / g * c("html").outerHeight(!0)); return this
    }; b._applyDataApi = function () {
        var a = {}; c("[data-match-height], [data-mh]").each(function () {
            var b =
                c(this), d = b.attr("data-match-height") || b.attr("data-mh"); a[d] = d in a ? a[d].add(b) : b
        }); c.each(a, function () { this.matchHeight(!0) })
    }; var p = function (a) { b._beforeUpdate && b._beforeUpdate(a, b._groups); c.each(b._groups, function () { b._apply(this.elements, this.options) }); b._afterUpdate && b._afterUpdate(a, b._groups) }; b._update = function (a, e) { if (e && "resize" === e.type) { var d = c(window).width(); if (d === f) return; f = d } a ? -1 === g && (g = setTimeout(function () { p(e); g = -1 }, b._throttle)) : p(e) }; c(b._applyDataApi); c(window).bind("load",
        function (a) { b._update(!1, a) }); c(window).bind("resize orientationchange", function (a) { b._update(!0, a) })
})(jQuery); 