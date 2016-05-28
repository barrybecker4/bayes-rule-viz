
var disease = (function(module) {

    /**
     *
     * @param parentEl the selector for the element into which the bayesRuleView will be placed.
     * @param graph data
     */
    module.bayesRuleView = function(parentEl, graph) {

        var margin = {top: 10, right: 10, bottom: 10, left: 10};


        var my = {};


        /** Add the initial svg structure */
        function init() {
            // append the svg canvas to the page
            var svg = d3.selectAll(parentEl).append("svg")
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");


        }

        /** update the sanky diagram */
        my.render = function() {
            var chartWidth = $(parentEl).width();
            var chartHeight = $(parentEl).height();
            var width = chartWidth - margin.left - margin.right;
            var height = chartHeight - margin.top - margin.bottom;


            // append the svg canvas to the page
            var svg = d3.select(parentEl + " svg")
                .attr("width", chartWidth)
                .attr("height", chartHeight);
        };
        
        init();
        return my;
    };

    return module;
} (disease || {}));