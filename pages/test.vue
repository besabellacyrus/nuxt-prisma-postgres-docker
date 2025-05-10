<template>
  <UModal title="Modal with title">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
      <Placeholder class="h-48" />
    </template>
  </UModal>
</template>

<script setup>
import { ref } from 'vue'
const show = ref(false)
</script>
