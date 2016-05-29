
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
        }


        /** update the sanky diagram */
        my.render = function() {

            var bayeRuleExp = $("" +
                '<table class="fraction" align="center" cellpadding="0" cellspacing="0">' +
                '<tr>' +
                '<td rowspan="2" nowrap="nowrap"> x&nbsp; = &nbsp;</td>' +
                '<td nowrap="nowrap"> p(B) p(A|B) </td>' +
                '<td rowspan="2" nowrap="nowrap"> &nbsp; = &nbsp;</td>' +
                '<td nowrap="nowrap"> x<sup>2</sup> + x + 1 </td>' +
                '</tr>' +
                '<tr>' +
                '<td class="upper_line">2 cos(<i>x</i>)</td>' +
                '<td class="upper_line">5 sin(<i>x</i>)</td>' +
                '</tr>' +
                '</table>');

            root.append(bayeRuleExp);
        };

        init();
        return my;
    };

    return module;
} (disease || {}));