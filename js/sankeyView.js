
var disease = (function(module) {

    /**
     * Shows how the population is divided.
     * @param parentEl the selector for the element into which the sankeyView will be placed
     * @param graph the data to be graphed with sankey
     */
    module.sankeyView = function(parentEl, graph) {

        var margin = {top: 10, right: 10, bottom: 10, left: 10};

        var colorScale = d3.scale.ordinal()
            .range(["#ff3300", "#00ee11", "#cc0044", "#eebb00", "#00ff00"])
            .domain(["diseased", "healthy", "test-negative-diseased", "test-positive", "test-negative-healthy"]);

        // Set the sankey diagram properties
        var sankey = d3.sankey()
            .nodeWidth(20)
            .nodePadding(50);

        var defs, linksEl, nodesEl;
        
        var my = {};


        /** Add the initial svg structure */
        function init() {
            // append the svg canvas to the page
            var svg = d3.selectAll(parentEl).append("svg")
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            defs = svg.append("defs");
            linksEl = svg.append("g");
            nodesEl = svg.append("g");
        }


        /** update the sanky diagram */
        my.render = function() {
            var chartWidth = $(parentEl).width();
            var chartHeight = $(parentEl).height();
            var width = chartWidth - margin.left - margin.right;
            var height = chartHeight - margin.top - margin.bottom;
            var t = d3.transition().duration(500);

            // append the svg canvas to the page
            var svg = d3.select(parentEl + " svg")
                .attr("width", chartWidth)
                .attr("height", chartHeight);

            // Set the sankey diagram properties
            sankey
                .size([width, height])
                .nodes(graph.nodes)
                .links(graph.links)
                .layout(0);  // 32

            addColorGradients();
            addLinks();
            addNodes(width);
        };

        function addLinks() {
            var path = sankey.link();

            var links = linksEl.selectAll(".link")
                .data(graph.links, getLinkID);

            var linkEnter = links.enter()
                .append("path")
                .attr("class", "link");

            // add the link titles
            linkEnter.append("title")
                .text(function (d) {
                    return d.source.name + " -> " + d.target.name;
                });

            links
                .attr("d", path)
                .style("stroke", function(d) {
                    return "url(#" + getLinkID(d) + ")";
                })
                .style("stroke-width", function (d) {
                    return Math.max(1, d.dy);
                })
                .sort(function (a, b) {
                    return b.dy - a.dy;
                });
        }

        function addNodes(width) {
            var nodes = nodesEl.selectAll(".node").data(graph.nodes);

            var nodeEnter = nodes.enter();

            var nodeG = nodeEnter.append("g")
                .attr("class", "node");

            nodes.select("g.node")
                .call(d3.behavior.drag()
                    .origin(function (d) {
                        return d;
                    })
                    .on("dragstart", function () {
                        this.parentNode.appendChild(this);
                    })
                    .on("drag", dragmove)
                );

            nodes
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            // add the rectangles for the nodes
            nodeG.append("rect")
                .attr("width", sankey.nodeWidth())
                .style("fill", nodeColor)
                .style("stroke", function (d) {
                    return d3.rgb(d.color).darker(1);
                })
                .append("title")
                .text(function (d) {
                    return d.name + "\n" + d.value.toLocaleString();
                });

            nodes.select("rect")
                .attr("height", function (d) {
                    return d.dy;
                });

            // add in the title for the nodes
            nodeG.append("text")
                .attr("x", -6)
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .attr("transform", null)
                .text(function (d) {
                    return d.name;
                })
                .filter(function (d) {
                    return d.x < width / 2;
                })
                .attr("x", 6 + sankey.nodeWidth())
                .attr("text-anchor", "start");

            nodes.select("text")
                .attr("y", function (d) {
                    return d.dy / 2;
                });
        }

        /** add link color gradients */
        function addColorGradients() {

            var grads = defs.selectAll("linearGradient")
                .data(graph.links, getLinkID);

            grads.enter().append("linearGradient")
                .attr("id", getLinkID)
                .attr("gradientUnits", "userSpaceOnUse");


            grads.html("") // erase any existing <stop> elements on update
                .append("stop")
                .attr("offset", "0%")
                .attr("stop-color", function (d) {
                    return nodeColor((+d.source.x <= +d.target.x) ? d.source : d.target);
                });

            grads.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", function (d) {
                    return nodeColor((+d.source.x > +d.target.x) ? d.source : d.target)
                });
        }

        function getLinkID(d) {
            return "link-" + makeValid(d.source.name) + "-" + makeValid(d.target.name);
        }

        function nodeColor(d) {
            return d.color = colorScale(makeValid(d.name));
        }

        function makeValid(s) {
            return s.replace(/ /g, "").replace(/,/g, "");
        }


        // the function for moving the nodes
        function dragmove(d) {
            d3.select(this).attr("transform",
                "translate(" + d.x + "," + (
                    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
            sankey.relayout();
            link.attr("d", path);
        }

        init();
        return my;
    };

    return module;
} (disease || {}));