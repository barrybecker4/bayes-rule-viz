import diseaseConsts from './diseaseConsts.js'

export default {
    template: `
         <div id="notes">
              <h3>Understanding Bayesian Reasoning</h3>
              <div class="notes-content">
                  <div class="note-section">
                      <h4>Terminology</h4>
                      <ul>
                           <li><strong>p(<span class="diseased">D</span> | <span class="positive">positive</span>)</strong>: 
                               The probability of having the disease given that you have tested positive.
                               This is what we want to calculate and is known as a conditional probability.
                           </li>
                           <li><strong>p(<span class="diseased">D</span>)</strong>: 
                               The base rate or prevalence of the disease in the population (prior probability).
                           </li>
                           <li><strong>p(<span class="positive">positive</span> | <span class="diseased">D</span>)</strong>: 
                               The probability of testing positive given that you have the disease (test sensitivity).
                           </li>
                           <li><strong>p(<span class="positive">positive</span>)</strong>: 
                               The total probability of testing positive, calculated as 
                               <span class="formula">{{this.testPositive.toLocaleString()}} / {{this.totalPopulation.toLocaleString()}} = {{this.probPositive}}</span>
                           </li>
                      </ul>
                  </div>
                  
                  <div class="note-section">
                      <h4>Key Insights</h4>
                      <ul>
                           <li>For rare diseases with imperfect tests, a positive result often doesn't mean you likely have the disease.</li>
                           <li>The base rate (prevalence) of the disease significantly affects how we should interpret test results.</li>
                           <li>Test accuracy influences both false positives and false negatives.</li>
                      </ul>
                  </div>
                  
                  <div class="note-section">
                      <h4>Visualizations</h4>
                      <ul>
                           <li>The <strong>Sankey diagram</strong> on the left shows the flow of populations through testing.</li>
                           <li>The <strong>Venn diagram</strong> on the right shows the relationships between disease status and test results.</li>
                           <li>Try hovering over different regions to explore the relationships!</li>
                      </ul>
                  </div>
              </div>
          </div>`,

     props: {
         testPositive: 0,
         totalPopulation: 1,
     },

     computed: {
         probPositive: function() {
            return diseaseConsts.format(this.testPositive / this.totalPopulation, 4);
         }
     },
}