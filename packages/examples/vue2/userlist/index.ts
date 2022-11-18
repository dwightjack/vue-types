import Vue from 'vue2'
import VueTypes, { VueTypeDef } from 'vue-types'

type typeofVueTypes = typeof VueTypes
interface VueTypesCustom extends typeofVueTypes {
  adult: VueTypeDef<number>
}

const CustomTypes = VueTypes.extend<VueTypesCustom>({
  name: 'adult',
  getter: true,
  type: Number,
  validator(v) {
    return v >= 18
  },
})

const User = {
  template: '<li><strong>{{ name }}</strong> ({{ age }})</li>',
  props: {
    name: CustomTypes.string.isRequired,
    age: CustomTypes.adult,
  },
}

const UserList = {
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
}

new Vue({
  el: '#app',
  template:
    '<section><h1>A list of users:</h1><UserList :users="users" /></section>',
  data: {
    users: [
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
    ],
  },
  components: {
    UserList,
  },
})
