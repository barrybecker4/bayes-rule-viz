/**
 * Modules to interactively visualize disease testing using Baye's rule
 * https://www.mathsisfun.com/data/probability-false-negatives-positives.html
 */
var disease = (function(module) {

    module.POSITIVE_COLOR = "#eecc00";
    module.HEALTHY_COLOR = "#00ee11";
    module.DISEASED_COLOR = "#ff3300";
    module.TEST_NEG_HEALTHY = "#00ff00";
    module.TEST_NEG_DISEASED = "#cc0044";
    
    var TOTAL_POPULATION;

    var graph = {
        "nodes": [
            {"node": 0, "id": "diseased", "name": "Diseased"},
            {"node": 1, "id": "healthy", "name": "Healthy"},
            {"node": 2, "id": "test-negative-diseased", "name": "Test negative, but infected!"},
            {"node": 3, "id": "test-positive", "name": "Test positive for the Disease"},
            {"node": 4, "id": "test-negative-healthy", "name": "Test negative and Healthy"}
        ]
    };

    var sankeyView, vennDiagramView, bayesRuleView;


    /**
     * Initialize the module
     * @param totalPopulation - a number in the range [100, 1,000,000,000,000]
     * @param initialPctDiseased - probability of having the disease. In range [0.1, 10]
     * @param initialTestAccuracy - percent of time that the test is correct. In range [90, 99.5]
     */
    module.init = function(totalPopulation, initialPctDiseased, initialTestAccuracy) {

        initialPctDiseased = initialPctDiseased ? initialPctDiseased : 1;
        initialTestAccuracy = initialTestAccuracy ? initialTestAccuracy : 90;
        TOTAL_POPULATION = totalPopulation;

        $("#total-population").text(TOTAL_POPULATION.toLocaleString());
        $("#probability-diseased").text(initialPctDiseased);
        $("#test-accuracy").text(initialTestAccuracy);

        initializeInputSection(initialPctDiseased, initialTestAccuracy);

        bayesRuleView = disease.bayesRuleView("#bayes-rule-view", graph);
        vennDiagramView = disease.vennDiagramView("#venn-diagram-view", graph, TOTAL_POPULATION);
        sankeyView = disease.sankeyView("#sankey-view", graph);
        updateViews();

        $(window).resize(renderViews);
    };

    /**
     * Show two sliders that allow changing the incidence and accuracy.
     */
    function initializeInputSection(initialPctDiseased, initialTestAccuracy) {
        var probDiseasedSlider = $("#probability-diseased-slider");
        var testAccuracySlider = $("#test-accuracy-slider");

        // Using integer values to avoid round of problems at the max valu
        probDiseasedSlider.slider({
            value: initialPctDiseased * 100,
            min: 1,
            max: 2000.0,
            step: 1,
            height: "10px",
            slide: getSliderChangedHandler("#probability-diseased"),
            stop: clearThumbTip
        });

        testAccuracySlider.slider({
            value: initialTestAccuracy * 100,
            min: 8000,
            max: 9990,  // for some reason only goes to 99.8
            step: 1,
            slide: getSliderChangedHandler("#test-accuracy"),
            stop: clearThumbTip
        });
    }

    function getSliderChangedHandler(sliderEl) {
        return function (event, ui) {
            // update value in text
            var value = ui.value / 100;
            $(sliderEl).text(value);

            // current value (when sliding) or initial value (at start)
            var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + value
                + '</div><div class="tooltip-arrow"></div></div>';
            $(sliderEl + "-slider").find('.ui-slider-handle').html(tooltip);
            updateViews();
        }
    }

    function updateViews() {
        var probDiseased = parseFloat($("#probability-diseased").text()) / 100.0;
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
        //console.log(JSON.stringify(graph.links));

        renderViews();
    }

    function renderViews() {
        bayesRuleView.render();
        sankeyView.render();
        vennDiagramView.render();
    }

    function clearThumbTip(event, ui) {
        $("#probability-diseased-slider").find('.ui-slider-handle').empty();
        $("#test-accuracy-slider").find('.ui-slider-handle').empty();
    }


    return module;
} (disease || {}));