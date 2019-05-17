export default {
    findCircleSeparation,
    circleIntersection,
}

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
function findCircleSeparation(circleInfo) {

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
       if (x === 0) {
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

    return findXForY(circleInfo.overlap, y, maxDistance, maxOverlap);
}

/**
 * @param overlap the overlapping area value we want to find x for.
 * @param y the function of x that will yield the support value.
 * @param maxDistance the maximum distance the two circles can be apart before they no longer overlap.
 * @param maxOverlap the maximum amount of overlap possible. The min of the two circle areas.
 * @return the x value for the given y(x)
 */
function findXForY(overlap, y, maxDistance, maxOverlap) {

    // if they totally overlay, then we know the distance is 0;
    if (overlap === maxOverlap) {
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
    let MAX_ITERATIONS = 100;
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
        //console.log("itCt=" + ct + " overlap=" + overlap + " currY=" + currentY + "  delta=" +  Math.abs(overlap - currentY));
        //console.log("     lower=" +   lower + " cur=" + currentGuess + " upper=" + upper);
    }

    if (ct >= MAX_ITERATIONS) {
        throw "It was not possible to find the separation for overlap = " + overlap + " when maxOverlap is "
        + maxOverlap + " and maxDistance is " + maxDistance + ". Current range = [" + lower + ", " + upper + "]";
    }
    return currentGuess;
}

/**
 * @return the points that define the intersection region of two circles.
 */
function circleIntersection(x0, y0, r0, x1, y1, r1) {
    let a, dx, dy, distance, h, rx, ry;
    let x2, y2;

    dx = x1 - x0;
    dy = y1 - y0;
    distance = Math.sqrt((dy * dy) + (dx * dx));

    if (distance > (r0 + r1)) {
        throw "No solution. circles do not intersect";
    }
    if (distance < Math.abs(r0 - r1)) {
        console.log("One circle is contained by the other");
        return [x1, x1, y1, y1];
        //throw "No solution. one circle is contained in the other. Dist = " +
        //    distance + " is less than " + r0 + " - " + r1 + " = " + Math.abs(r0 - r1);
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
}
