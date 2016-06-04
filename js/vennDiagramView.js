var disease = (function(module) {

    /**
     * @param parentEl the selector for the element into which the vennDiagramView will be placed
     * @param graph data
     * @param totalPopulation some big number
     */
    module.vennDiagramView = function(parentEl, graph, totalPopulation) {

        //var margin = {top: 10, right: 10, bottom: 10, left: 10};
        var TRANS_DURATION = 400;
        var STROKE_WIDTH = 1;
        var OVER_STROKE_WIDTH = 2;
        var STROKE_OPACITY = 0.7;
        var OVER_STROKE_OPACITY = 1.0;
        var FILL_OPACITY = 0.3;
        var OVER_FILL_OPACITY = 0.6;

        var my = {};
        var chart = venn.VennDiagram();
        var div;
        var tooltip;
        var colors = [disease.TEST_NEG_HEALTHY, disease.POSITIVE_COLOR, disease.DISEASED_COLOR];
        var cmap = d3.scale.ordinal();

        /** Add the initial svg structure */
        function init() {
            div = d3.select(parentEl);

            cmap.domain(["Population", "Test positive", "Diseased"]).range(colors);

            // add a tooltip to place when mousing over
            tooltip = d3.select(parentEl).append("div")
                .attr("class", "venntooltip");
        }

        /** update the Venn diagram */
        my.render = function() {
            var chartWidth = $(parentEl).width();
            var chartHeight = $(parentEl).height();
            chart.width(chartWidth).height(chartHeight);

            div.datum(createSets()).call(chart);

            div.selectAll("path")
                .style("stroke-opacity", 0)
                .style("stroke", "#fff")
                .style("stroke-width", 0)

            d3.selectAll(parentEl + " .venn-circle path")
                .style("fill-opacity", FILL_OPACITY)
                .style("fill", function(d, i) { return colors[i]; });
                //.style("stroke-width", STROKE_WIDTH)
                //.style("stroke-opacity", STROKE_OPACITY)
                //.style("stroke", function(d, i) { return colors[i]; });

            d3.selectAll(parentEl + " .venn-circle text")
                .style("fill", "black")
                .style("font-size", "16px")
                .style("font-weight", "100");

            // add listeners to all the groups to display tooltip on mouseover
            var circles = div.selectAll("g");
            circles
                .on("mouseover", function(d, i) {
                    // sort all the areas relative to the current item
                    venn.sortAreas(div, d);

                    // Display a tooltip with the current size
                    tooltip.transition().duration(TRANS_DURATION)
                        .style("opacity", .7);
                    tooltip.text(d.size.toLocaleString() + " people");

                    // highlight the current path
                    var selection = d3.select(this).transition("tooltip").duration(TRANS_DURATION);
                    selection.select("path")
                        .style("stroke-width", OVER_STROKE_WIDTH)
                        .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
                        .style("stroke-opacity", OVER_STROKE_OPACITY);
                })

                .on("mousemove", function() {
                    tooltip.style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })

                .on("mouseout", function(d, i) {
                    // remove the ttip
                    tooltip.transition().duration(TRANS_DURATION).style("opacity", 0);

                    // restore circle styling
                    var selection = d3.select(this).transition("tooltip").duration(TRANS_DURATION);
                    selection.select("path")
                        .style("stroke-width", 0)
                        .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
                        .style("stroke-opacity", 0)
                });
        };

        function createSets() {

            var numPositiveAndDiseased = 100;
            var numPositiveAndHealthy =  80;
            var testNegButDiseased = 5;
            if (graph.links) {
                numPositiveAndDiseased = graph.links[1].value;
                numPositiveAndHealthy =  graph.links[2].value;
                testNegButDiseased = graph.links[0].value;
            }
            var numDiseased = testNegButDiseased + numPositiveAndDiseased;
            var numPositive = numPositiveAndDiseased + numPositiveAndHealthy;

            return [ {sets: ['Population'], size: totalPopulation},
                {sets: ['Test positive'], size: numPositive},
                {sets: ['Diseased'], size: numDiseased},
                {sets: ['Population','Test positive'], size: numPositive},
                {sets: ['Population','Diseased'], size: numDiseased},
                {sets: ['Test positive', 'Diseased'], size: numPositiveAndDiseased}
                // {sets: ['Population', 'Test positive', 'Diseased'], "size": numDiseased}
            ];
        }

        init();
        return my;
    };


    return module;
} (disease || {}));