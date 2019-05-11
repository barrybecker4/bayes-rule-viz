
export default {
   template: `
      <div>
           <div class="inputs">
           <span class="input-line">The incidence of the disease in the population is
               <span id="probability-diseased"></span>%
               <span id="probability-diseased-slider" class="slider"></span>
           </span>
               <div class="input-line">The disease testing accuracy is <span id="test-accuracy"></span>%
                   <div id="test-accuracy-slider" class="slider"></div>
               </div>
           </div>
           <div id="bayes-rule-view"></div>
           <div id="venn-diagram-view"></div>
           <div id="sankey-view"></div>
      </div>`,

   data() {
     return {
       msg: "Hello another World!"
     }
   }
}
