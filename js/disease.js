
var disease = (function(module) {

    /** Initialize the module */
    module.init = function() {

        initializeInputSection();

        var sankeyView = disease.sankeyView("#chart");
    };

    /**
     * Show two sliders that allow changing the incidence and accuracy.
     *
     * TODO:
     *  - add jquery ui images to lib/images
     *  - add vennDiagramView
     *  - add bayeyTheoemView
     *  - update views when params change and rerender
     */
    function initializeInputSection() {
        var probDiseasedSlider = $("#probability-diseased-slider");
        var testAccuracySlider = $("#test-accuracy-slider");

        probDiseasedSlider.slider({
            value: 0.1,
            min: 0.01,
            max: 1.0,
            step: 0.01,
            height: "10px",
            slide: getSliderChangedHandler("#probability-diseased"),
            stop: clearThumbTip
        });

        testAccuracySlider.slider({
            value: 99.0,
            min: 95,
            max: 100.0,
            step: 0.1,
            slide: getSliderChangedHandler("#test-accuracy"),
            stop: clearThumbTip
        });
    }

    function getSliderChangedHandler(sliderEl) {
        return function (event, ui) {
            // update value in text
            $(sliderEl).text(ui.value);

            // current value (when sliding) or initial value (at start)
            var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + ui.value
                + '</div><div class="tooltip-arrow"></div></div>';
            $(sliderEl + "-slider").find('.ui-slider-handle').html(tooltip);
        }
    }

    function clearThumbTip() {
        $("#probability-diseased-slider").find('.ui-slider-handle').empty();
        $("#test-accuracy-slider").find('.ui-slider-handle').empty();
    }


    return module;
} (disease || {}));