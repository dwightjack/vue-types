import Vue from 'vue2'
import VueTypes from 'vue-types'
import { PropValidator } from 'vue2/types/options'

Vue.config.silent = false

interface ModelItem {
  id: string
  pet: 'dog' | 'cat'
  isNew: boolean
}

const Model = Vue.extend({
  template: '<li>{{ model.id }} {{ isNew }} (pet: {{ model.pet }})</li>',
  props: {
    model: VueTypes.shape<ModelItem>({
      id: VueTypes.string.isRequired,
      pet: VueTypes.oneOf(['dog', 'cat'] as const).isRequired,
      isNew: VueTypes.bool,
    }).isRequired as PropValidator<ModelItem>,
  },
  computed: {
    isNew(): string {
      return this.model.isNew ? '- new' : ''
    },
  },
})

const App = Vue.extend({
  template: `
    <section>
      <h1>A list of models</h1>
      <button type="button" @click="addPet('parrot')">Add parrot (invalid, logs to console)</button>
      <button type="button" @click="addPet('dog')">Add dog</button>
      <ul><Model v-for="model in models" :model="model" :key="model.id" /></ul>
    </section>
  `,
  data: () => ({
    models: [] as ModelItem[],
  }),
  components: {
    Model,
  },
  methods: {
    addPet(pet: any) {
      const newId = 'model-' + this.models.length
      this.models.forEach((model) => {
        model.isNew = false
      })
      this.models.push({
        id: newId,
        pet,
        isNew: true,
      })
    },
  },
})

new Vue({ render: (h) => h(App) }).$mount('#app')
