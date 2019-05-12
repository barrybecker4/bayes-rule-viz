import diseaseConstants from './diseaseConstants.js'


export default {

   template: `<div>
       <table class="bayes-rule-exp" align="center" cellpadding="0" cellspacing="0">
           <tr>
               <td rowspan="2" nowrap="nowrap"> p(<span class="diseased">D</span> | <span class="positive">positive</span>)&nbsp; = &nbsp;</td>
               <td class="numerator"> p(<span class="diseased">D</span>) &nbsp; p(<span class="positive">positive</span> | <span class="diseased">D</span>) </td>
               <td rowspan="2" nowrap="nowrap"> &nbsp; = &nbsp;</td>
               <td class="numerator"><span class="prob-diseased"></span> * <span class="prob-pos-given-diseased"></span></td>
               <td rowspan="2" nowrap="nowrap"> &nbsp; = &nbsp;</td>
               <td rowspan="2" width="100%"> <span class="prob-diseased-result"></span>&nbsp;</span> chance that you are infected. <span class="prob-diseased-worry"></span></td>
           </tr>
           <tr>
               <td class="upper_line">p(<span class="positive">positive</span>)</td>
               <td class="upper_line"><span class="prob-positive"></span></td>
           </tr>
       </table>
   </div>`,

   props: {
     graph: {},
     totalPopulation: 0,
     probDiseased: 0,
     testAccuracy: 0,
   },

   data() {
       return {
           margin: {}
       }
   },

   mounted() {
   },

   watch: {
       // whenever question changes, this function will run
       graph: function() {  render(); },
       probDiseased: function() {
           this.render();
       },
       testAccuracy: function() {
           this.render();
       },
   },

   methods: {

       /** update the Bayes rule formula with the current numbers */
       render: function() {
           var bayesRule = $(this.$el).find(".bayes-rule-exp");
           var numPositiveAndDiseased = this.graph.links[1].value;
           var numPositiveAndHealthy =  this.graph.links[2].value;
           var numDiseased = this.graph.links[0].value + numPositiveAndDiseased;
           var numPositive = numPositiveAndDiseased + numPositiveAndHealthy;
           var probPositiveGivenDiseased = numPositiveAndDiseased / numDiseased;
           var probDiseased = numDiseased / this.totalPopulation;
           var probPositive = numPositive / this.totalPopulation;
           bayesRule.find(".prob-diseased").text(diseaseConstants.format(probDiseased, 5));
           bayesRule.find(".prob-pos-given-diseased").text(diseaseConstants.format(probPositiveGivenDiseased, 4));
           bayesRule.find(".prob-positive").text(diseaseConstants.format(probPositive, 4));

           var probDiseasedGivenPositive = (100 * numDiseased * probPositiveGivenDiseased) / numPositive;

           var worryAttrs = this.getWorryAttrs(probDiseasedGivenPositive);
           bayesRule.find(".prob-diseased-result").text(diseaseConstants.format(probDiseasedGivenPositive, 2) + "%  ");
           bayesRule.find(".prob-diseased-worry").text(worryAttrs.howMuch).css("color", worryAttrs.color);
       },

       /** Determine how much you should worry given your probability of having the disease */
       getWorryAttrs: function(probDiseased) {
            var worryAttrs = {};

            if (probDiseased <= 5) {
                worryAttrs.howMuch = "Don't worry at all!";
                worryAttrs.color = "#00dd00";
            }
            else if (probDiseased <= 10) {
                worryAttrs.howMuch = "Don't worry.";
                worryAttrs.color = "#22cc00";
            }
            else if (probDiseased <= 15) {
                worryAttrs.howMuch = "Perhaps you should worry a little...";
                worryAttrs.color = "#77aa00";
            }
            else if (probDiseased <= 20) {
                worryAttrs.howMuch = "You should be concerned, but don't panic.";
                worryAttrs.color = "#997700";
            }
            else if (probDiseased <= 50) {
                worryAttrs.howMuch = "You should worry.";
                worryAttrs.color = "#bb6600";
            }
            else if (probDiseased <= 80) {
                worryAttrs.howMuch = "Yes, you should be very worried.";
                worryAttrs.color = "#cc3300";
            }
            else {
                worryAttrs.howMuch = "Panic!!!";
                worryAttrs.color = "#dd0000";
            }
            return worryAttrs;
       },
   },
}
