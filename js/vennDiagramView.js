var disease = (function(module) {

    /**
     * @param parentEl the selector for the element into which the vennDiagramView will be placed
     * @param graph data
     * @param totalPopulation some big number
     */
    module.vennDiagramView = function(parentEl, graph, totalPopulation) {

        var margin = {top: 10, right: 10, bottom: 10, left: 10};

        /** all circles will be relative to the test positive circle */
        var TEST_POS_CIRCLE_RADIUS = 250;
        var DURATION = 300;

        var my = {};


        /** Add the initial svg structure */
        function init() {
            // append the svg canvas to the page
            var rootSvg = d3.selectAll(parentEl).append("svg");
            var svg = rootSvg.append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");


            svg.append("circle")
                .attr("class", "population-circle")
                .attr("fill-opacity", 0.3)
                .attr("fill", disease.TEST_NEG_HEALTHY)
                .append("title").text("The whole population of " + totalPopulation.toLocaleString() +
                    " people. \nThose outside the red circle are healthy");
            svg.append("circle")
                .attr("class", "test-positive-circle")
                .attr("fill-opacity", 0.3)
                .attr("fill", disease.POSITIVE_COLOR)
                .on("mousemove", function(d) {
                    d3.select(this).transition("tooltip").duration(DURATION)
                        .style("stroke", "black")
                        .style("fill-opacity", 0.5)
                        .style("stroke-width", 1)
                        .style("stroke-opacity", 0.9);
                })
                .on("mouseout", function(d) {
                    d3.select(this).transition("tooltip").duration(DURATION)
                        .style("fill-opacity", 0.3)
                        .style("stroke-width", 0)
                        .style("stroke-opacity", 0.0);
                })
                .append("title");

            svg.append("circle")
                .attr("class", "diseased-circle")
                .attr("fill-opacity", 0.1).attr("fill", disease.DISEASED_COLOR)
                .append("title");

            svg.append("path")
                .attr("class", "test-positive-diseased-intersection")
                .attr("fill-opacity", 0.3)
                .attr("fill", "#ddaa00")
                .on("mousemove", function(d) {
                    d3.select(this).transition("tooltip").duration(DURATION)
                        .style("stroke", "black")
                        .style("fill-opacity", 1.0)
                        .style("stroke-width", 1)
                        .style("stroke-opacity", 1.0);
                    svg.select("circle.test-positive-circle").transition("tooltip").duration(DURATION)
                        .attr("fill-opacity", 0.2)
                        .style("stroke", "black")
                        .style("stroke-width", 1)
                        .style("stroke-opacity", 0.3);
                })
                .on("mouseout", function(d) {
                    d3.select(this).transition("tooltip").duration(DURATION)
                        .style("fill-opacity", 0.3)
                        .style("stroke-width", 0)
                        .style("stroke-opacity", 0.0);
                    svg.select("circle.test-positive-circle").transition("tooltip").duration(DURATION)
                        .attr("fill-opacity", 0.2)
                        .style("stroke-width", 0)
                        .style("stroke-opacity", 0.0);
                })
                .append("title");

            svg.append("path")
                .attr("class", "test-negative-diseased-intersection")
                .attr("fill-opacity", 0.6)
                .attr("fill", disease.TEST_NEG_DISEASED)
                .on("mousemove", function(d) {
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
        }


        /** update the Venn diagram */
        my.render = function() {
            var chartWidth = $(parentEl).width();
            var chartHeight = $(parentEl).height();
            var chartWidthD2 = chartWidth / 2;
            var chartHeightD2 = chartHeight / 2;

            var svg = d3.select(parentEl + " svg")
                .attr("width", chartWidth)
                .attr("height", chartHeight);

            var numPositiveAndDiseased = graph.links[1].value;
            var numPositiveAndHealthy =  graph.links[2].value;
            var testNegButDiseased = Math.round(graph.links[0].value);
            var numDiseased = testNegButDiseased + numPositiveAndDiseased;
            var numPositive = numPositiveAndDiseased + numPositiveAndHealthy;

            var testPositiveRad = TEST_POS_CIRCLE_RADIUS;
            var scaleFactor = Math.sqrt(totalPopulation / numPositive);
            var diseasedRad = testPositiveRad * Math.sqrt(numDiseased / numPositive);
            var popRad = testPositiveRad * scaleFactor;
            var popArea = Math.PI = popRad * popRad;
            var diseaseArea = Math.PI * diseasedRad * diseasedRad;
            var overlap = (numPositiveAndDiseased / numDiseased) * diseaseArea;
            /*console.log("diseaseArea = "+ diseaseArea + "overlap="+ overlap
                + " numPosAndD="+ numPositiveAndDiseased + " numDis="+ numDiseased);
            console.log("diseaseArea= " + diseaseArea + " popArea= "+ popArea
                + " numDiseased= " + numDiseased + " pop= " + totalPopulation
                + " rat1=" + diseaseArea/popArea + " rat2="+ numDiseased/totalPopulation);
            console.log("numPositiveAndDiseased = " + numPositiveAndDiseased + " numDiseased = "
             + numDiseased + " overlap="+ overlap); */
            var distance = findCircleSeparation({
                radiusA: testPositiveRad,
                radiusB: diseasedRad,
                overlap: overlap
            });

            var centerX = chartWidthD2 + testPositiveRad - 180;
            var diseasedCenterY = chartHeightD2 - distance;

            svg.selectAll("circle.population-circle")
                .attr("cx", Math.max(chartWidthD2 - popRad, 0) + popRad + 40)
                .attr("cy", chartHeightD2)
                .attr("r", popRad);
            svg.selectAll("circle.test-positive-circle")
                .attr("cx", centerX)
                .attr("cy", chartHeightD2)
                .attr("r", testPositiveRad)
                .select("title")
                .text(numPositive.toLocaleString() + " Tested positive.\n" + numPositiveAndHealthy.toLocaleString() +
                    " of these are actually healthy.");

            svg.selectAll("circle.diseased-circle")
                .attr("cx", centerX)
                .attr("cy", diseasedCenterY)
                .attr("r", diseasedRad);

            // Draw paths for 2 halves of disease circle - the part in the intersection, and outsied of it.
            // See https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
            var pdPath = svg.selectAll("path.test-positive-diseased-intersection");
            var pctDiseasedGivenPositive = disease.format(100 * numPositiveAndDiseased / numPositive, 2);
            pdPath.attr("d", pathFunc(centerX, chartHeightD2, testPositiveRad,
                    centerX, diseasedCenterY, diseasedRad, 1, 1));
            pdPath.select("title").text(numPositiveAndDiseased.toLocaleString() +
                " (" + pctDiseasedGivenPositive + "%) " + " of the " +
                numPositive.toLocaleString() +
                " that tested positive\nactually have the disease.");

            var ndPath = svg.selectAll("path.test-negative-diseased-intersection");
            ndPath.attr("d", pathFunc(centerX, chartHeightD2, testPositiveRad,
                centerX, diseasedCenterY, diseasedRad, 0, 0));
            ndPath.select("title").text(testNegButDiseased.toLocaleString() + " out of "
                + numDiseased.toLocaleString() + "\nwith the disease test negative.");
        };

        var pathFunc = function(x1, y1, rad1, x2, y2, rad2, largeArcFlag2, sweepFlag2) {
            var interPoints = circleIntersection(x1, y1, rad1,  x2, y2, rad2);
            var rotation = 0;
            var largeArcFlag1 = 0;
            var sweepFlag1 = 1;
            return "M" +
                interPoints[0] + "," + interPoints[2] + "A" + rad2 + "," + rad2 + " " + rotation + " " +
                largeArcFlag2 + " " + sweepFlag2 + " " +
                interPoints[1] + "," + interPoints[3]+ "A" + rad1 + "," + rad1 +  " " + rotation + " " +
                largeArcFlag1 + " " + sweepFlag1 + " " +
                interPoints[0] + "," + interPoints[2];
        };

        /**
         * Given circle A with radiusA, and circle B with radiusB, and a desired amount of overlap,
         * find the distance between the center of A and B.
         *
         * Circle A is at the origin. Circle B starts radA + radB to the right where intersection = 0.
         * When they are both at the origin, the overlap is min(areaA, areaB)
         * Move them closer until the amount of overlap is equal to the overlap.
         *
         * @param circleInfo radiusA, radiusB, overlap
         * @return the center distance between circles A and B.
         */
        var findCircleSeparation = function(circleInfo) {

            var radA = circleInfo.radiusA;
            var radB = circleInfo.radiusB;
            var radAsq = radA * radA;
            var radBsq = radB * radB;
            var maxDistance = radA + radB;
            var maxOverlap = Math.PI * Math.min(radAsq, radBsq);
            //console.log("radA=" + radA + " radB="+ radB + " maxDist=" + maxDistance
            // + " maxOver="+ maxOverlap + " overlap=" + circleInfo.overlap);


            // This function returns the area of intersection when the two circles are x apart.
            var y = function (x) {
                if (x == 0) {
                    return maxOverlap;
                }
                var cosCBD = (radBsq + x * x - radAsq) / (2.0 * radB * x);
                var cosCAD = (radAsq + x * x - radBsq) / (2.0 * radA * x);
                if (Math.abs(cosCBD) > 1 || Math.abs(cosCAD) > 1) {
                    // then the two circles do not intersect at all
                    return maxOverlap;
                }
                var angleCBD = 2.0 * Math.acos(cosCBD);
                var angleCAD = 2.0 * Math.acos(cosCAD);
                return 0.5 * (angleCBD * radBsq - radBsq * Math.sin(angleCBD)
                    + angleCAD * radAsq - radAsq * Math.sin(angleCAD));
            };

            return findXForY(circleInfo.overlap, y, maxDistance, maxOverlap);
        };

        /**
         * @param overlap the overlapping area value we want to find x for.
         * @param y the function of x that will yield the support value.
         * @param maxDistance the maximum distance the two circles can be appart before they no longer overlap.
         * @param maxOverlap the maximum amount of overlap possible. The min of the two circle areas.
         * @return the x value for the given y(x)
         */
        var findXForY = function(overlap, y, maxDistance, maxOverlap) {

            // if they totally overlay, then we know the distance is 0;
            if (overlap == maxOverlap) {
                return 0;
            }
            var lower = 0;
            var upper = maxDistance;
            var currentGuess = maxDistance / 2.0;
            var currentY = y(currentGuess);
            if (isNaN(currentY)) {
                throw "y is NaN for " + currentGuess;
            }
            var EPS = 0.05;
            // if an answer is not found after 20 iterations something is wrong
            var MAX_ITERATIONS = 30;
            var ct = 0;

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
        };

        /**
         * @return the points that define the intersection region of two circles.
         */
        function circleIntersection(x0, y0, r0, x1, y1, r1) {
            var a, dx, dy, distance, h, rx, ry;
            var x2, y2;

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
            var xi = x2 + rx;
            var xi_prime = x2 - rx;
            var yi = y2 + ry;
            var yi_prime = y2 - ry;

            return [xi, xi_prime, yi, yi_prime];
        }

        init();
        return my;
    };


    return module;
} (disease || {}));