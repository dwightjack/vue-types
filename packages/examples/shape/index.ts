import { defineComponent, createApp, h, computed, ref } from 'vue'
import { shape, string, oneOf, bool } from 'vue-types'

interface ModelItem {
  id: string
  pet: 'dog' | 'cat'
  isNew: boolean
}

const Model = defineComponent({
  props: {
    model: shape<ModelItem>({
      id: string().isRequired,
      pet: oneOf(['dog', 'cat'] as const).isRequired,
      isNew: bool().def(true),
    }).isRequired,
  },
  setup(props) {
    const isNew = computed(() => (props.model.isNew ? '- new' : ''))
    return { isNew }
  },
  template: '<li>{{ model.id }} {{ isNew }} (pet: {{ model.pet }})</li>',
})

const App = defineComponent({
  components: {
    Model,
  },
  setup() {
    const models = ref<ModelItem[]>([])

    function addPet(pet: ModelItem['pet']) {
      models.value.forEach((model) => {
        model.isNew = false
      })
      models.value.push({
        id: 'model-' + models.value.length,
        pet,
        isNew: true,
      })
    }

    return { models, addPet }
  },
  template: `
    <section>
      <h1>A list of models</h1>
      <div class="grid">
        <button type="button" @click="addPet('parrot')">Add parrot (invalid, logs to console)</button>
        <button type="button" @click="addPet('dog')">Add dog</button>
      </div>
      <ul><Model v-for="model in models" :model="model" :key="model.id" /></ul>
    </section>
  `,
})

createApp({ render: () => h(App) }).mount('#app')
