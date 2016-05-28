/**
 * Modules to interactively visualize disease testing using Baye's rule
 * https://www.mathsisfun.com/data/probability-false-negatives-positives.html
 */
var disease = (function(module) {

    var TOTAL_POPULATION;

    var graph = {
        "nodes": [
            {"node": 0, "id": "diseased", "name": "Actually Diseased"},
            {"node": 1, "id": "healthy", "name": "Actually Healthy"},
            {"node": 2, "id": "test-negative-diseased", "name": "Test negative,<br>but they have the Disease!"},
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
        initialTestAccuracy = initialTestAccuracy ? initialTestAccuracy : 95;
        TOTAL_POPULATION = totalPopulation;

        $("#total-population").text(TOTAL_POPULATION.toLocaleString());
        $("#probability-diseased").text(initialPctDiseased);
        $("#test-accuracy").text(initialTestAccuracy);

        initializeInputSection(initialPctDiseased, initialTestAccuracy);

        bayesRuleView = disease.bayesRuleView("#bayes-rule-view", graph);
        sankeyView = disease.sankeyView("#sankey-view", graph);
        //vennDiagramView = disease.vennDiagramView("#venn-diagram-view", graph);

        updateViews();

        $(window).resize(renderViews);
    };

    /**
     * Show two sliders that allow changing the incidence and accuracy.
     */
    function initializeInputSection(initialPctDiseased, initialTestAccuracy) {
        var probDiseasedSlider = $("#probability-diseased-slider");
        var testAccuracySlider = $("#test-accuracy-slider");

        probDiseasedSlider.slider({
            value: initialPctDiseased,
            min: 0.1,
            max: 10.0,
            step: 0.1,
            height: "10px",
            slide: getSliderChangedHandler("#probability-diseased"),
            stop: clearThumbTip
        });

        testAccuracySlider.slider({
            value: initialTestAccuracy,
            min: 80,
            max: 99.5,
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
        //vennDiagramView.render();
    }

    function clearThumbTip() {
        $("#probability-diseased-slider").find('.ui-slider-handle').empty();
        $("#test-accuracy-slider").find('.ui-slider-handle').empty();
    }


    return module;
} (disease || {}));