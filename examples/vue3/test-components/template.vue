<template>
  <div>
    <ul>
      <li>User: {{ user.ID }}: {{ user.name }} - {{ age }}</li>
      <li>Hobbies: {{ hobbies.join(', ') }}</li>
    </ul>
    <button @click="onClick">click</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue3'
import {
  userType,
  messageType,
  ageType,
  arrayOfStringsType,
  arrayOfMultipleType,
  scoreType,
  funcType,
  anyType,
  objectOfTuple,
  oneOfTuple,
  nullType,
} from '../../shared/validators'

export default defineComponent({
  props: {
    user: userType,
    message: messageType,
    age: ageType,
    sometng: nullType,
    hobbies: arrayOfStringsType,
    randomData: arrayOfMultipleType,
    score: scoreType,
    onClick: funcType,
    action: anyType,
    tupleObj: objectOfTuple,
    oneOf: oneOfTuple,
  },
})
</script>
