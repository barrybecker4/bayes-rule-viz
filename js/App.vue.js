import IntroductionContent from './IntroductionContent.vue.js'
import BayesRuleSimulation from './BayesRuleSimulation.vue.js'
import NotesContent from './NotesContent.vue.js'

new Vue({
    el: "#app",
    components: {
        IntroductionContent,
        BayesRuleSimulation,
        NotesContent,
    },

    data() {
      return {
        msg: "FooBar!"
      }
    }
});

