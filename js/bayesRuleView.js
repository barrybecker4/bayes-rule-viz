
var disease = (function(module) {

    /**
     *
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
                '<td rowspan="2" nowrap="nowrap"> p(D | positive)&nbsp; = &nbsp;</td>' +
                '<td nowrap="nowrap"> p(D) &nbsp; p(positive | D) </td>' +
                '<td rowspan="2" nowrap="nowrap"> &nbsp; = &nbsp;</td>' +
                '<td nowrap="nowrap">23 * 989</td>' +
                '<td rowspan="2" nowrap="nowrap"> &nbsp; = &nbsp; 7.34%</td>' +
                '<td rowspan="2" nowrap="nowrap" width="100%"> &nbsp;</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="upper_line">p(positive)</td>' +
                '<td class="upper_line">1234</td>' +
                '</tr>' +
                '</table>');

            root.append(bayeRuleExp);
        }

        /** update the sanky diagram */
        my.render = function() {


        };

        init();
        return my;
    };

    return module;
} (disease || {}));