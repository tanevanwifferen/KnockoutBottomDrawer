class BottomDrawerSettings {
    public snap: KnockoutObservable<boolean>;
    public afterAdd: () => void;
    public onOpen: () => void;
    public onClose: () => void;
    public open: KnockoutObservable<boolean>;
    public percentage: KnockoutObservable<number>;
    public openOnTap: KnockoutObservable<boolean> | boolean;
    public animate: KnockoutObservable<boolean> | boolean;
}

/**
 * A binding for a slider coming up from the bottom of the screen. It is optimized
 * for small mobile screens.
 *
 * @requires jQuery, jQuery Draggable, KnockoutJs
 *
 * Functionality (under development)
 * - beforeAdd
 * - afterRemove
 * - snap open or closed
 * - tap
 */
ko.bindingHandlers["BottomDrawer"] = {
    init: (element, valueAccessor, allBindings) => {
        var settings: BottomDrawerSettings = valueAccessor();

        // click handler
        if (settings.animate == undefined) {
            settings.animate = true;
        }

        var toggleFunction = (percentage: number) => {
            setTimeout(() => {
                var jqElement = $(element);

                var topPercentage = 100 - percentage;
                var parentHeight = element.parentNode.clientHeight;
                var headerHeight = jqElement.children(".header").height();
                var headerPercentage = headerHeight / parentHeight * 100;

                var contentHeight = (parentHeight * percentage / 100 ) - headerHeight;
                if (contentHeight < 0) {
                    contentHeight = 0;
                }

                if (topPercentage + headerPercentage > 100) {
                    topPercentage = topPercentage - headerPercentage;
                }

                var timing = 0;
                if (ko.unwrap(settings.animate)) {
                    timing = 150;
                }

                jqElement.animate({ top: topPercentage + "%" }, timing);
                jqElement.children(".content").animate({ height: contentHeight + "px" }, 150);

                jqElement.animate({ height: headerHeight + contentHeight + "px" }, 0);

                settings.percentage(percentage);

                if (ko.unwrap(settings.snap)) {
                    if (percentage === 0 && settings.onClose) {
                        settings.onClose();
                    }
                    if (percentage === 100 && settings.onOpen) {
                        settings.onOpen();
                    }
                }
            }, 0);
        };

        // click handler
        if (settings.openOnTap == undefined) {
            settings.openOnTap = true;
        }
        if (settings.percentage == undefined) {
            settings.percentage = ko.observable<number>(0);
        }

        if (settings.open !== undefined) {
            settings.open.subscribe((newValue) => {
                if (newValue) {
                    toggleFunction(100);
                } else {
                    toggleFunction(0);
                }
            });
        }

        toggleFunction(settings.percentage());
        if (ko.unwrap(settings.openOnTap)) {
            ko.utils.registerEventHandler($(element).children(".header"), "click", () => {
                var percentage = ko.unwrap(settings.percentage);
                var newPercentage = percentage > 50 ? 0 : 100;
                toggleFunction(newPercentage);
            });
        }

        // drag handler
        var jqElement = $(element);
        jqElement.draggable({
            handle: ".header",
            snapMode: "inner",
            containment: [0, jqElement.children(".header").height(), 0, "100%"],
            axis: "y",
            drag: (event: JQueryEventObject, ui) => {
                var dragPostionFromTop = ui.position.top;
                var parent = jqElement.parent();
                var parentHeight = parent.height();
                var headerHeight = jqElement.children(".header").height();
                var contentHeight = parentHeight - dragPostionFromTop;
                if (contentHeight < 0) {
                    contentHeight = 0;
                }
                settings.percentage(100 - (dragPostionFromTop / parentHeight * 100));
                jqElement.animate({ height: headerHeight + contentHeight + "px" }, 0);
                jqElement.children(".content").animate({ height: contentHeight + "px" }, 0);
                jqElement.children(".content").animate({ top: headerHeight + "px" }, 0);
            },
            stop: (event, ui) => {
                var position = ui.position.top;
                var windowHeight = $("#body").height();

                var realPosition = windowHeight - position;

                if (ko.unwrap(settings.snap)) {
                    if (realPosition < windowHeight / 2) {
                        toggleFunction(0);
                    } else {
                        toggleFunction(100);
                    }
                } else {
                    toggleFunction(realPosition / windowHeight * 100);
                }
            }
        });

        if (settings.afterAdd) {
            settings.afterAdd();
        }
    }
}