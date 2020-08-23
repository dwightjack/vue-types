import { defineComponent, createApp, h, computed, ref } from 'vue'
import VueTypes from 'vue-types'

interface ModelItem {
  id: string
  pet: 'dog' | 'cat'
  isNew: boolean
}

const Model = defineComponent({
  template: '<li>{{ model.id }} {{ isNew }} (pet: {{ model.pet }})</li>',
  props: {
    model: VueTypes.shape<ModelItem>({
      id: VueTypes.string.isRequired,
      pet: VueTypes.oneOf(['dog', 'cat'] as const).isRequired,
      isNew: VueTypes.bool,
    }).isRequired,
  },
  setup(props) {
    const isNew = computed(() => (props.model.isNew ? '- new' : ''))
    return { isNew }
  },
})

const App = defineComponent({
  template: `
    <section>
      <h1>A list of models</h1>
      <button type="button" @click="addModel">Add model</button>
      <ul><Model v-for="model in models" :model="model" :key="model.id" /></ul>
    </section>
  `,
  setup() {
    const models = ref<ModelItem[]>([])
    const pets = ['dog', 'cat'] as const

    function addModel() {
      models.value.forEach((model) => {
        model.isNew = false
      })
      models.value.push({
        id: 'model-' + models.value.length,
        pet: pets[Math.floor(Math.random() * pets.length)],
        isNew: true,
      })
    }

    return { models, addModel }
  },
  components: {
    Model,
  },
})

createApp({ render: () => h(App) }).mount('#app')
