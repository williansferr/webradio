! function(e) {
    e.fn.slider = function(a, t) {
        function n(e, a, t) {
            "function" == typeof e && e.call(a, t)
        }

        function i(e, a, t) {
            var n = a.data("setup"),
                i = n.handles,
                s = n.settings,
                r = n.pos;
            if (e = 0 > e ? 0 : e > 100 ? 100 : e, 2 == s.handles)
                if (t.is(":first-child")) {
                    var o = parseFloat(i[1][0].style[r]) - s.margin;
                    e = e > o ? o : e
                } else {
                    var o = parseFloat(i[0][0].style[r]) + s.margin;
                    e = o > e ? o : e
                }
            if (s.step) {
                var d = l.from(s.range, s.step);
                e = Math.round(e / d) * d
            }
            return e
        }

        function s(e) {
            try {
                return [e.clientX || e.originalEvent.clientX || e.originalEvent.touches[0].clientX, e.clientY || e.originalEvent.clientY || e.originalEvent.touches[0].clientY]
            } catch (a) {
                return ["x", "y"]
            }
        }

        function r(e, a) {
            return parseFloat(e[0].style[a])
        }
        var o = window.navigator.msPointerEnabled ? 2 : "ontouchend" in document ? 3 : 1;
        window.debug && console && console.log(o);
        var l = {
                to: function(e, a) {
                    return a = e[0] < 0 ? a + Math.abs(e[0]) : a - e[0], 100 * a / this._length(e)
                },
                from: function(e, a) {
                    return 100 * a / this._length(e)
                },
                is: function(e, a) {
                    return a * this._length(e) / 100 + e[0]
                },
                _length: function(e) {
                    return e[0] > e[1] ? e[0] - e[1] : e[1] - e[0]
                }
            },
            d = {
                handles: 1,
                serialization: {
                    to: ["", ""],
                    resolution: .01
                }
            };
        methods = {
            create: function() {
                return this.each(function() {
                    function t(e, a) {
                        e.css(c, a + "%").data("input").val(l.is(h.range, a).toFixed(b))
                    }
                    var c, u, h = e.extend(d, a),
                        f = "<a><div></div></a>",
                        v = e(this).data("_isnS_", !0),
                        p = [],
                        y = "",
                        m = function(e) {
                            return !isNaN(parseFloat(e)) && isFinite(e)
                        },
                        g = (h.serialization.resolution = h.serialization.resolution || .01).toString().split("."),
                        b = 1 == g[0] ? 0 : g[1].length;
                    h.start = m(h.start) ? [h.start, 0] : h.start, e.each(h, function(e, a) {
                        m(a) ? h[e] = parseFloat(a) : "object" == typeof a && m(a[0]) && (a[0] = parseFloat(a[0]), m(a[1]) && (a[1] = parseFloat(a[1])));
                        var t = !1;
                        switch (a = "undefined" == typeof a ? "x" : a, e) {
                            case "range":
                            case "start":
                                t = 2 != a.length || !m(a[0]) || !m(a[1]);
                                break;
                            case "handles":
                                t = 1 > a || a > 2 || !m(a);
                                break;
                            case "connect":
                                t = "lower" != a && "upper" != a && "boolean" != typeof a;
                                break;
                            case "orientation":
                                t = "vertical" != a && "horizontal" != a;
                                break;
                            case "margin":
                            case "step":
                                t = "undefined" != typeof a && !m(a);
                                break;
                            case "serialization":
                                t = "object" != typeof a || !m(a.resolution) || "object" == typeof a.to && a.to.length < h.handles;
                                break;
                            case "slide":
                                t = "function" != typeof a
                        }
                        t && console && console.error("Bad input for " + e + " on slider:", v)
                    }), h.margin = h.margin ? l.from(h.range, h.margin) : 0, (h.serialization.to instanceof jQuery || "string" == typeof h.serialization.to || h.serialization.to === !1) && (h.serialization.to = [h.serialization.to]), "vertical" == h.orientation ? (y += "vertical", c = "top", u = 1) : (y += "horizontal", c = "left", u = 0), y += h.connect ? "lower" == h.connect ? " connect lower" : " connect" : "", v.addClass(y);
                    for (var P = 0; P < h.handles; P++) {
                        p[P] = v.append(f).children(":last");
                        var j = l.to(h.range, h.start[P]);
                        p[P].css(c, j + "%"), 100 == j && p[P].is(":first-child") && p[P].css("z-index", 2);
                        var S = ".slider",
                            k = (1 === o ? "mousedown" : 2 === o ? "MSPointerDown" : "touchstart") + S + "X",
                            F = (1 === o ? "mousemove" : 2 === o ? "MSPointerMove" : "touchmove") + S,
                            x = (1 === o ? "mouseup" : 2 === o ? "MSPointerUp" : "touchend") + S;
                        p[P].find("div").on(k, function(a) {
                            if (e("body").bind("selectstart" + S, function() {
                                    return !1
                                }), !v.hasClass("disabled")) {
                                e("body").addClass("TOUCH");
                                var t = e(this).addClass("active").parent(),
                                    r = t.add(e(document)).add("body"),
                                    o = parseFloat(t[0].style[c]),
                                    d = s(a),
                                    f = d,
                                    y = !1;
                                e(document).on(F, function(e) {
                                    e.preventDefault();
                                    var a = s(e);
                                    if ("x" != a[0]) {
                                        a[0] -= d[0], a[1] -= d[1];
                                        var r = [f[0] != a[0], f[1] != a[1]],
                                            m = o + 100 * a[u] / (u ? v.height() : v.width());
                                        m = i(m, v, t), r[u] && m != y && (t.css(c, m + "%").data("input").val(l.is(h.range, m).toFixed(b)), n(h.slide, v.data("_n", !0)), y = m, t.css("z-index", 2 == p.length && 100 == m && t.is(":first-child") ? 2 : 1)), f = a
                                    }
                                }).on(x, function() {
                                    r.off(S), e("body").removeClass("TOUCH"), v.find(".active").removeClass("active").end().data("_n") && v.data("_n", !1).change()
                                })
                            }
                        }).on("click", function(e) {
                            e.stopPropagation()
                        })
                    }
                    1 == o && v.on("click", function(e) {
                        if (!v.hasClass("disabled")) {
                            var a = s(e),
                                r = 100 * (a[u] - v.offset()[c]) / (u ? v.height() : v.width()),
                                o = p.length > 1 ? a[u] < (p[0].offset()[c] + p[1].offset()[c]) / 2 ? p[0] : p[1] : p[0];
                            t(o, i(r, v, o), v), n(h.slide, v), v.change()
                        }
                    });
                    for (var P = 0; P < p.length; P++) {
                        var z = l.is(h.range, r(p[P], c)).toFixed(b);
                        "string" == typeof h.serialization.to[P] ? p[P].data("input", v.append('<input type="hidden" name="' + h.serialization.to[P] + '">').find("input:last").val(z).change(function(e) {
                            e.stopPropagation()
                        })) : 0 == h.serialization.to[P] ? p[P].data("input", {
                            val: function(e) {
                                return "undefined" == typeof e ? this.handle.data("noUiVal") : void this.handle.data("noUiVal", e)
                            },
                            handle: p[P]
                        }) : p[P].data("input", h.serialization.to[P].data("handleNR", P).val(z).change(function() {
                            var a = [null, null];
                            a[e(this).data("handleNR")] = e(this).val(), v.val(a)
                        }))
                    }
                    e(this).data("setup", {
                        settings: h,
                        handles: p,
                        pos: c,
                        res: b
                    })
                })
            },
            val: function() {
                if ("undefined" != typeof arguments[0]) {
                    var a = "number" == typeof arguments[0] ? [arguments[0]] : arguments[0];
                    return this.each(function() {
                        for (var t = e(this).data("setup"), n = 0; n < t.handles.length; n++)
                            if (null != a[n]) {
                                var s = i(l.to(t.settings.range, a[n]), e(this), t.handles[n]);
                                t.handles[n].css(t.pos, s + "%").data("input").val(l.is(t.settings.range, s).toFixed(t.res))
                            }
                    })
                }
                for (var t = e(this).data("setup").handles, n = [], s = 0; s < t.length; s++) n.push(parseFloat(t[s].data("input").val()));
                return 1 == n.length ? n[0] : n
            },
            disabled: function() {
                return t ? e(this).addClass("disabled") : e(this).removeClass("disabled")
            }
        };
        var c = jQuery.fn.val;
        return jQuery.fn.val = function() {
            return this.data("_isnS_") ? methods.val.apply(this, arguments) : c.apply(this, arguments)
        }, "disabled" == a ? methods.disabled.apply(this) : methods.create.apply(this)
    }
}(jQuery),
function(e) {
    function a(a, t, n, i) {
        var s = new Array;
        e.each(n.media, function(e) {
            "poster" != e && s.push(e)
        }), formats = s.join(", ");
        var r = {
            ready: function() {
                e(this).jPlayer("setMedia", n.media), null != n.autoplay && e(t).jPlayer("play")
            },
            swfPath: "jquery.jplayer.swf",
            supplied: formats,
            solution: "html, flash",
            volume: .5,
            size: n.size,
            smoothPlayBar: !1,
            keyEnabled: !0,
            cssSelectorAncestor: a,
            cssSelector: {
                videoPlay: ".video-play",
                play: ".play",
                pause: ".pause",
                seekBar: ".seekBar",
                playBar: ".playBar",
                volumeBar: ".currentVolume",
                volumeBarValue: ".currentVolume .curvol",
                currentTime: ".time.current",
                duration: ".time.duration",
                fullScreen: ".fullScreen",
                restoreScreen: ".fullScreenOFF",
                gui: ".controls",
                noSolution: ".noSolution"
            },
            error: function(a) {
                a.jPlayer.error.type === e.jPlayer.error.URL_NOT_SET && e(this).jPlayer("setMedia", n.media).jPlayer("play")
            },
            play: function() {
                e(a + " .video-play").fadeOut(), e(this).on("click", function() {
                    e(t).jPlayer("pause")
                }), e(this).jPlayer("pauseOthers")
            },
            pause: function() {
                e(a + " .video-play").fadeIn(), e(a + " .playerScreen").unbind("click")
            },
            volumechange: function(t) {
                t.jPlayer.options.muted ? e(a + " .currentVolume").val(0) : e(a + " .currentVolume").val(t.jPlayer.options.volume)
            },
            timeupdate: function(t) {
                e(a + " .seekBar").val(t.jPlayer.status.currentPercentRelative)
            },
            progress: function(t) {
                e(a + " .seekBar").val(t.jPlayer.status.currentPercentRelative)
            },
            ended: function() {
                e(this).jPlayer("setMedia", n.media)
            }
        };
        e(a + " .currentVolume").slider({
            range: [0, 1],
            step: .01,
            start: .5,
            handles: 1,
            slide: function() {
                var n = e(this).val();
                e(t).jPlayer("option", "muted", !1), e(t).jPlayer("option", "volume", n), e(a + " .volumeText").html("Volume: " + (100 * n).toFixed(0))
            }
        }), e(a + " .seekBar").slider({
            range: [0, 100],
            step: .01,
            start: 0,
            handles: 1,
            slide: function() {
                var a = e(this).val();
                e(t).jPlayer("playHead", a)
            }
        }), e.extend(r, i), e(t).jPlayer(r)
    }
    e.fn.videoPlayer = function(t) {
        var n = "#" + e(this).attr("id"),
            i = "#" + e(this).find(".videoPlayer").attr("id");
        try {
            var s = e.parseJSON(e(this).find(".playerData").text())
        } catch (r) {
            console.log("JSON parse ERROR, fall back to JS!");
            var s = t
        }
        e(this).find(".playerData").remove(), e(this).append('<div class="playerScreen">            <a tabindex="1" href="#" class="video-play noload"></a>         </div>          <div class="controls">          <div class="leftblock">         <a tabindex="1" href="#" class="play smooth noload"></a>            <a tabindex="1" href="#" class="pause smooth noload"></a>           </div>          <div class="play-progress">         <span>' + s.name + '</span>         <div class="progressbar">           <div class="seekBar">           <div class="playBar"></div>         </div>          </div>          <div class="time current">00:00</div>           <div class="time duration">00:00</div>          </div>          <div class="rightblock">            <div class="volumeBar">         <div class="currentVolume"><div class="curvol"></div></div>         </div>          <div class="volumeText">Volume: 50</div>            <a href="#" tabindex="1" class="fullScreen smooth noload"></a>          <a href="#" tabindex="1" class="fullScreenOFF smooth noload"></a>       </div>'), e(this).hasClass("audioPlayer") && (e(this).find(".fullScreen").remove(), e(this).find(".fullScreenOFF").remove()), a(n, i, s, t)
    }
}(jQuery);