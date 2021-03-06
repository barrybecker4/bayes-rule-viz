import diseaseConsts from './diseaseConsts.js'

export default {
    template: `
         <div id="notes">
              <h3>Notes:</h3>
              <ul>
                   <li>p(<span class="diseased">D</span> | <span class="positive">positive</span>)
                       means the probability of having the disease given that you have tested positive.
                       This is the notation for representing a conditional probability.
                   </li>
                   <li>p(<span class="positive">positive</span> | <span class="diseased">D</span>) =
                       p(<span class="negative">negative</span> | <span class="healthy">H</span>)
                       = <span id="accuracy-fn">test accuracy, by definition.</span>
                   </li>
                   <li>p(<span class="positive">positive</span>) is the total number of people that test positive
                       ({{this.testPositive.toLocaleString()}}) divided by the total population
                       ({{this.totalPopulation.toLocaleString()}})
                       = {{this.probPositive}}</li>
                   <li>The data is shown on the left
                       with a <a href="https://bost.ocks.org/mike/sankey/">Sankey diagram</a>,
                       and on the right with a <a href="https://en.wikipedia.org/wiki/Venn_diagram">Venn diagram</a>
                   </li>
              </ul>
          </div>`,

     props: {
         testPositive: 0,
         totalPopulation: 1,
     },

     computed: {
         probPositive: function() {
            diseaseConsts.format(this.testPositive / this.totalPopulation, 4);
         }
     },
}
