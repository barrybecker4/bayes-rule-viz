
var disease = (function(module) {

    /**
     * @param parentEl the selector for the element into which the bayesRuleView will be placed.
     * @param graph data
     */
    module.bayesRuleView = function(parentEl, graph) {

        var margin = {top: 10, right: 10, bottom: 10, left: 10};
        var root;

        var my = {};


        /** Add the initial svg structure */
        function init() {
            root = $(parentEl);
            createExpression();
        }

        function createExpression() {
            var bayeRuleExp = $("" +
                '<table class="bayes-rule-exp" align="center" cellpadding="0" cellspacing="0">' +
                '<tr>' +
                '<td rowspan="2" nowrap="nowrap"> p(<span class="diseased">D</span> | <span class="positive">positive</span>)&nbsp; = &nbsp;</td>' +
                '<td class="numerator"> p(<span class="diseased">D</span>) &nbsp; p(<span class="positive">positive</span> | <span class="diseased">D</span>) </td>' +
                '<td rowspan="2" nowrap="nowrap"> &nbsp; = &nbsp;</td>' +
                '<td class="numerator"><span class="prob-diseased"></span> * <span class="prob-pos-given-diseased"></span></td>' +
                '<td rowspan="2" nowrap="nowrap"> &nbsp; = &nbsp; <span class="prob-diseased-result"></span><span class="prob-diseased-worry"></span></td>' +
                '<td rowspan="2" nowrap="nowrap" width="100%"> &nbsp;</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="upper_line">p(<span class="positive">positive</span>)</td>' +
                '<td class="upper_line"><span class="prob-positive"></span></td>' +
                '</tr>' +
                '</table>');

            root.append(bayeRuleExp);
        }

        /** update the Bayes rule formula with the current numbers */
        my.render = function() {

            /*
            graph.links = [
                {"source": 0, "target": 2, "value": testNegButDiseased},
                {"source": 0, "target": 3, "value": testPositiveAndDiseased},
                {"source": 1, "target": 3, "value": testPositiveButHealthy},
                {"source": 1, "target": 4, "value": testNegAndHealthy}
            ];*/

            var bayesRule = $(".bayes-rule-exp");
            var numPositiveAndDiseased = graph.links[1].value;
            var numPositiveAndHealthy =  graph.links[2].value;
            var numDiseased = graph.links[0].value + numPositiveAndDiseased;
            var numPositive = numPositiveAndDiseased + numPositiveAndHealthy;
            var probPositiveGivenDiseased = numPositiveAndDiseased / numDiseased;
            bayesRule.find(".prob-diseased").text(numDiseased.toLocaleString());
            bayesRule.find(".prob-pos-given-diseased").text(probPositiveGivenDiseased.toLocaleString());
            bayesRule.find(".prob-positive").text(numPositive.toLocaleString());

            var probDiseasedGivenPositive = (100 * numDiseased * probPositiveGivenDiseased) / numPositive;

            var worryAttrs = getWorryAttrs(probDiseasedGivenPositive);
            bayesRule.find(".prob-diseased-result").text(probDiseasedGivenPositive.toLocaleString(undefined, { maximumFractionDigits: 1 }) + "%  ");
            bayesRule.find(".prob-diseased-worry").text(worryAttrs.howMuch).css("color", worryAttrs.color);
        };

        /** Determine how much you should worry given your probability of having the disease */
        function getWorryAttrs(probDiseased) {
            var worryAttrs = {};

            if (probDiseased < 5) {
                worryAttrs.howMuch = "Don't Worry!";
                worryAttrs.color = "#00ee00";
            }
            else if (probDiseased < 10) {
                worryAttrs.howMuch = "Perhaps you should worry a little...";
                worryAttrs.color = "#99cc00";
            }
            else if (probDiseased < 20) {
                worryAttrs.howMuch = "You should be concerned, but don't panic.";
                worryAttrs.color = "#dd9900";
            }
            else if (probDiseased < 50) {
                worryAttrs.howMuch = "Yes, you should worry.";
                worryAttrs.color = "#ee0000";
            }
            else {
                worryAttrs.howMuch = "Panic!";
                worryAttrs.color = "#cc0000";
            }
            return worryAttrs;
        }

        init();
        return my;
    };

    return module;
} (disease || {}));