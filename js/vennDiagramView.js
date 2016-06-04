var disease = (function(module) {

    /**
     * @param parentEl the selector for the element into which the vennDiagramView will be placed
     * @param graph data
     * @param totalPopulation some big number
     */
    module.vennDiagramView = function(parentEl, graph, totalPopulation) {

        //var margin = {top: 10, right: 10, bottom: 10, left: 10};
        var TRANS_DURATION = 400;

        var my = {};
        var chart = venn.VennDiagram();
        var div;
        var tooltip;

        /** Add the initial svg structure */
        function init() {
            div = d3.select(parentEl);

            // add a tooltip to place when mousing over
            tooltip = d3.select(parentEl).append("div")
                .attr("class", "venntooltip");
/*
            svg.append("circle")
                .attr("class", "population-circle")
                .attr("opacity", 0.4).attr("fill", disease.TEST_NEG_HEALTHY)
                .append("title").text("The whole population. Those outside the red circle are healthy.");
            svg.append("circle")
                .attr("class", "test-positive-circle")
                .attr("opacity", 0.8).attr("fill", disease.POSITIVE_COLOR);
            svg.append("circle")
                .attr("class", "diseased-circle")
                .attr("opacity", 0.2).attr("fill", disease.DISEASED_COLOR)
                .append("title").text("These are healthy, but tested positive.");
            svg.append("circle").on("click", function() {alert("hi")})
                .attr("class", "diseased-circle")
                .attr("opacity", 0.9).attr("fill", disease.TEST_NEG_DISEASED)
                .style("mask", "url(#test-pos-mask)")
                .append("title").text("These people have the disease, but they tested negative, so they will die.")
            svg.append("circle")
                .attr("class", "test-positive-circle")
                .attr("opacity", 0.0)
                .append("title").text("These people tested positive");
                */
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
                .style("stroke-width", 0);

            // add listeners to all the groups to display tooltip on mouseover
            var circles = div.selectAll("g");
            circles
                .on("mouseover", function(d, i) {
                    // sort all the areas relative to the current item
                    venn.sortAreas(div, d);

                    // Display a tooltip with the current size
                    tooltip.transition().duration(TRANS_DURATION).style("opacity", .9);
                    tooltip.text(d.size.toLocaleString() + " people");

                    // highlight the current path
                    var selection = d3.select(this).transition("tooltip").duration(TRANS_DURATION);
                    selection.select("path")
                        .style("stroke-width", 2)
                        .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
                        .style("stroke-opacity", 1);
                })

                .on("mousemove", function() {
                    tooltip.style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })

                .on("mouseout", function(d, i) {
                    tooltip.transition().duration(TRANS_DURATION).style("opacity", 0);
                    var selection = d3.select(this).transition("tooltip").duration(TRANS_DURATION);
                    selection.select("path")
                        .style("stroke-width", 0)
                        .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
                        .style("stroke-opacity", 0);
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