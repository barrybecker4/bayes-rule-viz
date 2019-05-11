import IntroductionContent from './IntroductionContent.vue.js'
import DiseaseSimulation from './DiseaseSimulation.vue.js'
import NotesContent from './NotesContent.vue.js'

new Vue({
    el: "#app",
    components: {
        IntroductionContent,
        DiseaseSimulation,
        NotesContent,
    },

    data() {
      return {
        msg: "FooBar!"
      }
    }
});

