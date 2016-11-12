var _this = this;
/// <reference path="../../../Scripts/typings/jqueryui/jqueryui.d.ts" />
var BottomDrawerSettings = (function () {
    function BottomDrawerSettings() {
        this.snap = true;
        this.open = ko.observable(false);
        this.percentage = ko.observable(0);
    }
    return BottomDrawerSettings;
}());
ko.bindingHandlers['BottomDrawer'] = {
    init: function (element, valueAccessor) {
        _this.toggle = function (jqElement, open) {
            var windowHeight = $("#body").height();
            if (open) {
                jqElement.animate({ top: windowHeight - 45 + "px" }, 150);
                jqElement.children(".bottomDrawerContent").animate({ height: 0 }, 150);
            }
            else {
                jqElement.animate({ top: "0px" }, 150);
                jqElement.children(".bottomDrawerContent").height(windowHeight - 45 + "px");
            }
        };
        var value = valueAccessor();
        var jqElement = $(element);
        jqElement.draggable({
            handle: ".filterHeader",
            snapMode: "inner",
            containment: [0, 45, 0, "100%"],
            axis: "y",
            drag: function (event) {
                jqElement.css("height", "");
                jqElement.css("bottom", "0");
                var height = $(".filterView").height();
                jqElement.children(".bottomDrawerContent").height(height + "px");
            },
            stop: function (event, ui) {
                var position = ui.position.top;
                var windowHeight = $("#body").height();
                var openNow = FilterObject.filterOpen();
                var newValue = false;
                if (value.snap) {
                    if (position < windowHeight / 2) {
                        newValue = true;
                    }
                }
                FilterObject.filterOpen(newValue);
                _this.toggle(newValue);
            }
        });
    },
    update: function (element, valueAccessor) {
        debugger;
        var jqElement = $(element);
        var settings = ko.unwrap(valueAccessor());
        var shouldBeOpen = settings.open();
        _this.toggle(jqElement, shouldBeOpen);
    }
};
