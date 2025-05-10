<template>
<client-only>
  <a-button @click="showModal = true">Open Modal saa</a-button>
  <a-modal v-model:visible="showModal" title="My Modal">
    <p>Modal content here</p>
  </a-modal>
</client-only>
</template>

<script setup>
import { ref } from 'vue'
const showModal = ref(false)
</script>