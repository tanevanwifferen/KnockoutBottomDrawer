/// <reference path="../../../Scripts/typings/jqueryui/jqueryui.d.ts" />
class BottomDrawerSettings {
    public snap = true;
    public open = ko.observable(false);
    public percentage = ko.observable<number>(0);
}

ko.bindingHandlers['BottomDrawer'] = {
    init: (element, valueAccessor) => {
        this.toggle = (jqElement: JQuery, open: boolean) => {
            var windowHeight = $("#body").height();
            if (open) {
                jqElement.animate({ top: windowHeight - 45 + "px" }, 150);
                jqElement.children(".bottomDrawerContent").animate({ height: 0 }, 150);
            } else {

                jqElement.animate({ top: "0px" }, 150);
                jqElement.children(".bottomDrawerContent").height(windowHeight - 45 + "px");
            }
        };

        var value: BottomDrawerSettings = valueAccessor();

        var jqElement = $(element);
        jqElement.draggable({
            handle: ".filterHeader",
            snapMode: "inner",
            containment: [0, 45, 0, "100%"],
            axis: "y",
            drag: (event: JQueryEventObject) => {
                jqElement.css("height", "");
                jqElement.css("bottom", "0");
                var height = $(".filterView").height();
                jqElement.children(".bottomDrawerContent").height(height + "px");
            },
            stop: (event, ui) => {
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
                this.toggle(newValue);
            }
        });
    },
    update: (element, valueAccessor) => {
        debugger;
        var jqElement = $(element);
        var settings: BottomDrawerSettings = ko.unwrap(valueAccessor());
        var shouldBeOpen = settings.open();
        this.toggle(jqElement, shouldBeOpen);
    }
}