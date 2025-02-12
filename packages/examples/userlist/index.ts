import { defineComponent, createApp, h } from 'vue'
import VueTypes, { fromType, number } from 'vue-types'

class CustomTypes extends VueTypes {
  static get adult() {
    return fromType('adult', number(), {
      validator: (v: number) => v >= 18,
    })
  }
}

const User = defineComponent({
  props: {
    name: CustomTypes.string.isRequired,
    age: CustomTypes.adult,
  },
  template: '<li><strong>{{ name }}</strong> ({{ age }})</li>',
})

const UserList = defineComponent({
  components: {
    User,
  },
  props: {
    users: VueTypes.arrayOf(VueTypes.shape(User.props)),
  },
  template: `
  <ul>
    <User v-for="user in users" :name="user.name" :age="user.age"  :key="user.name" />
  </ul>
  `,
})

createApp({
  components: {
    UserList,
  },
  setup() {
    const users = [
      {
        name: 'John',
        age: 20,
      },
      {
        name: 'Jane',
        age: 30,
      },
      {
        name: 'Jack',
        age: 18,
      },
    ]
    return () =>
      h('section', [h('h1', ['A list of users:']), h(UserList, { users })])
  },
}).mount('#app')
