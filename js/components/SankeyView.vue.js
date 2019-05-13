import diseaseConstants from './diseaseConstants.js'


let colorScale = d3.scale.ordinal()
    .range([
        diseaseConstants.DISEASED_COLOR,
        diseaseConstants.HEALTHY_COLOR,
        diseaseConstants.TEST_NEG_DISEASED,
        diseaseConstants.POSITIVE_COLOR,
        diseaseConstants.TEST_NEG_HEALTHY
        ])
    .domain(["diseased", "healthy", "test-negative-diseased", "test-positive", "test-negative-healthy"]);

function getLinkID(d) {
   return "link-" + makeValid(d.source.name) + "-" + makeValid(d.target.name);
};

function nodeColor(d) {
   return d.color = colorScale(makeValid(d.name));
};

function makeValid(s) {
   return s.replace(/ /g, "").replace(/,/g, "");
}

let sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(30);

let defs, linksEl, nodesEl;
let width, height;
let links;


export default {

   template: `<div id="sankey-view"></div>`,

   data() {
        return {
            margin: {top: 10, right: 10, bottom: 10, left: 10}
        }
   },

   props: {
     graph: {},
     probDiseased: 0,
     testAccuracy: 0,
   },

   mounted() {
       this.init();
   },

   watch: {
       graph: {
           handler() {
               this.render();
           },
           deep: true,
       },
       probDiseased: function() { this.render(); },
       testAccuracy: function() { this.render(); },
   },

   methods: {
       /** Add the initial svg structure */
       init: function() {
              var svg = d3.selectAll("#sankey-view").append("svg")
                  .append("g")
                  .attr("transform",
                      "translate(" + this.margin.left + "," + this.margin.top + ")");

              defs = svg.append("defs");
              linksEl = svg.append("g");
              nodesEl = svg.append("g");
              $(window).resize(this.render);
        },

       /** update the sankey diagram */
       render: function() {
           var chartWidth = $(this.$el).width();
           var chartHeight = $(this.$el).height();
           width = chartWidth - this.margin.left - this.margin.right;
           height = chartHeight - this.margin.top - this.margin.bottom;

           // append the svg canvas to the page
           var svg = d3.select("#" + this.$el.id + " svg")
               .attr("width", chartWidth)
               .attr("height", chartHeight);

           // Set the sankey diagram properties
           sankey
               .size([width, height])
               .nodes(this.graph.nodes)
               .links(this.graph.links)
               .layout(0);  // 32

           this.addColorGradients();
           this.addLinks();
           this.addNodes();
       },

       addLinks: function() {
            links = linksEl.selectAll(".link").data(this.graph.links, getLinkID);

            var linkEnter = links.enter()
                .append("path")
                .attr("class", "link")
                .append("title");

            var path = sankey.link();
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

            // add the link titles
            links.selectAll("path title")
                .text(function (d) {
                    var data = d3.select(this.parentNode).datum();
                    return d.source.name + " -> " + d.target.name + " (" + data.value.toLocaleString() + " people)";
                });
       },

       /**
        * consider foreign object for html styling
        * <foreignobject x="10" y="10" width="100" height="150">
        *   <body xmlns="http://www.w3.org/1999/xhtml">
        *   <div>Here is a <strong>paragraph</strong> that requires <em>word wrap</em></div>
        *  </body>
        */
       addNodes: function() {
            var nodes = nodesEl.selectAll(".node").data(this.graph.nodes);

            var nodeEnter = nodes.enter();

            var nodeG = nodeEnter.append("g")
                .attr("class", "node");

            nodes.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            // add the rectangles for the nodes
            nodeG.append("rect")
                .attr("width", sankey.nodeWidth())
                .style("fill", nodeColor)
                .style("stroke", function (d) {
                    return d3.rgb(d.color).darker(1);
                })
                .append("title");
            nodes.select("rect title")
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
        },

        /** add link color gradients */
       addColorGradients: function() {

            var grads = defs.selectAll("linearGradient")
                .data(this.graph.links, getLinkID);

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
       },
    },
}
