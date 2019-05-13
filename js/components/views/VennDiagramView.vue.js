import diseaseConstants from '../diseaseConstants.js'

/** all circles will be relative to the test positive circle */
let TEST_POS_CIRCLE_RADIUS = 250;
let DURATION = 300;
let POP_LABEL_X = 100;
let POP_LABEL_Y = 260;

let margin = {top: 10, bottom: 10, left: 10};

export default {

   template: `<div id="venn-diagram-view"></div>`,

   props: {
     graph: {},
     totalPopulation: 0,
     probDiseased: 0,
     testAccuracy: 0,
   },

   mounted() {
       this.init();
   },

   watch: {
       probDiseased: function() { this.render(); },
       testAccuracy: function() { this.render(); },
   },

   methods: {

       /** Add the initial svg structure */
       init: function() {
            // append the svg canvas to the page
            var rootSvg = d3.selectAll("#venn-diagram-view").append("svg");
            var svg = rootSvg.append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            svg.append("circle")
                .attr("class", "population-circle")
                .attr("fill-opacity", 0.3)
                .attr("fill", diseaseConstants.TEST_NEG_HEALTHY)
                .on("mouseover", function(d) {
                    d3.select(this).transition("tooltip").duration(DURATION)
                        .style("stroke", "black")
                        .style("fill-opacity", 0.4)
                        .style("stroke-width", 2)
                        .style("stroke-opacity", 0.6);
                })
                .on("mouseout", function(d) {
                    d3.select(this).transition("tooltip").duration(DURATION)
                        .style("fill-opacity", 0.3)
                        .style("stroke-width", 0)
                        .style("stroke-opacity", 0.0);
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
                .attr("fill", diseaseConstants.POSITIVE_COLOR);

            svg.append("text")
                .attr("class", "venn-label diseased")
                .text("Diseased");
            svg.append("line")
                .attr("class", "venn-line diseased");

            svg.append("circle")
                .attr("class", "diseased-circle")
                .attr("fill-opacity", 0.1).attr("fill", diseaseConstants.DISEASED_COLOR)
                .append("title");

            svg.append("path")
                .attr("class", "test-positive-diseased-intersection")
                .attr("fill-opacity", 0.5)
                .attr("fill", "#ffaa00")
                .on("mouseover", function(d) {
                    d3.select(this).transition("tooltip").duration(DURATION)
                        .style("stroke", "black")
                        .style("fill-opacity", 1.0)
                        .style("stroke-width", 1)
                        .style("stroke-opacity", 1.0);
                    svg.select("circle.test-positive-circle").transition("tooltip").duration(DURATION)
                        .attr("fill-opacity", 0.5)
                        .style("stroke", "black")
                        .style("stroke-width", 1)
                        .style("stroke-opacity", 0.3);
                })
                .on("mouseout", function(d) {
                    d3.select(this).transition("tooltip").duration(DURATION)
                        .style("fill-opacity", 0.2)
                        .style("stroke-width", 0)
                        .style("stroke-opacity", 0.0);
                    svg.select("circle.test-positive-circle").transition("tooltip").duration(DURATION)
                        .attr("fill-opacity", 0.3)
                        .style("stroke-width", 0)
                        .style("stroke-opacity", 0.0);
                })
                .append("title");

            svg.append("path")
                .attr("class", "test-negative-diseased-intersection")
                .attr("fill-opacity", 0.6)
                .attr("fill", diseaseConstants.TEST_NEG_DISEASED)
                .on("mouseover", function(d) {
                    d3.select(this).transition("tooltip").duration(DURATION)
                        .style("stroke", "black")
                        .style("fill-opacity", 1.0)
                        .style("stroke-width", 1)
                        .style("stroke-opacity", 1.0);
                    svg.select("circle.diseased-circle").transition("tooltip").duration(DURATION)
                        .style("stroke", "black")
                        .style("stroke-width", 1)
                        .style("stroke-opacity", 0.3);
                })
                .on("mouseout", function(d) {
                    d3.select(this).transition("tooltip").duration(DURATION)
                        .style("fill-opacity", 0.6)
                        .style("stroke-width", 0)
                        .style("stroke-opacity", 0.0);
                    svg.select("circle.diseased-circle").transition("tooltip").duration(DURATION)
                        .style("stroke-width", 0)
                        .style("stroke-opacity", 0.0);
                })
                .append("title");

            svg.append("path")
                .attr("class", "test-positive-healthy-intersection")
                .attr("fill-opacity", 0.1)
                .attr("fill", "#55ee00")
                .on("mouseover", function(d) {
                    d3.select(this).transition("tooltip").duration(DURATION)
                        .style("stroke", "black")
                        .style("fill-opacity", 0.5)
                        .style("stroke-width", 1)
                        .style("stroke-opacity", 1.0);
                    svg.select("circle.test-positive-circle").transition("tooltip").duration(DURATION)
                        .style("stroke", "black")
                        .style("stroke-width", 2)
                        .style("stroke-opacity", 0.7);
                })
                .on("mouseout", function(d) {
                    d3.select(this).transition("tooltip").duration(DURATION)
                        .style("fill-opacity", 0.1)
                        .style("stroke-width", 0)
                        .style("stroke-opacity", 0.0);
                    svg.select("circle.test-positive-circle").transition("tooltip").duration(DURATION)
                        .style("stroke-width", 0)
                        .style("stroke-opacity", 0.0);
                })
                .append("title");

            svg.append("text")
                .attr("class", "venn-label positive")
                .text("Tested Positive");

            $(window).resize(this.render);
        },

       /** update the Venn diagram */
       render: function() {
            let el = $(this.$el);
            let chartWidth = el.width();
            let chartHeight = el.height();
            let chartWidthD2 = chartWidth / 2;
            let chartHeightD2 = chartHeight / 2 + 30;

            let svg = d3.select("#" + this.$el.id + " svg")
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
            /*console.log("diseaseArea = "+ diseaseArea + "overlap="+ overlap
                + " numPosAndD="+ numPositiveAndDiseased + " numDis="+ numDiseased);
            console.log("diseaseArea= " + diseaseArea + " popArea= "+ popArea
                + " numDiseased= " + numDiseased + " pop= " + this.totalPopulation
                + " rat1=" + diseaseArea/popArea + " rat2="+ numDiseased/this.totalPopulation);
            console.log("numPositiveAndDiseased = " + numPositiveAndDiseased + " numDiseased = "
             + numDiseased + " overlap="+ overlap); */
            let distance = this.findCircleSeparation({
                radiusA: testPositiveRad,
                radiusB: diseasedRad,
                overlap: overlap
            });

            let centerX = chartWidthD2 + testPositiveRad - 180;
            let diseasedCenterY = chartHeightD2 - distance;
            let popCircleCenterX = Math.max(chartWidthD2 - popRad, 0) + popRad + 40;

            svg.selectAll("circle.population-circle")
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

            // Draw paths for 2 halves of disease circle - the part in the intersection, and outsied of it.
            // See https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
            let pdPath = svg.selectAll("path.test-positive-diseased-intersection");
            let pctDiseasedGivenPositive = diseaseConstants.format(100 * numPositiveAndDiseased / numPositive, 2);
            pdPath.attr("d", this.pathFunc(centerX, chartHeightD2, testPositiveRad,
                    centerX, diseasedCenterY, diseasedRad, 0, 1,   1, 1));
            pdPath.select("title").text(numPositiveAndDiseased.toLocaleString() +
                " (" + pctDiseasedGivenPositive + "%) " + " of the " +
                numPositive.toLocaleString() +
                " that tested positive\nactually have the disease.");

            let ndPath = svg.selectAll("path.test-negative-diseased-intersection");
            ndPath.attr("d", this.pathFunc(centerX, chartHeightD2, testPositiveRad,
                centerX, diseasedCenterY, diseasedRad, 0, 1,  0, 0));
            ndPath.select("title").text(testNegButDiseased.toLocaleString() + " out of "
                + numDiseased.toLocaleString() + "\nwith the disease test negative.");

            let phPath = svg.selectAll("path.test-positive-healthy-intersection");
            phPath.attr("d", this.pathFunc(centerX, chartHeightD2, testPositiveRad,
                centerX, diseasedCenterY, diseasedRad, 1, 0,  1, 1));
            phPath.select("title")
                .text(numPositiveAndHealthy.toLocaleString()  + " are healthy out of the\n" +
                    numPositive.toLocaleString() + " that tested positive.");
        },

       pathFunc: function(x1, y1, rad1, x2, y2, rad2, largeArcFlag1, sweepFlag1, largeArcFlag2, sweepFlag2) {
           let interPoints = this.circleIntersection(x1, y1, rad1,  x2, y2, rad2);
           let rotation = 0;
           return "M" +
                interPoints[0] + "," + interPoints[2] + "A" + rad2 + "," + rad2 + " " + rotation + " " +
                largeArcFlag2 + " " + sweepFlag2 + " " +
                interPoints[1] + "," + interPoints[3]+ "A" + rad1 + "," + rad1 +  " " + rotation + " " +
                largeArcFlag1 + " " + sweepFlag1 + " " +
                interPoints[0] + "," + interPoints[2];
       },

        /**
         * Given circle A with radiusA, and circle B with radiusB, and a desired amount of overlap,
         * find the distance between the center of A and B.
         *
         * Circle A is at the origin. Circle B starts radA + radB to the right where intersection = 0.
         * When they are both at the origin, the overlap is min(areaA, areaB)
         * Move them closer until the amount of overlap is equal to the desired overlap.
         *
         * @param circleInfo radiusA, radiusB, overlap
         * @return the center distance between circles A and B.
         */
       findCircleSeparation: function(circleInfo) {

           let radA = circleInfo.radiusA;
           let radB = circleInfo.radiusB;
           let radAsq = radA * radA;
           let radBsq = radB * radB;
           let maxDistance = radA + radB;
           let maxOverlap = Math.PI * Math.min(radAsq, radBsq);
           //console.log("radA=" + radA + " radB="+ radB + " maxDist=" + maxDistance
           // + " maxOver="+ maxOverlap + " overlap=" + circleInfo.overlap);

           // This function returns the area of intersection when the two circles are x apart.
           let y = function (x) {
               if (x == 0) {
                   return maxOverlap;
               }
               let cosCBD = (radBsq + x * x - radAsq) / (2.0 * radB * x);
               let cosCAD = (radAsq + x * x - radBsq) / (2.0 * radA * x);
               if (Math.abs(cosCBD) > 1 || Math.abs(cosCAD) > 1) {
                   // then the two circles do not intersect at all
                   return maxOverlap;
               }
               let angleCBD = 2.0 * Math.acos(cosCBD);
               let angleCAD = 2.0 * Math.acos(cosCAD);
               return 0.5 * (angleCBD * radBsq - radBsq * Math.sin(angleCBD)
                   + angleCAD * radAsq - radAsq * Math.sin(angleCAD));
            };

            return this.findXForY(circleInfo.overlap, y, maxDistance, maxOverlap);
       },

        /**
         * @param overlap the overlapping area value we want to find x for.
         * @param y the function of x that will yield the support value.
         * @param maxDistance the maximum distance the two circles can be apart before they no longer overlap.
         * @param maxOverlap the maximum amount of overlap possible. The min of the two circle areas.
         * @return the x value for the given y(x)
         */
        findXForY: function(overlap, y, maxDistance, maxOverlap) {

            // if they totally overlay, then we know the distance is 0;
            if (overlap == maxOverlap) {
                return 0;
            }
            let lower = 0;
            let upper = maxDistance;
            let currentGuess = maxDistance / 2.0;
            let currentY = y(currentGuess);
            if (isNaN(currentY)) {
                throw "y is NaN for " + currentGuess;
            }
            let EPS = 0.05;
            // if an answer is not found after 20 iterations something is wrong
            let MAX_ITERATIONS = 30;
            let ct = 0;

            while (Math.abs(overlap - currentY) > EPS && ct++ < MAX_ITERATIONS) {
                if (currentY > overlap) {
                    // then move circles further apart
                    currentGuess = (upper + currentGuess) / 2;
                }
                else {
                    // then move circles closer together
                    currentGuess = (lower + currentGuess) / 2;
                }
                currentY = y(currentGuess);
                if (currentY > overlap) {
                    lower = currentGuess;
                }
                else {
                    upper = currentGuess;
                }
            }

            if (ct >= MAX_ITERATIONS) {
                throw "It was not possible to find the separation for overlap = " + overlap + " when maxOverlap is "
                + maxOverlap + " and maxDistance is " + maxDistance + ". Current range = [" + lower + ", " + upper + "]";
            }
            return currentGuess;
        },

        /**
         * @return the points that define the intersection region of two circles.
         */
        circleIntersection: function(x0, y0, r0, x1, y1, r1) {
            let a, dx, dy, distance, h, rx, ry;
            let x2, y2;

            //console.log(`p1=${x0} ${y0}, p2=${x1} ${y1}`)
            dx = x1 - x0;
            dy = y1 - y0;
            distance = Math.sqrt((dy * dy) + (dx * dx));

            if (distance > (r0 + r1)) {
                throw "No solution. circles do not intersect";
            }
            if (distance < Math.abs(r0 - r1)) {
                throw "No solution. one circle is contained in the other. Dist = " +
                    distance + " is less than " + r0 + " - " + r1 + " = " + Math.abs(r0 - r1);
            }

            // Determine the distance from point 0 to point 2.
            // point 2 is the point where the line through the circle
            // intersection points crosses the line between the circle centers.
            a = ((r0 * r0) - (r1 * r1) + (distance * distance)) / (2.0 * distance);

            // Determine the coordinates of point 2.
            x2 = x0 + (dx * a / distance);
            y2 = y0 + (dy * a / distance);

            // Determine the distance from point 2 to either of the
            // intersection points.
            h = Math.sqrt((r0 * r0) - (a * a));

            // Determine the offsets of the intersection points from point 2.
            rx = -dy * (h / distance);
            ry = dx * (h / distance);

            // Determine the absolute intersection points.
            let xi = x2 + rx;
            let xi_prime = x2 - rx;
            let yi = y2 + ry;
            let yi_prime = y2 - ry;

            return [xi, xi_prime, yi, yi_prime];
        },
   }
}
