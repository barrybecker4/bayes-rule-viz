import IntroductionContent from './IntroductionContent.vue.js'

new Vue({
    el: "#app",
    components: {
        IntroductionContent,
    },

    data() {
      return {
        msg: "FooBar!"
      }
    }
});

