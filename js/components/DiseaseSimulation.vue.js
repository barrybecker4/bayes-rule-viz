import sankeyView from './sankeyView.js'
import vennDiagramView from './vennDiagramView.js'
import diseaseConstants from './diseaseConstants.js'


/**
 * Interactively visualize disease testing using Bayes' rule.
 * https://www.mathsisfun.com/data/probability-false-negatives-positives.html
 */

let TOTAL_POPULATION;
let sankeyViewer, vennDiagramViewer;

export default {
   template: `
      <div>
           <div class="inputs">
           <span class="input-line">The incidence of the disease in the population is
               <span id="probability-diseased"></span>%
               <span id="probability-diseased-slider" class="slider"></span>
           </span>
               <div class="input-line">The disease testing accuracy is <span id="test-accuracy"></span>%
                   <div id="test-accuracy-slider" class="slider"></div>
               </div>
           </div>
           <bayes-rule-view></bayes-rule-view>
           <div id="venn-diagram-view"></div>
           <div id="sankey-view"></div>
      </div>`,

   props: {
     totalPopulation: 100000,
     initialPctDiseased: 1,
     initialTestAccuracy: 90,
   },

   data() {
       return {
           graph: {
               "nodes": [
                   {"node": 0, "id": "diseased", "name": "Diseased"},
                   {"node": 1, "id": "healthy", "name": "Healthy"},
                   {"node": 2, "id": "test-negative-diseased", "name": "Test negative, but infected!"},
                   {"node": 3, "id": "test-positive", "name": "Test positive for the Disease"},
                   {"node": 4, "id": "test-negative-healthy", "name": "Test negative and Healthy"}
               ]
           }
       }
   },

   mounted() {
       this.init(this.totalPopulation, this.initialPctDiseased, this.initialTestAccuracy);
   },

   methods: {
       /**
        * Initialize the module
        * @param totalPopulation - a number in the range [100, 1,000,000,000,000]
        * @param initialPctDiseased - probability of having the disease. In range [0.1, 10]
        * @param initialTestAccuracy - percent of time that the test is correct. In range [90, 99.5]
        */
       init: function(totalPopulation, initialPctDiseased, initialTestAccuracy) {

            initialPctDiseased = initialPctDiseased ? initialPctDiseased : 1;
            initialTestAccuracy = initialTestAccuracy ? initialTestAccuracy : 90;
            TOTAL_POPULATION = totalPopulation;

            $("#total-population").text(TOTAL_POPULATION.toLocaleString());
            $("#probability-diseased").text(initialPctDiseased);
            $("#test-accuracy").text(initialTestAccuracy);

            this.initializeInputSection(initialPctDiseased, initialTestAccuracy);

            //bayesRuleViewer = bayesRuleView("#bayes-rule-view", this.graph, TOTAL_POPULATION);
            vennDiagramViewer = vennDiagramView("#venn-diagram-view", this.graph, TOTAL_POPULATION);
            sankeyViewer = sankeyView("#sankey-view", this.graph);
            this.updateViews();

            $(window).resize(renderViews);
        },

        /**
         * Show two sliders that allow changing the incidence and accuracy.
         */
        initializeInputSection: function(initialPctDiseased, initialTestAccuracy) {
            var probDiseasedSlider = $("#probability-diseased-slider");
            var testAccuracySlider = $("#test-accuracy-slider");

            // Using integer values to avoid rounding problems at the max value
            probDiseasedSlider.slider({
                value: Math.log10(initialPctDiseased),
                min: -2,
                max: 1.0,
                step: 0.1,
                height: "10px",
                slide: this.getSliderChangedHandler("#probability-diseased", this.pctDiseasedConverter),
                stop: this.clearThumbTip
            });

            testAccuracySlider.slider({
                value: initialTestAccuracy * 10,
                min: 800,
                max: 999,
                step: 1,
                slide: this.getSliderChangedHandler("#test-accuracy", this.testAccuracyConverter),
                stop: this.clearThumbTip
            });
        },

        pctDiseasedConverter: function(sliderValue) {
            return diseaseConstants.format(Math.pow(10, sliderValue), 2);
        },

        testAccuracyConverter: function(sliderValue) {
            return sliderValue / 10;
        },

        /**
         * @param sliderEl jquery selector for slider
         * @param convert function used to map slider value to actual value
         * @returns {Function} slider changed callback
         */
        getSliderChangedHandler: function(sliderEl, convert) {
            let vm = this;
            return function (event, ui) {
                // update value in text
                var value = convert(ui.value);
                $(sliderEl).text(value);

                // current value (when sliding) or initial value (at start)
                var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + value
                    + '</div><div class="tooltip-arrow"></div></div>';
                $(sliderEl + "-slider").find('.ui-slider-handle').html(tooltip);
                vm.updateViews();
            }
        },

        updateViews: function() {
            var probDiseased = parseFloat($("#probability-diseased").text()) / 100.0;
            var testAccuracy = parseFloat($("#test-accuracy").text()) / 100.0;

            var diseasedPop = probDiseased * TOTAL_POPULATION;
            var healthyPop = TOTAL_POPULATION - diseasedPop;
            var testNegAndHealthy = testAccuracy * healthyPop;
            var testNegButDiseased = (1.0 - testAccuracy) * diseasedPop;
            var testPositiveAndDiseased = diseasedPop - testNegButDiseased;
            var testPositiveButHealthy = healthyPop - testNegAndHealthy;
            var testPositive = testPositiveAndDiseased + testPositiveButHealthy;

            this.graph.links = [
                {"source": 0, "target": 2, "value": testNegButDiseased},
                {"source": 0, "target": 3, "value": testPositiveAndDiseased},
                {"source": 1, "target": 3, "value": testPositiveButHealthy},
                {"source": 1, "target": 4, "value": testNegAndHealthy}
            ];

            // update footnote info
            $("#num-positive").text(testPositive.toLocaleString());
            $("#num-population").text(TOTAL_POPULATION.toLocaleString());
            var probPositive = testPositive / TOTAL_POPULATION;
            $("#prob-positive").text(diseaseConstants.format(probPositive, 4));

            this.renderViews();
        },

        renderViews: function() {
            //bayesRuleViewer.render();
            sankeyViewer.render();
            vennDiagramViewer.render();
        },

        clearThumbTip: function(event, ui) {
            $("#probability-diseased-slider").find('.ui-slider-handle').empty();
            $("#test-accuracy-slider").find('.ui-slider-handle').empty();
        },
   },
}
