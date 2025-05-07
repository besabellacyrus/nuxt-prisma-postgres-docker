<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-6">Create User</h2>

    <a-form layout="vertical" @submit.prevent="handleSubmit">
      <a-form-item label="Name" :validateStatus="nameError ? 'error' : ''" :help="nameError">
        <a-input v-model:value="form.name" placeholder="Enter name" />
      </a-form-item>

      <a-form-item label="Email" :validateStatus="emailError ? 'error' : ''" :help="emailError">
        <a-input v-model:value="form.email" type="email" placeholder="Enter email" />
      </a-form-item>

      <a-form-item label="Password" :validateStatus="passwordError ? 'error' : ''" :help="passwordError">
        <a-input v-model:value="form.password" type="password" placeholder="Enter password" />
      </a-form-item>

      <div class="flex justify-end mt-4">
        <a-button type="primary" html-type="submit" :loading="loading">Create</a-button>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated'],
})

const form = reactive({
  name: '',
  email: '',
  password: '',
})

const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const loading = ref(false)

const router = useRouter()

async function handleSubmit() {

  nameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  console.log({ click: true, form })

  if (!form.name) nameError.value = 'Name is required'
  if (!form.email) emailError.value = 'Email is required'
  if (!form.password) passwordError.value = 'Password is required'

  if (nameError.value || emailError.value || passwordError.value) return

  try {
    loading.value = true
    await $fetch('/api/users', {
      method: 'POST',
      body: form,
    })
    router.push('/users') // redirect after creation
  } catch (err: any) {
    const message = err?.data?.message || 'Failed to create user'
    alert(message)
  } finally {
    loading.value = false
  }
}
</script>
