import IntroductionContent from './components/IntroductionContent.vue.js'
import DiseaseSimulation from './components/DiseaseSimulation.vue.js'

Vue.config.devtools = true  // so Vue plugin shows in browser.

new Vue({
    el: "#app",
    components: {
        IntroductionContent,
        DiseaseSimulation,
    },
});

