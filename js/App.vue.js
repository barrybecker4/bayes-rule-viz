import IntroductionContent from './IntroductionContent.vue.js'
import NotesContent from './NotesContent.vue.js'

new Vue({
    el: "#app",
    components: {
        IntroductionContent,
        NotesContent,
    },

    data() {
      return {
        msg: "FooBar!"
      }
    }
});

