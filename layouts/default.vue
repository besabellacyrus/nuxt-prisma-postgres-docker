<template>
  <div>
    <div>Default View</div>
    <button @click="logout">Logout</button>
    <slot />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated'],
})

const { user, clear: clearSession } = useUserSession()

 async function logout() {
  await clearSession()
  await navigateTo('/login')
}

</script>