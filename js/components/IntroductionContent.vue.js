export default {
    template: `<div class="introduction-section">
            <h1>Medical Testing & Bayes' Theorem</h1>
            
            <div class="introduction-card">
                <p>Suppose your doctor tests you for a disease, and the results are
                    <span class="positive">positive</span>!
                    How worried should you be?
                </p>
                
                <p><a href="https://en.wikipedia.org/wiki/Bayes%27_theorem">Bayes' theorem</a>
                    can help us calculate the actual probability you have the disease, which might
                    be surprisingly different from what you'd expect.
                </p>
   
                <p>In this simulation, we're looking at a population of <span id="total-population"></span> people.
                    Let <span class="diseased">D</span> = <span class="diseased">Diseased</span>
                    and <span class="healthy">H</span> = <span class="healthy">Healthy</span>.
                </p>
                
                <p>Use the sliders below to adjust the disease prevalence and test accuracy to see how
                   these factors affect your probability of actually having the disease after a positive test.
                </p>
            </div>
       </div>`,
 }