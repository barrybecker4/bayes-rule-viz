import HelloWorld from './HelloWorld.vue.js'

new Vue({
    el: "#app",
    components: {
        HelloWorld,
    },

    data() {
      return {
        msg: "FooBar!"
      }
    }
});

