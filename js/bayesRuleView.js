
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
            root.html("<div>p(D|positive) = p(D)p(positive|D) </div>" +
                "<div>" +
                '<math xmlns="http://www.w3.org/1998/Math/MathML">' +
                '   <mi>a</mi><mo>&#x2260;</mo><mn>0</mn>' +
                '</math>' +
                "</div>" +
                '<math xmlns="http://www.w3.org/1998/Math/MathML">' +
                "<mi>a</mi><msup><mi>x</mi><mn>2</mn></msup>" +
                "<mo>+</mo> <mi>b</mi><mi>x</mi>" +
                "<mo>+</mo> <mi>c</mi> <mo>=</mo> <mn>0</mn>" +
                "</math>" +
                '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">' +
                "<mi>x</mi> <mo>=</mo><mrow><mfrac><mrow>" +
                "<mo>&#x2212;</mo><mi>b</mi><mo>&#x00B1;</mo>" +
                "<msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt>" +
                "</mrow>" +
                "<mrow> <mn>2</mn><mi>a</mi> </mrow>" +
                "</mfrac></mrow>" +
                "</math>" +
                "<div style='font-size: 150%;'>$$" +
                "\\definecolor{energy}{RGB}{114,0,172} " +
                "\\definecolor{freq}{RGB}{45,177,93} " +
                "\\definecolor{spin}{RGB}{251,0,29} " +
                "\\definecolor{signal}{RGB}{18,110,213} " +
                "\\definecolor{circle}{RGB}{217,86,16} " +
                "\\definecolor{average}{RGB}{203,23,206} " +
                "\\color{energy} X_{\\color{freq} k} \\color{black} = " +
                "\\color{average} \\frac{1}{N} \\sum_{n=0}^{N-1}" +
                "\\color{signal}x_n \\color{spin}e^{\\mathrm{i} \\color{circle} 2\\pi \\color{freq}k \\color{average} \\frac{n}{N}}" +
            "$$" +
                "</div>");
        };

        init();
        return my;
    };

    return module;
} (disease || {}));