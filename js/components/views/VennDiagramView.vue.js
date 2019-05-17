import diseaseConsts from '../diseaseConsts.js'
import circleUtils from './circleUtils.js'

/** all circles will be relative to the test positive circle */
const TEST_POS_CIRCLE_RADIUS = 250;
const DURATION = 300;
const POP_LABEL_X = 100;
const POP_LABEL_Y = 260;

let margin = {top: 10, bottom: 10, left: 10};

export default {

   template: `<div id="venn-diagram-view"></div>`,

   props: {
       graph: {},
       totalPopulation: 0,
   },

   mounted() {
       let vm = this;
       this.init();

       this.$root.$on('highlight', data => {
           vm.doHighlight(data);
       });
       this.$root.$on('unhighlight', data => {
           vm.doUnhighlight(data);
       });
   },

   watch: {
       graph: {
           handler(g){
             this.render();
           },
           deep: true
      }
   },

   methods: {

       /** Add the initial svg structure */
       init: function() {
            // append the svg canvas to the page
            let rootSvg = d3.selectAll("#" + this.$el.id).append("svg");
            let vm = this;

            let svg = rootSvg.append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            svg.append("circle")
                .attr("class", diseaseConsts.HEALTHY_TEST_NEG)
                .attr("fill-opacity", 0.3)
                .attr("fill", diseaseConsts.TEST_NEG_HEALTHY_COLOR)
                .on("mouseover", function(d) {
                    vm.$root.$emit('highlight', diseaseConsts.HEALTHY_TEST_NEG);
                })
                .on("mouseout", function(d) {
                    vm.$root.$emit('unhighlight', diseaseConsts.HEALTHY_TEST_NEG);
                })
                .append("title").text("The whole population of " + this.totalPopulation.toLocaleString() +
                    " people. \nThose outside the red circle are healthy");
            svg.append("text")
                .attr("class", "venn-label population")
                .attr("x", POP_LABEL_X)
                .attr("y", POP_LABEL_Y)
                .text("Whole Population");

            svg.append("circle")
                .attr("class", "test-positive-circle")
                .attr("fill-opacity", 0.2)
                .attr("fill", diseaseConsts.POSITIVE_COLOR);

            svg.append("text")
                .attr("class", "venn-label diseased")
                .text("Diseased");
            svg.append("line")
                .attr("class", "venn-line diseased");

            svg.append("circle")
                .attr("class", "diseased-circle")
                .attr("fill-opacity", 0.1).attr("fill", diseaseConsts.DISEASED_COLOR)
                .append("title");

            svg.append("path")
                .attr("class", diseaseConsts.DISEASED_TEST_POS)
                .attr("fill-opacity", 0.4)
                .attr("fill", "#ffaa00")
                .on("mouseover", function(d) {
                    vm.$root.$emit('highlight', diseaseConsts.DISEASED_TEST_POS);
                })
                .on("mouseout", function(d) {
                    vm.$root.$emit('unhighlight', diseaseConsts.DISEASED_TEST_POS);
                })
                .append("title");

            svg.append("path")
                .attr("class", diseaseConsts.DISEASED_TEST_NEG)
                .attr("fill-opacity", 0.5)
                .attr("fill", diseaseConsts.TEST_NEG_DISEASED_COLOR)
                .on("mouseover", function(d) {
                    vm.$root.$emit('highlight', diseaseConsts.DISEASED_TEST_NEG);
                })
                .on("mouseout", function(d) {
                    vm.$root.$emit('unhighlight', diseaseConsts.DISEASED_TEST_NEG);
                })
                .append("title");

            svg.append("path")
                .attr("class", diseaseConsts.HEALTHY_TEST_POS)
                .attr("fill-opacity", 0.1)
                .attr("fill", "#55ee00")
                .on("mouseover", function(d) {
                    vm.$root.$emit('highlight', diseaseConsts.HEALTHY_TEST_POS);
                })
                .on("mouseout", function(d) {
                    vm.$root.$emit('unhighlight', diseaseConsts.HEALTHY_TEST_POS);
                })
                .append("title");

            svg.append("text")
                .attr("class", "venn-label positive")
                .text("Tested Positive");

            window.addEventListener('resize', this.render);
        },

       /** update the Venn diagram */
       render: function() {

            let el = this.$el;
            let chartWidth = el.clientWidth;
            let chartHeight = el.clientHeight;
            let chartWidthD2 = chartWidth / 2;
            let chartHeightD2 = chartHeight / 2 + 30;

            let svg = d3.select("#" + el.id + " svg")
                .attr("width", chartWidth)
                .attr("height", chartHeight);

            let numPositiveAndDiseased = this.graph.links[1].value;
            let numPositiveAndHealthy =  this.graph.links[2].value;
            let testNegButDiseased = Math.round(this.graph.links[0].value);
            let numDiseased = testNegButDiseased + numPositiveAndDiseased;
            let numPositive = numPositiveAndDiseased + numPositiveAndHealthy;

            let testPositiveRad = TEST_POS_CIRCLE_RADIUS;
            let scaleFactor = Math.sqrt(this.totalPopulation / numPositive);
            let diseasedRad = testPositiveRad * Math.sqrt(numDiseased / numPositive);
            let popRad = testPositiveRad * scaleFactor;
            let popArea = Math.PI * popRad * popRad;
            let diseaseArea = Math.PI * diseasedRad * diseasedRad;
            let overlap = (numPositiveAndDiseased / numDiseased) * diseaseArea;

            /*console.log("diseaseArea = "+ diseaseArea + " overlap="+ overlap
                + " numPosAndD="+ numPositiveAndDiseased + " numDis="+ numDiseased);
            console.log("diseaseArea= " + diseaseArea + " popArea= "+ popArea
                + " numDiseased= " + numDiseased + " pop= " + this.totalPopulation
                + " rat1=" + diseaseArea/popArea + " rat2="+ numDiseased/this.totalPopulation);
            console.log("numPositiveAndDiseased = " + numPositiveAndDiseased + " numDiseased = "
             + numDiseased + " overlap="+ overlap);*/

            let distance = circleUtils.findCircleSeparation({
                radiusA: testPositiveRad,
                radiusB: diseasedRad,
                overlap: overlap
            });

            let centerX = chartWidthD2 + testPositiveRad - 180;
            let diseasedCenterY = chartHeightD2 - distance;
            let popCircleCenterX = Math.max(chartWidthD2 - popRad, 0) + popRad + 40;

            svg.selectAll("circle.healthy--test-negative-healthy")
                .attr("cx", popCircleCenterX)
                .attr("cy", chartHeightD2)
                .attr("r", popRad);

            let rot = 180 / Math.PI * Math.asin(popRad / popCircleCenterX);
            let diseasedTop = diseasedCenterY - diseasedRad;
            svg.selectAll("text.venn-label.positive")
                .attr("x", centerX - 30)
                .attr("y", 0.7 * chartHeight);
            svg.selectAll("text.venn-label.diseased")
                .attr("x", centerX + 30)
                .attr("y", diseasedTop - 5);

            svg.selectAll("line.venn-line.diseased")
                .attr("x1", centerX)
                .attr("y1", diseasedTop + 1)
                .attr("x2", centerX + 29)
                .attr("y2", diseasedTop - 10);
            svg.selectAll("text.venn-label.population")
                .attr("transform", "rotate(" + -rot + " " + POP_LABEL_X + " " + POP_LABEL_Y + ")");

            svg.selectAll("circle.test-positive-circle")
                .attr("cx", centerX)
                .attr("cy", chartHeightD2)
                .attr("r", testPositiveRad);

            svg.selectAll("circle.diseased-circle")
                .attr("cx", centerX)
                .attr("cy", diseasedCenterY)
                .attr("r", diseasedRad);

            // Draw paths for 2 halves of disease circle - the part in the intersection, and outside of it.
            // See https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
            let pdPath = svg.selectAll("path.diseased--test-positive");
            let pctDiseasedGivenPositive = diseaseConsts.format(100 * numPositiveAndDiseased / numPositive, 2);
            pdPath.attr("d", this.pathFunc(centerX, chartHeightD2, testPositiveRad,
                    centerX, diseasedCenterY, diseasedRad, 0, 1,   1, 1));
            pdPath.select("title").text(numPositiveAndDiseased.toLocaleString() +
                " (" + pctDiseasedGivenPositive + "%) " + " of the " +
                numPositive.toLocaleString() +
                " that tested positive\nactually have the disease.");

            let ndPath = svg.selectAll("path.diseased--test-negative-diseased");
            ndPath.attr("d", this.pathFunc(centerX, chartHeightD2, testPositiveRad,
                centerX, diseasedCenterY, diseasedRad, 0, 1,  0, 0));
            ndPath.select("title").text(testNegButDiseased.toLocaleString() + " out of "
                + numDiseased.toLocaleString() + "\nwith the disease test negative.");

            let phPath = svg.selectAll("path.healthy--test-positive");
            phPath.attr("d", this.pathFunc(centerX, chartHeightD2, testPositiveRad,
                centerX, diseasedCenterY, diseasedRad, 1, 0,  1, 1));
            phPath.select("title")
                .text(numPositiveAndHealthy.toLocaleString()  + " are healthy out of the\n" +
                    numPositive.toLocaleString() + " that tested positive.");
        },

       pathFunc: function(x1, y1, rad1, x2, y2, rad2, largeArcFlag1, sweepFlag1, largeArcFlag2, sweepFlag2) {
           let interPoints = circleUtils.circleIntersection(x1, y1, rad1,  x2, y2, rad2);
           if (interPoints[0] == interPoints[2])
              return "M0,0";
           else {
              let rotation = 0;
              return "M" +
                   interPoints[0] + "," + interPoints[2] + "A" + rad2 + "," + rad2 + " " + rotation + " " +
                   largeArcFlag2 + " " + sweepFlag2 + " " +
                   interPoints[1] + "," + interPoints[3]+ "A" + rad1 + "," + rad1 +  " " + rotation + " " +
                   largeArcFlag1 + " " + sweepFlag1 + " " +
                   interPoints[0] + "," + interPoints[2];
           }
       },

       doHighlight: function(id) {

           let styles = {};
           let svg = getSvg();
           switch(id) {
               case diseaseConsts.HEALTHY_TEST_NEG:
                   styles.fillOpacity = 0.4;
                   styles.strokeWidth = 3;
                   styles.strokeOpacity = 0.6;
                   break;
               case diseaseConsts.DISEASED_TEST_POS:
                   styles.fillOpacity = 1.0;
                   styles.strokeWidth = 1;
                   styles.strokeOpacity = 1.0;
                   svg.select("circle.test-positive-circle").transition("tooltip").duration(DURATION)
                      .attr("fill-opacity", 0.4)
                      .style("stroke", "black")
                      .style("stroke-width", 1)
                      .style("stroke-opacity", 0.3);
                   break;
               case diseaseConsts.HEALTHY_TEST_POS:
                   styles.fillOpacity = 0.5;
                   styles.strokeWidth = 1;
                   styles.strokeOpacity = 1.0;
                   svg.select("circle.test-positive-circle").transition("tooltip").duration(DURATION)
                       .style("stroke", "black")
                       .style("stroke-width", 2)
                       .style("stroke-opacity", 0.7);
                   break;
               case diseaseConsts.DISEASED_TEST_NEG:
                   styles.fillOpacity = 1.0;
                   styles.strokeWidth = 1;
                   styles.strokeOpacity = 1.0;
                   svg.select("circle.diseased-circle").transition("tooltip").duration(DURATION)
                       .style("stroke", "black")
                       .style("stroke-width", 1)
                       .style("stroke-opacity", 0.3);
                   break;
               default:
               throw "Unexpected style: " + id;
           }
           d3.select("#venn-diagram-view ." + id).transition().duration(DURATION)
                .style("stroke", "black")
                .style("fill-opacity", styles.fillOpacity)
                .style("stroke-width", styles.strokeWidth)
                .style("stroke-opacity", styles.strokeOpacity);
           ;
       },

       doUnhighlight: function(id) {
           let styles = {};
           let svg = getSvg();
           switch(id) {
               case diseaseConsts.HEALTHY_TEST_NEG:
                   styles.fillOpacity = 0.3;
                   styles.strokeWidth = 0;
                   styles.strokeOpacity = 0.0;
                   break;
               case diseaseConsts.DISEASED_TEST_POS:
                   styles.fillOpacity = 0.2;
                   styles.strokeWidth = 0;
                   styles.strokeOpacity = 0.0;
                   svg.select("circle.test-positive-circle").transition("tooltip").duration(DURATION)
                       .attr("fill-opacity", 0.3)
                       .style("stroke-width", 0)
                       .style("stroke-opacity", 0.0);
                   break;
              case diseaseConsts.HEALTHY_TEST_POS:
                  styles.fillOpacity = 0.1;
                  styles.strokeWidth = 0;
                  styles.strokeOpacity = 0.0;
                  svg.select("circle.test-positive-circle").transition("tooltip").duration(DURATION)
                      .style("stroke-width", 0)
                      .style("stroke-opacity", 0.0);
              case diseaseConsts.DISEASED_TEST_NEG:
                  styles.fillOpacity = 0.5;
                  styles.strokeWidth = 0;
                  styles.strokeOpacity = 0.0;
                  svg.select("circle.diseased-circle").transition("tooltip").duration(DURATION)
                      .style("stroke-width", 0)
                      .style("stroke-opacity", 0.0);
                  break;
              default:
                 throw "Unexpected style: " + id;
           }
           d3.select("#venn-diagram-view ." + id).transition().duration(DURATION)
               .style("stroke", "none")
               .style("fill-opacity", styles.fillOpacity)
               .style("stroke-width", styles.strokeWidth)
               .style("stroke-opacity", styles.strokeOpacity);
       },
   }
}

function getSvg() {
    return d3.select("#venn-diagram-view svg");
}
