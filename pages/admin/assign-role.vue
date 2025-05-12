<template>
  <div class="p-2">
    <UserRoleForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated", "admin"],
  layout: "main",
});
</script>
