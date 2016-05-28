
var disease = (function(module) {

    var TOTAL_POPULATION;

    var graph = {
        "nodes": [
            {"node": 0, "id": "diseased", "name": "Actually Diseased"},
            {"node": 1, "id": "healthy", "name": "Actually Healthy"},
            {"node": 2, "id": "test-negative-diseased", "name": "Test negative, but they have the Disease!"},
            {"node": 3, "id": "test-positive", "name": "Test positive for the Disease"},
            {"node": 4, "id": "test-negative-healthy", "name": "Test negative and Healthy"}
        ],
        "links": [
            {"source":0, "target":2, "value":42},
            {"source":0, "target":3, "value":2058},
            {"source":1, "target":3, "value":158},
            {"source":1, "target":4, "value":7742}
        ]
    };

    var sankeyView, vennDiagramView, bayesRuleView;


    /** Initialize the module */
    module.init = function(totalPopulation) {

        TOTAL_POPULATION = totalPopulation;

        $("#total-population").text(TOTAL_POPULATION.toLocaleString());

        initializeInputSection();

        sankeyView = disease.sankeyView("#sankey-view", graph);
        //vennDiagramView = disease.vennDiagramView("#venn-diagram-view", graph);
        //bayesRuleView = disease.bayesRuleView("#bayes-rule-view", graph);

        $(window).resize(renderViews);
    };

    /**
     * Show two sliders that allow changing the incidence and accuracy.
     */
    function initializeInputSection() {
        var probDiseasedSlider = $("#probability-diseased-slider");
        var testAccuracySlider = $("#test-accuracy-slider");

        probDiseasedSlider.slider({
            value: 0.2,
            min: 0.1,
            max: 1.0,
            step: 0.01,
            height: "10px",
            slide: getSliderChangedHandler("#probability-diseased"),
            stop: clearThumbTip
        });

        testAccuracySlider.slider({
            value: 98.0,
            min: 95,
            max: 99.0,
            step: 0.5,
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
            updateViews();
        }
    }

    function updateViews() {
        var probDiseased = parseFloat($("#probability-diseased").text());
        var testAccuracy = parseFloat($("#test-accuracy").text()) / 100.0;

        var diseasedPop = probDiseased * TOTAL_POPULATION;
        var healthyPop = TOTAL_POPULATION - diseasedPop;
        var testNegAndHealthy = testAccuracy * healthyPop;
        var testNegButDiseased = (1.0 - testAccuracy) * diseasedPop;
        var testPositiveAndDiseased = diseasedPop - testNegButDiseased;
        var testPositiveButHealthy = healthyPop - testNegAndHealthy;

        graph.links = [
            {"source": 0, "target": 2, "value": testNegButDiseased},
            {"source": 0, "target": 3, "value": testPositiveAndDiseased},
            {"source": 1, "target": 3, "value": testPositiveButHealthy},
            {"source": 1, "target": 4, "value": testNegAndHealthy}
        ];
        console.log(JSON.stringify(graph.links));

        renderViews();
    }

    function renderViews() {
        sankeyView.render();
        //vennDiagramView.render();
        //bayesRuleView.render();
    }

    function clearThumbTip() {
        $("#probability-diseased-slider").find('.ui-slider-handle').empty();
        $("#test-accuracy-slider").find('.ui-slider-handle').empty();
    }


    return module;
} (disease || {}));