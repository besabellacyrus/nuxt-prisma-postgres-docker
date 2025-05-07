<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Users</h1>
    <div class="space-y-4">
      <div v-for="user in users" :key="user.id" class="p-4 border rounded shadow">
        <h2 class="text-lg font-semibold">{{ user.name }}</h2>
        <p>{{ user.email }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: users } = await useFetch('/api/users')
definePageMeta({
  middleware: ['authenticated'],
})
</script>