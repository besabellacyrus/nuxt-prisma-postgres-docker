<template>
  <div class="p-4 text-red-600">
    <h1>Access Denied</h1>
    <p>You must be an admin to view this page.</p>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["authenticated"],
  layout: "main",
});
</script>
