<script lang="ts" setup>
import { string } from 'vue-types'

defineProps({
  name: string().isRequired,
})
</script>

<template>
  <p>{{ name }}</p>
</template>
