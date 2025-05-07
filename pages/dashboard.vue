<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Dashboard View</h1>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated'],
})

</script>