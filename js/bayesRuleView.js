
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
                '<td class="numerator"><span class="diseased">23</span> * 989</td>' +
                '<td rowspan="2" nowrap="nowrap"> &nbsp; = &nbsp; 7.34%</td>' +
                '<td rowspan="2" nowrap="nowrap" width="100%"> &nbsp;</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="upper_line">p(<span class="positive">positive</span>)</td>' +
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