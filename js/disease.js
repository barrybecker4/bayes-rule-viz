
var disease = (function(module) {

    module.init = function() {

        $("#probability-diseased-slider").slider({
            value: 0.1,
            min: 0.01,
            max: 1.0,
            step: 0.01,
            height: "10px",
            slide: function(event, ui) {
                $("#probability-diseased").text(ui.value);
            }
        });

        $("#test-accuracy-slider").slider({
            value: 99.0,
            min: 98,
            max: 100.0,
            step: 0.1,
            labels: true,
            pips: true,
            slide: function(event, ui) {
                $("#test-accuracy").text(ui.value);
            }
        });

        var sankeyView = disease.sankeyView("#chart");


    };


    return module;
} (disease || {}));