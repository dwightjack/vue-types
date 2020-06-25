import Vue from 'vue'
import VueTypes from 'vue-types'

Vue.config.silent = false

const Model = Vue.extend({
  template: '<li>{{ model.id }} {{ isNew }}</li>',
  props: {
    model: VueTypes.shape({
      id: VueTypes.string.isRequired,
      pet: VueTypes.oneOf(['dog', 'cat']).isRequired,
      isNew: VueTypes.bool,
    }).isRequired,
  },
  computed: {
    isNew() {
      return this.model.isNew ? '- new' : ''
    },
  },
})

const App = Vue.extend({
  template: `
    <section>
      <h1>A list of models</h1>
      <button type="button" @click="addModel">Add model</button>
      <ul><Model v-for="model in models" :model="model" :key="model.id" /></ul>
    </section>
  `,
  data: () => ({
    models: [],
  }),
  components: {
    Model,
  },
  methods: {
    addModel() {
      const newId = 'model-' + this.models.length
      this.models.forEach((model) => {
        model.isNew = false
      })
      this.models.push({
        id: newId,
        pet: 'parrot',
        isNew: true,
      })
    },
  },
})

new Vue({ render: (h) => h(App) }).$mount("#app")
