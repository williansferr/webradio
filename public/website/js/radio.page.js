/*!
 * (c) Copyright Spacial Audio Solutions, LLC - 2015.
 * Please make sure to read the license before making any use of this software.
 * http://spacial.com
 */

var selected = $("#btnHist")[0];
show = function (arg, caller) {
    selected.parentElement.classList.remove("selected");
    caller.parentElement.classList.add("selected");
    selected = caller;
    switch (arg) {
        case 1:
            $("#tabs-2").addClass("hide");
            $("#tabs-3").addClass("hide");
            $("#tabs-1").removeClass("hide");
            document.location.hash = "#history";
            break;
        case 2:
            $("#tabs-1").addClass("hide");
            $("#tabs-3").addClass("hide");
            $("#tabs-2").removeClass("hide");
            document.location.hash = "#library";
            break;
        case 3:
            $("#tabs-1").addClass("hide");
            $("#tabs-2").addClass("hide");
            $("#tabs-3").removeClass("hide");
            document.location.hash = "#schedule";
            break;
    }
};

$(document).ready(function () {
    $ = jQuery;
    var jq_noc = $.noConflict();
    var StationId;
    var Token;
    var MenuType;
    var MaxItems;
    var WidgetUrl;
    var QueueItems;
    var ShowScheduledTimeline;
    var TimelineHours;
    var WidgetTheme;
    var SocialMeda;
    var StartPlayer;
    var ShowDedicationsWidget;

    jq_noc.loadScript = function (url, dataType, callback, errorCallback) {
        jq_noc.ajax({
            url: url,
            dataType: dataType,
            async: false,
            success: function (result) {
                if (callback) {
                    callback(result);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (errorCallback) {
                    errorCallback();
                }
            }
        });
    };

    jq_noc.loadScript("config.json", "json",
            function (result) {
                var totalToShow = 0;
                StationId = result.StationId;
                Token = result.Token;
                MenuType = result.MenuType;
                MaxItems = result.MaxItems || 15;
                QueueItems = result.QueueItems || 15;
                ShowScheduledTimeline = result.ShowScheduledTimeline || "no";
                TimelineHours = result.TimelineHours;
                WidgetTheme = result.WidgetTheme;
                WidgetUrl = "http://samcloudmedia.spacial.com/webwidgets/widget/v4";
                SocialMeda = result.SocialMeda;
                StartPlayer = result.StartPlayer || "no";
                ShowDedicationsWidget = result.ShowDedicationsWidget || "no";

                if (!StationId || !Token) {
                    jQuery(".page-loading").addClass("hide");
                    jQuery("#header").addClass("hide");
                    jQuery(".page").addClass("hide");
                    jQuery(".footer").addClass("hide");
                    jQuery("#validationForm").removeClass("hide");
                    return;
                }
                jQuery("#validationForm").addClass("hide");

                if (MenuType) {
                    jQuery("#menu").removeClass("classic");
                    jQuery("#menu").removeClass("compact");
                    jQuery("#menu").addClass(MenuType);
                }

                if (ShowScheduledTimeline == undefined || ShowScheduledTimeline != "yes") {
                    jQuery("#mnuShowScheduleTimelineWidget").remove();
                    jQuery("#tabs-3").remove();
                }
                if (ShowDedicationsWidget == undefined || ShowDedicationsWidget != "yes") {
                    jQuery("#dedication-li").remove();
                }

                var shareBoxContainer = jQuery(".share-box-container")[0];
                if (SocialMeda && (SocialMeda.Facebook && ++totalToShow > 0)
                        | (SocialMeda.Twitter && ++totalToShow > 0)
                        | (SocialMeda.Google && ++totalToShow > 0)
                        | (SocialMeda.Email && ++totalToShow > 0)) {
                    shareBoxContainer.parentNode.classList.remove("hide");
                    shareBoxContainer.style.maxWidth = 52 * totalToShow + "px";

                    var facebookNode = jQuery("#social-facebook");
                    var twitterNode = jQuery("#social-twitter");
                    var googleNode = jQuery("#social-google");
                    var emailNode = jQuery("#social-email");


                    if (SocialMeda.Facebook) {
                        facebookNode[0].href = SocialMeda.Facebook;
                        facebookNode.removeClass("hide");
                    } else {
                        facebookNode.addClass("hide");
                    }

                    if (SocialMeda.Twitter) {
                        twitterNode[0].href = SocialMeda.Twitter;
                        twitterNode.removeClass("hide");
                    } else {
                        twitterNode.addClass("hide");
                    }

                    if (SocialMeda.Google) {
                        googleNode[0].href = SocialMeda.Google;
                        googleNode.removeClass("hide");
                    } else {
                        googleNode.addClass("hide");
                    }

                    if (SocialMeda.Email) {
                        emailNode.removeClass("hide");
                        emailNode[0].title = SocialMeda.Email;
                        emailNode[0].onclick = function (event) {
                            window.alert(SocialMeda.Email);
                        };
                    } else {
                        emailNode.addClass("hide");
                    }

                } else {
                    shareBoxContainer.parentNode.classList.add("hide");
                }
                $ = jQuery;
                $("div[class^='spacial-widget-']").each(function () {
                    var classList = $(this)[0].classList;
                    var info;
                    for (var i = 0; i < classList.length; i++) {
                        if (classList[i].indexOf("spacial-widget-") === 0) {
                            info = classList[i];
                            break;
                        }
                    }
                    $(this).removeClass(info);
                    info = info.replace("placeholder", StationId + "-" + Token);
                    $(this).addClass(info);
                });
                var widgetUrl = WidgetUrl + '/spacialwidget.js?his=' + MaxItems + '&queue=' + QueueItems + '&lib=' + MaxItems + '&hours=' + TimelineHours + '&art=true&startPlayer=' + StartPlayer;

                if (WidgetTheme != "custom") {
                    widgetUrl += '&themeType=defined&theme=' + WidgetTheme;
                } else {
                    widgetUrl += '&themeType=custom&theme=';
                }

                jq_noc('head').append('<script type="text/javascript" src="' + widgetUrl + '">').append('</ script>');

                if (document.location.hash == "#library") {
                    show(2, $("#btnLib")[0]);
                } else if (document.location.hash == "#history") {
                    show(1, $("#btnHist")[0]);
                } else if (document.location.hash == "#schedule") {
                    if (ShowScheduledTimeline == undefined || ShowScheduledTimeline != "yes") {
                        show(2, $("#btnLib")[0]);
                    } else {
                        show(3, $("#btnSchedule")[0]);
                    }
                }
            },
            function () {
                jQuery(".page-loading").addClass("hide");
                jQuery("#header").addClass("hide");
                jQuery(".page").addClass("hide");
                jQuery(".footer").addClass("hide");
                jQuery("#validationForm").removeClass("hide");
            }
    );
});

function onLoadHandler() {
    $ = jQuery;
    $("#loading-overlay").addClass("hide");
}

function onQueueEmpty() {
    $ = jQuery;
    $("#content")[0].style.width = "95%";
    $("#comingUp-li").addClass("hide");
}

function onDedicationStatus(isEnabled) {
    if (isEnabled) {
        $ = jQuery;
        $("#content")[0].style.width = "64%";
        $("#dedication-li").removeClass("hide");
    } else {
        $("#dedication-li").addClass("hide");
    }
}

function onResultsFound() {
    $ = jQuery;
    $("#content")[0].style.width = "64%";
    $("#comingUp-li").removeClass("hide");
}


function  _generateJson() {
    var json = {
        "StationId": jQuery('#StationId').val(),
        "Token": jQuery('#Token').val(),
        "MenuType": jQuery('input[name=menuType]:checked').val(),
        "MaxItems": jQuery('#MaxItems').val(),
        "QueueItems": jQuery('#QueueItems').val(),
        "ShowScheduledTimeline": jQuery('#ShowScheduledTimeline')[0].checked ? "yes" : "no",
        "TimelineHours": jQuery('#TimelineHours').val(),
        "ShowDedicationsWidget": jQuery('#ShowScheduledTimeline')[0].checked ? "yes" : "no",
        "WidgetTheme": jQuery('input[name=widgetThemeType]:checked').val(),
        "StartPlayer": jQuery('input[name=rbStartPlayer]:checked').val(),
        "SocialMeda": {
            "Facebook": jQuery('#Facebook').val(),
            "Twitter": jQuery('#Twitter').val(),
            "Google": jQuery('#Google').val(),
            "Email": jQuery('#Email').val()
        }
    };

    jQuery('#jsonFormatted').val(JSON.stringify(json, null, 2));
    jQuery('#jsonFormatted').removeClass("hide");
}