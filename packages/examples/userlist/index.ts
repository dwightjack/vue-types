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
  template: '<li><strong>{{ name }}</strong> ({{ age }})</li>',
  props: {
    name: CustomTypes.string.isRequired,
    age: CustomTypes.adult,
  },
})

const UserList = defineComponent({
  template: `
    <ul>
      <User v-for="user in users" :name="user.name" :age="user.age"  :key="user.name" />
    </ul>
    `,
  props: {
    users: VueTypes.arrayOf(VueTypes.shape(User.props)),
  },
  components: {
    User,
  },
})

createApp({
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
  components: {
    UserList,
  },
}).mount('#app')
