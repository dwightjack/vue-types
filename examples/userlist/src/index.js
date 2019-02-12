import Vue from 'vue'
import VueTypes from 'vue-types'

var User = {
  template: '<li><strong>{{ name }}</strong> ({{ age }})</li>',
  props: {
    name: VueTypes.string.isRequired,
    age: VueTypes.integer.def(10)
  }
}

var UserList = {
  template: `
    <ul>
      <User v-for="user in users" :name="user.name" :age="user.age"  :key="user.name" />
    </ul>
    `,
  props: {
    users: VueTypes.arrayOf(
      VueTypes.shape(User.props)
    )
  },
  components: {
    User
  }
}

new Vue({
  el: '#app',
  template: '<section><h1>A list of users:</h1><UserList :users="users" /></section>',
  data: {
    users: [{
      name: 'John',
      age: 20
    }, {
      name: 'Jane',
      age: 30
    }, {
      name: 'Jack'
    }]
  },
  components: {
    UserList
  }
})
